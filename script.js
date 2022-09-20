const gameElement = document.querySelector(".game");
const titleElement = document.querySelector(".title");
const winnerElement = document.querySelector(".winner");

const loseAudio = document.querySelector(".lose");
const successAudio = document.querySelector(".success");
const winAudio = document.querySelector(".win");
const cardAudio = document.querySelector(".card-audio");

const questionsAndResponses = [
  {
    id: 1,
    text: "(Questão) Todas as pesquisas podem ser consideradas ciências nomotéticas ou idiográficas?",
  },
  {
    id: 1,
    text: "(Resposta) Não. O estudo da ciência nomotética estuda os fenômenos que se repetem, podendo assim, fazer previsões e descobrir leis gerais que à geram. Como exemplo temos as previsões do tempo. Já a idiográfica, é totalmente o contrário. Estudam os casos únicos que não se repetem, mesmo assim, tem argumentos suficientes para validar o campo do estudo.",
  },
  {
    id: 2,
    text: "(Questão) A ciência também pode ser caracterizada em ciências exatas e ciências inexatas. Dessa maneira, qual a diferença entre elas?",
  },
  {
    id: 2,
    text: "(Resposta) As ciências exatas são aquelas cujos resultados são precisos. Suas leis são altamente preditivas e previsíveis, já as ciências inexatas, são aquelas que podem prever comportamentos gerais de seus fenômenos, mas cujos resultados nem sempre são os esperados.",
  },
  {
    id: 3,
    text: "(Questão) Dissertações e teses em Computação, bem como artigos científicos, ainda são fortemente caracterizados como apresentações técnicas: sistemas, protótipos, frameworks, arquiteturas, modelos, processos, todas essas construções são técnicas e não necessariamente Ciência, explique o por quê.",
  },
  {
    id: 3,
    text: "(Resposta) a Ciência é a busca pelo conhecimento e pelas explicações, mas a técnica não tem por vocação explicar o mundo. Ela é prática e existe para transformar o mundo, não para teorizar sobre ele. É necessário que a informação contida nele explique um pouco mais sobre o porquê das coisas funcionarem como funcionam.",
  },
  {
    id: 4,
    text: "(Questão) O aspecto da ciência básica da Computação é algo difícil, pois a maioria de suas pesquisas são de fácil prática e comprovação. Então diga um exemplo de um estudo que só veio ter aplicações práticas depois de ser desenvolvida:",
  },
  {
    id: 4,
    text: "(Resposta) A teoria do Caos é um ótimo exemplo de uma ciência básica, pois se ela evolui de acordo com fenômenos provocados por ferramentas computacionais. Outros exemplos são os sistemas multiagentes e matemática computacional",
  },
];

const game = {
  data: {
    questionsAndResponses,
    pairsFinished: 0,
    pairsQuantity: 0,
    cardsQuantity: 0,
    cards: [],
  },
  resetGame() {
    this.data = {
      questionsAndResponses,
      pairsFinished: 0,
      pairsQuantity: 0,
      cardsQuantity: 0,
      cards: [],
    };
    titleElement.innerHTML = "Jogo da memória";
    winnerElement.innerHTML = "";

    this.init();
  },
  init() {
    this.data.pairsQuantity = questionsAndResponses.length / 2;
    this.data.cardsQuantity = questionsAndResponses.length;
    this.data.cards = Array(this.data.cardsQuantity);

    const indexesPossibles = [];

    for (let i = 0; i < this.data.cardsQuantity; i++) {
      indexesPossibles.push(i);
    }

    for (const value of this.data.questionsAndResponses) {
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

    if (card.finished || card.disabled) return;

    cardAudio.play();
    this.addClass([card], ["click-rotate"]);

    if (!card.active) {
      const cardsActives = this.data.cards.filter(
        (cardFilter) => cardFilter.active & !cardFilter.finished
      );

      this.addClass([card], ["active"]);
      this.updateCardKeys([card], [true, true]);

      if (cardsActives.length === 1) {
        this.disableAllCards();
        const cardTwo = cardsActives[0];

        if (cardTwo.value.id === card.value.id) {
          this.data.pairsFinished += 1;

          this.updateCardKeys([card, cardTwo], [undefined, undefined, true]);

          setTimeout(() => {
            successAudio.play();

            this.addClass(
              [card],
              ["finished"],
              `${card.value.id} - ${card.value.text}`
            );
            this.addClass(
              [cardTwo],
              ["finished"],
              `${cardTwo.value.id} - ${cardTwo.value.text}`
            );
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
          } else {
            setTimeout(() => {
              this.enableAllCards();
            }, 800);
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
            this.enableAllCards();
          }, 4000);
        }
      }
    } else {
      this.removeClass([card], ["active", "click-rotate"], "?");
      card.active = false;
    }
  },
  disableAllCards() {
    this.updateCardKeys(this.data.cards, [undefined, true, undefined]);
  },
  enableAllCards() {
    this.updateCardKeys(this.data.cards, [undefined, false, undefined]);
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
        cardElements[card.index].innerText = text ? text : card.value.text;
      }
    }
  },
  addClass(cards, classes, text = null) {
    const cardElements = document.querySelectorAll(".card");

    for (const card of cards) {
      for (const className of classes) {
        cardElements[card.index].classList.add(className);
        cardElements[card.index].innerText = text ? text : card.value.text;
      }
    }
  },
  getRandomIndexOfArray(array) {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
  },
};

game.init();
