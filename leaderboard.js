const DATA = {
  weekly: [
    { name: "Sarah Johnson", rating: 2850, streak: 45, habits: 234, change: +2 },
    { name: "Mike Chen",     rating: 2720, streak: 38, habits: 218, change: +1 },
    { name: "Emma Davis",    rating: 2680, streak: 32, habits: 209, change: -1 },
    { name: "John Smith",    rating: 2540, streak: 30, habits: 189, change: +3 },
    { name: "Lisa Anderson", rating: 2480, streak: 28, habits: 176, change: -1 },
    { name: "Tom Wilson",    rating: 2420, streak: 25, habits: 165, change:  0 },
    { name: "Amy Brown",     rating: 2380, streak: 35, habits: 158, change: +4 },
    { name: "David Lee",     rating: 2340, streak: 22, habits: 152, change: -2 },
    { name: "Jennifer White",rating: 2290, streak: 27, habits: 145, change: +1 },
    { name: "Chris Martin",  rating: 2250, streak: 20, habits: 139, change:  0 },
    { name: "Rachel Green",  rating: 2180, streak: 18, habits: 132, change: -3 },
    { name: "You",           rating: 2120, streak: 12, habits:  98, change: +5, isYou: true },
    { name: "Alex Turner",   rating: 2080, streak: 15, habits: 124, change: +2 },
    { name: "Maria Garcia",  rating: 2020, streak: 19, habits: 118, change: -1 },
    { name: "James Brown",   rating: 1980, streak: 14, habits: 112, change: +1 },
    { name: "Nina Patel",    rating: 1940, streak: 10, habits: 105, change: -2 },
    { name: "Carlos Reyes",  rating: 1900, streak: 17, habits:  99, change: +3 },
    { name: "Sophie Lee",    rating: 1860, streak:  9, habits:  92, change:  0 },
    { name: "Kevin Park",    rating: 1820, streak: 13, habits:  88, change: +1 },
    { name: "Diana Prince",  rating: 1790, streak:  8, habits:  81, change: -1 },
  ],

  monthly: [
    { name: "Emma Davis",    rating: 3100, streak: 60, habits: 310, change: +2 },
    { name: "Sarah Johnson", rating: 3050, streak: 58, habits: 295, change: -1 },
    { name: "Mike Chen",     rating: 2980, streak: 55, habits: 280, change: +1 },
    { name: "Amy Brown",     rating: 2860, streak: 50, habits: 260, change: +4 },
    { name: "John Smith",    rating: 2800, streak: 48, habits: 250, change: +2 },
    { name: "Lisa Anderson", rating: 2740, streak: 45, habits: 242, change: -1 },
    { name: "Jennifer White",rating: 2680, streak: 40, habits: 230, change: +3 },
    { name: "David Lee",     rating: 2620, streak: 38, habits: 220, change: -2 },
    { name: "Chris Martin",  rating: 2560, streak: 35, habits: 210, change:  0 },
    { name: "Tom Wilson",    rating: 2500, streak: 32, habits: 200, change: +1 },
    { name: "Rachel Green",  rating: 2420, streak: 28, habits: 190, change: -3 },
    { name: "You",           rating: 2380, streak: 26, habits: 178, change: +5, isYou: true },
    { name: "Alex Turner",   rating: 2320, streak: 22, habits: 165, change: +2 },
    { name: "Maria Garcia",  rating: 2260, streak: 20, habits: 155, change: -1 },
    { name: "James Brown",   rating: 2200, streak: 18, habits: 145, change:  0 },
  ],

  alltime: [
    { name: "Mike Chen",     rating: 8500, streak: 180, habits: 900, change: +1 },
    { name: "Emma Davis",    rating: 8400, streak: 175, habits: 880, change: +2 },
    { name: "Sarah Johnson", rating: 8300, streak: 170, habits: 860, change: -1 },
    { name: "John Smith",    rating: 7900, streak: 150, habits: 800, change: +3 },
    { name: "Lisa Anderson", rating: 7700, streak: 140, habits: 760, change: -1 },
    { name: "Amy Brown",     rating: 7500, streak: 130, habits: 720, change: +4 },
    { name: "Tom Wilson",    rating: 7300, streak: 120, habits: 680, change:  0 },
    { name: "David Lee",     rating: 7100, streak: 110, habits: 640, change: -2 },
    { name: "Jennifer White",rating: 6900, streak: 100, habits: 600, change: +1 },
    { name: "Chris Martin",  rating: 6700, streak:  90, habits: 560, change:  0 },
    { name: "Rachel Green",  rating: 6500, streak:  80, habits: 520, change: -3 },
    { name: "You",           rating: 6200, streak:  60, habits: 480, change: +5, isYou: true },
    { name: "Alex Turner",   rating: 6000, streak:  55, habits: 450, change: +2 },
    { name: "Maria Garcia",  rating: 5800, streak:  50, habits: 420, change: -1 },
    { name: "James Brown",   rating: 5600, streak:  45, habits: 390, change: +1 },
  ],
};

let currentPeriod = "weekly";
let currentPage   = 1;
const ROWS_PER_PAGE = 10;

function changeHTML(val) {
  if (val === 0) return `<span class="change-neu">—</span>`;
  if (val > 0)  return `<span class="change-up">↗ +${val}</span>`;
  return `<span class="change-down">↘ ${val}</span>`;
}

function renderPodium(data) {
  const top3 = data.slice(0, 3); 
  const slots = [top3[1], top3[0], top3[2]];
  const ids   = ["podium-2", "podium-1", "podium-3"];
  const nameIds   = ["p2-name", "p1-name", "p3-name"];
  const ratingIds = ["p2-rating", "p1-rating", "p3-rating"];

  slots.forEach((player, i) => {
    if (!player) return;
    document.getElementById(nameIds[i]).textContent   = player.name;
    document.getElementById(ratingIds[i]).textContent = player.rating.toLocaleString();
  });
}

function renderTable(data, page) {
  const tbody = document.getElementById("leaderboard-body");
  const start = (page - 1) * ROWS_PER_PAGE;
  const rows  = data.slice(start, start + ROWS_PER_PAGE);

  tbody.innerHTML = rows.map((p, i) => {
    const rank     = start + i + 1;
    const isTop3   = rank <= 3;
    const rankClass= isTop3 ? "rank-cell top3" : "rank-cell";
    const rowClass = p.isYou ? "you-row" : "";
    const badge    = p.isYou ? `<span class="you-badge">You</span>` : "";
    return `
      <tr class="${rowClass}">
        <td class="${rankClass}">#${rank}</td>
        <td><div class="username-cell">${p.name} ${badge}</div></td>
        <td class="rating-cell">${p.rating.toLocaleString()}</td>
        <td>${p.streak} days</td>
        <td>${p.habits}</td>
        <td>${changeHTML(p.change)}</td>
      </tr>`;
  }).join("");
}

function renderPagination(data) {
  const total   = Math.ceil(data.length / ROWS_PER_PAGE);
  const pag     = document.getElementById("pagination");
  let html = "";

  html += `<button class="page-btn" id="prev-btn" ${currentPage===1?"disabled":""}>← Prev</button>`;

  for (let p = 1; p <= total; p++) {
    html += `<button class="page-btn ${p===currentPage?"active":""}" data-page="${p}">${p}</button>`;
  }

  html += `<button class="page-btn" id="next-btn" ${currentPage===total?"disabled":""}>Next →</button>`;

  pag.innerHTML = html;

  pag.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      refresh();
    });
  });

  const prev = document.getElementById("prev-btn");
  const next = document.getElementById("next-btn");
  if (prev) prev.addEventListener("click", () => { if (currentPage > 1) { currentPage--; refresh(); } });
  if (next) next.addEventListener("click", () => { if (currentPage < total) { currentPage++; refresh(); } });
}

function refresh() {
  const data = DATA[currentPeriod];
  renderPodium(data);
  renderTable(data, currentPage);
  renderPagination(data);
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentPeriod = btn.dataset.period;
    currentPage   = 1;
    refresh();
  });
});

refresh();