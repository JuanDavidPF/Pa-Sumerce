let cards = document.querySelectorAll(".card");
let nextBtn = document.querySelector(".card_container_nextBtn");
let currentCard = 0;

function nextButton() {
  cards[currentCard].classList.add("animate__fadeOutLeft");

  setTimeout(function () {
    cards[currentCard].classList.remove("current");
    currentCard++;

    cards[currentCard].classList.add("animate__fadeInRight");
    cards[currentCard].classList.add("current");
  }, 500);

  if (currentCard == cards.length - 2) {
    nextBtn.value = "Aceptar";
    getData();
  } else if (currentCard == cards.length - 3) nextBtn.value = "Finalizar";
} //closes nextButton method

function getData() {
  let inputs = document.querySelectorAll("input:checked");
} //closes getData method
