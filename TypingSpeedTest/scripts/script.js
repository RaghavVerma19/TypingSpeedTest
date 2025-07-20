const startBtn = document.getElementsByClassName("start-btn")[0];
const testContainer = document.querySelector(".container");
const resultContainer = document.querySelector(".result-container");
const wordsDiv = document.getElementById("words");
const timerSpan = document.getElementById("timer");
const wpmSpan = document.getElementById("wpm");
const retakeBtn = document.getElementsByClassName("retake-btn")[0];

const typingContent = [
  "Beneath a satin sky, the river flows with quiet purpose, carrying moonlight like silver coins upon its rippling surface. Trees lean forward to listen as the water hums its ancient lullaby, and the scent of wet earth rises in gentle plumes. Somewhere downstream, a heron stands motionless, its feathers catching the pale glow, as if spellbound by the night’s soft conversation. Time seems to pause here, wrapped in the hush of willow branches and distant stars.",
  "In a sun‑kissed meadow, wildflowers nod in unison to a breeze that knows all their secrets. Petals of lavender, gold, and rose vibrate in a silent song, weaving patterns of color that shimmer under the afternoon light. Bees drift lazily from bloom to bloom, their wings like tiny bells marking the pulse of summer’s heart. The world feels boundless in this gentle expanse, a sanctuary where every breath tastes of warmth and possibility.",
  "High on a windswept cliff, gulls wheel and cry above a restless sea that stretches to the horizon’s edge. Waves hammer at the rocks with tireless insistence, sculpting the shore into ever‑changing reliefs of stone and spray. Salt tangs the air, sharp and exhilarating, stirring memories kept in every crashing crest. Standing there, you sense the pulse of the earth, wild and unbridled, calling you to remember your own fierce spirit.",
  "When autumn twilight falls, the forest becomes a cathedral of russet light, each leaf aflame with the promise of change. Paths carpeted in fallen amber lead deeper into the hush, where shadows dance between ancient trunks. A breeze carries whispers of departure and return, of endings that cradle beginnings. And in that fleeting hour, the world seems to hold its breath, marveling at the slow, graceful turning of life’s great wheel.",
  "At dawn, the mountain’s silhouette stands guard against a sky brushed with pale rose and gold, its peaks piercing the horizon as if to touch the very breath of heaven. Mist coils through the pines like a living spirit, softening the jagged contours of rock and root. Birds trill hymns of awakening, their voices threading through the silent hush, announcing the day’s first promise. Each step upward feels like an offering, a pilgrimage into light and clarity, where the air itself sings of renewal.",
];

let chars = [];
let currentCharIndex = 0;
let correctChars = 0;
let totalChars = 0;
let correctWords = 0;
let timeLeft = 60;
let timerInterval;

function startTest() {
  startBtn.style.display = "none";
  testContainer.style.display = "block";

  const passage =
    typingContent[Math.floor(Math.random() * typingContent.length)];
  chars = passage.split("");
  renderChars();

  timerSpan.textContent = `Time: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) finishTest();
  }, 1000);
}

function renderChars() {
  wordsDiv.innerHTML = "";
  chars.forEach((ch, idx) => {
    const span = document.createElement("span");
    span.textContent = ch;
    if (idx === 0) span.classList.add("current-char");
    wordsDiv.appendChild(span);
  });
  wordsDiv.scrollLeft = 0;
}

document.addEventListener("keydown", (e) => {
  if (!timerInterval || timeLeft <= 0) return;
  const key = e.key;

  if (key === "Backspace") {
    if (currentCharIndex > 0) {
      const prev = wordsDiv.children[--currentCharIndex];
      prev.classList.remove("correct", "incorrect");
      updateCurrentHighlight();
    }
    return;
  }
  if (key.length !== 1) return;

  const span = wordsDiv.children[currentCharIndex];
  if (key === span.textContent) {
    span.classList.add("correct");
    correctChars++;
  } else {
    span.classList.add("incorrect");
  }
  totalChars++;

  span.classList.remove("current-char");
  currentCharIndex++;
  if (currentCharIndex < chars.length) {
    updateCurrentHighlight();
    scrollToCurrent();
  } else {
    finishTest();
  }

  if (key === " ") correctWords++;
  updateWPM();
});

function updateCurrentHighlight() {
  wordsDiv.children[currentCharIndex].classList.add("current-char");
}

function scrollToCurrent() {
  const curr = wordsDiv.children[currentCharIndex];
  wordsDiv.scrollLeft = curr.offsetLeft - wordsDiv.clientWidth / 2;
}

function updateWPM() {
  const elapsed = 60 - timeLeft;
  const wpm = elapsed > 0 ? Math.round((correctWords / elapsed) * 60) : 0;
  wpmSpan.textContent = `WPM: ${wpm}`;
}

function finishTest() {
  clearInterval(timerInterval);
  timerInterval = null;

  testContainer.style.display = "none";
  resultContainer.style.display = "block";

  const finalWPM = Math.round((correctWords / 60) * 60);
  const accuracy =
    totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

  document.querySelector(".result-item:nth-child(1) p").textContent = finalWPM;
  document.querySelector(
    ".result-item:nth-child(2) p"
  ).textContent = `${accuracy}%`;
  document.querySelector(".result-item:nth-child(3) p").textContent = `60s`;
}

retakeBtn.addEventListener("click", () => window.location.reload());
startBtn.addEventListener("click", startTest);
