// https://teachablemachine.withgoogle.com/models/wVsOuK6L/
// https://teachablemachine.withgoogle.com/models/e86UM4Hu/

// Global variables:
// Initialize a sound classifier method with "soundModel" variable model. A callback needs to be passed.
let classifier;
// Options for the "soundModel" variable model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.6 };

let mic;
let label = "listening...";

// Teachable Machine model URL:
let soundModel =
  "https://teachablemachine.withgoogle.com/models/e86UM4Hu/model.json";

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel, options);
}

function setup() {
  // noCanvas();
  let canvas = createCanvas(50, 50);
  canvas.id("canvas");
  canvas.parent("canvasWrapper");

  mic = new p5.AudioIn();
  mic.start();

  // Start classifying
  // Classify the sound from microphone in real time
  // The sound model will continuously listen to the microphone
  classifier.classify(gotResult);
}

function draw() {
  let vol = mic.getLevel();
  background(255);
  noStroke();
  fill("tomato");
  ellipse(25, 25, 20 + vol * 600, 20 + vol * 600);
}

// A function to run when we get any errors and the results
// The model recognizing a sound will trigger this event
function gotResult(error, results) {
  const elem = document.querySelector(".wrapper");
  const dictionary = document.querySelector(".dictionary");
  const dictWords = [
    { label: "amcic", emoji: "🐱", fr: "chat", en: "cat" },
    { label: "izem", emoji: "🦁", fr: "lion", en: "lion" },
    { label: "iddew", emoji: "🐵", fr: "singe", en: "monkey" },
    { label: "aqjun", emoji: "🐶", fr: "chien", en: "dog" },
    { label: "azul", emoji: "👋", fr: "salut", en: "hi" },
    { label: "aḥelluf", emoji: "🐷", fr: "cochon", en: "pig" },
    { label: "aɣyul", emoji: "🐴", fr: "âne", en: "donkey" }
  ];

  // Display error in the console
  if (error) {
    console.error(error);
    return;
  }

  // The results are in an array ordered by confidence.
  const dom = results
    .filter(el => el.label != "_background_noise_")
    .map(result => {
      let confidence = (result.confidence * 100).toFixed(0);

      // Colors: Red => Orange => Green
      let color = (opacity = 1) => {
        return (
          (confidence < 30 && `rgba(244,67,54,${opacity})`) ||
          ((confidence >= 30) & (confidence <= 60) &&
            `rgba(255,152,0, ${opacity})`) ||
          (confidence > 60 && `rgba(76,175,80, ${opacity})`)
        );
      };

      return `
        <li>
          <p class="text" style="color:${color()}">${result.label}</p>
          <div class="progressWrap" style="background:${color(0.05)}">
              <div class="progress" style="background:${color()};width:${confidence}%">
                  ${confidence < 13 ? "" : confidence + "%"}
              </div>
          </div>
        </li>
        `;
    })
    .join("");
  const text = dictWords.filter(el => el.label == results[0].label);
  elem.innerHTML = `<ul>${dom}</ul>`;
  dictionary.innerHTML = `<div>
  <p>${text[0].label}</p>
  <p>
  ${text[0].emoji}
  </p>
  <p>${text[0].fr}</p>
  <p>${text[0].en}</p>
</div>`;
}
