"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, FileSearch, Folder, HardDrive, ScanLine } from "lucide-react";

const branches = [
  { name: "Users", size: "109.6", detail: "Documents, downloads and profiles", color: "#d5fa73" },
  { name: "Programs", size: "67.2", detail: "Installed applications", color: "#92e7ed" },
  { name: "Windows", size: "42.8", detail: "System folders", color: "#b1d59e" },
  { name: "Other", size: "18.8", detail: "Other indexed folders", color: "#b7b9e9" },
];

export function FolderMap() {
  const [selected, setSelected] = useState(null);
  const folder = branches[selected];
  return (
    <section className="folder-map" aria-label="Interactive sample disk map">
      <div className="pane-bar"><span><ScanLine size={16} /> DiskLens <i>/</i> Storage map</span><span className="sample"><b /> Sample index</span></div>
      <div className="map-grid">
        <svg className="map-links" viewBox="0 0 600 360" preserveAspectRatio="none" aria-hidden="true">
          {branches.map((branch, index) => {
            const path = `M 172 180 C 300 180, 284 ${45 + index * 90}, 390 ${45 + index * 90}`;
            return <g key={branch.name} stroke={branch.color} className={selected === null || selected === index ? "active" : ""}>
              <path d={path} className="link-glow" />
              <path d={path} className="link-wire" />
              <path d={path} className="link-pulse" pathLength="100" style={{ "--delay": `${index * -.7}s` }} />
            </g>;
          })}
        </svg>
        <button className="map-disk" type="button" aria-pressed={selected === null} onClick={() => setSelected(null)} aria-label="Show all indexed folders">
          <HardDrive size={27} strokeWidth={1.3} /><strong>C:</strong><span>Local disk</span>
        </button>
        <div className="map-branches" role="group" aria-label="Inspect a sample folder">
          {branches.map((branch, index) => (
            <button className="map-branch" key={branch.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(selected === index ? null : index)}
              style={{ "--branch-color": branch.color }}>
              <Folder size={16} /><span>{branch.name}</span><b>{branch.size} GB</b>
            </button>
          ))}
        </div>
      </div>
      <div className="map-metric" aria-live="polite">
        <span><strong>{folder?.size ?? "238.4"}</strong> GB</span><p>{folder?.detail ?? "Indexed across four folder groups"}</p>
      </div>
    </section>
  );
}

const stages = [
  { title: "Choose a location", copy: "Start with a drive or a specific folder. Confirm exactly where DiskLens should look.", progress: 18, current: "C: selected" },
  { title: "Build the index", copy: "Follow the scan as DiskLens records file metadata. You can cancel a scan in progress.", progress: 64, current: "Reading file metadata" },
  { title: "Explore the results", copy: "See the largest folders, open the sunburst and review cleanup candidates.", progress: 100, current: "Index ready to explore" },
];
const scanPaths = ["C:\\Users", "C:\\Program Files", "C:\\Windows"];

export function ScanConsole() {
  const [stage, setStage] = useState(0);
  const steps = useRef(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !window.matchMedia("(min-width: 761px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setStage(Number(entry.target.dataset.step));
    }, { rootMargin: "-40% 0px -35% 0px" });
    Array.from(steps.current.children).forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);
  return (
    <section className="wrap scan-section" id="how-it-works" data-light-scene="1">
      <header className="chapter-title"><span className="kicker">How it works</span><h2>From drive to <em>detail.</em></h2></header>
      <div className="scan-layout">
        <ol className="scan-steps" ref={steps}>
          {stages.map((item, index) => <li data-step={index} key={item.title}>
            <button type="button" aria-pressed={stage === index} onClick={() => setStage(index)}>
              <span className="step-marker" aria-hidden="true">{stage > index ? <Check size={15} /> : index + 1}</span>
              <span><strong>{item.title}</strong><span>{item.copy}</span></span>
            </button>
          </li>)}
        </ol>
        <div className="scan-sticky">
          <section className="scan-pane" aria-label="Example scan console">
            <div className="pane-bar"><span><FileSearch size={16} /> Scan console</span><span className="sample"><b /> Sample scan</span></div>
            <div className="scan-body">
              <div className="scan-heading"><div><span className="micro">Local disk</span><h3>{stages[stage].current}</h3></div><span className="scan-percent">{stages[stage].progress}%</span></div>
              <div className="scan-progress" role="progressbar" aria-label="Sample scan progress" aria-valuenow={stages[stage].progress}><i style={{ width: stages[stage].progress + "%" }} /></div>
              <div className="scan-paths">{scanPaths.map((path, index) => (
                <div className={stage >= index ? "path-current" : ""} key={path}><Folder size={16} /><code>{path}</code><span>{stage === 2 || stage > index ? "Indexed" : stage === index ? "Selected" : "Queued"}</span></div>
              ))}</div>
            </div>
          </section>
          <Link className="guide-link" href="/docs#install">Read the setup guide</Link>
        </div>
      </div>
    </section>
  );
}
