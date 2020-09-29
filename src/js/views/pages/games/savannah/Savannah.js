import '../../../../../css/pages/games/allGames.scss';
import '../../../../../css/pages/games/savannah/savannah.scss';

import Utils from '../../../../services/Utils';
import Game from '../Game';

function shuffle(array) {
  const shuffledArray = array.slice();
  shuffledArray.sort(() => Math.random() - 0.5);

  return shuffledArray;
}

const Savannah = {
  model: null,
  gameRoundsCount: 30, // количество слов за всю игру
  wrongTranslationsCount: 3,
  data: null,
  mistakesCount: 0,
  maxMistakesCount: 5,
  correctAnswersCount: 0,
  isAnswerSelected: false,
  correctAnswers: [],
  wrongAnswers: [],

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },

  reformat(wordsArray) {
    return wordsArray.map((words) => {
      const temp = [];
      temp.push(words.correct);
      words.incorrect.forEach((incorrect) => {
        const obj = {
          wordTranslate: incorrect.wordTranslate,
        };
        temp.push(obj);
      });

      return temp;
    });
  },

  removeWords() {
    Utils.removeBlock('.savannah--game__question');
    Utils.removeBlock('.savannah--game__answersList');
  },

  createNewWords(roundIndex) {
    const game = document.querySelector('.savannah--game');
    const words = this.data[roundIndex];

    Utils.createBlockInside('div', ['savannah--game__question', 'savannah--game__question-fall'], game, words[0].word);
    const answersList = Utils.createBlockInside('div', 'savannah--game__answersList', game);

    const shuffledWords = shuffle(words);

    shuffledWords.forEach((item, index) => {
      const dataObj = {
        key: `${index + 1}`,
      };
      if (Object.keys(item).length > 1) {
        Utils.createBlockInside('div', ['savannah--game__answer', 'fl-correct'], answersList, `${index + 1} ${item.wordTranslate}`, {}, dataObj);
      } else {
        Utils.createBlockInside('div', 'savannah--game__answer', answersList, `${index + 1} ${item.wordTranslate}`, {}, dataObj);
      }
    });
  },

  isSoundOn() {
    const soundBtn = document.querySelector('.savannah--sound');
    return !(soundBtn.classList.contains('savannah--sound-off'));
  },

  playAudio(file) {
    const audio = document.querySelector('#savannah-audio');

    if (this.isSoundOn()) {
      audio.setAttribute('src', `src/audio/${file}.mp3`);
      audio.play();
    }
  },

  toggleSound() {
    const soundBtn = document.querySelector('.savannah--sound');

    soundBtn.addEventListener('click', () => {
      soundBtn.classList.toggle('savannah--sound-off');
    });
  },

  zoomFlower() {
    if ((this.correctAnswersCount - 1) % 3 === 0 && this.correctAnswersCount !== 1) {
      const flower = document.querySelector('.savannah--game__flower');
      const currentWidth = Number(getComputedStyle(flower).width.slice(0, -2));
      const currentHeight = Number(getComputedStyle(flower).height.slice(0, -2));

      flower.style.width = `${currentWidth + 10}px`;
      flower.style.height = `${currentHeight + 10}px`;

      if (this.isSoundOn()) {
        const audio = new Audio('src/audio/win.mp3');
        audio.play();
      }
    }
  },

  goToNextRound(roundIndex, delay) {
    return setTimeout(async () => {
      if (roundIndex < (this.gameRoundsCount - 1) && this.mistakesCount < this.maxMistakesCount) {
        this.play(roundIndex + 1);
      } else {
        Utils.removeBlock('.savannah--progressBar');
        Utils.clearBlock('.savannah--controls');
        Utils.clearBlock('.savannah--game');
        this.showStatistics();
        this.clickOnAudioHandler();
        await this.model.saveStatForGame({ name: 'sv', y: this.correctAnswersCount, n: this.mistakesCount });
      }
    }, delay);
  },

  showStatistics() {
    const stat = document.querySelector('.savannah--stat');
    stat.classList.remove('savannah--stat-hidden');

    const mistakesCount = document.querySelector('.savannah--stat__errorsHeading span');
    mistakesCount.textContent = this.mistakesCount;
    const errorList = document.querySelector('.savannah--stat__errors .savannah--stat__list');
    errorList.innerHTML = '';
    this.showAnswersList(errorList, this.wrongAnswers);

    const correctAnswersCount = document.querySelector('.savannah--stat__correctHeading span');
    correctAnswersCount.textContent = this.correctAnswersCount;
    const correctList = document.querySelector('.savannah--stat__correct .savannah--stat__list');
    correctList.innerHTML = '';
    this.showAnswersList(correctList, this.correctAnswers);
  },

  initGlobalStatistics() {
    const globalStat = document.querySelector('.savannah--stat__global');
    const localStat = document.querySelector('.savannah--stat__local');
    const globalStatLink = document.querySelector('.savannah--link-globalStat');

    globalStatLink.addEventListener('click', async () => {
      const stat = await this.model.getStatForGame('sv');

      stat.forEach((item, index) => {
        const table = document.querySelector('.savannah--stat__global table');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.y}</td>
            <td>${item.n}</td>
            <td>${item.d}</td>
        `;

        table.append(row);
      });

      globalStat.classList.remove('savannah--stat__global-hidden');
      localStat.classList.add('savannah--stat__local-hidden');
      globalStatLink.classList.add('savannah--link-hidden');
    });
  },

  clickOnAudioHandler() {
    const answers = document.querySelector('.savannah--stat__answers');
    answers.addEventListener('click', (e) => {
      const audioIcon = e.target.closest('.savannah--stat__audio');

      if (audioIcon) {
        const audio = document.querySelector('#savannah-audio');
        const audoiSrc = audioIcon.getAttribute('data-audio');

        audio.setAttribute('src', audoiSrc);
        audio.play();
      }
    });
  },

  showAnswersList(answersListElement, answersArr) {
    answersArr.forEach((answer) => {
      const div = Utils.createBlockInside('div', 'savannah--stat__audio');
      div.dataset.audio = answer.audio;

      const span = Utils.createBlockInside('span', null, null, `<b>${answer.word}</b> - ${answer.wordTranslate}`);

      const li = document.createElement('li');
      li.classList.add('savannah--stat__listItem');
      li.append(div, span);
      answersListElement.append(li);
    });
  },

  handleCorrectAnswer(correct, roundIndex) {
    const question = document.querySelector('.savannah--game__question');
    question.classList.remove('savannah--game__question-fall');
    correct.classList.add('savannah--game__answer-correct');

    this.correctAnswersCount += 1;
    this.correctAnswers.push(this.data[roundIndex][0]);
    this.isAnswerSelected = true;

    this.zoomFlower();
    this.playAudio('correct');
  },

  handleWrongAnswer(wrong, roundIndex) {
    Utils.clearBlock('.savannah--game__question');
    wrong.classList.add('savannah--game__answer-wrong');

    const correct = document.querySelector('.fl-correct');
    correct.classList.add('savannah--game__answer-correct');

    const stars = document.querySelectorAll('.savannah--stars__item');
    stars[this.mistakesCount].classList.add('savannah--stars__item-lost');

    this.mistakesCount += 1;
    this.wrongAnswers.push(this.data[roundIndex][0]);
    this.isAnswerSelected = true;

    this.playAudio('error');
  },

  clearTimers(timerShowCorrectTranslation, timerChangeRound) {
    clearTimeout(timerShowCorrectTranslation);
    clearTimeout(timerChangeRound);
  },

  checkAnswer(roundIndex) {
    const question = document.querySelector('.savannah--game__question');
    const answersList = document.querySelector('.savannah--game__answersList');

    this.isAnswerSelected = false;

    // при отсутствии ответа
    // показываем правильный перевод, когда кончится анимация (5,5 секунд)
    const timerShowCorrectTranslation = setTimeout(() => {
      const stars = document.querySelectorAll('.savannah--stars__item');
      stars[this.mistakesCount].classList.add('savannah--stars__item-lost');

      this.wrongAnswers.push(this.data[roundIndex][0]);
      this.mistakesCount += 1;
      this.playAudio('error');

      const correct = document.querySelector('.fl-correct');
      correct.classList.add('savannah--game__answer-correct');
      question.classList.add('savannah--game__question-explode');

      this.isAnswerSelected = true;
      this.changeProgressBar();
    }, 5500);

    // смена раунда или конец игры еще через секунду
    const timerChangeRound = this.goToNextRound(roundIndex, 6500);

    answersList.addEventListener('click', ({ target }) => {
      // клик по переводу
      if (target.classList.contains('savannah--game__answer') && !this.isAnswerSelected) {
        // удаляем таймеры, которые используются при отсутвии ответа
        this.clearTimers(timerShowCorrectTranslation, timerChangeRound);

        if (target.classList.contains('fl-correct')) {
          this.handleCorrectAnswer(target, roundIndex);
        } else {
          this.handleWrongAnswer(target, roundIndex);
        }

        this.changeProgressBar();

        // смена раунда или конец игры через секунду
        this.goToNextRound(roundIndex, 1000);
      }
    });

    document.onkeyup = ({ key }) => {
      // только нужные клавиши с 1-4 слушаем
      if ((key === '1' || key === '2' || key === '3' || key === '4') && !this.isAnswerSelected) {
        // удаляем таймеры, которые используются при отсутвии ответа
        this.clearTimers(timerShowCorrectTranslation, timerChangeRound);

        const answers = document.querySelectorAll('.savannah--game__answer');
        const correct = document.querySelector('.fl-correct');
        const translationNumber = correct.getAttribute('data-key');

        if (key === translationNumber) {
          this.handleCorrectAnswer(correct, roundIndex);
        } else {
          this.handleWrongAnswer(answers[key - 1], roundIndex);
        }

        this.changeProgressBar();

        // смена раунда или конец игры
        this.goToNextRound(roundIndex, 1000);
      }
    };
  },

  play(roundIndex) {
    this.removeWords();
    this.createNewWords(roundIndex);
    this.checkAnswer(roundIndex);
  },

  clearGameVariables() {
    this.mistakesCount = 0;
    this.correctAnswersCount = 0;
    this.correctAnswers = [];
    this.wrongAnswers = [];
  },

  changeProgressBar() {
    const progressBar = document.querySelector('.savannah--progressBar');
    progressBar.style.width = `${Number(progressBar.style.width.slice(0, -2)) + 100 / this.gameRoundsCount}vw`;
  },

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  render: async (model) => {
    Savannah.beforeRender();
    Savannah.model = model;

    const view = `
    <div class="savannah  allGames">
        <section class="allGames__startScreen">
            <h1 class="allGames__heading">Саванна</h1>
            <p class="allGames__description">Тренировка Саванна развивает словарный запас.</p>

            <div class="allGames__choice">
                <p class="allGames__choice_learn select">Игра с изученными словами</p>
                <p class="allGames__choice_new">Игра с новыми словами</p>
                <div class="allGames__choice_levels hidden">
                    <label>Уровень:</label>
                    <select name="levels" id="levels">
                    disabled selected
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                    <label>Раунд:</label>
                    <select name="pages" id="pages" size="0">
                        <option value="0">1</option>
                        <option value="1">2</option>
                        <option value="2">3</option>
                        <option value="3">4</option>
                        <option value="4">5</option>
                        <option value="5">6</option>
                        <option value="6">7</option>
                        <option value="7">8</option>
                        <option value="8">9</option>
                        <option value="9">10</option>
                        <option value="10">11</option>
                        <option value="11">12</option>
                        <option value="12">13</option>
                        <option value="13">14</option>
                        <option value="14">15</option>
                        <option value="15">16</option>
                        <option value="16">17</option>
                        <option value="17">18</option>
                        <option value="18">19</option>
                        <option value="19">20</option>
                    </select>
                </div>
            </div>

            <button class="allGames__startBtn">Начать</button>
        </section>

        <section class="allGames__timerScreen  allGames__timerScreen-hidden">
            <div class="allGames__timer">3</div>
            <div class="allGames__tip">Используй клавиши 1, 2, 3 и 4, чтобы дать быстрый ответ</div>
        </section>

        <section class="savannah--playScreen  allGames__playScreen  allGames__playScreen-hidden">
            <div class="savannah--progressBar"></div>
            <div class="savannah--controls">
                <div class="savannah--sound"></div>
                <div class="savannah--stars">
                    <div class="savannah--stars__item"></div>
                    <div class="savannah--stars__item"></div>
                    <div class="savannah--stars__item"></div>
                    <div class="savannah--stars__item"></div>
                    <div class="savannah--stars__item"></div>
                </div>
            </div>
            <div class="savannah--game">
                <div class="savannah--game__question">word</div>
                <div class="savannah--game__answersList">
                    <div class="savannah--game__answer">неправильно</div>
                    <div class="savannah--game__answer">правильно</div>
                    <div class="savannah--game__answer">неправильно</div>
                    <div class="savannah--game__answer">неправильно</div>
                </div>
                <div class="savannah--game__flower"></div>
            </div>

            <div class="savannah--stat  savannah--stat-hidden">
                <div class="savannah--stat__local">
                    <h2 class="savannah--stat__heading">Статистика тренировки</h2>
                    <div class="savannah--stat__answers">
                        <div class="savannah--stat__errors">
                            <h3 class="savannah--stat__errorsHeading">Ошибок: <span>1</span></h3>
                            <ul class="savannah--stat__list">
                                <li class="savannah--stat__listItem">
                                    <div class="savannah--stat__audio"></div>
                                    <span><b>слово</b> - перевод<span>
                                </li>
                                <li class="savannah--stat__listItem">
                                    <div class="savannah--stat__audio"></div>
                                    <span><b>слово</b> - перевод<span>
                                </li>
                            </ul>
                        </div>
                        <div class="savannah--stat__correct">
                            <h3 class="savannah--stat__correctHeading">Знаю: <span>1</span></h3>
                            <ul class="savannah--stat__list">
                                <li class="savannah--stat__listItem">
                                    <div class="savannah--stat__audio"></div>
                                    <span><b>слово</b> - перевод<span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="savannah--stat__global  savannah--stat__global-hidden">
                    <h2 class="savannah--stat__heading">Глобальная статистика</h2>
                    <table>
                        <tr>            
                            <th>#</th>
                            <th>Знаю</th>
                            <th>Ошибок</th>
                            <th>Дата игры</th>
                        </tr>
                    </table>
                </div>

                <button class="savannah--btn  savannah--btn-continue" onclick="document.location.reload()">Играть еще раз</button>
                <a class="savannah--link  savannah--link-globalStat">Смотреть статистику по игре</a>
                <a class="savannah--link" href="/">На главную</a>
            </div>

        </section>

        <audio id="savannah-audio"></audio>
    </div>
    `;

    return view;
  },

  afterRender: async () => {
    Game.initStartScreen();

    const startBtn = document.querySelector('.allGames__startBtn');
    startBtn.addEventListener('click', async () => {
      const isNewWords = document.querySelector('.allGames__choice_new').classList.contains('select');
      const difficulty = document.getElementById('levels').value;
      const round = document.getElementById('pages').value;

      // если выбрана игра с новыми словами
      if (difficulty && round && isNewWords) {
        const data = await Savannah.model.getSetOfWordsAndTranslations(difficulty, round,
          Savannah.gameRoundsCount, Savannah.wrongTranslationsCount);
        Savannah.data = Savannah.reformat(data);
      } else {
        // если изученных слов не хватает для игры, берем слова из раунда 1.0
        const data = (Savannah.model.learnedWordsCounter >= Savannah.gameRoundsCount)
          ? await Savannah.model.getSetOfLearnedWordsAndTranslations(Savannah.gameRoundsCount,
            Savannah.wrongTranslationsCount)
          : await Savannah.model.getSetOfWordsAndTranslations(1, 0, Savannah.gameRoundsCount,
            Savannah.wrongTranslationsCount);

        Savannah.data = Savannah.reformat(data);
      }
    });

    const roundIndex = 0;
    Savannah.toggleSound();
    Savannah.clearGameVariables();
    Game.startGame(() => Savannah.play(roundIndex));
    Savannah.initGlobalStatistics();
  },
};

export default Savannah;
