import '../../../../../css/pages/games/audition/audition.scss';
import Utils from '../../../../services/Utils';
import Game from '../Game';

const Audition = {
  isGameActive: true,
  currentWordCounter: 0,
  correctAnswers: [],
  wrongAnswers: [],
  startTime: Date.now(),
  data: null,

  settings: {
    model: null,
    wordsInGame: 10,
    difficulty: null,
    round: null,
  },

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },

  render: (model) => {
    Audition.beforeRender();
    Audition.settings.model = model;
    const view = `
    <div class="allGames__playScreen"></div>
    <div class="audition--game allGames">
      <section class="audition--startScreen  allGames__startScreen">
          <h1 class="allGames__heading">Аудиовызов</h1>
          <p class="allGames__description">В этой игре вы улучшите восприятие английской речи на слух. <br>Чем больше слов ты
              знаешь, тем больше очков опыта получишь.</p>
          <div class="allGames__choice">
            <p class="allGames__choice_learn select">Игра с изученными словами</p>
            <p class="allGames__choice_new">Игра с новыми словами</p>
            <div class="allGames__choice_levels hidden">
              <label>Уровень:</label>
              <select name="levels" id="levels">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <label>Раунд:</label>
              <select name="pages" id="pages">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
          <button class="allGames__startBtn  btn">Начать</button>
          <div class="allGames__tip">Используй клавиши 1, 2, 3, 4 и 5 чтобы дать быстрый ответ, Enter для перехода к следующему слову.</div>
      </section>

      <section class="audition__timerScreen  allGames__timerScreen  allGames__timerScreen-hidden">
          <div class="allGames__timer">3</div>
      </section>
    </div>
     `;
    return view;
  },

  getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  setWords(data, correctWord) {
    const wordsList = document.querySelectorAll('.wordsList__word');
    let startPoint = 0;
    if (wordsList.length === 10) {
      startPoint = 5;
    }
    const correctWordPlace = Audition.getRandomInRange(0, 4) + startPoint;
    wordsList[correctWordPlace].innerHTML += correctWord.wordTranslate;
    let wordNum = 0;
    for (let i = startPoint; i < wordsList.length; i += 1) {
      if (i !== correctWordPlace) {
        wordsList[i].innerHTML += data.incorrect[wordNum].wordTranslate;
        wordNum += 1;
      }
    }
  },

  setClassesForWrongWords(correctWord) {
    document.querySelectorAll('.wordsList__word').forEach((element) => {
      if (!element.innerHTML.includes(correctWord)) {
        element.classList.add('wrong');
      }
    });
  },

  setAnswer(wordData) {
    const wordAreas = document.querySelectorAll('.audition--wordScreen');
    let wordArea = document.querySelector('.audition--wordScreen');
    if (wordAreas.length !== 1) {
      [, wordArea] = wordAreas;
    }
    const wordImage = Utils.createBlockInside('img', 'wordScreen__image', '', '', { src: wordData.image });
    wordArea.prepend(wordImage);
    const correctWords = document.querySelectorAll('.wordScreen__word');
    if (correctWords.length !== 1) {
      correctWords[1].innerHTML = wordData.word;
    } else {
      correctWords[0].innerHTML = wordData.word;
    }
  },

  showAnswer() {
    const wordImage = document.querySelectorAll('.wordScreen__image');
    if (wordImage[1] === undefined) {
      document.querySelector('.wordScreen__image').classList.add('show');
      document.querySelector('.wordScreen__speaker').classList.add('show');
      document.querySelector('.wordScreen__word').classList.add('show');
    } else {
      document.querySelectorAll('.wordScreen__image')[1].classList.add('show');
      document.querySelectorAll('.wordScreen__speaker')[1].classList.add('show');
      document.querySelectorAll('.wordScreen__word')[1].classList.add('show');
    }
  },

  generateWordSlideHTML() {
    const gameArea = document.querySelector('.audition--game');
    const wordSlide = `
    <section class="audition--wordScreen hidden">
      <div class="wordScreen__wordArea">
        <div class="wordScreen__speaker"></div>
        <div class="wordScreen__word"></div>
      </div>
      <div class="wordScreen__wordsList">
        <div class="wordsList__word"><span>1.</span></div>
        <div class="wordsList__word"><span>2.</span></div>
        <div class="wordsList__word"><span>3.</span></div>
        <div class="wordsList__word"><span>4.</span></div>
        <div class="wordsList__word"><span>5.</span></div>
      </div>
      <button class="wordScreen__button">Не знаю</button>
    </section>
    `;
    gameArea.innerHTML += wordSlide;
  },

  addStatisticClickHandler() {
    const statScreen = document.querySelector('.audition--statistic');
    const wordsInGame = [...Audition.correctAnswers, ...Audition.wrongAnswers];
    statScreen.addEventListener('click', ({ target }) => {
      if (target.closest('.answer__speaker')) {
        const answer = target.closest('.Answers__answer');
        const word = answer.childNodes[3].firstElementChild.innerText;
        wordsInGame.forEach((element) => {
          if (element.word === word) {
            const wordAudio = new Audio(element.audio);
            wordAudio.play();
          }
        });
      }
    });
  },

  setCorrectAnswers() {
    const correctAnswersPlace = document.querySelectorAll('.statistic__Answers')[0];
    Audition.correctAnswers.forEach((element) => {
      const correctAnswerHTML = `<div class="Answers__answer">
                                  <div class="answer__speaker"></div>
                                  <div class="answer__words"><span>${element.word}</span> — ${element.wordTranslate}</div>
                                </div>`;
      correctAnswersPlace.innerHTML += correctAnswerHTML;
    });
  },

  setWrongAnswers() {
    const wrongAnswersPlace = document.querySelectorAll('.statistic__Answers')[1];
    Audition.wrongAnswers.forEach((element) => {
      const wrongAnswerHTML = `<div class="Answers__answer">
                                <div class="answer__speaker"></div>
                                <div class="answer__words"><span>${element.word}</span> — ${element.wordTranslate}</div>
                              </div>`;
      wrongAnswersPlace.innerHTML += wrongAnswerHTML;
    });
  },

  generateStatisticHTML() {
    const gameArea = document.querySelector('.audition--game');
    const gameTime = new Date(Date.now() - Audition.startTime);
    const numberOfCorrectAnswers = Audition.correctAnswers.length;
    const numberOfWrongAnswers = Audition.wrongAnswers.length;
    const statistic = `
    <section class="audition--statistic hidden">
      <div class="statistic__title">Статистика игры</div>
      <div class="statistic__Answers ${numberOfCorrectAnswers === 0 ? 'less' : ''}">
        <div class="Answers__title_correct">Верных ответов: <div>${numberOfCorrectAnswers}</div></div>
      </div>
      <hr>
      <div class="statistic__Answers ${numberOfWrongAnswers === 0 ? 'less' : ''}">
        <div class="Answers__title_wrong">Неверных ответов: <div>${numberOfWrongAnswers}</div></div>
      </div>
      <hr>
      <div class="statistic__time">Время игры: ${gameTime.getMinutes()}:${gameTime.getSeconds()}</div>
      <a href="/#/games/audition"><button class="statistic__button"">Начать заново</button></a>
      <a href="/"><button class="statistic__button">Перейти на главную страницу</button></a>
      <button class="statistic__button global">Глобальная статистика</button>
    </section>
    `;
    gameArea.innerHTML += statistic;
  },

  async setGlobalStatisticData() {
    const tableBody = document.querySelector('.statTable__body');
    const statistic = await Audition.settings.model.getStatForGame('au');
    let template = '';
    statistic.forEach((elem, num) => {
      template += `
        <tr class="statTable__bodyRow">
          <td class="statTable__bodyData">${num + 1}</td>
          <td class="statTable__bodyData">${elem.y}</td>
          <td class="statTable__bodyData">${elem.n}</td>
          <td class="statTable__bodyData">${elem.d}</td>
        </tr>
      `;
    });
    tableBody.innerHTML = template;
  },

  generateGlobalStatisticHTML() {
    const gameArea = document.querySelector('.audition--game');
    const globalStatistic = `
    <section class="audition--globalStatistic hidden">
      <div class="globalStatistic__title">Статистика игры</div>
      <table class="globalStatistic__statTable">
        <thead class="statTable__head">
          <tr class="statTable__headRow">
          <th class="statTable__headData">№</th>
            <th class="statTable__headData">Верных ответов</th>
            <th class="statTable__headData">Неверных ответов</th>
            <th class="statTable__headData">Дата игры</th>
          </tr>
        </thead>
        <tbody class="statTable__body">

        </tbody>  
      </table>
      <button class="globalStatistic__button">Вернуться назад</button>
    </section>
    `;
    gameArea.innerHTML += globalStatistic;
    Audition.setGlobalStatisticData();
  },

  generateProgressBar() {
    const gameArea = document.querySelector('.audition--game');
    const progressBar = Utils.createBlockInside('section', 'audition--progressBar', '', '', { style: 'width: 0vw;' });
    gameArea.prepend(progressBar);
  },

  changeProgressBar() {
    const progressBar = document.querySelector('.audition--progressBar');
    document.querySelector('.audition--progressBar').style.width = `${Number(progressBar.style.width.slice(0, -2)) + 10}vw`;
  },

  generateNextWordSlide(prevSlide) {
    Audition.generateWordSlideHTML();
    const wordScreens = document.querySelectorAll('.audition--wordScreen');
    if (wordScreens[1] !== undefined) {
      wordScreens[1].classList.remove('hidden');
      wordScreens[0].classList.add('hide');
    } else {
      wordScreens[0].classList.remove('hidden');
    }
    if (prevSlide) setTimeout(() => Utils.removeBlock(prevSlide), 2000);
    const currentWords = Audition.data[Audition.currentWordCounter];
    const correctWord = currentWords.correct;
    Audition.setWords(currentWords, correctWord);
    Audition.setAnswer(correctWord);
    const wordAudio = new Audio(correctWord.audio);
    setTimeout(() => wordAudio.play(), 1000);
    Audition.addGameClickHandler(wordAudio, correctWord);
  },

  async saveGlobalStatistic() {
    const CorrectAnswers = Audition.correctAnswers.length;
    const WrongAnswers = Audition.wrongAnswers.length;
    await Audition.settings.model.saveStatForGame({ name: 'au', y: CorrectAnswers, n: WrongAnswers });
  },

  async stopGame() {
    await Audition.saveGlobalStatistic();
    await Audition.generateStatistic('.audition--wordScreen');
    Utils.removeBlock('.audition--progressBar');
  },

  addStatisticButtonsHandler() {
    const statisticScreen = document.querySelector('.audition--statistic');
    const globalStatisticScreen = document.querySelector('.audition--globalStatistic');
    const statisticButton = document.querySelector('.statistic__button.global');
    const globalStatisticButton = document.querySelector('.globalStatistic__button');
    statisticButton.onclick = () => {
      statisticScreen.classList.toggle('hidden');
      globalStatisticScreen.classList.toggle('hidden');
    };
    globalStatisticButton.onclick = () => {
      statisticScreen.classList.toggle('hidden');
      globalStatisticScreen.classList.toggle('hidden');
    };
  },

  generateStatistic(prevSlide) {
    Audition.generateStatisticHTML();
    Audition.generateGlobalStatisticHTML();
    Audition.addStatisticButtonsHandler();
    Audition.setCorrectAnswers();
    Audition.setWrongAnswers();
    Audition.addStatisticClickHandler();
    const wordScreen = document.querySelector('.audition--wordScreen');
    const statisticScreen = document.querySelector('.audition--statistic');
    statisticScreen.classList.remove('hidden');
    wordScreen.classList.add('hide');
    if (prevSlide) setTimeout(() => Utils.removeBlock(prevSlide), 2000);
  },

  setCorrectWordButton(correctWord) {
    const wordsButtons = document.querySelectorAll('.wordsList__word');
    wordsButtons.forEach((element) => {
      if (element.innerText.includes(correctWord)) element.classList.add('correct');
    });
  },

  addGameClickHandler(wordAudio, correctWord) {
    const wordScreens = document.querySelectorAll('.audition--wordScreen');
    const correctAudio = new Audio('src/audio/correct.mp3');
    const errorAudio = new Audio('src/audio/error.mp3');
    let gameScreen = document.querySelector('.audition--wordScreen');
    let button = document.querySelector('.wordScreen__button');
    if (wordScreens[1] !== undefined) {
      [, gameScreen] = document.querySelectorAll('.audition--wordScreen');
      [, button] = document.querySelectorAll('.wordScreen__button');
    }
    Audition.isGameActive = true;
    document.onkeyup = (event) => {
      if (event.key > 0 && event.key < 6 && Audition.isGameActive) {
        const answers = document.querySelectorAll('.wordsList__word');
        let targetWord = answers[event.key - 1];
        if (answers.length === 10) {
          targetWord = answers[event.key - 1 + 5];
        }
        Audition.setClassesForWrongWords(correctWord.wordTranslate);
        if (targetWord.innerHTML.includes(correctWord.wordTranslate) && Audition.isGameActive) {
          targetWord.innerHTML = targetWord.innerHTML.slice(15);
          targetWord.classList.add('correct');
          Audition.correctAnswers.push(correctWord);
          correctAudio.play();
        } else if (!targetWord.innerHTML.includes(correctWord.wordTranslate)
        && Audition.isGameActive) {
          targetWord.classList.add('checked');
          Audition.wrongAnswers.push(correctWord);
          Audition.setCorrectWordButton(correctWord.wordTranslate);
          errorAudio.play();
        }
        Audition.showAnswer();
        button.innerText = '';
        button.classList.add('correct');
        Audition.isGameActive = false;
        Audition.currentWordCounter += 1;
      }
      if (event.key === 'Enter' && !Audition.isGameActive) {
        if (Audition.currentWordCounter < Audition.settings.wordsInGame) {
          Audition.generateNextWordSlide('.audition--wordScreen');
          Audition.changeProgressBar();
        } else {
          Audition.stopGame();
          document.onkeyup = null;
        }
      }
    };
    gameScreen.addEventListener('click', (event) => {
      if (event.target.closest('.wordScreen__speaker')) {
        wordAudio.play();
      }
      if (event.target.closest('.wordsList__word') && Audition.isGameActive) {
        const targetWord = event.target.closest('.wordsList__word');
        Audition.setClassesForWrongWords(correctWord.wordTranslate);
        if (targetWord.innerHTML.includes(correctWord.wordTranslate) && Audition.isGameActive) {
          targetWord.innerHTML = targetWord.innerHTML.slice(15);
          targetWord.classList.add('correct');
          Audition.correctAnswers.push(correctWord);
          correctAudio.play();
        } else if (!targetWord.innerHTML.includes(correctWord.wordTranslate)
        && Audition.isGameActive) {
          targetWord.classList.add('checked');
          Audition.wrongAnswers.push(correctWord);
          Audition.setCorrectWordButton(correctWord.wordTranslate);
          errorAudio.play();
        }
        Audition.showAnswer();
        button.innerText = '';
        button.classList.add('correct');
        Audition.isGameActive = false;
        Audition.currentWordCounter += 1;
      }
      if (event.target.closest('.wordScreen__button') && !Audition.isGameActive) {
        if (Audition.currentWordCounter < Audition.settings.wordsInGame) {
          Audition.generateNextWordSlide('.audition--wordScreen');
          Audition.changeProgressBar();
        } else {
          Audition.stopGame();
        }
      } else if (event.target.closest('.wordScreen__button') && Audition.isGameActive) {
        Audition.setClassesForWrongWords(correctWord.wordTranslate);
        Audition.showAnswer();
        Utils.clearBlock('.wordScreen__button');
        button.classList.add('correct');
        Audition.isGameActive = false;
        Audition.currentWordCounter += 1;
        Audition.wrongAnswers.push(correctWord);
      }
    });
  },

  afterRender: async () => {
    const startBtn = document.querySelector('.allGames__startBtn');
    startBtn.addEventListener('click', async () => {
      const isNewWords = document.querySelector('.allGames__choice_new').classList.contains('select');

      Audition.settings.difficulty = document.getElementById('levels').value;
      Audition.settings.round = document.getElementById('pages').value;

      if (Audition.settings.difficulty && Audition.settings.round && isNewWords) {
        Audition.data = await Audition.settings.model.getSetOfWordsAndTranslations(
          Audition.settings.difficulty,
          Audition.settings.round - 1,
          Audition.settings.wordsInGame,
          4,
        );
      } else {
        Audition.data = await Audition.settings.model.getSetOfLearnedWordsAndTranslations(
          Audition.settings.wordsInGame, 4,
        );
      }
    });
    Game.initStartScreen();
    Game.startGame(Audition.generateNextWordSlide);
    Audition.generateProgressBar();
  },
};

export default Audition;
