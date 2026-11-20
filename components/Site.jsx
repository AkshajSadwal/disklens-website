"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Database, Download, FileSearch, HardDrive, Menu, Monitor, ShieldCheck, Sparkles, X } from "lucide-react";
import StoragePreview from "./StoragePreview";
import LightTrails from "./LightTrails";
import { FolderMap, ScanConsole } from "./StorageScenes";

const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "AkshajSadwal/disklens";
const SOURCE = `https://github.com/${REPO}`;
const RELEASES = `${SOURCE}/releases`;
const PINNED = { version: "v1.1.0", asset: `${RELEASES}/download/v1.1.0/DiskLens-Setup-1.1.0.exe` };

function useInstaller() {
  const [release, setRelease] = useState(PINNED);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4500);
    async function load() {
      try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        const asset = data.assets?.find((item) => /^DiskLens-Setup-.*\.exe$/i.test(item.name));
        if (asset?.browser_download_url && data.tag_name) {
          setRelease({ version: data.tag_name, asset: asset.browser_download_url, size: asset.size });
        }
      } catch {
        // The pinned installer remains available offline or when GitHub rate-limits requests.
      } finally {
        window.clearTimeout(timer);
      }
    }
    load();
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, []);
  return release;
}

const questions = [
  ["Is DiskLens free to download?", "Yes. You can download the Windows installer from the public GitHub Releases page."],
  ["Does DiskLens upload my files?", "A normal scan stores file metadata on your device. Hosted AI analysis is optional. You can review the request before sending it to your chosen provider."],
  ["Does it scan my whole PC automatically?", "You choose the drives or folders and confirm the selection before a scan starts. You can cancel a scan in progress."],
  ["Do I need an API key?", "Local storage advice works without a key. To use a hosted AI provider, configure your own key and review the provider’s usage terms."],
  ["Where can I find the source code?", <>The application source, issues and release history are available in the <a href={SOURCE}>DiskLens GitHub repository</a>.</>],
];

function Brand() {
  return <Link href="/" className="brand" aria-label="DiskLens home"><span aria-hidden="true" className="brand-icon" />DiskLens</Link>;
}

function Header({ asset }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const header = useRef(null);
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    function keydown(event) {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }
    const outside = (event) => { if (!header.current?.contains(event.target)) setOpen(false); };
    const desktop = window.matchMedia("(min-width: 921px)");
    desktop.addEventListener("change", close);
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      desktop.removeEventListener("change", close);
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open]);
  return (
    <header className="topbar" ref={header}>
      <div className="wrap header-row">
        <Brand />
        <nav id="site-nav" aria-label="Main navigation" className={open ? "primary-nav is-open" : "primary-nav"}>
          <a href="#features" onClick={close}>Features</a><a href="#how-it-works" onClick={close}>How it works</a><a href="#privacy" onClick={close}>Privacy</a><Link href="/docs" onClick={close}>Docs</Link>
        </nav>
        <div className="header-actions"><a className="source-link" href={SOURCE}>GitHub</a><a className="nav-install" href={asset}>Download <Download size={14} /></a>
          <button className="menu-toggle" type="button" ref={trigger} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>
  );
}


const candidates = [
  ["Temporary files", "1.20 GB", "68%"],
  ["Old downloads", "620 MB", "41%"],
  ["Duplicate candidates", "340 MB", "24%"],
];

export default function Site() {
  const release = useInstaller();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header asset={release.asset} />
      <main id="main" className="landing">
        <LightTrails />
        <section className="hero" data-light-scene="0" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="kicker">Disk analysis for Windows</span>
              <h1 id="hero-title">Map every<br /><em>gigabyte.</em></h1>
              <p>Follow your storage from the whole drive down to a single folder. See what’s taking up space and decide what to keep.</p>
              <div className="hero-actions">
                <a className="button primary" href={release.asset}><Download size={17} />Download for Windows</a>
                <a className="button secondary" href="#showcase">Try the explorer</a>
              </div>
              <div className="release-meta"><Monitor size={14} />Windows 10 / 11 · x64 <a href={RELEASES + "/tag/" + release.version}>{release.version}</a></div>
            </div>
            <div className="map-stage"><FolderMap /></div>
          </div>
          <div className="wrap hero-foot"><a href="#how-it-works"><ChevronDown size={15} /> See how DiskLens scans</a><span><ShieldCheck size={15} /> Local indexing</span></div>
        </section>

        <ScanConsole />

        <section className="wrap insights" id="features" data-light-scene="2">
          <div className="chapter-title insight-title"><div><span className="kicker">Cleanup &amp; insights</span><h2>Find what’s <em>taking up space.</em></h2></div><p>Investigate large files, review cleanup candidates and use the Storage Advisor to see where to look next.</p></div>
          <div className="insight-grid">
            <article className="cleanup pane">
              <div className="pane-bar"><span><FileSearch size={16} /> Cleanup review</span><span className="sample"><b /> Sample results</span></div>
              <div className="cleanup-body">
                <h3>Review before you remove</h3>
                <div className="candidate-list">
                  {candidates.map(([name, size, width]) => <div className="candidate" key={name}><span>{name}</span><strong>{size}</strong><div className="candidate-track"><i style={{ "--fill": width }} /></div></div>)}
                </div>
                <Link className="guide-link" href="/docs#cleanup">Cleanup guide</Link>
              </div>
            </article>
            <article className="advisor pane">
              <div className="advisor-signal" aria-hidden="true"><div /><div /><div /><Sparkles size={33} strokeWidth={1.3} /></div>
              <h3>Storage Advisor</h3>
              <p>Start with local rules. Connect a hosted AI provider if you want another perspective.</p>
              <Link className="guide-link" href="/docs#ai">Storage Advisor guide</Link>
            </article>
          </div>
        </section>

        <section className="privacy-section" id="privacy" data-light-scene="3">
          <div className="wrap privacy-layout">
            <div className="chapter-title"><span className="kicker">Privacy</span><h2>Your index<br /><em>stays local.</em></h2><p>DiskLens records names, paths, sizes and timestamps on your PC. If you configure hosted AI, you can review the request before sending it.</p><Link className="guide-link" href="/docs#privacy">Read the privacy guide</Link></div>
            <div className="privacy-map pane" aria-label="File metadata moves from the selected drive to a local index on this PC">
              <div className="pane-bar"><span><ShieldCheck size={16} /> Local scan</span><span className="sample"><b /> On this PC</span></div>
              <div className="privacy-route">
                <div><HardDrive size={25} strokeWidth={1.5} /><span>Selected drive</span></div>
                <i aria-hidden="true" />
                <div><Database size={25} strokeWidth={1.5} /><span>Local index</span></div>
              </div>
              <span className="privacy-caption">File metadata</span>
            </div>
          </div>
        </section>

        <section className="showcase" id="showcase" aria-labelledby="showcase-title">
          <div className="wrap showcase-head"><div><span className="kicker">Interactive preview</span><h2 id="showcase-title">See the <em>whole drive.</em></h2></div><p>Select a folder to see its share of a sample disk. Follow the sunburst rings to see how the space is split.</p></div>
          <div className="laptop-shot"><div className="laptop">
            <div className="laptop-lid"><div className="laptop-camera" aria-hidden="true" /><div className="laptop-display"><StoragePreview /></div></div>
            <div className="laptop-base" aria-hidden="true" />
          </div></div>
          <div className="wrap showcase-foot"><Link className="guide-link" href="/docs#storage">Storage Explorer guide</Link></div>
        </section>

        <section className="download-scene" id="download" data-light-scene="4">
          <div className="wrap download-panel">
            <div><span className="kicker">DiskLens for Windows</span><h2>Find what’s <em>filling your disk.</em></h2></div>
            <div className="download-actions"><a href={release.asset} className="button dark"><Download size={17} />Download DiskLens</a><a className="notes" href={RELEASES}>{release.version}{release.size ? " · " + (release.size / 1048576).toFixed(1) + " MB" : ""} · Release notes</a></div>
          </div>
        </section>

        <section className="wrap faq-layout" id="faq">
          <div><span className="kicker">FAQ</span><h2>Common <em>questions.</em></h2></div>
          <div className="faq">{questions.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div>
        </section>
      </main>
      <footer><div className="wrap footer-row"><Brand /><nav aria-label="Footer navigation"><Link href="/docs">Documentation</Link><a href={SOURCE}>GitHub</a><a href={RELEASES}>Releases</a></nav><small>© {new Date().getFullYear()} DiskLens</small></div></footer>
    </>
  );
}
