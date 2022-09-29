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
    text: "<span><strong><em>(Questão)</em></strong> Dentre todas as subáreas qual a mais difícil de se trabalhar e porquê?</span>",
  },
  {
    id: 1,
    text: "<span><strong><em>(Resposta)</em></strong> A pesquisa de design é extremamente difícil por se tratar de uma ideia tão inovadora, e também por possuir o conceito de ter possíveis soluções para problemas ainda não explorados.</span>",
  },
  {
    id: 2,
    text: "<span><strong><em>(Questão)</em></strong> Uma pesquisa bibliográfica é aquela que analisa estudos já feitos com intuito de ampliar o conhecimento, com quais outros tipos de pesquisa ela pode se relacionar?</span>",
  },
  {
    id: 2,
    text: "<span><strong><em>(Resposta)</em></strong> Com uma pesquisa secundária que faz revisões de pesquisas primárias. Com uma pesquisa explicativa que visa abordar um certo assunto, sendo de maneira mais aprofundada.</span>",
  },
  {
    id: 3,
    text: "<span><strong><em>(Questão)</em></strong> As pesquisas ditas por Wazlawick estão classificadas em 3 áreas e 14 subáreas, algum artigo pode estar em duas subdivisões de duas áreas diferentes? Diga um exemplo.</span>",
  },
  {
    id: 3,
    text: "<span><strong><em>(Resposta)</em></strong> Sim. Uma pesquisa bibliográfica da 2° categoria pode muito bem ser uma pesquisa secundária da 1° categoria.</span>",
  },
  {
    id: 4,
    text: "<span><strong><em>(Questão)</em></strong> Correlacione, exemplificando, duas subcategorias dentre as 14.</span>",
  },
  {
    id: 4,
    text: "<span><strong><em>(Resposta)</em></strong> A pesquisa experimental e a pesquisa etnográfica, ambas se tratam de pesquisas que envolvem testes para suas hipóteses e podem fazer parte em conjunto de um artigo científico facilmente.</span>",
  },

  {
    id: 5,
    text: "<span><strong><em>(Questão)</em></strong> O estudo de caso possui duas subdivisões, quais são? Diferencia-as.</span>",
  },
  {
    id: 5,
    text: "<span><strong><em>(Resposta)</em></strong> O estudo de caso exploratório e o estudo de caso confirmatório, a maior diferença entre eles é que o exploratório é muito utilizado para estudar novas áreas e novas ideias, já o confirmatório é para confirmar ideias já formuladas.</span>",
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
      // console.log(card.value.id);
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
              `<div><strong><em>${card.value.id} -</em></strong> ${card.value.text}</div>`
            );
            this.addClass(
              [cardTwo],
              ["finished"],
              `<div><strong><em>${cardTwo.value.id} -</em></strong> ${cardTwo.value.text}`
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
              window.scrollTo({ top: 0, behavior: "smooth" });
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
        cardElements[card.index].innerHTML = text ? text : card.value.text;
      }
    }
  },
  addClass(cards, classes, text = null) {
    const cardElements = document.querySelectorAll(".card");

    for (const card of cards) {
      for (const className of classes) {
        cardElements[card.index].classList.add(className);
        cardElements[card.index].innerHTML = text ? text : card.value.text;
      }
    }
  },
  getRandomIndexOfArray(array) {
    const index = Math.floor(Math.random() * array.length);

    return array[index];
  },
};

game.init();
