"use client";

import { useEffect, useState } from "react";

import { AsciiBox } from "../ui/AsciiBox";
import { DotLoader } from "../ui/DotLoader";
import { ProgressBar } from "../ui/ProgressBar";

/** Slow sweep so the determinate bar visibly moves in the showcase. */
function useSweep() {
  const [v, setV] = useState(18);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setV((prev) => (prev + dt * 0.012) % 100);
      raf = requestAnimationFrame(tick);
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return v;
}

export function DemoBlock() {
  const sweep = useSweep();

  return (
    <div className="mb-3 flex flex-wrap items-start gap-4 pl-5">
      <AsciiBox title="ascii box">
        <div className="whitespace-pre" style={{ color: "var(--dim)" }}>
          {"frames arbitrary JSX,\nnot just text — the\nborder is real\ncharacters, measured\nto the content."}
        </div>
      </AsciiBox>

      <AsciiBox title="progress">
        <div className="flex flex-col gap-1">
          <ProgressBar label="build" value={100} width={18} />
          <ProgressBar label="tests" value={72} width={18} />
          <ProgressBar label="deploy" value={sweep} width={18} />
          <ProgressBar label="watch" value={0} indeterminate width={18} />
        </div>
      </AsciiBox>

      <AsciiBox title="dot loader">
        <div className="flex items-start gap-4">
          <DotLoader size="block" />
          <div className="flex flex-col gap-1" style={{ color: "var(--dim)" }}>
            <DotLoader size="inline" label="inline" />
            <span style={{ color: "var(--faint)" }}>die faces, drawn</span>
            <span style={{ color: "var(--faint)" }}>from in-font dots</span>
          </div>
        </div>
      </AsciiBox>
    </div>
  );
}
