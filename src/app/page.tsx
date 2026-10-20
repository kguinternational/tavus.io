"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Code2,
  Workflow,
  Users,
  Eye,
  Zap,
  Copy,
  Check,
  Play,
  RotateCcw,
} from "lucide-react";

const ProceduralAvatarCanvas = dynamic(
  () => import("@/components/ProceduralAvatarCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[340px] flex items-center justify-center font-mono text-xs text-primary animate-pulse">
        [INSTANTIATING RUNTIME 3D GEOMETRY...]
      </div>
    ),
  }
);

type ModelId = "PHOENIX-S4" | "RAVEN-S1" | "SPARROW-S1";

interface WindowState {
  id: string;
  title: string;
  badge: string;
  dotColor: string;
  minimized: boolean;
  zIndex: number;
}

const VALID_MICRO_SPRINT_SPEC = JSON.stringify(
  {
    workflowName: "Sovereign_PAL_Lead_Qualifier_Sprint_1",
    idempotencyKey: "sha256(webhook_payload.contact_email + timestamp_day)",
    errorHandling: "onError -> Sovereign_DeadLetter_Vault",
    nodes: [
      {
        id: "node_1",
        type: "Sovereign.WebhookTrigger",
        purpose: "Ingest inbound executive inquiry from PAL video session",
      },
      {
        id: "node_2",
        type: "Sovereign.UpsertCRMRecord",
        onError: "continueOnFail",
        idempotentUpsert: true,
        purpose: "Upsert qualified transcript & emotional telemetry into Sovereign Lakehouse",
      },
    ],
  },
  null,
  2
);

const UNSAFE_WORKFLOW_SPEC = JSON.stringify(
  {
    workflowName: "Unchecked_Spaghetti_Automation",
    nodes: [
      { id: "1", type: "Webhook" },
      { id: "2", type: "CreateDuplicateRecord" },
      { id: "3", type: "LogToPublicSheet", sink: "public_sheet_pii" },
      { id: "4", type: "TriggerSelfWebhook" },
      { id: "5", type: "UncheckedExternalCall" },
    ],
  },
  null,
  2
);

export default function SovereignTavusNhilPlatform() {
  // Interactive 3D & PAL State
  const [explodeFactor, setExplodeFactor] = useState<number>(0.18);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<ModelId>("PHOENIX-S4");

  // Draggable / Minimizable OS Windows (Tavus Desktop Paradigm)
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    palStream: {
      id: "palStream",
      title: "FACE-TO-FACE PAL // RUNTIME 3D RIG",
      badge: "LIVE CVI",
      dotColor: "#FF6183",
      minimized: false,
      zIndex: 30,
    },
    palMaker: {
      id: "palMaker",
      title: "PAL MAKER // NO-CODE SI STUDIO",
      badge: "BUILDER",
      dotColor: "#38BDF8",
      minimized: false,
      zIndex: 20,
    },
    specReviewer: {
      id: "specReviewer",
      title: "NHIL SPEC-DRIVEN WORKFLOW GUARDRAIL",
      badge: "AUDITOR",
      dotColor: "#10B981",
      minimized: false,
      zIndex: 10,
    },
  });

  // PAL Maker Form State
  const [personaName, setPersonaName] = useState("Charlie Sovereign PAL");
  const [domainRole, setDomainRole] = useState("Enterprise Sales & Bootcamp Architect");
  const [latencyTargetMs, setLatencyTargetMs] = useState(140);
  const [enforceNhilSpec, setEnforceNhilSpec] = useState(true);
  const [palSessionResult, setPalSessionResult] = useState<{
    sessionId: string;
    sdkSnippet: string;
    transportProtocol: string;
  } | null>(null);
  const [palLoading, setPalLoading] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);

  // Workflow Reviewer State
  const [workflowJsonInput, setWorkflowJsonInput] = useState(VALID_MICRO_SPRINT_SPEC);
  const [auditResult, setAuditResult] = useState<{
    verdict: string;
    score: string;
    checks: Array<{ rule: string; passed: boolean; detail: string }>;
  } | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const bringToFront = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...Object.values(prev).map((w) => w.zIndex), 10);
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: maxZ + 1, minimized: false },
      };
    });
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: !prev[id].minimized },
    }));
  };

  const handleSpeakWithCharlie = () => {
    if (isSpeaking) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Welcome to KGU Sovereign Human Computing. We are way beyond static models. We are engineering living worlds in code now, generated at runtime with zero human in the loop."
      );
      utterance.rate = 1.02;
      utterance.pitch = 0.98;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 6000);
    }
  };

  const handleInstantiatePal = async () => {
    setPalLoading(true);
    try {
      const res = await fetch("/api/pal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaName,
          domainRole,
          renderModel: activeModel,
          latencyTargetMs,
          enforceNhilSpec,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPalSessionResult(data);
      }
    } finally {
      setPalLoading(false);
    }
  };

  const handleRunWorkflowAudit = async (customJson?: string) => {
    const targetJson = customJson ?? workflowJsonInput;
    if (customJson) setWorkflowJsonInput(customJson);
    setAuditLoading(true);
    try {
      const res = await fetch("/api/review-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowJson: targetJson,
          microSprintMode: true,
        }),
      });
      const data = await res.json();
      setAuditResult(data);
    } finally {
      setAuditLoading(false);
    }
  };

  const copySdk = () => {
    if (!palSessionResult?.sdkSnippet) return;
    navigator.clipboard.writeText(palSessionResult.sdkSnippet);
    setCopiedSdk(true);
    setTimeout(() => setCopiedSdk(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pixel-grid-bg relative overflow-x-hidden">
      {/* Top Sovereign Announcement Banner (Tavus PAL Maker Style) */}
      <div className="w-full bg-gradient-to-r from-[#240b13] via-[#3b111f] to-[#121e2b] border-b border-border/80 py-2.5 px-4 text-center text-xs font-mono">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <strong className="text-primary uppercase tracking-wider">
            PAL MAKER + NHIL SPEC ENGINE LIVE:
          </strong>
          <span className="text-muted-foreground">
            We are way beyond static models. We are engineering living worlds in code now — generated at runtime.
          </span>
          <a
            href="#os-workspace"
            className="text-foreground underline underline-offset-4 hover:text-primary transition-colors ml-1"
          >
            Launch Sovereign Workspace →
          </a>
        </span>
      </div>

      {/* Ambient Atmospheric Glows */}
      <div className="fixed top-[-15%] left-[-10%] w-[520px] h-[520px] rounded-full bg-primary/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[520px] h-[520px] rounded-full bg-accent/15 blur-[150px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center font-mono font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                T//N
              </div>
              <div>
                <div className="font-bold tracking-tight text-lg leading-none">
                  TAVUS<span className="text-primary">.IO</span>{" "}
                  <span className="text-xs font-mono text-muted-foreground font-normal">
                    × NHIL.NET
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
                  KGU Sovereign Human Computing
                </div>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#os-workspace" className="hover:text-foreground transition-colors">
              PAL Workspace
            </a>
            <a href="#sovereign-models" className="hover:text-foreground transition-colors">
              Sovereign Models
            </a>
            <a href="#nhil-bootcamp" className="hover:text-foreground transition-colors">
              5-Day NHIL Bootcamp
            </a>
            <a href="#enterprise-matrix" className="hover:text-foreground transition-colors">
              Solutions
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#os-workspace"
              onClick={() => handleRunWorkflowAudit(VALID_MICRO_SPRINT_SPEC)}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs font-mono hover:border-primary/60 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Verify NHIL Spec
            </a>
            <a
              href="#os-workspace"
              onClick={handleInstantiatePal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Deploy a PAL <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-primary/30 text-xs font-mono text-primary mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            PERSONIFIED APPLICATION LAYERS (PALs) + 100% NHITL AUTOMATION
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            You’ve never met{" "}
            <span className="text-gradient-tavus">Synthetic Intelligence</span>{" "}
            like this.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Human-like SI that sees, hears, acts, and emotionally understands in real time—paired with{" "}
            <strong className="text-foreground">NHIL Spec-Driven Guardrails</strong> so your entire workforce can deploy autonomous workflows with zero human bottlenecks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleSpeakWithCharlie}
              className="px-7 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2.5 shadow-lg shadow-primary/25 hover:scale-[1.02] transition-all cursor-pointer"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 animate-pulse" />
                  Stop Charlie Audio Stream
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  Speak with Charlie (Live Runtime PAL)
                </>
              )}
            </button>

            <a
              href="#nhil-bootcamp"
              className="px-7 py-4 rounded-xl glass-window text-foreground font-semibold text-sm inline-flex items-center gap-2 hover:border-primary/50 transition-all"
            >
              <Workflow className="w-4 h-4 text-accent" />
              Explore 5-Day NHIL Bootcamp
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================================
          TAVUS DRAGGABLE SOVEREIGN OS WORKSPACE & DOCK
         ===================================================================== */}
      <section id="os-workspace" className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <div className="text-xs font-mono text-primary uppercase tracking-widest">
              // INTERACTIVE SOVEREIGN DESKTOP SURFACE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Drag, Inspect & Instantiate Living PALs at Runtime
            </h2>
          </div>

          {/* Window Dock for Minimized or Quick-Focus Windows */}
          <div className="flex items-center gap-2 bg-card/90 border border-border px-3 py-2 rounded-xl">
            <span className="text-[11px] font-mono text-muted-foreground mr-1">
              OS DOCK:
            </span>
            {Object.values(windows).map((win) => (
              <button
                key={win.id}
                onClick={() =>
                  win.minimized ? toggleMinimize(win.id) : bringToFront(win.id)
                }
                className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  win.minimized
                    ? "bg-muted/60 text-muted-foreground border border-dashed border-border"
                    : "bg-primary/15 text-foreground border border-primary/40"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-xs"
                  style={{ backgroundColor: win.dotColor }}
                />
                {win.badge}
                {win.minimized && <Maximize2 className="w-3 h-3 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Window Desktop Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* WINDOW 1: FACE-TO-FACE PAL + PROCEDURAL 3D RUNTIME RIG */}
          <AnimatePresence>
            {!windows.palStream.minimized && (
              <motion.div
                drag
                dragMomentum={false}
                onMouseDown={() => bringToFront("palStream")}
                style={{ zIndex: windows.palStream.zIndex }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="lg:col-span-7 glass-window rounded-2xl overflow-hidden tavus-glow"
              >
                {/* Tavus Retro OS Window Header */}
                <div className="px-4 py-3 bg-[#1c0f15] border-b border-border flex items-center justify-between cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-xs bg-primary inline-block" />
                    <span className="font-mono text-xs font-semibold tracking-wider">
                      {windows.palStream.title}
                    </span>
                  </div>
                  <div className="flex-1 mx-4 h-3 os-titlebar-lines opacity-75 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary">
                      ZERO STATIC FILES
                    </span>
                    <button
                      onClick={() => toggleMinimize("palStream")}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Minimize to Dock"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3D Procedural Viewport */}
                <div className="relative h-[370px] bg-gradient-to-b from-[#13090e] to-[#090507]">
                  <ProceduralAvatarCanvas
                    explodeFactor={explodeFactor}
                    isSpeaking={isSpeaking}
                    activeModel={activeModel}
                  />

                  {/* Top-Left HUD Overlay */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-3 font-mono text-[11px] space-y-1 pointer-events-none">
                    <div className="text-primary font-semibold">
                      ENGINE: {activeModel} RUNTIME CORE
                    </div>
                    <div className="text-muted-foreground">
                      GEOMETRY: Lathe + Extrude + CatmullRom Splines
                    </div>
                    <div className="text-muted-foreground">
                      INSTANCED NODES: 48 Orbital Synaptic Fasteners
                    </div>
                    <div className="text-emerald-400">
                      KINEMATICS: Trigonometric sin/cos Linkages
                    </div>
                  </div>

                  {/* Model Switcher Pill Bar */}
                  <div className="absolute top-4 right-4 flex gap-1.5 bg-black/75 p-1 rounded-lg border border-white/10">
                    {(["PHOENIX-S4", "RAVEN-S1", "SPARROW-S1"] as ModelId[]).map(
                      (m) => (
                        <button
                          key={m}
                          onClick={() => setActiveModel(m)}
                          className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                            activeModel === m
                              ? "bg-primary text-primary-foreground font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {m}
                        </button>
                      )
                    )}
                  </div>

                  {/* Bottom Interactive Exploded View & Voice Bar */}
                  <div className="absolute bottom-4 inset-x-4 bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Sliders className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span>EXPLODE SUB-ASSEMBLIES</span>
                          <span className="text-primary font-bold">
                            {(explodeFactor * 100).toFixed(0)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={explodeFactor}
                          onChange={(e) =>
                            setExplodeFactor(parseFloat(e.target.value))
                          }
                          className="w-full sm:w-44 accent-[#ff6183] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() =>
                          setExplodeFactor((prev) => (prev > 0.5 ? 0 : 0.85))
                        }
                        className="px-3 py-2 rounded-lg border border-white/15 text-xs font-mono hover:border-primary/60 transition-colors cursor-pointer"
                      >
                        {explodeFactor > 0.5 ? "Implode Core" : "Explode 85%"}
                      </button>
                      <button
                        onClick={handleSpeakWithCharlie}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {isSpeaking ? "Speaking..." : "Test Voice"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WINDOW 2: NO-CODE PAL MAKER STUDIO */}
          <AnimatePresence>
            {!windows.palMaker.minimized && (
              <motion.div
                drag
                dragMomentum={false}
                onMouseDown={() => bringToFront("palMaker")}
                style={{ zIndex: windows.palMaker.zIndex }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="lg:col-span-5 glass-window rounded-2xl overflow-hidden"
              >
                <div className="px-4 py-3 bg-[#101c24] border-b border-border flex items-center justify-between cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-xs bg-accent inline-block" />
                    <span className="font-mono text-xs font-semibold tracking-wider">
                      {windows.palMaker.title}
                    </span>
                  </div>
                  <div className="flex-1 mx-4 h-3 os-titlebar-lines opacity-60 hidden sm:block" />
                  <button
                    onClick={() => toggleMinimize("palMaker")}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title="Minimize to Dock"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">
                        PAL Persona Identity
                      </label>
                      <input
                        type="text"
                        value={personaName}
                        onChange={(e) => setPersonaName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-muted-foreground uppercase mb-1">
                        Enterprise Assignment
                      </label>
                      <select
                        value={domainRole}
                        onChange={(e) => setDomainRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="Enterprise Sales & Bootcamp Architect">
                          Sales & Bootcamp Architect
                        </option>
                        <option value="Sovereign Legal Intake & Briefing SI">
                          Legal Intake & Briefing SI
                        </option>
                        <option value="Healthcare Triage & Patient Empathy SI">
                          Healthcare Triage PAL
                        </option>
                        <option value="5-Day NHIL Bootcamp Instructor">
                          NHIL Bootcamp Instructor
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-background/70 px-3.5 py-2.5 rounded-xl border border-border">
                    <div>
                      <div className="text-xs font-semibold">
                        Enforce NHIL Spec-Driven Guardrails
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Requires idempotency & 2-node micro-sprint verification
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enforceNhilSpec}
                      onChange={(e) => setEnforceNhilSpec(e.target.checked)}
                      className="w-4 h-4 accent-[#ff6183]"
                    />
                  </div>

                  <button
                    onClick={handleInstantiatePal}
                    disabled={palLoading}
                    className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {palLoading
                      ? "Instantiating Sovereign PAL..."
                      : "Instantiate PAL at Runtime →"}
                  </button>

                  {palSessionResult && (
                    <div className="bg-black/80 border border-accent/40 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400">
                          ● {palSessionResult.sessionId}
                        </span>
                        <button
                          onClick={copySdk}
                          className="inline-flex items-center gap-1 text-accent hover:underline cursor-pointer"
                        >
                          {copiedSdk ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy SDK
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-[11px] font-mono text-muted-foreground overflow-x-auto leading-relaxed">
                        {palSessionResult.sdkSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WINDOW 3: NHIL SPEC-DRIVEN WORKFLOW REVIEWER */}
          <AnimatePresence>
            {!windows.specReviewer.minimized && (
              <motion.div
                drag
                dragMomentum={false}
                onMouseDown={() => bringToFront("specReviewer")}
                style={{ zIndex: windows.specReviewer.zIndex }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="lg:col-span-12 glass-window rounded-2xl overflow-hidden"
              >
                <div className="px-4 py-3 bg-[#0f1f18] border-b border-border flex items-center justify-between cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block" />
                    <span className="font-mono text-xs font-semibold tracking-wider">
                      {windows.specReviewer.title}
                    </span>
                  </div>
                  <div className="flex-1 mx-4 h-3 os-titlebar-lines opacity-60 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleRunWorkflowAudit(VALID_MICRO_SPRINT_SPEC)
                      }
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                    >
                      Load Valid 2-Node Sprint
                    </button>
                    <button
                      onClick={() => handleRunWorkflowAudit(UNSAFE_WORKFLOW_SPEC)}
                      className="text-[11px] font-mono px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 cursor-pointer"
                    >
                      Simulate Unsafe Spec
                    </button>
                    <button
                      onClick={() => toggleMinimize("specReviewer")}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 grid md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        WORKFLOW SPECIFICATION JSON (MICRO-SPRINT INPUT)
                      </span>
                      <button
                        onClick={() => handleRunWorkflowAudit()}
                        disabled={auditLoading}
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-mono font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        {auditLoading
                          ? "Auditing..."
                          : "Run NHIL Guardrail Audit →"}
                      </button>
                    </div>
                    <textarea
                      value={workflowJsonInput}
                      onChange={(e) => setWorkflowJsonInput(e.target.value)}
                      rows={10}
                      className="w-full p-3.5 rounded-xl bg-black/80 border border-border font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="md:col-span-5 bg-black/60 border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <div className="text-xs font-mono text-muted-foreground">
                          NHIL WORKFLOW REVIEWER VERDICT
                        </div>
                        <div className="text-lg font-bold font-mono mt-0.5">
                          {auditResult ? (
                            <span
                              className={
                                auditResult.verdict === "[APPROVED]"
                                  ? "text-emerald-400"
                                  : "text-rose-400"
                              }
                            >
                              {auditResult.verdict} ({auditResult.score})
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              READY FOR AUDIT
                            </span>
                          )}
                        </div>
                      </div>
                      <ShieldCheck className="w-7 h-7 text-emerald-400" />
                    </div>

                    {auditResult?.checks ? (
                      <div className="space-y-3">
                        {auditResult.checks.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-background/80 border border-border/80 flex items-start gap-2.5"
                          >
                            {c.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            )}
                            <div className="text-xs">
                              <div className="font-semibold">{c.rule}</div>
                              <div className="text-muted-foreground mt-0.5">
                                {c.detail}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Click <strong>&ldquo;Run NHIL Guardrail Audit&rdquo;</strong> to verify your workflow specification against our 4 mandatory enterprise invariants: Micro-Sprint 2-Node Bound, Idempotency Key, Autonomous Error Route, and Zero-PII Leakage.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* =====================================================================
          SOVEREIGN RESEARCH MODELS (PHOENIX-S4 / RAVEN-S1 / SPARROW-S1)
         ===================================================================== */}
      <section id="sovereign-models" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
            // FOUNDATION HUMAN COMPUTING MODELS
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            We are engineering living worlds in code now.
          </h2>
          <p className="text-muted-foreground">
            Three proprietary Sovereign SI models working in concert to deliver zero-latency face-to-face presence—instantiated dynamically at runtime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-window p-7 rounded-2xl border border-primary/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold">
                PHOENIX-S4
              </span>
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">
              Real-Time Emotional Rendering Core
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Synthesizes full-face micro-expressions, ocular saccades, and natural cranial kinematics in real time. Zero pre-rendered static loops.
            </p>
            <div className="pt-2 border-t border-border/60 font-mono text-xs text-primary">
              ● 60 FPS Runtime Neural Synthesis
            </div>
          </div>

          <div className="glass-window p-7 rounded-2xl border border-accent/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-mono text-xs font-bold">
                RAVEN-S1
              </span>
              <Eye className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-2xl font-bold">
              KGU Empathy & Perception Matrix
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Multimodal visual perception that sees user gestures, reads shared screens, and interprets emotional tone to adapt workflow execution dynamically.
            </p>
            <div className="pt-2 border-t border-border/60 font-mono text-xs text-accent">
              ● Live Visual & Somatosensory Context
            </div>
          </div>

          <div className="glass-window p-7 rounded-2xl border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                SPARROW-S1
              </span>
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold">
              Sovereign Conversational Timing
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sub-150ms turn-taking and natural interruption handling over the Sovereign Transport Protocol, eliminating robotic pauses forever.
            </p>
            <div className="pt-2 border-t border-border/60 font-mono text-xs text-purple-300">
              ● &lt;150ms Full-Duplex Turn Cadence
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5-DAY NHIL ENTERPRISE BOOTCAMP & SPEC-DRIVEN CURRICULUM
         ===================================================================== */}
      <section
        id="nhil-bootcamp"
        className="py-20 bg-card/40 border-y border-border/60 relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
                // NHIL.NET WORKFORCE TRANSFORMATION
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                The 5-Day Spec-Driven AI Bootcamp
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md text-sm">
              We turn your lawyers, marketers, accountants, and operators into Sovereign Automation Engineers in 5 days using our strict{" "}
              <strong className="text-foreground">I Do, We Do, You Do</strong>{" "}
              Micro-Sprint methodology.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                day: "DAY 01",
                title: "Canvas & JSON Telemetry",
                desc: "Master webhooks, API payloads, and deterministic JSON array transformations.",
              },
              {
                day: "DAY 02",
                title: "Autonomous Error Routes",
                desc: "Eliminate fragile pipelines with dead-letter vaults, switches, and fallback triggers.",
              },
              {
                day: "DAY 03",
                title: "Idempotency & Spec-Builder",
                desc: "Interview with the NHIL Spec-Builder SI to lock scope, MVP, and idempotency keys.",
              },
              {
                day: "DAY 04",
                title: "Sub-Workflows & PALs",
                desc: "Connect modular sub-workflows to live face-to-face Tavus PAL video agents.",
              },
              {
                day: "DAY 05",
                title: "Executive Demo & Audit",
                desc: "Pass the automated NHIL Reviewer Agent audit and deploy live into production.",
              },
            ].map((item) => (
              <div
                key={item.day}
                className="glass-window p-5 rounded-2xl flex flex-col justify-between border border-border/70 hover:border-primary/50 transition-all"
              >
                <div>
                  <div className="text-xs font-mono text-primary font-bold mb-2">
                    {item.day}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>2-NODE MICRO-SPRINT</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SOLUTIONS & ENTERPRISE DEPLOYMENT TIERS
         ===================================================================== */}
      <section id="enterprise-matrix" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
            // COMMERCIAL DEPLOYMENT PACKAGES
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Deploy Sovereign PALs & NHIL Infrastructure Today
          </h2>
          <p className="text-muted-foreground">
            Replace $250k/year agency bottlenecks with permanent internal capability and 24/7 face-to-face Synthetic Intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              tier: "PILOT COHORT",
              name: "5-Day NHIL Bootcamp",
              price: "$25,000",
              cadence: "per 10-seat executive cohort",
              features: [
                "Full 5-Day Spec-Driven Bootcamp Curriculum",
                "NHIL Spec-Builder Skill installed for all seats",
                "2-Node Micro-Sprint Certification",
                "Friday Executive Prototype Demo Day",
              ],
              cta: "Book Cohort Pilot",
              highlighted: false,
            },
            {
              tier: "SOVEREIGN ENTERPRISE",
              name: "Managed PAL + NHIL Cloud",
              price: "$8,500",
              cadence: "per month // unlimited internal workflows",
              features: [
                "Dedicated Sovereign Hardware Node & Lakehouse",
                "Real-time Phoenix-S4, Raven-S1 & Sparrow-S1 PALs",
                "Automated NHIL Workflow Reviewer Gatekeeper",
                "24/7 Sovereign Broadcast & Full-Duplex CVI",
              ],
              cta: "Deploy Sovereign Node",
              highlighted: true,
            },
            {
              tier: "CUSTOM DIGITAL TWIN",
              name: "Executive Founder PAL",
              price: "Custom",
              cadence: "Dedicated Tier-1 Sovereign GPU Cluster",
              features: [
                "Bespoke Executive / Founder Face-to-Face PAL",
                "Private KGU Empathy Engine Matrix training",
                "Magic Canvas & Multi-Agent Swarm Orchestration",
                "100% Sovereign Data Isolation & Zero Leaks",
              ],
              cta: "Request Executive Briefing",
              highlighted: false,
            },
          ].map((pkg) => (
            <div
              key={pkg.name}
              className={`rounded-2xl p-8 flex flex-col justify-between ${
                pkg.highlighted
                  ? "glass-window border-2 border-primary tavus-glow"
                  : "glass-window border border-border"
              }`}
            >
              <div>
                <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">
                  {pkg.tier}
                </div>
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold font-mono mb-1">
                  {pkg.price}
                </div>
                <div className="text-xs text-muted-foreground mb-6">
                  {pkg.cadence}
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#os-workspace"
                onClick={handleInstantiatePal}
                className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-center transition-all ${
                  pkg.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-white/10 text-foreground hover:bg-white/15"
                }`}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Tavus-Inspired Pixel Matrix Footer */}
      <footer className="border-t border-border/80 bg-[#080406] relative z-10">
        <div className="w-full h-4 bg-gradient-to-r from-primary via-[#ffb4c5] to-accent opacity-80" />
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground font-mono">
          <div>
            <span className="text-foreground font-bold">
              KGUINTERNATIONAL // TAVUS.IO × NHIL.NET
            </span>{" "}
            — Engineering Living Worlds in Code. Generated at Runtime.
          </div>
          <div className="flex items-center gap-6">
            <a href="#os-workspace" className="hover:text-primary transition-colors">
              PAL Studio
            </a>
            <a href="#sovereign-models" className="hover:text-primary transition-colors">
              Sovereign Models
            </a>
            <a href="#nhil-bootcamp" className="hover:text-primary transition-colors">
              Bootcamp Syllabus
            </a>
            <a
              href="https://github.com/kguinternational/tavus.io"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              GitHub: kguinternational/tavus.io
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
