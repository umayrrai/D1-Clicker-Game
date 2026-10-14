// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

// Game Name
const heading = document.createElement("h1");
heading.textContent = "The Jackpot Hotel";

// Old code for square
// const image = document.createElement("img");
// image.src = tileUrl;
// image.alt = "A teal tile with a cream circle";
// image.width = 96;
// image.height = 96;

// Game State
let guests = 0;
let clickValue = 1;

let bellboyCost = 10;
let bellboys = 0;
let guestsPerBellboy = 1;

// Counter display
const counter = document.createElement("p");

// Stats display
const stats = document.createElement("p");

// Create a Button
const hotelButton = document.createElement("button");
hotelButton.id = "hotelButton";
hotelButton.textContent = "Check in a guest.";

// Click
hotelButton.addEventListener("click", () => {
  guests += clickValue;
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
  if (guests >= bellboyCost) {
    guests -= bellboyCost;
    bellboys++;
    updateDisplay();
  }
});

store.append(storeHeading, bellboyButton);

// Helper Functions (Passive Rate and Display Update)
function passiveRate(): number {
    return bellboys * guestsPerBellboy;
}

function updateDisplay() {
  counter.textContent = `Guests checked in: ${Math.floor(guests)}`;
  stats.textContent =
    `Manual: ${clickValue} per click | Passive: ${passiveRate()} per second`;
  bellboyButton.textContent =
    `🛎️ Hire a bellboy (${bellboyCost} guests) - owned: ${bellboys}`;
  bellboyButton.disabled = guests < bellboyCost;
}

// Passive Income LOOP
let lastTime = performance.now();
function tick(now: number) {
  const seconds = (now - lastTime) / 1000;
  lastTime = now;
  guests += passiveRate() * seconds;
  updateDisplay();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

app.append(heading, hotelButton, counter, stats, store);
