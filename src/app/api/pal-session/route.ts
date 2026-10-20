import { NextRequest, NextResponse } from "next/server";

// Per-IP sliding window rate limiter (Phase 0 Cybersecurity Compliance)
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
    const rawBody = await req.text();
    if (rawBody.length > 16_384) {
      return NextResponse.json(
        { error: "Payload too large." },
        { status: 413 }
      );
    }

    const body = JSON.parse(rawBody);
    const personaName = String(body.personaName || "Charlie Sovereign PAL").slice(0, 80);
    const domainRole = String(body.domainRole || "Enterprise Automation Architect").slice(0, 80);
    const renderModel = ["PHOENIX-S4", "RAVEN-S1", "SPARROW-S1"].includes(body.renderModel)
      ? body.renderModel
      : "PHOENIX-S4";
    const latencyTargetMs = Number(body.latencyTargetMs) || 145;
    const enforceNhilSpec = Boolean(body.enforceNhilSpec ?? true);

    const sessionId = `pal_sovereign_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const runtimeManifest = {
      sessionId,
      status: "INSTANTIATED_AT_RUNTIME",
      timestamp: new Date().toISOString(),
      sovereignNode: "KGU-DTN-NODE-01",
      transportProtocol: "Sovereign Transport Protocol v4.2 (Zero-Static-Asset Stream)",
      persona: {
        name: personaName,
        role: domainRole,
        cognitiveEngine: "Private KGU Empathy Engine Matrix",
        renderCore: renderModel,
        perceptionLayer: "RAVEN-S1 Multimodal Vision & Emotional Context",
        timingEngine: `SPARROW-S1 (${latencyTargetMs}ms Full-Duplex Cadence)`,
      },
      nhilGuardrails: {
        enforced: enforceNhilSpec,
        idempotencyLock: "ACTIVE",
        microSprintCap: "2_NODES_MAX_PER_SPRINT",
        piiRedaction: "STRICT_SOVEREIGN_VAULT",
      },
      sdkSnippet: `import { SovereignPAL } from "@kguinternational/tavus-sovereign-sdk";

const pal = await SovereignPAL.instantiateAtRuntime({
  sessionId: "${sessionId}",
  personaName: "${personaName}",
  role: "${domainRole}",
  renderCore: "${renderModel}",
  transport: "sovereign-transport-protocol",
  nhilGuardrails: ${enforceNhilSpec},
});

await pal.connectFaceToFace("#magic-canvas-mount");`,
    };

    return NextResponse.json(runtimeManifest, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload submitted to Sovereign PAL endpoint." },
      { status: 400 }
    );
  }
}
