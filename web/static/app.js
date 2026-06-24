const REFRESH_INTERVAL = 60000;
const SPLASH_DURATION = 2800;

const splash = document.getElementById("splash");
let allData = {};
let refreshTimer = null;
let currentTab = "batting";

setTimeout(() => {
  splash.classList.add("hidden");
  document.body.style.overflow = "";
}, SPLASH_DURATION);
document.body.style.overflow = "hidden";

document.addEventListener("DOMContentLoaded", () => {
  loadAll();
  refreshTimer = setInterval(loadAll, REFRESH_INTERVAL);

  document.querySelectorAll("[data-tab-link]").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      switchTab(a.dataset.tabLink);
    });
  });

  document.querySelectorAll(".tab-mobile").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("teamFilter").addEventListener("change", applyFilters);
  document.getElementById("refreshNowBtn").addEventListener("click", triggerRefresh);
});

async function loadAll() {
  try {
    const [batting, keepers, keeperSummary, info] = await Promise.all([
      fetchJSON("/api/stats/batting"),
      fetchJSON("/api/stats/keepers"),
      fetchJSON("/api/stats/keeper-summary"),
      fetchJSON("/api/info"),
    ]);
    allData = { batting: deduplicateBatting(batting), keepers, keeperSummary, info };
    populateTeamFilters(allData.batting);
    renderCurrentTab();
    updateInfo(info);
  } catch (err) {
    console.error("Load error:", err);
  }
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

function deduplicateBatting(data) {
  if (!data || !data.length) return data || [];
  const map = {};
  for (const row of data) {
    const key = (row.Player || "").trim() + "|" + (row.Team || "").trim();
    const existing = map[key];
    const innings = parseInt(row.Innings) || 0;
    if (!existing || innings > (parseInt(existing.Innings) || 0)) {
      map[key] = row;
    }
  }
  return Object.values(map);
}

function switchTab(name) {
  currentTab = name;
  document.querySelectorAll(".sidebar-link").forEach(a => {
    a.classList.remove("active");
    if (a.dataset.tabLink === name) a.classList.add("active");
  });
  document.querySelectorAll(".tab-mobile").forEach(btn => {
    btn.classList.remove("bg-primary-container", "text-on-primary-container");
    btn.classList.add("text-on-surface-variant");
    if (btn.dataset.tab === name) {
      btn.classList.add("bg-primary-container", "text-on-primary-container");
      btn.classList.remove("text-on-surface-variant");
    }
  });
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById(`tab-${name}`);
  if (panel) panel.classList.add("active");
  renderCurrentTab();
}

function renderCurrentTab() {
  const data = getTabData(currentTab);
  const filtered = applyFiltersToData(data);
  renderTable(currentTab, filtered);
  renderSummary(currentTab, filtered);
}

function getTabData(name) {
  const map = { batting: "batting", keepers: "keepers", keepersummary: "keeperSummary" };
  return allData[map[name]] || [];
}

const columnConfig = {
  batting: [
    { key: "rank", label: "Rank", width: "w-12" },
    { key: "player", label: "Player" },
    { key: "team", label: "Team" },
    { key: "matches", label: "M", center: true },
    { key: "runs", label: "Runs", center: true },
    { key: "avg", label: "Avg", center: true },
    { key: "sr", label: "SR", center: true },
    { key: "hundreds", label: "100s/50s", center: true },
  ],
  keepers: [
    { key: "rank", label: "Rank", width: "w-12" },
    { key: "keeper", label: "Keeper" },
    { key: "club", label: "Club" },
    { key: "score", label: "Score", center: true },
    { key: "balls", label: "BF", center: true },
    { key: "dismissal", label: "Dismissal" },
    { key: "catches", label: "Ct", center: true },
    { key: "stumps", label: "St", center: true },
    { key: "vs", label: "Opponent" },
    { key: "date", label: "Date" },
  ],
  keepersummary: [
    { key: "rank", label: "Rank", width: "w-12" },
    { key: "keeper", label: "Keeper" },
    { key: "club", label: "Club" },
    { key: "vs", label: "Opponent" },
    { key: "date", label: "Date" },
    { key: "score", label: "Score", center: true },
    { key: "balls", label: "BF", center: true },
    { key: "catches", label: "Ct", center: true },
    { key: "stumps", label: "St", center: true },
    { key: "dismissal", label: "Dismissal" },
  ],
};

const valueGetters = {
  batting: (r, i) => ({
    rank: i + 1,
    player: r.Player || "-",
    team: r.Team || "-",
    matches: r.Innings || r.Matches || "-",
    runs: parseInt(r.Runs) || 0,
    avg: r.Average || r.Avg || "-",
    sr: r["Strike Rate"] || r["StrikeRate"] || "-",
    hundreds: `${r["100s"] || r.Hundreds || "0"}/${r["50s"] || r.Fifties || "0"}`,
  }),
  keepers: (r, i) => ({
    rank: i + 1,
    keeper: r["Name of Keeper"] || "-",
    club: r["Club Name"] || "-",
    score: parseInt(r.Score) || 0,
    balls: r["Balls Faced"] || "0",
    dismissal: r["Out/Not out"] || "-",
    catches: parseInt(r.Catches) || 0,
    stumps: parseInt(r.Stumps) || 0,
    vs: r["Vs Team"] || "-",
    date: r.Date || "-",
  }),
  keepersummary: (r, i) => ({
    rank: i + 1,
    keeper: r["Name of Keeper"] || "-",
    club: r["Club Name"] || "-",
    vs: r["Vs Team"] || "-",
    date: r["Date"] || "-",
    score: parseInt(r["Score"]) || 0,
    balls: r["Balls Faced"] || "0",
    catches: parseInt(r["Catches"]) || 0,
    stumps: parseInt(r["Stumps"]) || 0,
    dismissal: r["Out/Not out"] || "-",
  }),
};

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function getAvatarColor(name) {
  const colors = ["#facc15", "#ffb690", "#3b82f6", "#22c55e", "#ec6a06", "#a78bfa", "#f472b6", "#34d399"];
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function renderTable(tab, data) {
  const tbody = document.getElementById(`${tab}-body`);
  const thead = document.getElementById(`${tab}-headers`);
  const countEl = document.getElementById(`${tab}-count`);
  if (!tbody || !thead) return;

  const config = columnConfig[tab];
  const getter = valueGetters[tab];
  if (!config) return;

  thead.innerHTML = config.map(c =>
    `<th class="px-3 md:px-5 py-3 md:py-3.5 font-semibold uppercase tracking-wider ${c.width || ""} ${c.center ? "text-center" : ""}">${c.label}</th>`
  ).join("");

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${config.length}" class="text-center py-12 text-on-surface-variant text-sm">No data available</td></tr>`;
    if (countEl) countEl.textContent = "0 records";
    return;
  }

  const fragment = document.createDocumentFragment();
  data.forEach((row, i) => {
    const vals = getter(row, i);
    const tr = document.createElement("tr");
    tr.className = "cursor-pointer";
    if (i % 2 === 1) tr.style.background = "rgba(35, 31, 20, 0.2)";

    tr.innerHTML = config.map(c => {
      let content = vals[c.key];
      let cls = "px-3 md:px-5 py-3 md:py-3.5 text-xs md:text-sm";
      if (c.center) cls += " text-center";

      if (c.key === "rank") {
        const isTop3 = i < 3;
        const bg = isTop3 ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant";
        content = `<span class="${bg} w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px]">${String(content).padStart(2, "0")}</span>`;
        cls += " w-10";
      } else if (c.key === "player" || c.key === "keeper") {
        const initials = getInitials(String(content));
        const color = getAvatarColor(String(content));
        content = `<div class="flex items-center gap-2.5">
          <div class="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0" style="background:${color}18;color:${color};border:1.5px solid ${color}30">${initials}</div>
          <span class="font-semibold text-on-surface text-xs md:text-sm truncate max-w-[130px] md:max-w-[200px]">${content}</span>
        </div>`;
      } else if (c.key === "runs" || c.key === "score") {
        const val = parseInt(content) || 0;
        if (val > 0) content = `<span class="font-bold text-primary">${val.toLocaleString()}</span>`;
      } else if (c.key === "wickets" || c.key === "catches" || c.key === "stumps" || c.key === "fiveW") {
        const val = parseInt(content) || 0;
        if (val > 0) content = `<span class="font-bold text-secondary">${val}</span>`;
      } else if (c.key === "team" || c.key === "club") {
        content = `<span class="inline-block px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] md:text-xs rounded border border-outline-variant">${content}</span>`;
      } else if (c.key === "hundreds") {
        const parts = String(content).split("/");
        content = `<span class="font-bold text-primary">${parts[0]}</span><span class="text-outline mx-1">/</span><span class="text-on-surface">${parts[1] || "0"}</span>`;
      }

      return `<td class="${cls}">${content}</td>`;
    }).join("");

    fragment.appendChild(tr);
  });

  tbody.innerHTML = "";
  tbody.appendChild(fragment);
  if (countEl) countEl.textContent = `Showing 1 to ${data.length} of ${(allData[getTabKey(tab)] || []).length} records`;
}

function getTabKey(name) {
  const map = { batting: "batting", keepers: "keepers", keepersummary: "keeperSummary" };
  return map[name] || "batting";
}

function renderSummary(tab, data) {
  const el = document.getElementById(`summary-${tab}`);
  if (!el) return;
  if (!data || data.length === 0) { el.innerHTML = ""; return; }

  const cards = [];
  if (tab === "batting") {
    const runs = data.reduce((s, r) => s + (parseInt(r.Runs) || 0), 0);
    const hundreds = data.filter(r => (parseInt(r["100s"]) || parseInt(r.Hundreds) || 0) >= 1).length;
    const top = Math.max(...data.map(r => parseInt(r["Highest Score"]) || parseInt(r.Runs) || 0));
    cards.push(statCard("Total Runs", runs, "trending_up"), statCard("Centuries", hundreds, "workspace_premium"), statCard("Top Score", top, "arrow_upward"), statCard("Players", data.length, "groups"));
  } else if (tab === "keepers") {
    const ct = data.reduce((s, r) => s + (parseInt(r.Catches) || 0), 0);
    const st = data.reduce((s, r) => s + (parseInt(r.Stumps) || 0), 0);
    cards.push(statCard("Catches", ct, "trackpad"), statCard("Stumps", st, "close"), statCard("Dismissals", ct + st, "sports_handball"), statCard("Entries", data.length, "list"));
  }
  el.innerHTML = cards.join("");
}


function statCard(label, value, icon) {
  const num = typeof value === "number" ? value.toLocaleString() : value;
  return `<div class="glass-card p-4 md:p-5 rounded-xl flex flex-col justify-between group overflow-hidden relative">
    <div class="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <span class="material-symbols-outlined text-[80px] md:text-[100px]">${icon}</span>
    </div>
    <p class="text-on-surface-variant text-[10px] md:text-xs uppercase tracking-widest font-semibold mb-1.5">${label}</p>
    <h3 class="text-2xl md:text-[30px] font-extrabold text-primary stat-number">${num}</h3>
  </div>`;
}

function populateTeamFilters(batting) {
  const teams = new Set();
  (batting || []).forEach(r => { if (r.Team) teams.add(r.Team); });
  const sorted = [...teams].sort();
  const sel = document.getElementById("teamFilter");
  if (!sel) return;
  sel.innerHTML = '<option value="">All Teams</option>' + sorted.map(t => `<option value="${t}">${t}</option>`).join("");
}

function applyFilters() {
  renderCurrentTab();
}

function applyFiltersToData(data) {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const teamEl = document.getElementById("teamFilter");
  const team = teamEl ? teamEl.value : "";
  const isKeeper = currentTab === "keepers" || currentTab === "keepersummary";
  const clubCol = "Club Name";
  const searchCols = isKeeper
    ? ["Name of Keeper", "Club Name", "Vs Team"]
    : ["Player", "PlayerName", "Team", "TeamName"];

  return (data || []).filter(row => {
    if (team) {
      if (isKeeper) {
        if (row[clubCol] !== team) return false;
      } else if (row["Team"] !== team) return false;
    }
    if (!query) return true;
    return searchCols.some(col => {
      const val = row[col];
      return val && val.toString().toLowerCase().includes(query);
    });
  });
}

function updateInfo(info) {
  const lu = document.getElementById("lastUpdated");
  if (info?.server_time) {
    const d = new Date(info.server_time);
    lu.textContent = d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  const fi = document.getElementById("fileInfo");
  if (fi && info?.stats_file?.exists) {
    fi.textContent = `Stats ${info.stats_file.size_kb} KB · Keepers ${info.keeper_file.size_kb} KB`;
  }
}

async function triggerRefresh() {
  const btn = document.getElementById("refreshNowBtn");
  const statusEl = document.getElementById("lastUpdated");
  btn.disabled = true;
  btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span><span>Refreshing...</span>';
  try {
    const res = await fetch("/api/refresh", { method: "POST" });
    const result = await res.json();
    const statsOk = result.stats?.ok;
    const keeperOk = result.keeper?.ok;
    if (statsOk || keeperOk) {
      await loadAll();
      if (statusEl) statusEl.textContent = "Refreshed OK";
    } else {
      const statsErr = result.stats?.stderr || result.stats?.error || "unknown";
      const keeperErr = result.keeper?.stderr || result.keeper?.error || "unknown";
      if (statusEl) statusEl.textContent = `Refresh failed: stats=${statsOk}, keeper=${keeperOk}`;
      console.error("Stats error:", statsErr);
      console.error("Keeper error:", keeperErr);
    }
  } catch (err) {
    console.error(err);
    if (statusEl) statusEl.textContent = "Refresh error: " + err.message;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">refresh</span><span>Refresh Data</span>';
  }
}
