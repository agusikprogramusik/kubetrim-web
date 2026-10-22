"use client";

import React from "react";
import { ThemeMode, TraceMode } from "@/types/finops";

interface DualTraceOscilloscopeProps {
  traceMode: TraceMode;
  theme: ThemeMode;
  onChangeTraceMode: (mode: TraceMode) => void;
}

export function DualTraceOscilloscope({
  traceMode,
  theme,
  onChangeTraceMode,
}: DualTraceOscilloscopeProps) {
  const accent = theme === "paper" ? "#FF4F00" : "#D4FF00";
  const crimson = theme === "paper" ? "#C81E1E" : "#FF3B30";
  const muted = theme === "paper" ? "#62605B" : "#8E929F";

  return (
    <div className="swiss-cell lg:col-span-8 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--border-hairline)]">
        <div>
          <span className="font-mono-tech text-xs text-[var(--text-muted)] block">
            04 // DUAL-TRACE TELEMETRY OSCILLOSCOPE
          </span>
          <h2 className="font-editorial text-2xl mt-0.5">
            {traceMode === "sawtooth"
              ? "14-Day Sawtooth Memory Leak Detector (billing/invoice-aggregator)"
              : "Before & After (T0 -> T1) ConfigHash ROI Attribution Curve"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeTraceMode("attribution")}
            className={`mech-btn ${traceMode === "attribution" ? "active-btn" : ""}`}
          >
            <span>TRACE A // T0-&gt;T1 ROI</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTraceMode("sawtooth")}
            className={`mech-btn ${traceMode === "sawtooth" ? "active-btn" : ""}`}
          >
            <span>TRACE B // SAWTOOTH LEAK</span>
          </button>
        </div>
      </div>

      <div className="oscilloscope-bg border border-[var(--border-hairline)] p-3">
        {traceMode === "sawtooth" ? (
          <svg viewBox="0 0 760 220" className="w-full h-[220px] block">
            <line
              x1="40"
              y1="38"
              x2="740"
              y2="38"
              stroke={crimson}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x="48"
              y="30"
              fill={crimson}
              className="font-mono-tech"
              fontSize="10"
            >
              [ GUARDRAIL // MEMORY UPSIZING BLOCKED: 4096Mi LIMIT / OOM_KILL THRESHOLD ]
            </text>

            <line
              x1="40"
              y1="185"
              x2="740"
              y2="185"
              stroke={muted}
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <text
              x="48"
              y="202"
              fill={muted}
              className="font-mono-tech"
              fontSize="10"
            >
              T-14d (container_memory_working_set_bytes)
            </text>
            <text
              x="530"
              y="202"
              fill={muted}
              className="font-mono-tech"
              fontSize="10"
            >
              SLOPE: +48.5 MiB/hr (92% MONOTONIC)
            </text>

            <polyline
              fill="none"
              stroke={crimson}
              strokeWidth="2"
              points="40,175 85,140 130,98 175,42 178,176 225,135 275,88 320,40 323,174 375,130 430,82 480,39 483,175 540,125 600,75 650,41 653,172 705,120 740,85"
            />

            <circle cx="175" cy="42" r="4" fill={crimson} />
            <text x="145" y="20" fill={crimson} className="font-mono-tech" fontSize="9">
              OOM #1 (137)
            </text>

            <circle cx="320" cy="40" r="4" fill={crimson} />
            <text x="290" y="20" fill={crimson} className="font-mono-tech" fontSize="9">
              OOM #2 (137)
            </text>

            <circle cx="480" cy="39" r="4" fill={crimson} />
            <text x="450" y="20" fill={crimson} className="font-mono-tech" fontSize="9">
              OOM #3 (137)
            </text>

            <circle cx="650" cy="41" r="4" fill={crimson} />
            <text x="620" y="20" fill={crimson} className="font-mono-tech" fontSize="9">
              OOM #4 (137)
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 760 220" className="w-full h-[220px] block">
            <line
              x1="40"
              y1="95"
              x2="740"
              y2="95"
              stroke={muted}
              strokeOpacity="0.3"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x="48"
              y="86"
              fill={muted}
              className="font-mono-tech"
              fontSize="10"
            >
              T0 BASELINE ALLOCATION ($2,840/mo // ConfigHash sha256:9c11b0a4)
            </text>

            <polyline
              fill="none"
              stroke={muted}
              strokeWidth="1.5"
              points="40,65 140,62 240,66 340,64 380,64"
            />

            <line
              x1="380"
              y1="25"
              x2="380"
              y2="190"
              stroke={accent}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <text
              x="388"
              y="38"
              fill={accent}
              className="font-mono-tech"
              fontSize="10"
            >
              GITOPS PR MERGED -&gt; ConfigHash sha256:2f88e91b
            </text>

            <polyline
              fill="none"
              stroke={accent}
              strokeWidth="2.25"
              points="380,64 410,142 500,140 610,143 740,141"
            />
            <circle cx="380" cy="64" r="4" fill={accent} />
            <circle cx="410" cy="142" r="4" fill={accent} />
            <text
              x="422"
              y="164"
              fill={accent}
              className="font-mono-tech"
              fontSize="11"
            >
              REALIZED SAVINGS: +$394.30/mo ($4,731.60/yr) // SLA OOM DELTA: 0
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}
