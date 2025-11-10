let gameIsFinished = false;
L.Icon.Default.imagePath = "leaflet/images/";

const PUZZLE_SIZE = 400;
const GRID_DIMS = 4;
const TOTAL_PIECES = GRID_DIMS * GRID_DIMS;
const PIECE_SIZE = PUZZLE_SIZE / GRID_DIMS;

const map = L.map("map", {
  preferCanvas: true,
}).setView([52.23, 21.01], 15);

L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  maxZoom: 19,
  crossOrigin: true,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

L.marker([52.23, 21.01]).addTo(map).bindPopup("Centrum Warszawy").openPopup();

map.on("load", () => {
  document.getElementById("get-map-btn").disabled = false;
});

document.getElementById("get-location-btn").addEventListener("click", () => {
  map.locate({ setView: true, maxZoom: 17 });
  map.on("locationfound", (e) => {
    L.marker(e.latlng).addTo(map).bindPopup("Twoja lokalizacja!").openPopup();
  });
  map.on("locationerror", (e) => {
    alert("Nie udało się pobrać lokalizacji: " + e.message);
  });
});

document.getElementById("get-map-btn").addEventListener("click", async () => {
  try {
    leafletImage(map, function (err, canvas) {
      if (err) {
        console.error("Błąd Leaflet Image:", err);
        alert("Nie udało się stworzyć obrazu mapy.");
        return;
      }

      try {
        canvas.toDataURL();
      } catch (securityError) {
        console.error("Canvas zanieczyszczony (CORS):", securityError);
        alert(
          "Błąd CORS: Użyj warstwy mapy z obsługą CORS lub serwera lokalnego."
        );
        return;
      }

      const pieceUrls = cutCanvasIntoPieces(canvas);
      generatePieces(pieceUrls);
      generateSlots();
      gameIsFinished = false;
    });
  } catch (e) {
    console.error("Ogólny błąd:", e);
  }
});

function cutCanvasIntoPieces(sourceCanvas) {
  const urls = [];
  const tempCanvas = document.getElementById("puzzle-canvas");
  const context = tempCanvas.getContext("2d");

  tempCanvas.width = PIECE_SIZE;
  tempCanvas.height = PIECE_SIZE;

  for (let i = 0; i < TOTAL_PIECES; i++) {
    const row = Math.floor(i / GRID_DIMS);
    const col = i % GRID_DIMS;

    context.clearRect(0, 0, PIECE_SIZE, PIECE_SIZE);
    context.drawImage(
      sourceCanvas,
      col * PIECE_SIZE,
      row * PIECE_SIZE,
      PIECE_SIZE,
      PIECE_SIZE,
      0,
      0,
      PIECE_SIZE,
      PIECE_SIZE
    );

    let dataUrl = "";
    try {
      dataUrl = tempCanvas.toDataURL("image/png");
    } catch (e) {
      console.error("Nie można utworzyć DataURL:", e);
      dataUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }
    urls.push(dataUrl);
  }

  return urls;
}

function generatePieces(pieceUrls) {
  const sourceContainer = document.getElementById("puzzle-source");
  sourceContainer.innerHTML = "";

  const pieces = [];
  for (let i = 0; i < TOTAL_PIECES; i++) {
    const piece = document.createElement("div");
    piece.classList.add("puzzle-piece");
    piece.draggable = true;
    piece.id = "puzzle-piece-" + i;
    piece.dataset.correctIndex = i;
    piece.style.backgroundImage = `url(${pieceUrls[i]})`;
    piece.style.backgroundSize = "contain";

    piece.addEventListener("dragstart", handleDragStart);
    piece.addEventListener("dragend", handleDragEnd);

    pieces.push(piece);
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach((p) => sourceContainer.appendChild(p));
}

function generateSlots() {
  const targetContainer = document.getElementById("puzzle-target");
  targetContainer.innerHTML = "";

  for (let i = 0; i < TOTAL_PIECES; i++) {
    const slot = document.createElement("div");
    slot.classList.add("puzzle-piece", "puzzle-slot");
    slot.dataset.targetIndex = i;

    slot.addEventListener("dragover", handleDragOver);
    slot.addEventListener("drop", handleDrop);

    targetContainer.appendChild(slot);
  }
}

function handleDragStart(e) {
  if (gameIsFinished) return;
  e.dataTransfer.setData("text/plain", e.target.id);
  e.target.style.opacity = "0.5";
}

function handleDragEnd(e) {
  e.target.style.opacity = "1";
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  if (gameIsFinished) return;

  const target = e.target.closest(".puzzle-slot");
  if (!target) return;

  const draggedId = e.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(draggedId);
  if (!draggedElement) return;

  if (target.firstElementChild) {
    const existing = target.firstElementChild;
    const sourceParent = draggedElement.parentNode;
    sourceParent.appendChild(existing);
  }

  target.appendChild(draggedElement);
  checkWinCondition();
}

function checkWinCondition() {
  const targetContainer = document.getElementById("puzzle-target");
  const slots = Array.from(targetContainer.children);

  const allFilled = slots.every((slot) => slot.firstElementChild);
  if (!allFilled) return;

  const correct = slots.every((slot, i) => {
    const piece = slot.firstElementChild;
    return piece && parseInt(piece.dataset.correctIndex) === i;
  });

  if (correct) {
    gameIsFinished = true;
    setTimeout(() => {
      alert("Gratulacje! Mapa została ułożona!");
    }, 50);
  }
}

const resetButton = document.createElement("button");
resetButton.textContent = "Restart gry";
resetButton.style.marginTop = "10px";
resetButton.addEventListener("click", resetGame);
document.getElementById("table-3").appendChild(resetButton);

function resetGame() {
  document.getElementById("puzzle-source").innerHTML = "";
  document.getElementById("puzzle-target").innerHTML = "";
  gameIsFinished = false;
}
