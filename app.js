const SUPABASE_FUNCTION_URL =
  "https://sowbvzagfcpymswsaeld.supabase.co/functions/v1/get-fixtures-today";

const demoGames = [
  {
    status: "AO VIVO • 62'",
    teams: "Benfica vs Porto",
    tv: "Canal oficial",
    country: "Portugal",
    league: "Liga Portugal",
    odds: ["2.10", "3.40", "3.20"],
    trend: "🔥 Odd Benfica caiu de 2.30 para 2.10"
  },
  {
    status: "HOJE • 21:00",
    teams: "Flamengo vs Palmeiras",
    tv: "Canal oficial",
    country: "Brasil",
    league: "Brasileirão",
    odds: ["2.45", "3.10", "2.80"],
    trend: "⚖️ Jogo equilibrado"
  },
  {
    status: "AMANHÃ • 19:45",
    teams: "Real Madrid vs Barcelona",
    tv: "Canal oficial",
    country: "Espanha",
    league: "La Liga",
    odds: ["2.20", "3.60", "2.95"],
    trend: "📡 Disponível em vários países"
  }
];

let games = [...demoGames];

function renderGames(list = games) {
  const grid = document.getElementById("gamesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(game => {
    grid.innerHTML += `
      <div class="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl hover:-translate-y-1 transition">
        <p class="text-cyan-300 text-sm font-bold">${game.status}</p>
        <h4 class="text-2xl font-black mt-2">${game.teams}</h4>
        <p class="text-gray-300 mt-2">📺 ${game.tv} • ${game.country}</p>
        <p class="text-gray-400">🏆 ${game.league}</p>

        <div class="grid grid-cols-3 gap-2 mt-4 text-center">
          <div class="bg-black/30 rounded-xl p-3">1<br><b>${game.odds[0]}</b></div>
          <div class="bg-black/30 rounded-xl p-3">X<br><b>${game.odds[1]}</b></div>
          <div class="bg-black/30 rounded-xl p-3">2<br><b>${game.odds[2]}</b></div>
        </div>

        <p class="mt-4 text-sm text-cyan-300">${game.trend}</p>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <button class="neon-button py-3 rounded-xl font-black">Onde assistir</button>
          <button class="bg-white/10 border border-white/10 py-3 rounded-xl font-bold">
            Comparar odds
          </button>
        </div>
      </div>
    `;
  });
}

function searchGame() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const q = input.value.toLowerCase();

  const filtered = games.filter(g =>
    g.teams.toLowerCase().includes(q) ||
    g.country.toLowerCase().includes(q) ||
    g.league.toLowerCase().includes(q)
  );

  renderGames(filtered);
}

function setTab(button, title) {
  const tabTitle = document.getElementById("tabTitle");
  if (tabTitle) tabTitle.innerText = title;

  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
}

function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.toggle("hidden");
}

function updateApiStatus(message, type = "info") {
  const box = document.getElementById("apiStatus");
  if (!box) return;

  box.textContent = message;

  if (type === "success") {
    box.className =
      "mt-8 bg-green-400/10 border border-green-400/30 rounded-3xl p-5 text-green-200 font-semibold";
  }

  if (type === "warning") {
    box.className =
      "mt-8 bg-yellow-400/10 border border-yellow-400/30 rounded-3xl p-5 text-yellow-200 font-semibold";
  }

  if (type === "error") {
    box.className =
      "mt-8 bg-red-400/10 border border-red-400/30 rounded-3xl p-5 text-red-200 font-semibold";
  }
}

function mapSportmonksToGames(data) {
  if (!data || !Array.isArray(data.data)) return [];

  return data.data.map(item => {
    const name = item.name || "Jogo disponível";
    const league = item.league?.name || item.league_name || "Liga";
    const status = item.state?.name || item.status || "Agendado";
    const startingAt = item.starting_at || item.startingAt || "";

    let time = "Hoje";
    if (startingAt) {
      const date = new Date(startingAt);
      if (!isNaN(date)) {
        time = date.toLocaleTimeString("pt-PT", {
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    }

    return {
      status: `${status} • ${time}`,
      teams: name,
      tv: "Fonte oficial por país",
      country: "Global",
      league,
      odds: ["API", "API", "API"],
      trend: "✅ Dados reais via Sportmonks"
    };
  });
}

async function loadSportmonksGames() {
  updateApiStatus("🔄 A ligar à Sportmonks API...");

  try {
    const response = await fetch(SUPABASE_FUNCTION_URL);
    const data = await response.json();

    console.log("Sportmonks API:", data);

    const realGames = mapSportmonksToGames(data);

    if (realGames.length > 0) {
      games = realGames;
      renderGames(games);
      updateApiStatus(`✅ API ligada: ${realGames.length} registos reais carregados.`, "success");
    } else {
      games = [...demoGames];
      renderGames(games);
      updateApiStatus("⚠️ API ligada, mas o plano grátis não devolveu jogos para este endpoint. A mostrar demo.", "warning");
    }
  } catch (error) {
    console.error("Erro Sportmonks:", error);
    games = [...demoGames];
    renderGames(games);
    updateApiStatus("❌ Erro ao ligar à Sportmonks. A mostrar demo.", "error");
  }
}

renderGames();
loadSportmonksGames();
