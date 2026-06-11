const API_URL =
"https://script.google.com/macros/s/AKfycbwYUMIjajxgFPJzbx2Nz9UXBB-LdjkGcyenMnk3hWVTRqtuz9C1P3k9Zra-3P-mvCf1/exec?action=dashboard";

loadDashboard();

setInterval(loadDashboard, 30000);

async function loadDashboard() {

  try {

    const res = await fetch(API_URL);
    const data = await res.json();

    updateAC(data.devices?.ac);
    updateClimate(data.devices?.climate);
    updateLamp(data.devices?.lamp);
    updateTV(data.devices?.tv);
    updateCCTV(data.devices?.cctv);
    updatePlug(data.devices?.smartplug);

    updateStats(data.dailyStats);

    updateFeed(data.activityFeed);

  } catch(err){

    console.error(err);

  }

}

function updateAC(ac){

  if(!ac) return;

  document.getElementById("acTemp").textContent =
    (ac.temperature || "--") + "°";

  document.getElementById("acMode").textContent =
    ac.mode || "-";

  document.getElementById("acFan").textContent =
    "🌀 " + (ac.fan || "-");

}

function updateClimate(climate){

  if(!climate) return;

  document.getElementById("roomTemp").textContent =
    (climate.temperature || "--") + "°C";

  document.getElementById("roomHumidity").textContent =
    (climate.humidity || "--") + "%";

}

function updateLamp(lamp){

  if(!lamp) return;

  document.getElementById("lampStatus").textContent =
    lamp.power || "OFF";

}

function updateTV(tv){

  if(!tv) return;

  const text =
    tv.power === "ON"
      ? "ON"
      : "OFF";

  document.getElementById("tvStatus").textContent =
    text;

}

function updateCCTV(cctv){

  if(!cctv) return;

  document.getElementById("cctvStatus").textContent =
    cctv.online || "-";

}

function updatePlug(plug){

  if(!plug) return;

  document.getElementById("plugPower").textContent =
    (plug.power || 0) + " W";

}

function updateStats(stats){

  if(!stats) return;

  document.getElementById("motionToday").textContent =
    stats.motionToday || 0;

  document.getElementById("tvEvents").textContent =
    stats.tvEventsToday || 0;

  document.getElementById("acEvents").textContent =
    stats.acEventsToday || 0;

  document.getElementById("lampEvents").textContent =
    stats.lampEventsToday || 0;

}

function updateFeed(feed){

  const container =
    document.getElementById("activityFeed");

  if(!feed || !feed.length){

    container.innerHTML =
      '<div class="feed-item">Tidak ada aktivitas</div>';

    return;
  }

  container.innerHTML = "";

  feed.forEach(item => {

    const div =
      document.createElement("div");

    div.className =
      "feed-item";

    div.innerHTML = `
      <div class="feed-title">
        ${item.icon || ""}
        ${item.title || ""}
      </div>

      <div class="feed-detail">
        ${item.detail || ""}
      </div>

      <div class="feed-time">
        ${formatDate(item.timestamp)}
      </div>
    `;

    container.appendChild(div);

  });

}

function formatDate(dateStr){

  if(!dateStr) return "-";

  const d = new Date(dateStr);

  return d.toLocaleString("id-ID");

}
