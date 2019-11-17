// https://teachablemachine.withgoogle.com/models/wVsOuK6L/
// https://teachablemachine.withgoogle.com/models/e86UM4Hu/

// Global variables:
// Initialize a sound classifier method with "soundModel" variable model. A callback needs to be passed.
let classifier;
// Options for the "soundModel" variable model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.7 };

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
  ellipse(25, 25, 20 + vol * 300, 20 + vol * 300);
}

// A function to run when we get any errors and the results
// The model recognizing a sound will trigger this event
function gotResult(error, results) {
  const elem = document.querySelector(".wrapper");

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
                  ${confidence < 5 ? "" : confidence + "%"}
              </div>
          </div>
        </li>
        `;
    })
    .join("");
  elem.innerHTML = `<ul>${dom}</ul>`;
}

// 🐱  amcic : Chat, Cat
// 🦁  izem : Lion, Lion
// 🐵  iddew : Singe, Monkey
// 🐶  aqjun: Chien, Dog
// 👋  Azul : Bonjour, Hello
// 🐴  Aɣyul : âne, Donkey
// 🐷  Aḥelluf : Pig, Cochon
