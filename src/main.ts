// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import tileUrl from "./assets/tile.svg?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

// Step 1 Game Name
const heading = document.createElement("h1");
heading.textContent = "The Jackpot Hotel";

// 
const image = document.createElement("img");
image.src = tileUrl;
image.alt = "A teal tile with a cream circle";
image.width = 96;
image.height = 96;

const message = document.createElement("p");
message.textContent = "Your project starts here.";

// Step 2 Create a Button
const hotelButton = document.createElement("button");
hotelButton.id = "hotelButton";
hotelButton.textContent = "Check in a guest.";

// Step 3 Click
hotelButton.addEventListener("click", () => {
  console.log("Guest checked in!");
});

app.append(heading, image, message);
