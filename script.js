const gameElement = document.querySelector(".game");
const titleElement = document.querySelector(".title");
const winnerElement = document.querySelector(".winner");

const loseAudio = document.querySelector(".lose");
const successAudio = document.querySelector(".success");
const winAudio = document.querySelector(".win");
const cardAudio = document.querySelector(".card-audio");

const game = {
  data: {
    pairsFinished: 0,
    pairsQuantity: 5,
    cardsQuantity: 0,
    cards: [],
  },
  resetGame() {
    this.data = {
      pairsFinished: 0,
      pairsQuantity: 5,
      cardsQuantity: 0,
      cards: [],
    };
    titleElement.innerHTML = "Jogo da memória";
    winnerElement.innerHTML = "";

    this.init();
  },
  init() {
    const pairsQuantity = Number(prompt("Quantidade de pares de números: "));

    this.data.pairsQuantity = pairsQuantity < 2 ? 5 : pairsQuantity;

    this.data.cardsQuantity = this.data.pairsQuantity * 2;

    this.data.cards = Array(this.data.cardsQuantity);

    const indexesPossibles = [];
    const cardsValues = [];

    for (let index = 1; index <= this.data.cards.length; index++) {
      indexesPossibles.push(index - 1);
      if (index > this.data.pairsQuantity) {
        cardsValues.push(index - this.data.pairsQuantity);
      } else {
        cardsValues.push(index);
      }
    }

    for (const value of cardsValues) {
      const randomIndex = this.getRandomIndexOfArray(indexesPossibles);

      this.data.cards[randomIndex] = {
        index: randomIndex,
        value,
        active: false,
        finished: false,
        disabled: false,
      };

      indexesPossibles.splice(indexesPossibles.indexOf(randomIndex), 1);
    }

    gameElement.innerHTML = "";
    for (const card of this.data.cards) {
      gameElement.innerHTML += `<div onclick="game.handleCardClick(${card.index})" class="card">?</div>`;
    }
  },
  handleCardClick(cardIndex) {
    const card = this.data.cards[cardIndex];

    cardAudio.play();
    this.addClass([card], ["click-rotate"]);

    if (card.finished || card.disabled) return;

    if (!card.active) {
      const cardsActives = this.data.cards.filter(
        (cardFilter) => cardFilter.active & !cardFilter.finished
      );

      this.addClass([card], ["active"]);
      this.updateCardKeys([card], [true, true]);

      if (cardsActives.length === 1) {
        const cardTwo = cardsActives[0];

        if (cardTwo.value === card.value) {
          this.data.pairsFinished += 1;

          this.updateCardKeys([card, cardTwo], [undefined, undefined, true]);

          setTimeout(() => {
            successAudio.play();

            this.addClass([card, cardTwo], ["finished"]);
          }, 700);

          if (this.data.pairsFinished === this.data.pairsQuantity) {
            setTimeout(() => {
              winAudio.play();
            }, 1200);

            setTimeout(() => {
              titleElement.innerHTML =
                "Fim de Jogo! <br /> <span>Clique <span onclick='game.resetGame()'>AQUI</span> para jogar novamente</span>";
              winnerElement.innerHTML = `<img src="./assets/mario.gif" alt="Mário" />`;
            }, 1500);
          }
        } else {
          setTimeout(() => {
            loseAudio.play();
            this.addClass([card, cardTwo], ["error"]);
          }, 700);

          setTimeout(() => {
            this.removeClass(
              [card, cardTwo],
              ["active", "error", "click-rotate"],
              "?"
            );
            this.updateCardKeys([card, cardTwo], [false, false]);
          }, 2000);
        }
      }
    } else {
      this.removeClass([card], ["active", "click-rotate"], "?");
      card.active = false;
    }
  },
  updateCardKeys(cards, keyValues) {
    for (const card of cards) {
      card.active = keyValues[0] === undefined ? card.active : keyValues[0];
      card.disabled = keyValues[1] === undefined ? card.disabled : keyValues[1];
      card.finished = keyValues[2] === undefined ? card.finished : keyValues[2];
    }
  },
  removeClass(cards, classes, text = null) {
    const cardElements = document.querySelectorAll(".card");

    for (const card of cards) {
      for (const className of classes) {
        cardElements[card.index].classList.remove(className);
        cardElements[card.index].innerText = text ? text : card.value;
      }
    }
  },
  addClass(cards, classes, text = null) {
    const cardElements = document.querySelectorAll(".card");

    for (const card of cards) {
      for (const className of classes) {
        cardElements[card.index].classList.add(className);
        cardElements[card.index].innerText = text ? text : card.value;
      }
    }
  },
  getRandomIndexOfArray(array) {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
  },
};

game.init();
