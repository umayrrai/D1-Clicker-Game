import "./style.css";
// @deno-types="./asset-url.d.ts"
import hotelUrl from "./assets/hotel.svg?no-inline";
const app = document.querySelector<HTMLElement>("#app")!;

// Game Name
const heading = document.createElement("h1");
heading.textContent = "The Infinite Hotel";

// Game Rules (change these to balance the game)
const guestsPerClick = 1;
const stayLength = 10; // each guest stays 10 seconds
const baseRent = 1; // each guest pays $1 every second they stay
const costMultiplier = 1.5; // each upgrade costs 50% more than the last

const twoStarCost = 1500; // one-time purchase
const twoStarRentMultiplier = 2; // rent is doubled once you have two stars

// Game State
let money = 0;
let hasTwoStar = false;
let guestTimers: number[] = []; // seconds left for each guest in the hotel

// New Upgrade Template
interface Generator {
  icon: string;
  label: string;
  secondsPerGuest: number; // each one brings 1 guest every this many seconds
  cost: number;
  owned: number;
  progress: number; // how close it is to bringing the next guest
  button: HTMLButtonElement;
}

function makeGenerator(
  id: string,
  icon: string,
  label: string,
  baseCost: number,
  secondsPerGuest: number,
): Generator {
  const button = document.createElement("button");
  button.id = `${id}Button`;

  const gen: Generator = {
    icon,
    label,
    secondsPerGuest,
    cost: baseCost,
    owned: 0,
    progress: 0,
    button,
  };

  button.addEventListener("click", () => {
    if (money >= gen.cost) {
      money -= gen.cost;
      gen.owned++;
      gen.cost = Math.round(gen.cost * costMultiplier);
      updateDisplay();
    }
  });

  return gen;
}

const generators = [
  makeGenerator("bellboy", "🛎️", "Hire a bellboy", 10, 5),
  makeGenerator("newspaper", "📰", "Run a newspaper ad", 100, 2),
  makeGenerator("billboard", "🪧", "Rent a billboard", 1000, 0.5),
];

// Guest helpers
function checkInGuest() {
  guestTimers.push(stayLength);
}

function guestCount(): number {
  return guestTimers.length;
}

function currentRent(): number {
  return hasTwoStar ? baseRent * twoStarRentMultiplier : baseRent;
}

function incomePerSecond(): number {
  return guestCount() * currentRent();
}

function guestsPerMinute(): number {
  let total = 0;
  for (const gen of generators) {
    total += (gen.owned * 60) / gen.secondsPerGuest;
  }
  return Math.round(total);
}

// Displays
const moneyCounter = document.createElement("p");
moneyCounter.id = "money";
const counter = document.createElement("p");
const stats = document.createElement("p");

// Hotel Button
const hotelButton = document.createElement("button");
hotelButton.id = "hotelButton";
const hotelImage = document.createElement("img");
hotelImage.src = hotelUrl;
hotelImage.alt = "";
hotelImage.width = 300;
hotelImage.height = 300;
hotelImage.className = "icon";
hotelButton.append(hotelImage);
hotelButton.setAttribute("aria-label", "Check in a guest");

hotelButton.addEventListener("click", () => {
  for (let i = 0; i < guestsPerClick; i++) {
    checkInGuest();
  }
  updateDisplay();
});

// Store
const store = document.createElement("div");
store.id = "store";

const storeHeading = document.createElement("h2");
storeHeading.textContent = "Store";

// Two Star Permanent Upgrade
const twoStarButton = document.createElement("button");
twoStarButton.id = "twoStarButton";

twoStarButton.addEventListener("click", () => {
  if (!hasTwoStar && money >= twoStarCost) {
    money -= twoStarCost;
    hasTwoStar = true;
    updateDisplay();
  }
});

store.append(storeHeading);
for (const gen of generators) {
  store.append(gen.button);
}
store.append(twoStarButton);

// Display
function updateDisplay() {
  const rent = currentRent();
  const perMinute = guestsPerMinute();

  const moneyText = Math.floor(money);
  const incomeText = incomePerSecond();
  moneyCounter.textContent = `Money: $${moneyText} (+$${incomeText}/s)`;

  if (perMinute === 0) {
    stats.textContent = `Each guest stays ${stayLength}s and pays $${rent}/s`;
  } else {
    stats.textContent = `${perMinute} guests/min, each paying $${rent}/s`;
  }

  for (const gen of generators) {
    gen.button.textContent =
      `${gen.icon} ${gen.label} ($${gen.cost}) - owned: ${gen.owned}`;
    gen.button.disabled = money < gen.cost;
  }

  if (hasTwoStar) {
    twoStarButton.textContent = "⭐⭐ Two Star Rating - owned";
    twoStarButton.disabled = true;
  } else {
    twoStarButton.textContent =
      `⭐⭐ Two Star Rating ($${twoStarCost}) - guests pay 2x`;
    twoStarButton.disabled = money < twoStarCost;
  }
}

// Game Loop
let lastTime = performance.now();
function tick(now: number) {
  requestAnimationFrame(tick);

  const seconds = (now - lastTime) / 1000;
  lastTime = now;

  // 1. Guests in the hotel pay rent
  money += incomePerSecond() * seconds;

  // 2. Each guest's stay counts down; anyone at 0 checks out
  guestTimers = guestTimers
    .map((timeLeft) => timeLeft - seconds)
    .filter((timeLeft) => timeLeft > 0);

  // 3. Every guest-bringing upgrade works toward its next guest
  for (const gen of generators) {
    gen.progress += (gen.owned / gen.secondsPerGuest) * seconds;
    while (gen.progress >= 1) {
      checkInGuest();
      gen.progress -= 1;
    }
  }

  updateDisplay();
}

app.append(heading, hotelButton, moneyCounter, counter, stats, store);
updateDisplay();
requestAnimationFrame(tick);
