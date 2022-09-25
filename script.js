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
    text: "(Questão) Quais os principais tipos de pesquisas e suas subáreas apontados por Wazlawick, em seu livro Metodologia de Pesquisa para Ciência da Computação?",
  },
  {
    id: 1,
    text: "(Resposta) Pesquisas quanto a sua Natureza: Primária, Secundária e Terciária. Pesquisas quanto a seus Objetivos: Exploratória, Explicativa, Descritiva e de Design. Pesquisas quanto a seus Procedimentos Técnicos: Estudo de Caso, Experimental, de Levantamento, Etnográfica, Pesquisa Ação, Documental e Bibliográfica.",
  },
  {
    id: 2,
    text: "(Questão) Uma pesquisa bibliográfica é aquela que analisa estudos já feitos com intuito de ampliar o conhecimento, com quais outros tipos de pesquisa ela pode se relacionar?",
  },
  {
    id: 2,
    text: "(Resposta) Com uma pesquisa secundária que faz revisões de pesquisas primárias. Com uma pesquisa explicativa que visa abordar um certo assunto, sendo de maneira mais aprofundada.",
  },
  {
    id: 3,
    text: "(Questão) Entre as 14 subdivisões dos tipos de pesquisas, há uma que objetiva principalmente a coleta de dados em campo e a partir disto a elaboração de hipóteses, ideias e talvez testes no campo estudado. Qual essa subdivisão?",
  },
  {
    id: 3,
    text: "(Resposta) A pesquisa Etnográfica tem como sua principal função a coleta de dados em campo e avaliação da utilização destes dados, seja de maneira experimental ou observacional.",
  },
  {
    id: 4,
    text: "(Questão) Diga a diferença entre as pesquisas Primárias, de Levantamento e Experimentais. Defina cada uma delas e diga em que elas se diferem.",
  },
  {
    id: 4,
    text: "(Resposta) Primária: ela partirá do ponto zero, e que seguirá somente por observações ou fenômenos naturais. Levantamento: Podem começar do zero ou de algum ponto mais avançado, elas se constituem de questionamentos para pessoas de um certo âmbito. Experimental: Fará vários testes e partirá de algum embasamento para conseguir definir algum resultado final.",
  },

  {
    id: 5,
    text: "(Questão) Uma pesquisa Terciária pertence a um nicho muito específico dentre os tipos de pesquisa. Com base nessa informação há algum tipo de pesquisa que se relacione com a pesquisa terciária? Se sim  qual?",
  },
  {
    id: 5,
    text: "(Resposta) Sim, A pesquisa descritiva pois esta também parte de uma ampla base de dados para ser formulada, assim ela tende a pesquisa terciária por ambas tratarem muitas vezes de revisões. A pesquisa Documental pode não se ligar diretamente por se tratar de estudos ainda não publicados, mas podem compartilharem dados e ambas serem publicadas juntas.",
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
