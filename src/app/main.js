import "../styles/main.css";

const RELEASES_API = "https://api.github.com/repos/ananas123123/Digi-Factory-1.17.7.5/releases";
let releaseCache = null;

async function getReleases() {
  if (releaseCache) return releaseCache;
  const res = await fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error("GitHub release lookup failed");
  releaseCache = await res.json();
  return releaseCache;
}

const pageNames = {
  "/": "Home",
  "/download": "Download",
  "/releases": "Releases",
  "/requirements": "Requirements",
  "/verify": "Verify",
  "/help": "Help"
};

function nav() {
  const current = location.hash.slice(1) || "/";
  return '<header class="nav"><a class="brand" href="#/">Digi</a><nav class="links">' +
    Object.entries(pageNames).map(([path,name]) =>
      '<a class="' + (current === path ? "active" : "") + '" href="#' + path + '">' + name + "</a>"
    ).join("") +
    "</nav></header>";
}

function layout(content) {
  return '<div class="shell">' + nav() + '<main class="fade">' + content +
    '</main><footer class="footer">Digi installer website · simple by design</footer></div>';
}

function home() {
  return layout(
    '<section class="hero"><div class="eyebrow">Digi for Windows</div>' +
    '<h1>Get Digi.<br>Nothing else.</h1>' +
    '<p>A small, focused website for downloading the Digi installer, checking releases, and verifying what you are installing.</p>' +
    '<div class="actions"><a class="button primary" href="#/download">Download Digi</a>' +
    '<a class="button" href="#/releases">View releases</a></div></section>' +
    '<section class="grid"><article class="card"><h3>Latest release</h3>' +
    '<div id="home-version" class="stat">Loading…</div><p id="home-date">Checking GitHub releases.</p></article>' +
    '<article class="card"><h3>Windows</h3><div class="stat">Desktop</div>' +
    '<p>Digi is currently distributed as a Windows application.</p></article></section>'
  );
}

async function hydrateHome() {
  try {
    const release = (await getReleases())[0];
    document.querySelector("#home-version").textContent = release?.tag_name || "Not published";
    document.querySelector("#home-date").textContent = release
      ? new Date(release.published_at).toLocaleDateString()
      : "No GitHub release exists yet.";
  } catch {
    document.querySelector("#home-version").textContent = "Unavailable";
    document.querySelector("#home-date").textContent = "Could not reach GitHub.";
  }
}

async function download() {
  let release;
  try { release = (await getReleases())[0]; } catch {}
  const asset = release?.assets?.find(a => /\.exe$/i.test(a.name));
  let body = '<section class="page"><div class="eyebrow">Download</div><h1>Digi installer</h1>' +
    '<p>The download button uses the latest published GitHub release asset. Nothing is hard-coded to an old installer.</p>';
  if (!release) {
    body += '<div class="notice">There is currently no published Digi release on GitHub. Once an installer is attached to a release, this page will expose it automatically.</div>';
  } else {
    body += '<div class="card"><h2>' + release.tag_name + '</h2><p>' +
      (release.name || "Latest release") + " · " + new Date(release.published_at).toLocaleDateString() + "</p>" +
      '<div class="actions"><a class="button primary" ' +
      (asset ? 'href="' + asset.browser_download_url + '" download' : 'aria-disabled="true"') + '>' +
      (asset ? "Download " + asset.name : "No .exe asset published") + "</a></div></div>";
  }
  return layout(body + "</section>");
}

async function releases() {
  let releases = [];
  try { releases = await getReleases(); } catch {}
  const rows = releases.length
    ? releases.map(r => '<div class="row"><div><strong>' + r.tag_name + '</strong><div class="muted">' +
      (r.name || "Release") + " · " + new Date(r.published_at).toLocaleDateString() +
      '</div></div><a class="button" href="' + r.html_url + '" target="_blank" rel="noreferrer">GitHub</a></div>').join("")
    : '<div class="notice">No releases have been published yet.</div>';
  return layout('<section class="page"><div class="eyebrow">Releases</div><h1>Release history</h1>' +
    '<p>Published releases are read directly from the Digi GitHub repository.</p><div class="list">' + rows + "</div></section>");
}

function requirements() {
  return layout('<section class="page"><div class="eyebrow">Requirements</div><h1>Before installing</h1>' +
    '<p>Keep this page intentionally short for now. Exact requirements can be expanded as the installer becomes stable.</p>' +
    '<div class="grid"><article class="card"><h3>Operating system</h3><p>Windows desktop. Use the release notes for version-specific requirements.</p></article>' +
    '<article class="card"><h3>Architecture</h3><p>Use the architecture stated on the published installer release.</p></article>' +
    '<article class="card"><h3>Disk space</h3><p>Leave enough free space for the installer and installed application.</p></article>' +
    '<article class="card"><h3>Dependencies</h3><p>Any required runtime or dependency will be documented here when fixed.</p></article></div></section>');
}

async function verify() {
  let release;
  try { release = (await getReleases())[0]; } catch {}
  const asset = release?.assets?.find(a => /\.exe$/i.test(a.name));
  return layout('<section class="page"><div class="eyebrow">Verification</div><h1>Verify the installer</h1>' +
    '<p>When a release provides a SHA-256 digest, it can be copied from here.</p>' +
    (asset
      ? '<div class="card"><h3>' + asset.name + '</h3><div class="hash"><code>' +
        (asset.digest || "No digest published") + '</code>' +
        (asset.digest ? '<button class="button" id="copy">Copy</button>' : "") + "</div></div>"
      : '<div class="notice">No installer asset with a published digest is available yet.</div>') +
    "</section>");
}

function help() {
  return layout('<section class="page"><div class="eyebrow">Help</div><h1>Need help?</h1>' +
    '<p>Useful links for the first version of the site.</p><div class="list">' +
    '<a class="row" href="https://github.com/ananas123123/Digi-Factory-1.17.7.5" target="_blank" rel="noreferrer"><span><strong>Source repository</strong><br><small>View Digi source and documentation</small></span><span>↗</span></a>' +
    '<a class="row" href="https://github.com/ananas123123/Digi-Factory-1.17.7.5/issues" target="_blank" rel="noreferrer"><span><strong>Report a problem</strong><br><small>Open an issue on GitHub</small></span><span>↗</span></a>' +
    "</div></section>");
}

async function render() {
  const key = location.hash.slice(1) || "/";
  let html;
  if (key === "/") html = home();
  else if (key === "/download") html = await download();
  else if (key === "/releases") html = await releases();
  else if (key === "/requirements") html = requirements();
  else if (key === "/verify") html = await verify();
  else html = help();
  document.querySelector("#app").innerHTML = html;
  if (key === "/") hydrateHome();
  const copy = document.querySelector("#copy");
  if (copy) copy.onclick = () => navigator.clipboard.writeText(document.querySelector(".hash code").textContent);
}

window.addEventListener("hashchange", render);
render();
