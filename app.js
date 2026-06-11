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

  } catch (err) {
    console.error("SMART ROOM ERROR", err);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateAC(ac) {
  if (!ac) return;

  setText("acTemp", (ac.temperature || "--") + "°");
  setText("acMode", ac.mode || "-");
  setText("acFan", "🌀 " + (ac.fan || "-"));
}

function updateClimate(climate) {
  if (!climate) return;

  setText("roomTemp", (climate.temperature || "--") + "°C");
  setText("roomHumidity", (climate.humidity || "--") + "%");
}

function updateLamp(lamp) {
  if (!lamp) return;

  setText("lampStatus", lamp.power || "OFF");
  setText("lampBrightness", (lamp.brightness ?? "--") + "%");
  setText("lampColor", lamp.mode || "-");

  const slider = document.getElementById("lampSlider");
  if (slider && lamp.brightness !== undefined) {
    slider.value = lamp.brightness;
  }
}

function updateTV(tv) {
  if (!tv) return;

  setText("tvStatus", tv.power === "ON" ? "ON" : "OFF");
}

function updateCCTV(cctv) {
  if (!cctv) return;

  setText("cctvStatus", cctv.online || "-");
}

function updatePlug(plug) {
  if (!plug) return;

  setText("plugPower", (plug.power ?? 0) + " W");
}

function updateStats(stats) {
  if (!stats) return;

  setText("motionToday", stats.motionToday || 0);
  setText("tvEvents", stats.tvEventsToday || 0);
  setText("acEvents", stats.acEventsToday || 0);
  setText("lampEvents", stats.lampEventsToday || 0);
}

function updateFeed(feed) {
  const container = document.getElementById("activityFeed");
  if (!container) return;

  if (!feed || !feed.length) {
    container.innerHTML = '<div class="feed-item">Tidak ada aktivitas</div>';
    return;
  }

  container.innerHTML = "";

  feed.forEach(item => {
    const div = document.createElement("div");
    div.className = "feed-item";

    div.innerHTML = `
      <div class="feed-title">
        ${item.icon || ""} ${item.title || ""}
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

function formatDate(dateStr) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  return d.toLocaleString("id-ID");
}
