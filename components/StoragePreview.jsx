"use client";

import { useState } from "react";
import { ChartPie, Folder, HardDrive } from "lucide-react";

const folders = [
  { name: "Users", size: 109.6, color: "#cbf65a", parts: [48, 30, 16, 6] },
  { name: "Programs", size: 67.2, color: "#a8c694", parts: [38, 32, 22, 8] },
  { name: "Windows", size: 42.8, color: "#76ada2", parts: [50, 29, 21] },
  { name: "Other", size: 18.8, color: "#b2adc8", parts: [60, 40] },
];
const total = folders.reduce((sum, folder) => sum + folder.size, 0);

function point(radius, degrees) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [120 + Math.cos(radians) * radius, 120 + Math.sin(radians) * radius].join(" ");
}

function sector(inner, outer, start, end) {
  const large = end - start > 180 ? 1 : 0;
  return `M ${point(inner, start)} L ${point(outer, start)} A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)} Z`;
}

function Sunburst({ selected, toggle }) {
  let start = 0;
  return (
    <svg className="sunburst" viewBox="0 0 240 240" aria-hidden="true">
      <circle cx="120" cy="120" r="119" fill="none" stroke="#515948" strokeDasharray="1 6" />
      {folders.map((folder) => {
        const angle = (folder.size / total) * 360;
        const from = start;
        start += angle;
        let childStart = from;
        return (
          <g key={folder.name} fill={folder.color} stroke="#141912" strokeWidth="1.7"
            opacity={selected && selected !== folder ? 0.25 : 1} onClick={() => toggle(folder)}>
            <path d={sector(56, 77, from, start)} />
            {folder.parts.map((part, i) => {
              const left = childStart;
              childStart += (part / 100) * angle;
              const split = left + (childStart - left) * 0.62;
              return (
                <g key={i}>
                  <path d={sector(77, 96, left, childStart)} fillOpacity={0.9 - i * 0.07} />
                  <path d={sector(96, 112, left, split)} fillOpacity={0.72 - i * 0.06} />
                  <path d={sector(96, 112, split, childStart)} fillOpacity={0.48 + i * 0.04} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function StoragePreview() {
  const [selected, setSelected] = useState(null);
  const toggle = (folder) => setSelected((current) => current === folder ? null : folder);
  return (
    <section className="explorer" aria-label="Interactive sample storage explorer">
      <div className="explorer-bar"><span><ChartPie size={15} /> DiskLens <i>/</i> Explorer</span><span className="sample-label">Sample index</span></div>
      <div className="explorer-content">
        <div className="explorer-title"><div><span className="micro">Storage explorer</span><h2>Local Disk (C:)</h2></div><HardDrive size={23} strokeWidth={1.4} /></div>
        <div className="explorer-data">
          <div className="chart-well">
            <Sunburst selected={selected} toggle={toggle} />
            <div className="chart-center" aria-live="polite" aria-atomic="true">
              <strong>{(selected?.size ?? total).toFixed(1)}</strong><span>GB {selected ? "in " + selected.name : "indexed"}</span>
            </div>
          </div>
          <div className="folder-list" role="group" aria-label="Highlight a folder in the chart">
            <div className="folder-caption"><span>Folder</span><span>Size</span></div>
            {folders.map((folder) => (
              <button key={folder.name} type="button" onClick={() => toggle(folder)} aria-pressed={selected === folder} style={{ "--folder": folder.color }}>
                <span><i />{folder.name}</span><b>{folder.size.toFixed(1)} GB</b>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="explorer-foot"><span><Folder size={14} /> Select a folder to inspect</span><code>C:&#92;</code></div>
    </section>
  );
}
