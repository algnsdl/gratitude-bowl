const API_URL = "https://script.google.com/macros/s/AKfycbywXR36xpEZcR1iUENax0-_gsMKx0gYdOnET-ZrsN1_JRWB6dUEuc3hZmvUOGl9nboA/exec";

const form = document.getElementById("gratitudeForm");
const message = document.getElementById("message");
const groupBaskets = document.getElementById("groupBaskets");
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
  groupBaskets.innerHTML = "";

  const groups = ["1속", "2속", "3속", "4속", "5속", "6속", "♥"];

  const colors = [
    "#ff6f91",
    "#ff8fab",
    "#f9a8d4",
    "#ffd670",
    "#a9def9",
    "#cdb4db",
    "#caffbf",
    "#fff3b0"
  ];

  groups.forEach((groupName) => {
    const groupData = data.filter((item) => item.group === groupName);

    const card = document.createElement("div");
    card.className = "group-card";

    const title = document.createElement("div");
    title.className = "group-name";
    title.textContent = `[${groupName}의 감사그릇 - ${groupData.length}개]`;

    const basket = document.createElement("div");
    basket.className = "small-basket";

    const basketInner = document.createElement("div");
    basketInner.className = "small-basket-inner";

    groupData.forEach((item, index) => {
      const heart = document.createElement("div");
      heart.className = "heart";

      const position = getSmallHeartPosition(index);

      heart.style.left = `${position.x}px`;
      heart.style.bottom = `${position.y}px`;
      
let randomColor;

do {
  randomColor =
    colors[Math.floor(Math.random() * colors.length)];
} while (
  index >= 2 &&
  randomColor === groupData[index - 1]?._color &&
  randomColor === groupData[index - 2]?._color
);

item._color = randomColor;

heart.style.background = randomColor;
      heart.addEventListener("click", () => {
        openPrayerModal(item);
      });

      basketInner.appendChild(heart);
    });

    basket.appendChild(basketInner);
    card.appendChild(title);
    card.appendChild(basket);
    groupBaskets.appendChild(card);
  });
}

function openPrayerModal(item) {
  modalGroup.textContent = item.group;
  modalName.textContent = item.name;
  modalPrayer.textContent = item.prayer;

  modal.classList.add("open");
}

loadData();

function getSmallHeartPosition(index) {
  const isMobile = window.innerWidth <= 640;

  const gapX = isMobile ? 30 : 32;
  const gapY = isMobile ? 26 : 28;

  const heartsPerRow = isMobile ? 8 : 10;

  const row = Math.floor(index / heartsPerRow);
  const col = index % heartsPerRow;

  const offset = row % 2 === 0 ? 0 : gapX / 2;

  return {
    x: 18 + col * gapX + offset,
    y: 14 + row * gapY
  };
}
window.addEventListener("resize", () => {
  renderHearts(gratitudeData);
});

function updateCount(data) {
  const count = Array.isArray(data) ? data.length : 0;

  gratitudeCount.textContent =
    `❤️ 총 ${count}개의 감사가 담겼어요!`;
}
