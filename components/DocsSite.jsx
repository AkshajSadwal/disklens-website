"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, BookOpen, ChevronRight, Clipboard, Download,
  ExternalLink, FileSearch, Menu, Search, ShieldCheck, X,
} from "lucide-react";
import styles from "./DocsSite.module.css";

const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO || "AkshajSadwal/disklens";
const SOURCE_URL = `https://github.com/${REPO}`;
const RELEASES_URL = `${SOURCE_URL}/releases`;
const INSTALLER_URL = `https://github.com/${REPO}/releases/download/v1.1.0/DiskLens-Setup-1.1.0.exe`;

function CodeBlock({ label = "PowerShell", code }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeTop}><span>{label}</span><button type="button" onClick={copy}><Clipboard size={14} />{copied ? "Copied" : "Copy"}</button></div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function Callout({ kind = "info", title, children }) {
  return <aside className={`${styles.callout} ${styles[`callout${kind[0].toUpperCase()}${kind.slice(1)}`]}`}><strong>{title}</strong><div>{children}</div></aside>;
}

function Tag({ children }) { return <span className={styles.tag}>{children}</span>; }

const sections = [
  {
    id: "overview", group: "Start here", title: "What DiskLens does",
    summary: "A local-first index of your drives, plus tools to understand and review what is using space.",
    keywords: "overview home storage intelligence files folders index local first product scope",
    content: <>
      <p className={styles.lead}>DiskLens builds a searchable, local index of file and folder metadata so you can understand how storage is being used without uploading whole files to a cloud service.</p>
      <div className={styles.featureGrid}>
        <article><span>01 / SEE</span><h3>Home</h3><p>Compare indexed drives, review total / used / free space, scan locations and find the largest indexed items.</p></article>
        <article><span>02 / EXPLORE</span><h3>Storage</h3><p>Browse folders, use the multi-level sunburst to see where space sits, search, filter and export results.</p></article>
        <article><span>03 / REVIEW</span><h3>Programs &amp; Cleanup</h3><p>Inspect installed programs, possible leftover files, temporary items and possible duplicates before taking action.</p></article>
        <article><span>04 / UNDERSTAND</span><h3>AI Storage Advisor</h3><p>Get deterministic local suggestions offline, or opt into a hosted provider after reviewing the request preview.</p></article>
      </div>
      <h3>What it is — and what it is not</h3>
      <p>DiskLens is a storage index and review tool. It is not a backup system, cloud-sync service, antivirus product or automatic cleanup daemon. It does not decide that a file is safe to remove just because it is large, old or located in a cache-like folder.</p>
      <Callout kind="success" title="A user-controlled workflow">You choose the scan locations. You inspect the results. Cleanup actions require a separate review and confirmation.</Callout>
    </>,
  },
  {
    id: "install", group: "Start here", title: "Install & first launch",
    summary: "Install the Windows release, understand source archives and know where the app keeps its files.",
    keywords: "download setup exe install Windows 10 11 x64 Start Menu per user Node.js source zip",
    content: <>
      <p className={styles.lead}>For normal Windows use, download the installer asset from GitHub Releases. The automatically generated “Source code” ZIP is for developers; it is not the ready-to-install Windows application.</p>
      <a className={styles.actionLink} href={INSTALLER_URL} target="_blank" rel="noreferrer"><Download size={16} /> Download DiskLens Setup 1.1.0 <ArrowUpRight size={14} /></a>
      <div className={styles.infoGrid}>
        <div><span>SUPPORTED WINDOWS RELEASE</span><strong>Windows 10 / 11</strong><p>Published installer target: x64.</p></div>
        <div><span>INSTALL SCOPE</span><strong>Current user</strong><p>Installer files live under the current user’s Local AppData program folder; administrator privileges are not normally required.</p></div>
      </div>
      <h3>Install steps</h3>
      <ol className={styles.stepsList}>
        <li><strong>Open the official Releases page.</strong> Choose <code>DiskLens-Setup-*.exe</code> under the release assets.</li>
        <li><strong>Run the installer.</strong> Follow the setup prompts. The installer creates Start Menu shortcuts and can create a Desktop shortcut.</li>
        <li><strong>Launch DiskLens.</strong> Use the DiskLens shortcut. The launcher starts the local API and UI, waits for the API health check, then opens the browser.</li>
        <li><strong>Choose scan locations.</strong> The first-run flow asks you to select locations and confirm them; it does not silently begin a full-disk scan.</li>
      </ol>
      <Callout kind="warning" title="SmartScreen / unsigned builds">If Windows shows a publisher or SmartScreen warning, check that the file came from the official DiskLens GitHub release page. The v1.1.0 installer is not presented as a code-signed commercial installer.</Callout>
      <h3>Developer source launch</h3>
      <p>For a source checkout, use Node.js 22 or newer and run the launcher from the project root. The launcher starts the frontend, API and collector as managed processes.</p>
      <CodeBlock code={'node scripts/launch.mjs'} />
      <p>The launcher selects available loopback ports, opens the local web app and uses a per-user lock to avoid launching a second instance.</p>
    </>,
  },
  {
    id: "scanning", group: "Start here", title: "Scanning & indexing",
    summary: "Choose folders explicitly, understand scan phases, progress, exclusions and safe cancellation.",
    keywords: "scan index folders drives first run YES estimate progress uploaded skipped ETA cancel staged scanning inaccessible permissions symlink exclude private",
    content: <>
      <p className={styles.lead}>A scan walks the locations you selected and records filesystem metadata into the local index. Normal indexing does not open files to upload or copy their contents.</p>
      <h3>Choose locations deliberately</h3>
      <ul>
        <li>On first launch, enter one or more absolute drive or folder paths; separate multiple paths with semicolons.</li>
        <li>Review the selected locations and type <code>YES</code> to confirm. Press Enter to skip; you can add folders later from Quick Actions.</li>
        <li>Use Add folder / the native folder picker to add a new location before scanning it.</li>
      </ul>
      <h3>What the progress means</h3>
      <p>The collector first estimates the number of accessible entries (unless it can use a previous completed scan count as an estimate). It then traverses the selected tree and reports real item progress, uploaded batches, skipped or partial items, elapsed time and ETA.</p>
      <div className={styles.infoGrid}>
        <div><span>ESTIMATE</span><strong>Planning count</strong><p>An estimate used to give progress context; it can differ from the final count if the tree changes or permissions change.</p></div>
        <div><span>INDEX</span><strong>Metadata rows</strong><p>Names, paths, types, sizes, timestamps and access status for entries DiskLens could inspect.</p></div>
      </div>
      <h3>Cancellation and staged scans</h3>
      <p>A new scan is staged separately from the last completed index. If you cancel or the collector fails, unfinished staging rows are discarded and the previous completed index stays available. When a scan completes successfully, DiskLens commits the replacement. If a child directory becomes inaccessible, its previous descendants are retained rather than being mistaken for deleted content; a successfully completed empty directory scan can clear old contents.</p>
      <h3>What is intentionally skipped</h3>
      <ul>
        <li>Directory symbolic links are not traversed.</li>
        <li>Common credential stores and sensitive locations are excluded, including examples such as <code>.ssh</code>, <code>.gnupg</code>, cloud credential folders, browser login databases and private-key formats.</li>
        <li>Permission failures and unavailable metadata are counted as skipped or partial rather than treated as proof that a path is empty.</li>
      </ul>
      <Callout kind="info" title="A scan is not a content backup">The index records metadata. It does not copy file contents or create a recoverable backup of the files.</Callout>
    </>,
  },
  {
    id: "home", group: "Using DiskLens", title: "Home dashboard",
    summary: "Read drive summaries, largest items, quick actions and recent scan outcomes.",
    keywords: "home dashboard total storage used free drives largest items files folders programs scan history quick actions",
    content: <>
      <p className={styles.lead}>Home is the starting point for a quick storage review. It combines system-reported drive usage with the size of the metadata index DiskLens has successfully built.</p>
      <h3>Storage metrics</h3>
      <ul>
        <li><strong>Total / Used / Free</strong> summarize the drives reported by the operating system for the indexed locations.</li>
        <li><strong>Drives</strong> show each selected root, filesystem, used/free values and an indexed item count.</li>
        <li><strong>Largest Items</strong> surfaces the largest indexed files, folders or installed programs. Use the tabs to switch between Files, Folders and Programs.</li>
        <li><strong>Quick Actions</strong> link to scanning, Storage Explorer, Programs &amp; Cleanup and the AI Storage Advisor.</li>
        <li><strong>Recent scans</strong> show the latest saved outcomes for indexed locations.</li>
      </ul>
      <Callout kind="warning" title="Why indexed bytes can differ from drive usage">Disk usage is reported by the operating system. Indexed bytes are the sum of metadata DiskLens could read. Exclusions, permissions, unavailable metadata and filesystem overhead mean the two totals are not expected to match exactly.</Callout>
      <h3>Largest Items tabs</h3>
      <p>Files are ranked by indexed file size. Folder sizes are aggregated from indexed descendants. Program rows may use indexed bytes beneath a detected install location; where that is not available, the UI identifies an operating-system or package-manager estimate rather than presenting it as a measured total.</p>
    </>,
  },
  {
    id: "storage", group: "Using DiskLens", title: "Storage Explorer & sunburst",
    summary: "Navigate folders and use the multi-level sunburst, filters, saved filters and CSV export.",
    keywords: "storage explorer sunburst chart radial hierarchy drilldown folder breadcrumb back forward search filters qField name path extension kind min max size modified after before sort order saved filters csv export pagination",
    content: <>
      <p className={styles.lead}>Storage Explorer pairs a folder browser with the existing multi-level sunburst. The sunburst represents the relative indexed sizes of folders and their descendants; it is a visual map of the index, not a separate filesystem scan.</p>
      <h3>Navigate the tree</h3>
      <ul>
        <li>Choose a drive/root, open a folder segment or row, and use the breadcrumb and back/forward controls to move through the hierarchy.</li>
        <li>Select an item to inspect details; use the open actions to reveal a file or its containing folder in the operating-system file manager.</li>
        <li>Switch between indexed roots with the drive selector.</li>
      </ul>
      <h3>Search and filter</h3>
      <p>Filters are applied to the current location. The available controls include:</p>
      <div className={styles.tableWrap}><table><thead><tr><th>Filter</th><th>What it does</th></tr></thead><tbody>
        <tr><td>Search in</td><td>Search by name, path, or both.</td></tr>
        <tr><td>Name starts with</td><td>Prefix search for files and folders.</td></tr>
        <tr><td>Extension</td><td>Match an extension such as <code>.pdf</code>.</td></tr>
        <tr><td>Kind</td><td>All items, files only or folders only.</td></tr>
        <tr><td>Minimum / maximum size</td><td>Restrict results to a byte-size range; the UI accepts MiB values.</td></tr>
        <tr><td>Modified after / before</td><td>Filter by modification date.</td></tr>
        <tr><td>Sort / order</td><td>Sort by name, size, type or modification time where available, ascending or descending.</td></tr>
      </tbody></table></div>
      <h3>Saved filters and CSV</h3>
      <p>Saved filters are stored in this browser’s local storage, not synchronized to a DiskLens cloud account. Up to 20 named filters are retained in the browser. CSV export includes name, type, size, modified time, path, root and access status, with a maximum of 10,000 matching rows per export.</p>
      <Callout kind="info" title="Folder totals are index totals">A folder size shown by DiskLens is based on the indexed descendants it knows about. An inaccessible or excluded subtree can make that total smaller than what another tool reports.</Callout>
    </>,
  },
  {
    id: "programs", group: "Using DiskLens", title: "Programs & Cleanup",
    summary: "Understand installed-program discovery, estimated sizes and evidence-based file candidates.",
    keywords: "programs cleanup installed applications registry uninstall InstallLocation estimated size OS package manager deterministic ownership evidence candidates analyze leftovers",
    content: <>
      <p className={styles.lead}>Programs &amp; Cleanup helps connect installed application records with indexed files. It does not assume that every file with a matching word belongs to a program.</p>
      <h3>Where program records come from</h3>
      <ul>
        <li>Windows: installed-program metadata from the uninstall registry entries, including publisher, version, install location and uninstall information where available.</li>
        <li>macOS: application bundle discovery.</li>
        <li>Linux: package-manager records, including dpkg or rpm sources when available.</li>
      </ul>
      <h3>Measured size vs estimate</h3>
      <p>When a registered install location is available and indexed, DiskLens can aggregate indexed bytes beneath it. If not, the program row may use a Windows registry or package-manager size estimate. A missing estimate is shown as unavailable; it does not mean the program occupies zero bytes.</p>
      <h3>Analyze a program</h3>
      <p>Select one installed program (or search by name). DiskLens ranks indexed candidates using ownership evidence such as being under the registered install location, matching a registered uninstall executable, and name/path token signals. Stronger signals improve confidence, but a candidate still needs human review.</p>
      <Callout kind="warning" title="An ownership match is not a guarantee">Applications can share runtimes, libraries, caches and data folders. Confirm that each candidate belongs to the selected program and is no longer needed before removing anything.</Callout>
    </>,
  },
  {
    id: "cleanup", group: "Using DiskLens", title: "File cleanup & duplicate checks",
    summary: "Review temporary/cache/old-file candidates, compare hashes and understand the delete confirmation flow.",
    keywords: "file cleanup duplicate groups same size compare hashes SHA-256 20 files 128 MiB Recycle Bin Trash permanent delete open handle review confirmation safe paths",
    content: <>
      <p className={styles.lead}>Cleanup is a review workflow. Candidate generation highlights files that may deserve attention; it cannot know whether a file is personally valuable or whether an application can recreate it.</p>
      <h3>Cleanup recommendations</h3>
      <p>Rules can flag temporary folders or extensions, cache locations and large older files. The interface shows why an item was suggested. Age, size or a cache-like path is a prompt to review—not proof that an item is unused.</p>
      <h3>Possible duplicates are a prefilter</h3>
      <ol>
        <li>DiskLens first groups indexed files that have equal sizes. Equal size alone does not prove two files contain the same data.</li>
        <li>Choose <strong>Compare hashes</strong> to read the selected file bytes locally and compute SHA-256 hashes.</li>
        <li>Exact matching hashes identify exact content matches among the compared files.</li>
      </ol>
      <div className={styles.infoGrid}>
        <div><span>HASH COMPARISON LIMIT</span><strong>20 files</strong><p>Between 2 and 20 indexed files can be selected for one comparison.</p></div>
        <div><span>TOTAL READ BUDGET</span><strong>128 MiB</strong><p>The selected equal-size files must fit the combined comparison budget.</p></div>
      </div>
      <p>Hash comparison changes no files. DiskLens does not remove duplicate files automatically.</p>
      <h3>Review and delete</h3>
      <p>Before an action, the confirmation dialog lets you adjust the selection and checks selected items for active use/open handles. The default action is to move items to the system Trash or Windows Recycle Bin where supported. Permanent deletion is a separate mode and requires an additional explicit confirmation; it cannot be undone through the Recycle Bin.</p>
      <Callout kind="danger" title="Permanent deletion is irreversible">Read the selected paths, review the open-handle warning, confirm the item list and choose the delete mode deliberately. DiskLens blocks volume roots, symbolic links and protected operating-system or application paths.</Callout>
    </>,
  },
  {
    id: "ai", group: "Using DiskLens", title: "AI Storage Advisor",
    summary: "Learn the local rules mode, supported hosted providers, previews, cost controls and credential storage.",
    keywords: "AI Advisor OpenAI Anthropic Claude Azure OpenAI v1 compatible API local rules offline fallback API key model preview prompt token budget billing credential DPAPI Keychain Secret Service encrypted passphrase scrypt AES 256 GCM",
    content: <>
      <p className={styles.lead}>The AI Storage Advisor works without a hosted provider. Its default local-rules mode uses deterministic heuristics on the indexed metadata and is available offline.</p>
      <h3>Modes and supported providers</h3>
      <ul>
        <li><strong>Local rules:</strong> no API key, no hosted request; useful for an offline first review.</li>
        <li><strong>OpenAI</strong> and <strong>Anthropic Claude</strong>.</li>
        <li><strong>Azure OpenAI v1</strong>, using the deployment name in the model field.</li>
        <li><strong>OpenAI-compatible chat-completions endpoints</strong>, including a local endpoint when configured.</li>
      </ul>
      <h3>Preview before sending</h3>
      <p>For hosted analysis, DiskLens prepares a preview containing the provider and model, a request-body preview, an estimated input-token count and the maximum response-token cap. The preview is short-lived (five minutes) and bound to the current settings. If settings change or the preview expires, review a fresh preview before sending.</p>
      <ul>
        <li>Storage-top advice sends a small selected metadata summary such as program names, file type, size and a coarse location category; it does not send file contents or full paths.</li>
        <li>Hosted file analysis removes the full path, file name, file content and file hash from the hosted evidence payload.</li>
        <li>Hosted requests happen only after the user configures a provider and starts the analysis. Provider billing may apply.</li>
      </ul>
      <h3>Credential handling</h3>
      <p>Settings uses the operating-system credential service where available: Windows DPAPI, macOS Keychain or Linux Secret Service. If that service is unavailable, DiskLens can store a key encrypted in its private data directory using a local passphrase (at least 12 characters). That passphrase is not persisted; the encrypted fallback must be unlocked again after a server restart or after 15 minutes.</p>
      <p><strong>Test connection</strong> checks provider authentication with a models-list request. It does not send indexed data and does not generate a response.</p>
      <Callout kind="warning" title="AI output is advisory">Local or hosted AI is not antivirus software and cannot establish that a file is malicious, safe or disposable. Verify ownership and backups independently; never delete a file based only on an AI recommendation.</Callout>
    </>,
  },
  {
    id: "privacy", group: "Data & safety", title: "Privacy, security & local data",
    summary: "Where the index and settings live, what scans read, what gets excluded and when anything leaves the device.",
    keywords: "privacy security local data sqlite local app data loopback localhost 127.0.0.1 credentials .ssh .gnupg .aws .azure .kube private keys no file contents network metadata data location backup",
    content: <>
      <p className={styles.lead}>DiskLens is designed to keep its file index on the computer where it runs. The desktop application stores the SQLite database and launcher state in the current user’s application data directory.</p>
      <div className={styles.tableWrap}><table><thead><tr><th>Operating system</th><th>Application data directory</th></tr></thead><tbody>
        <tr><td>Windows</td><td><code>%LOCALAPPDATA%\DiskLens</code></td></tr>
        <tr><td>macOS</td><td><code>~/Library/Application Support/DiskLens</code></td></tr>
        <tr><td>Linux</td><td><code>$XDG_DATA_HOME/DiskLens</code>, or <code>~/.local/share/DiskLens</code></td></tr>
      </tbody></table></div>
      <h3>What a normal scan reads</h3>
      <p>Normal indexing reads directory entries and filesystem metadata (for example names, paths, sizes, timestamps and access status). It does not read the complete contents of every file. The collector avoids following directory symlinks and excludes common credential stores, browser credential databases, environment files and private-key formats.</p>
      <h3>Local network boundary</h3>
      <p>The launcher binds the local API and web UI to loopback addresses such as <code>127.0.0.1</code> and selects available local ports. They are not exposed to the LAN by default. Browser requests are checked against the exact web origin used by the launched UI; use the URL printed/opened by the launcher rather than changing between <code>localhost</code> and <code>127.0.0.1</code>.</p>
      <h3>What can leave the device?</h3>
      <p>Regular scans do not upload whole files. A hosted AI provider receives only the metadata summary prepared for that particular analysis after you configure the provider and press the analysis action. The preview and provider terms should be reviewed before sending. The manual update checker contacts GitHub only when you press <strong>Check for updates</strong>.</p>
      <Callout kind="info" title="Back up the index deliberately">The local SQLite database is application data, not a backup of the original files. Close DiskLens before copying the database for a manual backup or migration.</Callout>
    </>,
  },
  {
    id: "updates", group: "Data & safety", title: "Updates, uninstall & app data",
    summary: "Update the app safely, understand what uninstall keeps and find the per-user database directory.",
    keywords: "update upgrade check updates GitHub release install new version uninstall preserve data database index localappdata appdata backup migration legacy server diskLens.db WAL SHM",
    content: <>
      <p className={styles.lead}>DiskLens separates installed program files from your user data. Updating the application should not be confused with deleting the local index, preferences or stored AI credentials.</p>
      <h3>Check and install an update</h3>
      <ol className={styles.stepsList}>
        <li><strong>Check from Settings.</strong> Use <em>Check for updates</em> to contact the GitHub Releases API. The check is manual and does not download or install an update for you.</li>
        <li><strong>Read the release notes.</strong> Open the official release page and download the named DiskLens Setup asset for Windows, not GitHub’s automatic Source code ZIP.</li>
        <li><strong>Close DiskLens.</strong> Stop the running app before installing an update so the local database and running processes are not in use.</li>
        <li><strong>Run the newer installer.</strong> It installs the application files for the current Windows user. Launch DiskLens from the Start Menu or Desktop shortcut afterwards.</li>
      </ol>
      <h3>Where the app stores user data</h3>
      <p>On Windows, the SQLite index and launcher state are kept separately from the installed program files:</p>
      <CodeBlock label="Windows user data" code={"%LOCALAPPDATA%\\DiskLens\\"} />
      <p>The database file is <code>disklens.db</code>. The installed application files are under <code>%LOCALAPPDATA%\Programs\DiskLens</code>. The installer configuration intentionally does not remove the user data directory during uninstall.</p>
      <h3>Back up the local index</h3>
      <p>For a simple file-level backup, close DiskLens completely first, then copy the whole <code>%LOCALAPPDATA%\DiskLens</code> directory to a safe location. This can include SQLite sidecar files such as <code>disklens.db-wal</code> and <code>disklens.db-shm</code> if they exist. Do not copy a live database by grabbing only <code>disklens.db</code> while the application is running.</p>
      <p>Provider credentials saved through Windows DPAPI, macOS Keychain or Linux Secret Service are protected by the operating-system user context. A database copy is not a credential transfer; when moving to a different computer or user account, expect to configure the hosted AI provider again.</p>
      <Callout kind="warning" title="The index is not your files">Backing up DiskLens data preserves the index and app state. It does not back up the original documents, photos, videos or other files that DiskLens indexed.</Callout>
      <h3>Moving an older development index</h3>
      <p>When a source checkout still contains <code>server/disklens.db</code>, the launcher can copy that legacy database into the per-user data directory when the destination database does not already exist. It does not overwrite an existing user database. If a destination already exists, compare and back up both databases before attempting any manual migration.</p>
      <h3>Uninstalling DiskLens</h3>
      <p>The Windows installer removes the installed application but intentionally leaves the per-user data, index, preferences and AI credentials directory in place. If you also intend to remove that data, first verify that you no longer need the index or settings, then remove the DiskLens folder from your user AppData directory yourself.</p>
    </>,
  },
  {
    id: "support-bundle", group: "Data & safety", title: "Reporting a problem safely",
    summary: "Collect useful diagnostic details without publishing your database, private paths or API credentials.",
    keywords: "support bug report issue log diagnostics report version operating system reproducible steps screenshot database private path api key secrets credentials redaction",
    content: <>
      <p className={styles.lead}>A useful bug report makes a problem reproducible. It should explain what you expected, what actually happened and which version of DiskLens you were using.</p>
      <h3>Include these details</h3>
      <ul>
        <li>DiskLens release version and whether it was installed from the Windows installer or started from source.</li>
        <li>Windows/macOS/Linux version and architecture.</li>
        <li>The screen or workflow involved: scan, Storage Explorer, Programs &amp; Cleanup, duplicate comparison, AI Advisor or Settings.</li>
        <li>Exact steps to reproduce, the error message and whether it happens every time.</li>
        <li>A screenshot with personal file names and paths blurred or cropped where possible.</li>
      </ul>
      <h3>Do not publish these files or values</h3>
      <ul>
        <li><code>disklens.db</code> or SQLite sidecar files — they can contain private file and folder names, paths, sizes and timestamps.</li>
        <li><code>server/.env</code>, provider API keys, credential-store data, encryption passphrases or private keys.</li>
        <li>Unredacted personal folder paths, browser profiles, documents or screenshots containing private information.</li>
      </ul>
      <Callout kind="success" title="A safe first report">Start with the release version, operating system, steps to reproduce and the visible error text. Add redacted screenshots only when they materially clarify the problem.</Callout>
      <a className={styles.actionLink} href={`${SOURCE_URL}/issues`} target="_blank" rel="noreferrer"><FileSearch size={16} /> Open GitHub issues <ArrowUpRight size={14} /></a>
    </>,
  },
  {
    id: "troubleshooting", group: "Data & safety", title: "Troubleshooting",
    summary: "Resolve launch, local connection, scan, storage-size, program and AI issues.",
    keywords: "troubleshooting 403 untrusted local request origin localhost 127.0.0.1 permission denied access denied API offline local rules program size database server launcher port 3000 4000",
    content: <>
      <h3>The browser says the local request origin is untrusted</h3>
      <p>Use the exact loopback URL opened by the launcher. For example, do not switch from <code>http://127.0.0.1:3000</code> to <code>http://localhost:3000</code> during a session. The API validates the expected web origin, including its port.</p>
      <h3>A folder or drive cannot be scanned</h3>
      <ul><li>Confirm the location still exists and is a directory.</li><li>Check that the current Windows user can read it.</li><li>Use Add folder before scanning a new root.</li><li>Review skipped/partial counts; inaccessible subfolders are not necessarily empty.</li></ul>
      <h3>Drive usage and indexed total do not match</h3>
      <p>The operating system’s used/free figures include data and filesystem overhead that may not be represented by readable indexed entries. DiskLens also excludes sensitive paths and records inaccessible metadata as skipped or partial.</p>
      <h3>A program shows an unavailable or estimated size</h3>
      <p>Installed program registration data does not always include a usable install location or size. DiskLens prefers indexed bytes when it can identify an install root; otherwise it labels the number as an OS/package estimate or unavailable.</p>
      <h3>AI says Local rules / Offline</h3>
      <p>This is the expected default when no hosted provider is configured. Local analysis is available without a key. To use a hosted provider, open Settings, configure a provider and key, save, then test the connection and review an analysis preview.</p>
      <h3>DiskLens does not open or another instance is running</h3>
      <p>Use the Start Menu shortcut and wait for the current launcher to finish starting. DiskLens uses a per-user launcher lock and may reopen an existing browser session if it is already running. Close the running instance before installing an update.</p>
      <h3>Where to report a reproducible issue</h3>
      <p>Share the release version, operating system, exact steps and relevant error message. Do not attach your database, private folder paths, API keys or personal files to a public issue.</p>
      <a className={styles.actionLink} href={`${SOURCE_URL}/issues`} target="_blank" rel="noreferrer"><FileSearch size={16} /> Open GitHub issues <ArrowUpRight size={14} /></a>
    </>,
  },
  {
    id: "architecture", group: "Technical reference", title: "Architecture & developer reference",
    summary: "How the Next.js UI, Fastify API, SQLite database, collector and launcher fit together.",
    keywords: "architecture developer frontend Next.js React backend Fastify SQLite collector child process HTTP batch staged_items launcher loopback port health endpoint API routes source Node.js 22 24",
    content: <>
      <p className={styles.lead}>The desktop application is a local multi-process app. The browser UI talks to a local Fastify API; the API coordinates scans and persists metadata in SQLite; the collector is a separate Node process.</p>
      <div className={styles.architecture}>
        <div><span>01</span><strong>Next.js frontend</strong><small>React UI, pages, Explorer, Sunburst, cleanup review and Settings.</small></div>
        <div><span>02</span><strong>Fastify API</strong><small>Local routes for drives, roots, scans, items, folders, cleanup, programs and AI.</small></div>
        <div><span>03</span><strong>SQLite</strong><small>Items, drives, scan history and staged scan rows, with path and size indexes.</small></div>
        <div><span>04</span><strong>Filesystem collector</strong><small>Walks the selected tree, collects metadata and uploads bounded batches to the local API.</small></div>
      </div>
      <h3>Source layout</h3>
      <div className={styles.tableWrap}><table><thead><tr><th>Folder</th><th>Responsibility</th></tr></thead><tbody>
        <tr><td><code>frontend/</code></td><td>Next.js application and React components.</td></tr>
        <tr><td><code>server/src/routes/</code></td><td>Fastify API endpoints.</td></tr>
        <tr><td><code>server/src/services/</code></td><td>Scan jobs, program discovery/analysis, AI services and safe-delete logic.</td></tr>
        <tr><td><code>server/src/db/</code></td><td>SQLite schema, indexes and migrations.</td></tr>
        <tr><td><code>collector/src/</code></td><td>Filesystem traversal, metadata collection, batching and upload.</td></tr>
        <tr><td><code>scripts/</code> and <code>installers/</code></td><td>Launcher, first-run setup and per-user install/packaging scripts.</td></tr>
      </tbody></table></div>
      <h3>Local API route groups</h3>
      <ul>
        <li><code>/api/health</code>, <code>/api/drives</code>, <code>/api/roots</code> — health and available indexed roots.</li>
        <li><code>/api/scans/*</code> — pick, start, progress, cancel and history.</li>
        <li><code>/api/items</code>, <code>/api/folders</code>, <code>/api/explorer/search</code> — indexed content and browsing.</li>
        <li><code>/api/programs/*</code>, <code>/api/cleanup/*</code>, <code>/api/delete/*</code> — program candidates, cleanup, duplicate comparison and confirmed actions.</li>
        <li><code>/api/ai/*</code> — provider status/settings, previews and explicit local/hosted analysis actions.</li>
      </ul>
      <h3>Run from source</h3>
      <p>The repository README currently specifies Node.js 22+ for source development. The launcher can prepare an official Node.js 24 LTS runtime in the user data folder where a supported system runtime is not present.</p>
      <CodeBlock label="From the repository root" code={'node scripts/launch.mjs'} />
      <p>The launcher installs dependencies from the lockfiles when needed, finds free loopback ports, checks the API health endpoint, starts the web UI, opens the browser and shuts managed child processes down together.</p>
      <a className={styles.actionLink} href={SOURCE_URL} target="_blank" rel="noreferrer"><BookOpen size={16} /> Browse the source repository <ArrowUpRight size={14} /></a>
    </>,
  },
  {
    id: "limits", group: "Technical reference", title: "Design boundaries & limitations",
    summary: "Know what the index, recommendations, duplicate checker and AI can and cannot prove.",
    keywords: "limitations boundaries not live monitoring USN journal backup antivirus deletion heuristics full scan enumeration metadata estimate permissions hosted AI provider usage updates manual",
    content: <>
      <p className={styles.lead}>These boundaries are important when interpreting the numbers and recommendations. DiskLens aims to make storage easier to inspect, not to replace filesystem, backup, security or package-management tools.</p>
      <ul>
        <li><strong>Not a live watcher:</strong> a scan enumerates the selected directory tree. DiskLens is not presented as a continuous real-time change monitor or a USN-journal-based incremental index.</li>
        <li><strong>Not a backup:</strong> the SQLite index contains metadata, not recoverable copies of the original file contents.</li>
        <li><strong>Not a virus scanner:</strong> AI and local rules provide conservative review guidance, not malware verdicts.</li>
        <li><strong>Not a guarantee that cleanup candidates are unused:</strong> old, temporary-looking or cache-like files can still matter to an application or person.</li>
        <li><strong>Equal size is not duplicate proof:</strong> exact content comparison requires the explicit SHA-256 operation.</li>
        <li><strong>Size values have different bases:</strong> system drive usage, indexed bytes and package-manager estimates are distinct measurements.</li>
        <li><strong>Hosted AI may cost money:</strong> local rules are free of provider usage; external API billing is controlled by the provider account.</li>
        <li><strong>Updates are manual:</strong> Settings can check GitHub when requested, but DiskLens does not silently download or install updates automatically.</li>
      </ul>
      <Callout kind="success" title="The safest operating principle">Use DiskLens to find and understand candidates. Verify the path, owner, backup and application impact before making a cleanup decision.</Callout>
    </>,
  },
];

export default function DocsSite() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return sections;
    return sections.filter((section) => `${section.title} ${section.summary} ${section.keywords} ${section.group}`.toLowerCase().includes(value));
  }, [query]);
  const groups = useMemo(() => {
    const map = new Map();
    for (const section of filtered) {
      if (!map.has(section.group)) map.set(section.group, []);
      map.get(section.group).push(section);
    }
    return [...map.entries()];
  }, [filtered]);
  const activeId = filtered.some((section) => section.id === active) ? active : (filtered[0]?.id || "");

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setMobileNavOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-18% 0px -68% 0px", threshold: 0 });
    document.querySelectorAll("[data-doc-section]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [filtered]);

  function goTo(id) {
    setActive(id);
    setMobileNavOpen(false);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.brand} aria-label="DiskLens home"><span className={styles.brandMark}>D</span><span><strong>DiskLens</strong><small>Storage Intelligence</small></span></Link>
          <div className={styles.topbarLinks}><Link href="/">Product</Link><a href={SOURCE_URL} target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a><a className={styles.topDownload} href={RELEASES_URL} target="_blank" rel="noreferrer"><Download size={14} /> Get DiskLens</a></div>
          <button type="button" className={styles.mobileNavToggle} onClick={() => setMobileNavOpen((v) => !v)} aria-expanded={mobileNavOpen} aria-label="Toggle documentation navigation">{mobileNavOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>

      <section className={styles.masthead}>
        <div className={styles.mastGlow} aria-hidden="true" />
        <div className={styles.mastInner}>
          <div className={styles.breadcrumb}><Link href="/">DiskLens</Link><ChevronRight size={13} />Documentation</div>
          <div className={styles.mastGrid}>
            <div><div className={styles.eyebrow}><span />THE DISKLENS FIELD GUIDE</div><h1>Understand the disk.<br /><em>Own the decisions.</em></h1><p>Product guides, practical workflows and technical reference for DiskLens — from the first scan to a careful cleanup review.</p></div>
            <div className={styles.mastAside}><span>DOCUMENTATION SET</span><strong>14 guides</strong><small>Grounded in the current public application source and v1.1.0 release.</small><div className={styles.mastBadges}><Tag>Windows 10 / 11</Tag><Tag>Local-first</Tag><Tag>v1.1.0</Tag></div></div>
          </div>
        </div>
      </section>

      <div className={styles.layout}>
        {mobileNavOpen && <button type="button" className={styles.mobileNavScrim} aria-label="Close documentation navigation" onClick={() => setMobileNavOpen(false)} />}
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.sidebarOpen : ""}`} aria-label="Documentation contents">
          <div className={styles.sidebarHead}><div><span>GUIDE INDEX</span><strong>Browse topics</strong></div><button type="button" onClick={() => setMobileNavOpen(false)} aria-label="Close documentation navigation"><X size={16} /></button></div>
          <label className={styles.searchBox}><Search size={16} /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guides…" aria-label="Search documentation topics" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}</label>
          <nav className={styles.sideNav}>
            {groups.map(([group, entries]) => <div className={styles.navGroup} key={group}><span className={styles.navGroupLabel}>{group}</span>{entries.map((section) => <button type="button" key={section.id} onClick={() => goTo(section.id)} className={`${styles.navItem} ${activeId === section.id ? styles.navActive : ""}`} aria-current={activeId === section.id ? "location" : undefined}><span>{section.title}</span><ChevronRight size={13} /></button>)}</div>)}
            {!filtered.length && <p className={styles.noResults}>No guide topics match “{query}”. Try “scan”, “AI” or “cleanup”.</p>}
          </nav>
          <div className={styles.sidebarFoot}><ShieldCheck size={16} /><span>Review before action.<br />Your index stays on your device.</span></div>
        </aside>

        <article className={styles.article}>
          <div className={styles.articleToolbar}><span><BookOpen size={15} /> PRODUCT DOCUMENTATION</span><span>{filtered.length} of {sections.length} topics</span></div>
          {filtered.map((section, index) => <section className={styles.docSection} id={section.id} data-doc-section key={section.id}>
            <div className={styles.sectionMeta}><span>{section.group.toUpperCase()}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <h2>{section.title}</h2>
            <p className={styles.sectionSummary}>{section.summary}</p>
            <div className={styles.sectionContent}>{section.content}</div>
            <div className={styles.sectionEnd}><span>DISKLENS FIELD GUIDE</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>Back to top <ArrowUpRight size={13} /></button></div>
          </section>)}
          {!filtered.length && <div className={styles.emptySearch}><Search size={23} /><h2>No matching guide found</h2><p>Try a product area such as scanning, Storage Explorer, cleanup, duplicates, AI, privacy or troubleshooting.</p><button type="button" onClick={() => setQuery("")}>Clear search</button></div>}
        </article>
      </div>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerBrand}><span className={styles.brandMark}>D</span><span><strong>DiskLens</strong><small>A clearer view of your storage.</small></span></Link>
        <div><a href={SOURCE_URL} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} /></a><a href={RELEASES_URL} target="_blank" rel="noreferrer">Releases <ArrowUpRight size={13} /></a><Link href="/">Back to product <ArrowUpRight size={13} /></Link></div>
        <span className={styles.footerNote}>Documentation based on the current public application source.</span>
      </footer>
    </main>
  );
}
