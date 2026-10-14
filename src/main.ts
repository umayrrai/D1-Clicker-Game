import "./style.css";
// @deno-types="./asset-url.d.ts"
import hotelUrl from "./assets/hotel.svg?no-inline";
const app = document.querySelector<HTMLElement>("#app")!;

// Game Name
const heading = document.createElement("h1");
heading.textContent = "The Infinite Hotel";

// Game State
let guests = 0;
let money = 0;
const clickValue = 1;

let bellboyCost = 10;
const bellboyCostMultiplier = 1.5;
let bellboys = 0;
const guestsPerBellboy = 0.1; // guests per second each bellboy brings in

const moneyPerGuest = 1; // dollars per guest per second
const averageStayLength = 8; // in seconds

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
hotelImage.width = 300;
hotelImage.height = 300;
hotelImage.className = "icon";

hotelButton.append(hotelImage);
hotelButton.setAttribute("aria-label", "Check in a guest");

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

function incomeRate(): number {
  return guests * moneyPerGuest;
}

function updateDisplay() {
  const moneyText = money.toFixed(1);
  const incomeText = incomeRate().toFixed(1);
  const passiveText = passiveRate().toFixed(1);

  moneyCounter.textContent = `Money: $${moneyText} (+$${incomeText}/s)`;
  counter.textContent = `Guests in hotel: ${guests.toFixed(1)}`;
  stats.textContent =
    `Manual: ${clickValue} per click | Passive: ${passiveText} per second`;
  bellboyButton.textContent =
    `🛎️ Hire a bellboy ($${bellboyCost}) - owned: ${bellboys}`;
  bellboyButton.disabled = money < bellboyCost;
}

// Game LOOP
let lastTime = performance.now();
function tick(now: number) {
  const seconds = (now - lastTime) / 1000;
  lastTime = now;

  guests += passiveRate() * seconds; // bellboys bring guests in
  guests *= Math.exp(-seconds / averageStayLength); // guests leave over time
  if (guests < 0.01) guests = 0; // no guests, no money
  money += incomeRate() * seconds; // present guests pay

  updateDisplay();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

app.append(heading, hotelButton, moneyCounter, counter, stats, store);
updateDisplay();
