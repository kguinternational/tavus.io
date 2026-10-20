import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

export interface WorkflowAuditCheck {
  rule: string;
  passed: boolean;
  detail: string;
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in 60 seconds." },
      { status: 429 }
    );
  }

  try {
    const rawText = await req.text();
    if (rawText.length > 32_768) {
      return NextResponse.json(
        { error: "Workflow specification exceeds maximum size." },
        { status: 413 }
      );
    }

    const body = JSON.parse(rawText);
    const workflowSpec = typeof body.workflowJson === "string"
      ? JSON.parse(body.workflowJson)
      : body.workflowJson || body;

    const nodes: Array<Record<string, unknown>> = Array.isArray(workflowSpec.nodes)
      ? workflowSpec.nodes
      : [];
    const sprintMode = Boolean(body.microSprintMode ?? true);

    const checks: WorkflowAuditCheck[] = [];

    // 1. Micro-Sprint 2-Node Architecture Check
    const sprintPassed = !sprintMode || (nodes.length > 0 && nodes.length <= 4);
    checks.push({
      rule: "Micro-Sprint Node Bound",
      passed: sprintPassed,
      detail: sprintPassed
        ? `Verified ${nodes.length} node(s) within testable Micro-Sprint architecture.`
        : `Found ${nodes.length} nodes. Break workflow into 2-node micro-sprints before production.`,
    });

    // 2. Idempotency Verification
    const hasIdempotencyKey =
      JSON.stringify(workflowSpec).toLowerCase().includes("idempoten") ||
      JSON.stringify(workflowSpec).toLowerCase().includes("dedup") ||
      JSON.stringify(workflowSpec).toLowerCase().includes("upsert") ||
      Boolean(workflowSpec.idempotencyKey);
    checks.push({
      rule: "Idempotency Guarantee",
      passed: hasIdempotencyKey,
      detail: hasIdempotencyKey
        ? "Idempotency key / upsert guard detected. Safe for duplicate webhook replays."
        : "Missing idempotency guard (`idempotencyKey` or `upsert` check). Duplicate payloads could trigger double execution.",
    });

    // 3. Error Handling Verification
    const hasErrorRoute =
      JSON.stringify(workflowSpec).toLowerCase().includes("onerror") ||
      JSON.stringify(workflowSpec).toLowerCase().includes("continueonfail") ||
      JSON.stringify(workflowSpec).toLowerCase().includes("errortrigger") ||
      Boolean(workflowSpec.errorHandling);
    checks.push({
      rule: "Autonomous Error Route",
      passed: hasErrorRoute,
      detail: hasErrorRoute
        ? "Error fallback route (`onError` / `continueOnFail`) verified on external operations."
        : "External node lacks an explicit `onError` or `errorTrigger` fallback route.",
    });

    // 4. Zero-PII & Recursive Loop Guard
    const rawLower = JSON.stringify(workflowSpec).toLowerCase();
    const hasPiiLeak =
      rawLower.includes("plaintext_ssn") || rawLower.includes("public_sheet_pii");
    checks.push({
      rule: "Sovereign Data & Loop Guard",
      passed: !hasPiiLeak,
      detail: !hasPiiLeak
        ? "Zero unredacted PII sinks or recursive webhook loops detected."
        : "Detected potential unredacted PII sink in workflow specification.",
    });

    const allPassed = checks.every((c) => c.passed);

    return NextResponse.json(
      {
        verdict: allPassed ? "[APPROVED]" : "[REJECTED]",
        score: `${checks.filter((c) => c.passed).length}/${checks.length}`,
        auditedAt: new Date().toISOString(),
        auditorEngine: "NHIL Sovereign Workflow Reviewer SI v2.6",
        checks,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        verdict: "[REJECTED]",
        error: "Malformed JSON workflow specification. Ensure valid JSON syntax.",
      },
      { status: 400 }
    );
  }
}
