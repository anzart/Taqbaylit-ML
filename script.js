// https://teachablemachine.withgoogle.com/models/wVsOuK6L/
// https://teachablemachine.withgoogle.com/models/e86UM4Hu/
// Global variable to store the classifier
let micro;
let classifier;

// Label
let label = "listening...";

// Teachable Machine model URL:
let soundModel =
  "https://teachablemachine.withgoogle.com/models/e86UM4Hu/model.json";

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel);
}

function setup() {
  createCanvas(50, 50);
  micro = new p5.AudioIn();
  micro.start();

  // Start classifying
  // The sound model will continuously listen to the microphone
  classifier.classify(gotResult);
}

function draw() {
  let vol = micro.getLevel();
  background(255);
  stroke(255);
  fill("tomato");
  ellipse(25, 25, 20 + vol * 300, 20 + vol * 300);
  //   console.log(vol);
  //   // Draw the label in the canvas
  //   fill(255);
  //   textSize(32);
  //   textAlign(CENTER, CENTER);
  //   text(label, width / 2, height / 2);
}

// The model recognizing a sound will trigger this event
function gotResult(error, results) {
  const elem = document.querySelector(".wrapper");
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
