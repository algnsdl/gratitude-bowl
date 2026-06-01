const API_URL = "https://script.google.com/macros/s/AKfycbywXR36xpEZcR1iUENax0-_gsMKx0gYdOnET-ZrsN1_JRWB6dUEuc3hZmvUOGl9nboA/exec";

const form = document.getElementById("gratitudeForm");
const message = document.getElementById("message");
const heartContainer = document.getElementById("heartContainer");
const gratitudeCount = document.getElementById("gratitudeCount");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalGroup = document.getElementById("modalGroup");
const modalName = document.getElementById("modalName");
const modalPrayer = document.getElementById("modalPrayer");

let gratitudeData = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    group: document.getElementById("group").value.trim(),
    name: document.getElementById("name").value.trim(),
    prayer: document.getElementById("prayer").value.trim()
  };

  if (!data.group || !data.name || !data.prayer) {
    message.textContent = "모든 항목을 입력해주세요.";
    return;
  }

  try {
    message.textContent = "기도의 지경이 넓어지는 중...";

    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(data)
    });

    message.textContent = "하나님 감사합니다💗";
    form.reset();

    setTimeout(loadData, 1500);
  } catch (error) {
    message.textContent = "오류가 발생했습니다. 다시 시도해주세요.";
  }
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("open");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("open");
  }
});

async function loadData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

   gratitudeData = data;
renderHearts(gratitudeData);
updateCount(gratitudeData);
  } catch (error) {
    console.error(error);
  }
}

function renderHearts(data) {
  heartContainer.innerHTML = "";

  const maxVisible = 100;
  const visibleData = data.slice(-maxVisible);

  visibleData.forEach((item, index) => {
    const heart = document.createElement("div");
    heart.className = "heart";

    const position = getHeartPosition(index);
    heart.style.left = `${position.x}px`;
    heart.style.bottom = `${position.y}px`;

    const colors = [
      "#ff6f91",
      "#ff8fab",
      "#ffb3c6",
      "#ffc2d1",
      "#fb6f92",
      "#f9a8d4",
      "#c084fc",
      "#a78bfa",
      "#fda4af",
      "#fbcfe8"
    ];

    heart.style.background = colors[index % colors.length];

    heart.addEventListener("click", () => {
      openPrayerModal(item);
    });

    heartContainer.appendChild(heart);
  });
}

function getHeartPosition(index) {
  const gapX = window.innerWidth <= 640 ? 42 : 54;
  const gapY = window.innerWidth <= 640 ? 34 : 42;

  const containerWidth = heartContainer.clientWidth;
  const heartsPerRow = Math.max(4, Math.floor(containerWidth / gapX));

  const row = Math.floor(index / heartsPerRow);
  const col = index % heartsPerRow;

  const rowWidth = heartsPerRow * gapX;
  const startX = Math.max(0, (containerWidth - rowWidth) / 2);
  const offset = row % 2 === 0 ? 0 : gapX / 2;

  return {
    x: startX + col * gapX + offset,
    y: row * gapY + 10
  };
}

function openPrayerModal(item) {
  modalGroup.textContent = item.group;
  modalName.textContent = item.name;
  modalPrayer.textContent = item.prayer;

  modal.classList.add("open");
}

loadData();

window.addEventListener("resize", () => {
  renderHearts(gratitudeData);
});

function updateCount(data) {
  const count = Array.isArray(data) ? data.length : 0;

  gratitudeCount.textContent =
    `❤️ 지금까지 ${count}개의 감사가 담겼어요`;
}
