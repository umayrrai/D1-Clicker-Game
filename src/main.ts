import "./style.css";
// @deno-types="./asset-url.d.ts"
import hotelUrl from "./assets/hotel.svg?no-inline";
const app = document.querySelector<HTMLElement>("#app")!;

// Game Name
const heading = document.createElement("h1");
heading.textContent = "The Infinite Hotel";

// Game State
// Game Rules (change these to balance the game)
const guestsPerClick = 1;
const stayLength = 10; // each guest stays 10 seconds
const rentPerSecond = 1; // each guest pays $1 every second they stay
const secondsPerGuest = 5; // each bellboy brings 1 guest every 5 seconds
const bellboyCostMultiplier = 1.5;

// Game State
let money = 0;
let bellboys = 0;
let bellboyCost = 10;
let guestTimers: number[] = []; // seconds left for each guest in the hotel
let bellboyProgress = 0; // how close bellboys are to bringing the next guest

// Guest helpers
function checkInGuest() {
  guestTimers.push(stayLength);
}

function guestCount(): number {
  return guestTimers.length;
}

function incomePerSecond(): number {
  return guestCount() * rentPerSecond;
}

function guestsPerMinute(): number {
  return Math.round((bellboys * 60) / secondsPerGuest);
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

const bellboyButton = document.createElement("button");
bellboyButton.id = "bellboyButton";

bellboyButton.addEventListener("click", () => {
  if (money >= bellboyCost) {
    money -= bellboyCost;
    bellboys++;
    bellboyCost = Math.round(bellboyCost * bellboyCostMultiplier);
    updateDisplay();
  }
});

store.append(storeHeading, bellboyButton);

// Display
function updateDisplay() {
  moneyCounter.textContent = `Money: $${
    Math.floor(money)
  } (+$${incomePerSecond()}/s)`;
  counter.textContent = `Guests in hotel: ${guestCount()}`;

  if (bellboys === 0) {
    stats.textContent =
      `Each guest stays ${stayLength}s and pays $${rentPerSecond}/s`;
  } else {
    stats.textContent =
      `Your bellboys bring ${guestsPerMinute()} guests per minute`;
  }

  bellboyButton.textContent =
    `🛎️ Hire a bellboy ($${bellboyCost}) - owned: ${bellboys}`;
  bellboyButton.disabled = money < bellboyCost;
}

// Game Loop
let lastTime = performance.now();
function tick(now: number) {
  const seconds = (now - lastTime) / 1000;
  lastTime = now;

  // 1. Guests in the hotel pay rent
  money += incomePerSecond() * seconds;

  // 2. Each guest's stay counts down; anyone at 0 checks out
  guestTimers = guestTimers
    .map((timeLeft) => timeLeft - seconds)
    .filter((timeLeft) => timeLeft > 0);

  // 3. Bellboys work toward bringing the next guest
  bellboyProgress += (bellboys / secondsPerGuest) * seconds;
  while (bellboyProgress >= 1) {
    checkInGuest();
    bellboyProgress -= 1;
  }

  updateDisplay();
  requestAnimationFrame(tick);
}

app.append(heading, hotelButton, moneyCounter, counter, stats, store);
updateDisplay();
requestAnimationFrame(tick);
