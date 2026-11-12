"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  ChevronDown,
  Database,
  Folder,
  Gauge,
  HardDrive,
  Menu,
  ScanLine,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "AkshajSadwal/disklens";
const FALLBACK_VERSION = "v1.1.0";
const FALLBACK_ASSET = `https://github.com/${REPO}/releases/download/v1.1.0/DiskLens-Setup-1.1.0.exe`;
const RELEASES_URL = `https://github.com/${REPO}/releases`;
const SOURCE_URL = `https://github.com/${REPO}`;

const reveal = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
  },
};

const featureStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
};

const features = [
  {
    index: "01 / OVERVIEW",
    title: "Understand the big picture",
    body: "See indexed storage at a glance, compare drives and spot the largest items in your index.",
    icon: Gauge,
    tone: "blue",
  },
  {
    index: "02 / EXPLORE",
    title: "Explore space visually",
    body: "Use the multi-level sunburst to understand how folders contribute to a drive’s size.",
    icon: Database,
    tone: "coral",
  },
  {
    index: "03 / CLEANUP",
    title: "Review before you remove",
    body: "Inspect cleanup recommendations and file candidates. Actions are deliberate, not automatic.",
    icon: Folder,
    tone: "gold",
  },
  {
    index: "04 / INSIGHT",
    title: "Get useful storage advice",
    body: "Start with local rule-based analysis. Configure a hosted AI provider only when you choose.",
    icon: Sparkles,
    tone: "violet",
  },
  {
    index: "05 / CONTROL",
    title: "Stay in control of every scan",
    body: "Choose locations to index, follow progress and cancel when needed.",
    icon: ScanLine,
    tone: "green",
  },
];

const questions = [
  ["Is DiskLens free to download?", "Yes. The Windows installer is published in the public GitHub Releases page. Review the release notes and license in the repository before use."],
  ["Does DiskLens upload my files?", "Normal indexing records file metadata and stores the index locally. It does not upload complete file contents. Hosted AI features are optional and are only used when you configure a provider and start an analysis."],
  ["Does it scan my whole PC automatically?", "No. You choose the drives or folders to scan and confirm the selection."],
  ["What does the AI Storage Advisor need?", "Local rule-based advice works without an API key. A hosted provider is optional; provider usage may incur charges. Review the request preview and billing terms before sending."],
  ["Where can I find the source code?", "The source code, issues and release history are available on the public DiskLens GitHub repository."],
];

function Brand({ footer = false }) {
  return (
    <a className={`brand ${footer ? "brand-footer" : ""}`} href="#top" aria-label="DiskLens home">
      <span className="brand-mark">D</span>
      <span className="brand-copy">
        <strong>DiskLens</strong>
        <small>Storage Intelligence</small>
      </span>
    </a>
  );
}

function DownloadLink({ href, children, variant = "primary", className = "", onClick, ...props }) {
  return (
    <a className={`button button-${variant} ${className}`} href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
}

function FlowField({ reduceMotion }) {
  return (
    <div className={`flow-field ${reduceMotion ? "flow-static" : ""}`} aria-hidden="true">
      <div className="flow-aura flow-aura-one" />
      <div className="flow-aura flow-aura-two" />
      <svg className="flow-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="flow-lime" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D8FF59" stopOpacity="0" />
            <stop offset=".38" stopColor="#D8FF59" stopOpacity=".95" />
            <stop offset=".72" stopColor="#A7F75A" stopOpacity=".72" />
            <stop offset="1" stopColor="#71F6B2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flow-cyan" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#7BFFC0" stopOpacity="0" />
            <stop offset=".48" stopColor="#74F6D2" stopOpacity=".8" />
            <stop offset="1" stopColor="#91BCFF" stopOpacity="0" />
          </linearGradient>
          <filter id="flow-blur-wide" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="17" />
          </filter>
          <filter id="flow-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <g className="flow-wide" filter="url(#flow-blur-wide)">
          <path d="M-80 610 C180 210 345 835 630 500 S1050 125 1510 410" stroke="url(#flow-lime)" strokeWidth="45" />
          <path d="M-100 735 C175 345 420 895 710 585 S1160 245 1530 535" stroke="url(#flow-cyan)" strokeWidth="35" />
        </g>
        <g className="flow-lines">
          <path d="M-80 610 C180 210 345 835 630 500 S1050 125 1510 410" stroke="url(#flow-lime)" strokeWidth="2.2" />
          <path d="M-90 645 C175 255 365 850 650 525 S1090 160 1510 450" stroke="url(#flow-lime)" strokeWidth="1.35" />
          <path d="M-100 680 C160 300 390 875 680 555 S1130 205 1530 490" stroke="url(#flow-cyan)" strokeWidth="1.7" />
          <path d="M-120 720 C150 350 410 910 715 595 S1170 255 1540 535" stroke="url(#flow-cyan)" strokeWidth="1" />
          <path d="M-60 560 C190 170 330 770 600 455 S1030 75 1490 365" stroke="url(#flow-lime)" strokeWidth=".9" />
          <path d="M-100 770 C175 390 435 940 755 630 S1200 300 1540 570" stroke="url(#flow-cyan)" strokeWidth=".8" />
        </g>
      </svg>
      <div className="flow-grain" />
    </div>
  );
}

function ProductWindow({ reduceMotion }) {
  return (
    <motion.div
      className="product-window"
      initial={reduceMotion ? false : { opacity: 0, y: 54, rotate: 1.5, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 1.05, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { y: -7, rotateX: 1.1, rotateY: -1, transition: { duration: 0.32 } }}
    >
      <div className="window-topbar">
        <div className="window-brand"><span className="mini-mark">D</span><strong>DiskLens</strong><span className="window-local"><i /> LOCAL INDEX</span></div>
        <div className="window-controls"><i /><i /><i /></div>
      </div>
      <div className="window-body">
        <aside className="mock-sidebar" aria-hidden="true">
          <div className="mock-nav active"><b>⌂</b>Home</div>
          <div className="mock-nav"><b>▣</b>Storage</div>
          <div className="mock-nav"><b>▦</b>Programs &amp; Cleanup</div>
          <div className="mock-nav"><b>✣</b>AI Storage Advisor</div>
          <div className="mock-nav"><b>⚙</b>Settings</div>
          <div className="mock-local"><span />Local only</div>
        </aside>
        <div className="mock-main">
          <div className="mock-page-head">
            <div><small>OVERVIEW</small><h3>Home</h3><p>A simple view of your storage.</p></div>
            <span className="scan-pill"><ScanLine size={12} /> Scan Now</span>
          </div>
          <div className="mock-metrics">
            <div className="mock-metric"><small>Total storage</small><strong>475.42 <b>GB</b></strong><span>All indexed drives</span></div>
            <div className="mock-metric"><small>Used</small><strong>238.40 <b>GB</b></strong><span>50% of total</span></div>
            <div className="mock-metric"><small>Free</small><strong>237.02 <b>GB</b></strong><span>50% available</span></div>
          </div>
          <div className="mock-content-grid">
            <div className="mock-left">
              <div className="mock-panel drive-panel">
                <div className="mock-panel-heading"><strong>Drives</strong><small>View all drives ↗</small></div>
                {[["A:\\", 42], ["B:\\", 3], ["C:\\", 91]].map(([drive, percent]) => (
                  <div className="drive-row" key={drive}><b>{drive}</b><span className="drive-track"><i style={{ width: `${percent}%` }} /></span><small>{percent}%</small></div>
                ))}
              </div>
              <div className="mock-panel largest-panel">
                <div className="mock-panel-heading"><strong>Largest items</strong><small>View all ↗</small></div>
                <div className="mock-table-head"><span>NAME</span><span>PATH</span><span>SIZE</span></div>
                <div className="mock-table-row"><b>▤ &nbsp; docker_data.vhdx</b><span>C:\Users\…\Docker\wsl\disk</span><strong>43.90 GB</strong></div>
                <div className="mock-table-row"><b>▤ &nbsp; weights.bin</b><span>C:\chrome-debug-profile\…</span><strong>3.98 GB</strong></div>
                <div className="mock-table-row"><b>▤ &nbsp; video_features.csv</b><span>A:\projects\data\…</span><strong>3.14 GB</strong></div>
              </div>
            </div>
            <div className="mock-right">
              <div className="mock-panel quick-panel"><div className="mock-panel-heading"><strong>Quick actions</strong></div><div className="quick-row"><Folder size={13} /> Browse Storage <span>›</span></div><div className="quick-row"><Sparkles size={13} /> AI Storage Advisor <span>›</span></div><div className="quick-row"><HardDrive size={13} /> Programs &amp; Cleanup <span>›</span></div></div>
              <div className="mock-panel breakdown-panel"><strong>Storage breakdown</strong><div className="breakdown-body"><div className="donut"><div><b>475.42</b><small>GB total</small></div></div><div className="legend"><span><i className="used-dot" />Used <small>238.40 GB</small></span><span><i className="free-dot" />Free <small>237.02 GB</small></span></div></div></div>
            </div>
          </div>
          <div className="window-scanline" />
        </div>
      </div>
    </motion.div>
  );
}

function SunburstGraphic() {
  return (
    <div className="sunburst-wrap" aria-hidden="true">
      <div className="sunburst-ring sunburst-outer" />
      <div className="sunburst-ring sunburst-middle" />
      <div className="sunburst-ring sunburst-inner" />
      <div className="sunburst-core"><strong>A:\</strong><small>Current location</small></div>
    </div>
  );
}

function ScanFloat({ reduceMotion }) {
  return (
    <motion.div
      className="scan-float"
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.94 }}
      animate={reduceMotion ? {} : { opacity: 1, y: [0, -8, 0], scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : { opacity: { delay: 0.85, duration: 0.5 }, y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.45, delay: 0.9 } }}
    >
      <span className="scan-float-icon"><Check size={14} /></span>
      <span className="scan-float-copy"><strong>Index ready</strong><small>Local scan complete</small></span>
      <span className="scan-float-spark">✳</span>
    </motion.div>
  );
}

function ScrollProgress({ reduceMotion }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <motion.div className={`scroll-progress ${reduceMotion ? "scroll-progress-static" : ""}`} style={{ scaleX: reduceMotion ? 0 : scaleX }} aria-hidden="true" />;
}

export default function Site() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [release, setRelease] = useState({ version: FALLBACK_VERSION, asset: FALLBACK_ASSET, size: 0, status: "fallback" });
  const motionProps = reduceMotion ? {} : { variants: reveal, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.18 } };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4500);
    async function loadRelease() {
      try {
        const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
          headers: { Accept: "application/vnd.github+json" },
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
        const data = await response.json();
        const asset = (data.assets || []).find((item) => /^DiskLens-Setup-.*\.exe$/i.test(item.name));
        if (!asset?.browser_download_url) throw new Error("No Windows installer on the latest release");
        setRelease({ version: data.tag_name || FALLBACK_VERSION, asset: asset.browser_download_url, size: asset.size || 0, status: "latest" });
      } catch {
        // Keep the pinned, verified release link usable if the public API is unavailable.
      } finally {
        window.clearTimeout(timeout);
      }
    }
    loadRelease();
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const fileSize = release.size > 0 ? `${(release.size / (1024 * 1024)).toFixed(1)} MB installer` : "~73 MB installer";

  return (
    <>
      <ScrollProgress reduceMotion={reduceMotion} />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header" id="top">
        <div className="header-inner wrap">
          <Brand />
          <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`site-nav ${menuOpen ? "open" : ""}`} id="site-nav" aria-label="Main navigation">
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#privacy" onClick={closeMenu}>Privacy</a>
            <Link href="/docs" onClick={closeMenu}>Documentation</Link>
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" onClick={closeMenu}>GitHub <ArrowUpRight size={14} /></a>
            <a className="nav-download" href={release.asset} onClick={closeMenu}>Download <ArrowDown size={14} /></a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <FlowField reduceMotion={reduceMotion} />
          <div className="hero-grid wrap">
            <motion.div className="hero-copy" initial={reduceMotion ? false : "hidden"} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } }, hidden: {} }}>
              <motion.div className="eyebrow" variants={reveal}><span className="eyebrow-dot" />LOCAL-FIRST STORAGE INTELLIGENCE</motion.div>
              <motion.h1 id="hero-title" variants={reveal}>See where your<br /><em>storage goes.</em></motion.h1>
              <motion.p className="hero-lede" variants={reveal}>A clearer view of your disks. Find what takes up space, explore your files and make confident cleanup decisions — right on your PC.</motion.p>
              <motion.div className="hero-actions" variants={reveal}>
                <DownloadLink href={release.asset} variant="primary"><ArrowDownToLine size={17} />Download for Windows <ArrowUpRight className="button-arrow" size={16} /></DownloadLink>
                <DownloadLink href={SOURCE_URL} variant="secondary" target="_blank" rel="noreferrer"><span>View source on GitHub</span><ArrowUpRight size={15} /></DownloadLink>
              </motion.div>
              <motion.div className="hero-meta" variants={reveal}>
                <span className="version-chip"><span className="status-dot" />{release.version} <span className="latest-word">latest release</span></span>
                <span className="meta-divider" /><span>Windows 10 / 11 · x64</span><span className="meta-divider" /><span>{fileSize}</span>
              </motion.div>
              <motion.p className="release-note" aria-live="polite" variants={reveal}>{release.status === "latest" ? "Official GitHub release · Latest installer link refreshed" : "Official GitHub release · Verified v1.1.0 fallback link"} · Free to download</motion.p>
            </motion.div>

            <motion.div className="hero-visual" initial={reduceMotion ? false : { opacity: 0, x: 42 }} animate={{ opacity: 1, x: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              <div className="visual-caption"><span className="caption-line" />YOUR STORAGE, AT A GLANCE</div>
              <ProductWindow reduceMotion={reduceMotion} />
              <ScanFloat reduceMotion={reduceMotion} />
              <div className="visual-footnote"><span>01</span>A focused overview, without the noise.</div>
            </motion.div>
          </div>
          <div className="hero-bottom wrap"><span>SCROLL TO EXPLORE</span><motion.span className="scroll-cue" animate={reduceMotion ? {} : { y: [0, 7, 0] }} transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}><ArrowDown size={15} /></motion.span><span>BUILT FOR WINDOWS</span></div>
        </section>

        <section className="proof-strip" aria-label="Product principles">
          <div className="wrap proof-inner">
            <div><strong>LOCAL-FIRST</strong><span>Your index stays on your PC</span></div>
            <div><strong>KNOW YOUR SPACE</strong><span>Explore files and folders</span></div>
            <div><strong>REVIEW BEFORE ACTION</strong><span>Cleanup decisions stay yours</span></div>
            <div><strong>OPTIONAL AI</strong><span>Local rules work offline</span></div>
          </div>
        </section>

        <section className="section wrap" id="features">
          <motion.div className="section-heading" {...motionProps}>
            <div><div className="eyebrow">THE TOOLKIT</div><h2>Storage clarity,<br /><em>from every angle.</em></h2></div>
            <p>From a quick overview to a closer look at one folder, DiskLens gives you practical ways to understand what is using your disk space.</p>
          </motion.div>
          <motion.div className="feature-grid" variants={featureStagger} initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.14 }}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.article className={`feature-card feature-${feature.tone}`} key={feature.index} variants={reduceMotion ? {} : reveal} whileHover={reduceMotion ? undefined : { y: -9, rotateX: 1, transition: { duration: 0.24 } }}>
                  <div className="feature-top"><span className="feature-index">{feature.index}</span><span className="feature-symbol"><Icon size={20} strokeWidth={1.8} /></span></div>
                  <div className={`feature-graphic graphic-${feature.tone}`}>
                    {feature.tone === "blue" && <><div className="graphic-kpis"><i /><i /><i /></div><div className="graphic-bars"><span /><span /><span /></div><div className="graphic-table"><i /><i /><i /></div></>}
                    {feature.tone === "coral" && <SunburstGraphic />}
                    {feature.tone === "gold" && <div className="cleanup-list"><span><Check size={12} /> Temporary files <b>1.2 GB</b></span><span><Check size={12} /> Cache files <b>840 MB</b></span><span><Check size={12} /> Old downloads <b>620 MB</b></span></div>}
                    {feature.tone === "violet" && <div className="insight-lines"><Sparkles size={29} /><span /><span /><span /></div>}
                    {feature.tone === "green" && <div className="progress-demo"><div><span>Scanning selected locations</span><b>68%</b></div><i><span /></i><small>530,214 / 777,471 items indexed</small></div>}
                  </div>
                  <h3>{feature.title}</h3><p>{feature.body}</p>
                  <span className="feature-corner" aria-hidden="true"><ArrowUpRight size={15} /></span>
                </motion.article>
              );
            })}
          </motion.div>
          <div className="docs-callout">
            <div><span className="docs-callout-kicker">THE DISKLENS FIELD GUIDE</span><h3>Want the full picture?</h3><p>Read practical guides to scanning, exploring, cleanup safety, AI controls, local data and troubleshooting.</p></div>
            <Link href="/docs" className="button button-secondary">Browse documentation <ArrowUpRight size={15} /></Link>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="wrap how-grid">
            <motion.div className="how-intro" {...motionProps}>
              <div className="eyebrow">GET STARTED</div><h2>Three steps to<br /><em>know your disk.</em></h2><p>Install DiskLens, choose what to index, then explore the results. You decide what gets scanned.</p>
              <div className="how-links">
                <a className="text-link" href={`${RELEASES_URL}/tag/${release.version}`} target="_blank" rel="noreferrer">Read the release notes <ArrowUpRight size={15} /></a>
                <Link className="text-link" href="/docs">Explore the full documentation <ArrowUpRight size={15} /></Link>
              </div>
            </motion.div>
            <div className="steps">
              {[["01", "Install DiskLens", "Download the Windows installer and launch the app from your Start Menu.", <ArrowDownToLine key="step-install-icon" size={19} />], ["02", "Choose your locations", "Select the drives or folders you want DiskLens to index. Nothing starts until you confirm.", <Search key="step-locations-icon" size={19} />], ["03", "Explore and decide", "Browse the index, search for large items and review recommendations at your own pace.", <ArrowUpRight key="step-explore-icon" size={19} />]].map((step, index) => (
                <motion.div className="step" key={step[0]} {...motionProps} transition={{ ...reveal.visible.transition, delay: reduceMotion ? 0 : index * 0.12 }}>
                  <span className="step-no">{step[0]}</span><div><h3>{step[1]}</h3><p>{step[2]}</p></div><span className="step-mark">{step[3]}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="privacy-section wrap" id="privacy">
          <motion.div className="privacy-card" {...motionProps}>
            <div className="privacy-copy"><div className="eyebrow">YOUR DATA, YOUR DEVICE</div><h2>Private by<br /><em>default.</em></h2><p>DiskLens is designed to keep your storage index on your PC. A normal scan records file metadata — not the contents of your files.</p><a className="text-link" href={SOURCE_URL} target="_blank" rel="noreferrer">Inspect the source code <ArrowUpRight size={15} /></a></div>
            <div className="privacy-points">
              <div className="privacy-point"><span className="privacy-icon">01</span><div><strong>Local index</strong><p>Your file index is stored on your device.</p></div></div>
              <div className="privacy-point"><span className="privacy-icon">02</span><div><strong>No file-content upload during normal scans</strong><p>Indexing focuses on names, paths, timestamps, sizes and access status.</p></div></div>
              <div className="privacy-point"><span className="privacy-icon">03</span><div><strong>Hosted AI is optional</strong><p>External provider requests happen only when you configure a provider and start an AI analysis. Review the preview and provider terms first.</p></div></div>
            </div>
          </motion.div>
        </section>

        <section className="download-section" id="download">
          <div className="download-light-trail" aria-hidden="true" />
          <div className="wrap download-inner">
            <div className="download-topline"><span>DISKLENS FOR WINDOWS</span><span className="download-version">{release.version}</span></div>
            <div className="download-main"><div><h2>Make space<br /><em>make sense.</em></h2><p>Start with a clearer picture of your storage.</p></div><div className="download-cta"><DownloadLink href={release.asset} variant="light"><ArrowDownToLine size={17} />Download DiskLens <ArrowUpRight size={15} /></DownloadLink><span className="download-meta">Windows 10 / 11 · x64 · {fileSize}</span><a className="release-link" href={RELEASES_URL} target="_blank" rel="noreferrer">All releases and source archives <ArrowUpRight size={13} /></a></div></div>
            <div className="download-bottom"><span><i />Official GitHub release</span><span>No account required</span><span>Local-first by design</span></div>
          </div>
        </section>

        <section className="faq-section wrap" id="faq">
          <div className="faq-heading"><div className="eyebrow">GOOD TO KNOW</div><h2>Questions,<br /><em>answered.</em></h2><p>Still deciding? Explore the source and release notes before installing.</p></div>
          <div className="faq-list">
            {questions.map(([question, answer], index) => <motion.details key={question} {...motionProps} transition={{ ...reveal.visible.transition, delay: reduceMotion ? 0 : index * 0.06 }}><summary>{question}<ChevronDown size={17} /></summary><p>{answer}</p></motion.details>)}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-main"><div className="footer-brand-block"><Brand footer /><p>A clearer view of your storage.</p></div><div className="footer-links"><a href="#features">Features</a><a href="#privacy">Privacy</a><Link href="/docs">Documentation</Link><a href={SOURCE_URL} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a><a href={RELEASES_URL} target="_blank" rel="noreferrer">Releases <ArrowUpRight size={13} /></a></div></div>
        <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} DiskLens</span><span>Built for clarity. Runs locally.</span></div>
      </footer>

      <AnimatePresence>
        {menuOpen && <motion.button className="mobile-scrim" aria-label="Close navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />}
      </AnimatePresence>
    </>
  );
}
