import "./style.css";
// @deno-types="./asset-url.d.ts"
import hotelUrl from "./assets/hotel.svg?no-inline";
const app = document.querySelector<HTMLElement>("#app")!;

// Game Name
const heading = document.createElement("h1");
heading.textContent = "The Jackpot Hotel";

// Game State
let guests = 0;
let money = 0;
const clickValue = 1;
const roomRate = 1;

let bellboyCost = 10;
const bellboyCostMultiplier = 1.5;
let bellboys = 0;
const guestsPerBellboy = 1;

function checkIn(count: number) {
  guests += count;
  money += count * roomRate;
}

// Counter display
const counter = document.createElement("p");
const moneyCounter = document.createElement("p");
moneyCounter.id = "money";

// Stats display
const stats = document.createElement("p");

// Create a Button
const hotelButton = document.createElement("button");
hotelButton.id = "hotelButton";
const hotelImage = document.createElement("img");
hotelImage.src = hotelUrl;
hotelImage.alt = "";
hotelImage.width = 160;
hotelImage.height = 160;
hotelImage.className = "icon";

const hotelLabel = document.createElement("span");
hotelLabel.className = "label";
hotelLabel.textContent = "Check in a guest";

hotelButton.append(hotelImage, hotelLabel);

// Click
hotelButton.addEventListener("click", () => {
  checkIn(clickValue);
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

// Helper Functions (Passive Rate and Display Update)
function passiveRate(): number {
  return bellboys * guestsPerBellboy;
}

function updateDisplay() {
  moneyCounter.textContent = `Money: $${Math.floor(money)}`;
  counter.textContent = `Guests checked in: ${Math.floor(guests)}`;
  stats.textContent =
    `Manual: ${clickValue} per click | Passive: ${passiveRate()} per second`;
  bellboyButton.textContent =
    `🛎️ Hire a bellboy ($${bellboyCost}) - owned: ${bellboys}`;
  bellboyButton.disabled = money < bellboyCost;
}

// Passive Income LOOP
let lastTime = performance.now();
function tick(now: number) {
  const seconds = (now - lastTime) / 1000;
  lastTime = now;
  checkIn(passiveRate() * seconds);
  updateDisplay();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

app.append(heading, hotelButton, moneyCounter, counter, stats, store);
updateDisplay();
