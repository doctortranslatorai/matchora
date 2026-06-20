const SUPABASE_FUNCTION_URL =
  "https://sowbvzagfcpymswsaeld.supabase.co/functions/v1/get-fixtures-today";

const demoGames = [
  {
    status: "AO VIVO • 62'",
    teams: "Benfica vs Porto",
    tv: "Canal oficial",
    country: "Portugal",
    league: "Liga Portugal",
    time: "20:30",
    trend: "Fixture demo"
  },
  {
    status: "HOJE",
    teams: "Flamengo vs Palmeiras",
    tv: "Canal oficial",
    country: "Brasil",
    league: "Brasileirão",
    time: "21:00",
    trend: "Fixture demo"
  },
  {
    status: "AMANHÃ",
    teams: "Real Madrid vs Barcelona",
    tv: "Canal oficial",
    country: "Espanha",
    league: "La Liga",
    time: "19:45",
    trend: "Fixture demo"
  }
];

let allGames = [];
let games = [...demoGames];
let visibleCount = 12;

function createMatchUrl(game) {
  const params = new URLSearchParams({
    name: game.teams,
    time: game.time || "A confirmar",
    league: game.league || "Liga",
    status: game.status || "Agendado"
  });

  return `match.html?${params.toString()}`;
}

function renderGames(list = games) {
  const grid = document.getElementById("gamesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const visibleGames = list.slice(0, visibleCount);

  visibleGames.forEach(game => {
    const detailsUrl = createMatchUrl(game);

    grid.innerHTML += `
      <div class="bg-white/10 border border-white/10 rounded-3xl p-5 shadow-xl hover:-translate-y-1 transition">
        <div class="flex justify-between items-start gap-3">
          <p class="text-cyan-300 text-sm font-black">${game.status}</p>
          <span class="bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 px-3 py-1 rounded-full text-xs font-black">
            Fixture real
          </span>
        </div>

        <h4 class="text-2xl font-black mt-3 leading-tight">${game.teams}</h4>

        <div class="mt-4 space-y-2 text-sm">
          <p class="text-gray-300">⏰ ${game.time || "Horário por confirmar"}</p>
          <p class="text-gray-300">📺 ${game.tv} • ${game.country}</p>
          <p class="text-gray-400">🏆 ${game.league}</p>
        </div>

        <div class="mt-4 bg-black/30 border border-white/10 rounded-2xl p-4 text-center">
          <p class="text-cyan-300 font-black">Odds brevemente</p>
          <p class="text-gray-400 text-sm mt-1">Mercados 1X2, golos e ambas marcam.</p>
        </div>

        <p class="mt-4 text-sm text-cyan-300">✅ ${game.trend}</p>

        <div class="grid grid-cols-3 gap-2 mt-4">
          <button class="neon-button py-3 rounded-xl font-black text-sm">Onde assistir</button>
          <button class="bg-white/10 border border-white/10 py-3 rounded-xl font-bold text-sm">
            Alertar-me
          </button>
          <a href="${detailsUrl}" class="bg-white/10 border border-white/10 py-3 rounded-xl font-bold text-sm text-center">
            Detalhes
          </a>
        </div>
      </div>
    `;
  });

  renderLoadMoreButton(list.length);
}

function renderLoadMoreButton(total) {
  let wrapper = document.getElementById("loadMoreWrapper");

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "loadMoreWrapper";
    wrapper.className = "text-center mt-8";

    const jogosSection = document.getElementById("jogos");
    if (jogosSection) jogosSection.appendChild(wrapper);
  }

  if (visibleCount >= total) {
    wrapper.innerHTML = "";
    return;
  }

  wrapper.innerHTML = `
    <button onclick="loadMoreGames()" class="neon-button px-8 py-4 rounded-2xl font-black">
      Ver mais jogos
    </button>
  `;
}

function loadMoreGames() {
  visibleCount += 12;
  renderGames(games);
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

  visibleCount = 12;
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
}

function mapSportmonksToGames(data) {
  if (!data || !Array.isArray(data.data)) return [];

  return data.data.map(item => {
    const name = item.name || "Jogo disponível";
    const league = item.league?.name || item.league_name || "Liga";
    const status = item.state?.name || item.status || "Agendado";
    const startingAt = item.starting_at || item.startingAt || "";

    let time = "Horário por confirmar";

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
      status,
      teams: name,
      tv: "Fonte oficial por país",
      country: "Global",
      league,
      time,
      trend: "Dados reais via Sportmonks"
    };
  });
}

async function loadSportmonksGames() {
  try {
    const response = await fetch(SUPABASE_FUNCTION_URL);
    const data = await response.json();

    console.log("Sportmonks API:", data);

    const realGames = mapSportmonksToGames(data);

    if (realGames.length > 0) {
      allGames = realGames;
      games = realGames;
      visibleCount = 12;
      renderGames(games);
    } else {
      games = [...demoGames];
      visibleCount = 12;
      renderGames(games);
    }
  } catch (error) {
    console.error("Erro Sportmonks:", error);
    games = [...demoGames];
    visibleCount = 12;
    renderGames(games);
  }
}

renderGames();
loadSportmonksGames();
