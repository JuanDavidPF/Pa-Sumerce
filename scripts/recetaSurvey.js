let cards = document.querySelectorAll(".card");
let nextBtn = document.querySelector(".card_container_nextBtn");
let recetaName = document.querySelector(".recetaName");

let recetaIngredients = document.querySelector(".recetaIngredients");
recetaIngredients.style.display = "none";
recetaIngredients.style.color = "#000000";
recetaIngredients.style.marginTop = "15px";

let recetaProcess = document.querySelector(".recetaProcess");
recetaProcess.style.display = "none";
recetaProcess.style.colors = "#000000";
recetaProcess.style.marginTop = "25px";

let currentCard = 0;
let detalles = [];
let answers = [];
let geolocation = [];
let recetasDatabase;
let recetasDetalles;

Papa.parse("/data/csv/recetas.csv", {
  download: true,
  complete: function (results) {
    recetasDatabase = results.data;
  },
});

Papa.parse("/data/csv/recetasDetalles.csv", {
  download: true,
  complete: function (results) {
    recetasDetalles = results.data;
    recetasDetalles.shift();
  },
});

function nextButton() {
  cards[currentCard].classList.add("animate__fadeOutLeft");
  setTimeout(function () {
    cards[currentCard].classList.remove("current");
    currentCard++;

    if (currentCard < cards.length) {
      cards[currentCard].classList.add("animate__fadeInRight");
      cards[currentCard].classList.add("current");
    }
  }, 500);

  if (currentCard == cards.length - 1) {
    nextBtn.style.display = "none";
    showRecomendation();
  } else if (currentCard == cards.length - 2) {
    nextBtn.value = "Aceptar";
    getData();
  } else if (currentCard == cards.length - 3) nextBtn.value = "Finalizar";
} //closes nextButton method

function getData() {
  answers = [];
  geolocation = [];

  answers.push("User");
  geolocation.push("User");

  let inputs = document.querySelectorAll("input");

  for (let i = 0; i < inputs.length - 1; i++) {
    if (i < inputs.length - 7) {
      if (inputs[i].checked) answers.push(10);
      else answers.push(0);
    } else {
      if (inputs[i].checked) geolocation.push(10);
      else geolocation.push(0);
    }
  }

  recomendarReceta();
} //closes getData method

function recomendarReceta() {
  let databaseReference = recetasDatabase.slice(0);
  databaseReference.shift();

  let semejanza = 0;

  for (let i = 0; i < databaseReference.length; i++) {
    semejanza = Semejanza(answers, databaseReference[i]);
    databaseReference[i].push(semejanza);
  }

  databaseReference.sort(function (a, b) {
    a = parseFloat(a[a.length - 1]);
    b = parseFloat(b[b.length - 1]);
    return b - a;
  });

  databaseReference = databaseReference.slice(0, 1);
  databaseReference[0].pop();
  detallesReceta(databaseReference[0][0]);
} //closes recomendarReceta method

function detallesReceta(id) {
  detalles = [];

  for (let i = 0; i < recetasDetalles.length; i++) {
    if (recetasDetalles[i][0] == id) {
      detalles = recetasDetalles[i];
      break;
    }
  }
} //closes detallesReceta method

function showRecomendation() {
  recetaName.textContent = detalles[1];
  recetaIngredients.style.display = "block";
  recetaIngredients.textContent = detalles[2];

  recetaProcess.style.display = "block";
  recetaProcess.textContent = detalles[3];
} //closes showRecomendation method

function Semejanza(sujeto1Data, sujeto2Data) {
  //////////////CALCULO DE LA SEMEJANZA/////////////

  // Paso 1: calculo del producto punto

  let productoPunto = 0;

  for (let i = 1; i < sujeto1Data.length; i++) {
    a = parseFloat(sujeto1Data[i]);
    b = parseFloat(sujeto2Data[i]);
    productoPunto += a * b;
  }

  // Paso 2: calculo de la magnitud
  let magnitudA = 0;
  let magnitudB = 0;

  for (let i = 1; i < sujeto1Data.length; i++) {
    a = parseFloat(sujeto1Data[i]);
    b = parseFloat(sujeto2Data[i]);

    magnitudA += Math.pow(a, 2);
    magnitudB += Math.pow(b, 2);
  }

  magnitudA = Math.sqrt(magnitudA);
  magnitudB = Math.sqrt(magnitudB);

  // Paso 3: calculo de la similitud del coseno

  similitudCoseno = productoPunto / (magnitudA * magnitudB);
  return similitudCoseno;
} //closes Semejanza method
