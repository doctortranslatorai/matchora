const games = [
  {
    status: "AO VIVO • 62'",
    teams: "Benfica vs Porto",
    tv: "Sport TV",
    country: "Portugal",
    league: "Liga Portugal",
    odds: ["2.10", "3.40", "3.20"],
    trend: "🔥 Odd Benfica caiu de 2.30 para 2.10"
  },
  {
    status: "HOJE • 21:00",
    teams: "Flamengo vs Palmeiras",
    tv: "Globo / Premiere",
    country: "Brasil",
    league: "Brasileirão",
    odds: ["2.45", "3.10", "2.80"],
    trend: "⚖️ Jogo equilibrado"
  },
  {
    status: "AMANHÃ • 19:45",
    teams: "Real Madrid vs Barcelona",
    tv: "DAZN / Movistar",
    country: "Espanha",
    league: "La Liga",
    odds: ["2.20", "3.60", "2.95"],
    trend: "📡 Disponível em 34 países"
  }
];

function renderGames(list = games) {
  const grid = document.getElementById("gamesGrid");
  grid.innerHTML = "";

  list.forEach(game => {
    grid.innerHTML += `
      <div class="bg-white/10 border border-white/10 rounded-3xl p-5">
        <p class="text-green-400 text-sm">${game.status}</p>
        <h4 class="text-2xl font-bold mt-2">${game.teams}</h4>
        <p class="text-gray-300 mt-2">📺 ${game.tv} • ${game.country}</p>
        <p class="text-gray-400">🏆 ${game.league}</p>

        <div class="grid grid-cols-3 gap-2 mt-4 text-center">
          <div class="bg-black/30 rounded-xl p-3">1<br><b>${game.odds[0]}</b></div>
          <div class="bg-black/30 rounded-xl p-3">X<br><b>${game.odds[1]}</b></div>
          <div class="bg-black/30 rounded-xl p-3">2<br><b>${game.odds[2]}</b></div>
        </div>

        <p class="mt-4 text-sm text-green-300">${game.trend}</p>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <button class="bg-green-500 text-black py-3 rounded-xl font-bold">Onde assistir</button>
          <button class="bg-white/10 border border-white/10 py-3 rounded-xl font-bold">Comparar odds</button>
        </div>
      </div>
    `;
  });
}

function searchGame() {
  const q = document.getElementById("searchInput").value.toLowerCase();

  const filtered = games.filter(g =>
    g.teams.toLowerCase().includes(q) ||
    g.country.toLowerCase().includes(q) ||
    g.league.toLowerCase().includes(q)
  );

  renderGames(filtered);
}

function setTab(button, title) {
  document.getElementById("tabTitle").innerText = title;

  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
}

function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("hidden");
}

renderGames();
