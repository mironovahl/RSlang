import Utils from '../../../../services/Utils';
import '../../../../../css/pages/games/allGames.scss';
import '../../../../../css/pages/games/speakit/speakit.scss';
import Game from '../Game';
import AppModel from '../../../../model/AppModel';
import View from './helpers/View';
import Common from './helpers/Common';
import Render from './helpers/Render';
import Storage from './helpers/Storage';

const SpeakIt = {

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },


  render: () => {
    SpeakIt.beforeRender();

    const view = `
    
    
    <div class="speak__container allGames">
        
        <div class="allGames__startScreen start">
            <h1 class="allGames__heading">Speak It!</h1>
            <p class="allGames__description">Тренировка произношения слов</p>
            <div class="allGames__choice">
              <p class="allGames__choice_learn select">Игра с изученными словами</p>
              <p class="allGames__choice_new">Игра с новыми словами</p>
              <div class="allGames__choice_levels hidden"></div>
          </div>
          <button class="allGames__startBtn  ">Начать</button>
            
        </div>
        <div class="allGames__timerScreen allGames__timerScreen-hidden">
            <div class="allGames__timer">3</div>
            <div class="allGames__tip">Прослушай слова для повторения и нажми «Начать&#160игру»</div>
        </div>   
        <div class="game allGames__playScreen allGames__playScreen-hidden hidden">
            
            
            <div class="pic__container">
                <div class="pic__image">
                    <img alt="">
                </div>
                <!-- <div class="pic__translate">Cry</div> -->
                <div class="pic__translate"></div>

            </div>
            <div class="words__container">
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>
                <div class="word"></div>

                <!-- <div class="word">
                    <div class="word__icon"></div>
                    <div class="word__block">
                      <div class="word__english">test</div>
                      <div class="word__transcription">[test]</div>
                    </div>
                </div> -->

            </div>
            <div class="buttons__container">
                
                <div class="button button__speak">Начать игру</div>
                <div class="button button__results">Завершить</div>
                <div class="button__startScreen2">К старту</div>
            </div>

        </div>
        <div class="results">
            <h2 class="results__header">Результаты последней игры</h2>
            <div class="results__errors"></div>
            <h3>Произнесённые верно слова</h3>
            <div class="results__words results__correct__words">
                    <!-- <div class="stat__word">
                    <div class="sound__icon" data-audio="files/27_0521.mp3"></div>
                    <div class="text">actually</div>
                    <div class="transcription">[ǽktʃuəli]</div>
                    <div class="translate">на самом деле</div>
                </div> -->
              </div>   
            <h3>Непроизнесенные слова</h3>
            <div class="results__words results__uncorrect__words"></div>
            
            <div class="result__buttons">
                <button class=" button__restart btn">Повторить</button>                
                <button class=" button__next btn">Продолжить</button>
            </div>
                <div class="button__global">Глобальная статистика</div>
                <div class="button__startScreen">К старту</div>
            
        </div>
        <div class="global">
            <div class="global__header">Статистика по всем завершенным играм</div>

            <div class="global__results">
                <table>
                    <tr>
                        <th class = "td__datetime">Дата</th>
                        <th class = "td__words">Верно</th>
                        <th class = "td__errors">Количество ошибок</th>
                    </tr>
                </table>
            </div>
            <div class="global__buttons">
                
                <button class="btn button__stats">Назад к статистике</button>
            </div>
        </div>

    </div>
      `;
    return view;
  },

  afterRender: () => {
    const config = {
      apiMaxPage: 29,
      repoUrl: 'https://raw.githubusercontent.com/dispector/rslang-data/master/',
      pages: ['start', 'game', 'results', 'global'],
      hiddenCssCLass: 'hidden',
    };
    let recognition = null;
    let gameInProcess = false;
    let words = [];
    let wordsArr = [];
    let correctWords = [];
    let level = 0;
    let levels = {};
    let pages = {};
    let corrects = 0;
    let errors = 0;
    let page = 0;
    let mode = 'repeat';

    const correctAudio = new Audio('./src/audio/correct.mp3');
    const errorAudio = new Audio('./src/audio/error.mp3');
    const model = new AppModel();
    const view = new View(config);
    const common = new Common();
    const render = new Render();
    const storage = new Storage();

    const translateContainer = document.querySelector('.pic__translate');
    const levelsContainer = document.querySelector('.allGames__choice_levels');

    async function getRepeatWords() {
      const repeatWords = await model.getSetOfLearnedWords(10);
      words = repeatWords;
      return repeatWords;
    }
    function isGameIsEnd() {
      return corrects === words.length;
    }
    function setLastGame() {
      let lastGame = storage.getData('speakItlevel');
      if (lastGame === null) {
        lastGame = { levels: 0, pages: 0 };
        storage.saveLevelAndPage(0, 0);
      }

      levels.value = Number(lastGame.levels);
      pages.value = Number(lastGame.pages);
      level = lastGame.levels;
      page = lastGame.pages;
    }

    function resetGameCount() { // сбросить счет, остановить игру
      errors = 0;
      corrects = 0;
      wordsArr = words.map((wordObj) => wordObj.word.toLowerCase()); // массив слов игры
      gameInProcess = false;
    }

    function intersection(wordsArr, spaekedWords) {
      const speakedWords = spaekedWords;
      let speakedWord = spaekedWords[0].transcript.toLowerCase();

      speakedWords.forEach((element) => {
        if (wordsArr.includes(element.transcript.toLowerCase())) {
          speakedWord = element.transcript.toLowerCase();
        }
      });

      return speakedWord;
    }

    async function reloadWords() { // загрузить новые слова
      words = await model.getSetOfWordsAndTranslations(Number(level) + 1, page, 10);
      words = words.reduce((accum, currentValue) => [...accum, currentValue.correct], []);
      words = common.shuffleWords(words);
    }

    const statsWordClick = (e) => {
      const target = e.target.closest('.stat__word');
      if (!target) { // если это не слово со звуком
        return;
      }

      const audioIcon = target.querySelector('.sound__icon');
      const { audio } = audioIcon.dataset;
      common.playSound(audio);
    };

    const results = () => { // страница "Результаты"
      storage.saveGame(errors, correctWords);
      view.showPage('results');
      gameInProcess = false;
      recognition.onsoundstart = null;
      if (recognition) {
        recognition.removeEventListener('end', recognition.start);
        recognition.stop();
      }
      render.results(words, errors);
    };
    async function game(wordsArray = null) { // страница "Игра"
      if (wordsArray === null) { // если не переданы слова, получить новые
        setLastGame();
        if (mode === 'repeat') { await getRepeatWords(); } else { await reloadWords(); }
      }
      const resultsButton = document.querySelector('.button__results');
      resultsButton.style.display = 'none';
      await view.showPage('game');
      resetGameCount();
      common.resetSpeak();
      render.clearWords();
      render.words(words);
    }


    const restart = () => { // сброс игры
      game(words);
    };

    const next = async () => {
      if (mode === 'level') {
        if (page < 59) storage.saveLevelAndPage(level, Number(page) + 1);
        else if (Number(level) === 5) storage.saveLevelAndPage(0, 0);
        else storage.saveLevelAndPage(Number(level) + 1, 0);
      }
      game();
    };

    const speak = () => { // начать игру о распознаванию слов
      if (gameInProcess === true) {
        return;
      }
      // сбросить игру

      const speakButton = document.querySelector('.button__speak');
      speakButton.classList.add('activated');
      const resultsButton = document.querySelector('.button__results');
      resultsButton.style.display = 'block';
      translateContainer.style.width = '';
      translateContainer.textContent = 'Можешь произносить слова в произвольном порядке';
      gameInProcess = true;
      correctWords = [];

      const wordsContainer = document.querySelector('.words__container');
      const wordsDivs = document.querySelectorAll('.words__container .word');
      const imgContainer = document.querySelector('.pic__image img');

      wordsDivs.forEach((wordDiv) => wordDiv.classList.remove('pushed'));
      wordsDivs.forEach((wordDiv) => wordDiv.classList.remove('correct'));

      recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 5;
      recognition.onsoundstart = () => {
        translateContainer.classList.remove('translation-correct');
        translateContainer.classList.remove('translation-error');
        view.showLoader(translateContainer);
      };

      recognition.addEventListener('result', (event) => {
        if (gameInProcess === true) {
          const spaekedWords = Array.from(event.results[0]);
          const speakedWord = intersection(wordsArr, spaekedWords);
          if (!correctWords.includes(speakedWord)) {
            translateContainer.classList.remove('translation-correct');
            translateContainer.classList.remove('translation-error');
            translateContainer.innerText = speakedWord;

            if (wordsArr.includes(speakedWord)) {
              const speakedWordDiv = wordsContainer.querySelector(`[data-word='${speakedWord}']`);
              correctWords.push(speakedWord);
              speakedWordDiv.classList.add('correct');
              translateContainer.classList.add('translation-correct');
              const { image } = words.filter((e) => e.word.toLowerCase() === speakedWord)[0];
              correctAudio.play();
              imgContainer.src = image;
              corrects += 1;
              if (isGameIsEnd()) {
                //               storage.saveGame(errors, wordsArr);
                results();
              }
            } else {
              errorAudio.play();
              errors += 1;
              translateContainer.classList.add('translation-error');
            }
          }
        }
      });
      recognition.addEventListener('end', recognition.start);
      recognition.start();
    };

    const startButtonClick = async () => { // обработчик нажатия на "Start"
      translateContainer.style.width = 'auto';
      if (mode === 'repeat') {
        words = await getRepeatWords();
        if (words.length < 10) {
          words = null;
          mode = 'level';
          await game();
          translateContainer.innerHTML = 'Недостаточно слов для повторения, игра идёт с новыми словами';
        } else {
          await game(words);
          translateContainer.innerHTML = 'Нажми на любое слово, чтобы прослушать его произношение. <br> Когда будешь готов произнести слова, нажми «Начать&#160игру»';
        }
      } else {
        await game();
        translateContainer.innerHTML = 'Нажми на любое слово, чтобы прослушать его произношение. <br> Когда будешь готов произнести слова, нажми «Начать&#160игру»';
      }
    };

    function globalStats() {
      view.showPage('global');
      render.clearGlobalResults();
      render.globalResults();
    }

    const setPlayMod = (e) => {
      const repeatTarget = document.querySelector('.allGames__choice_learn');
      const learnTarget = document.querySelector('.allGames__choice_new');
      if (e.target.closest('.allGames__choice_learn')) {
        mode = 'repeat';
        repeatTarget.classList.add('select');
        learnTarget.classList.remove('select');
        levelsContainer.classList.add('hidden');
      }
      if (e.target.closest('.allGames__choice_new')) {
        mode = 'level';
        levelsContainer.classList.remove('hidden');
        repeatTarget.classList.remove('select');
        learnTarget.classList.add('select');
      }
    };

    function setImage(image) { // установить картинку
      const imgContainer = document.querySelector('.pic__image img');
      imgContainer.src = image;
    }

    function setTranslate(wordObj) { // получить перевод слова и вставить его на страницу
      translateContainer.innerText = wordObj.wordTranslate;
    }

    function processWord(wordObj) { // вставить картинку, слово, проиграть звук
      const { image } = wordObj;
      const { audio } = wordObj;
      setImage(image);
      setTranslate(wordObj);
      common.playSound(audio);
    }
    const wordClick = (e) => { // обработчик нажатия на слово
      const target = e.target.closest('.word');
      if (!target) { // если это не контейнер со словом
        return;
      }
      if (gameInProcess === true) { // если игра запущена
        return;
      }

      const wordsCl = document.querySelectorAll('.words__container .word');
      wordsCl.forEach((word) => word.classList.remove('pushed'));
      target.classList.add('pushed');
      const pushedWord = target.dataset.word.toLowerCase();
      const pushedWordData = words.find((wordObj) => wordObj.word.toLowerCase() === pushedWord);
      processWord(pushedWordData);
    };

    function createLevels() {
      levels = document.createElement('select');
      levels.name = 'levels';
      levels.id = 'levels';
      const levelsLable = document.createElement('label');
      levelsLable.textContent = 'Уровень: ';
      levelsLable.for = 'levels';
      for (let i = 0; i < 6; i += 1) {
        const lev = document.createElement('option');
        lev.value = i;
        lev.innerHTML = i + 1;
        levels.append(lev);
      }
      levelsContainer.append(levelsLable);
      levelsContainer.append(levels);

      pages = document.createElement('select');
      pages.name = 'pages';
      for (let i = 0; i < 60; i += 1) {
        const pag = document.createElement('option');
        pag.value = i;
        pag.innerHTML = i + 1;
        pages.append(pag);
      }
      pages.id = 'pages';
      const pagesLable = document.createElement('label');
      pagesLable.textContent = ' Раунд: ';
      pagesLable.for = 'pages';
      levelsContainer.append(pagesLable);
      levelsContainer.append(pages);
      setLastGame();
      pages.onchange = () => storage.saveLevelAndPage(levels.value, pages.value);
      levels.onchange = () => storage.saveLevelAndPage(levels.value, pages.value);
    }
    function startScreen() {
      document.querySelector('.allGames__startScreen-hidden').classList.remove('allGames__startScreen-hidden');
      document.querySelector('.allGames__playScreen').classList.add('allGames__playScreen-hidden');
      document.querySelector('.allGames__timer').textContent = 3;

      if (recognition) {
        recognition.removeEventListener('end', recognition.start);
        recognition.stop();
      }
      view.showPage('start');
      if (recognition) recognition.onsoundstart = null;
    }
    function addListeners() { // повесить слушатели событий
      // нажатие на "Старт"
      const startButton = document.querySelector('.allGames__startBtn');
      startButton.addEventListener('click', startButtonClick);


      const startScreenButton = document.querySelector('.button__startScreen');
      startScreenButton.addEventListener('click', startScreen);
      const startScreenButton2 = document.querySelector('.button__startScreen2');
      startScreenButton2.addEventListener('click', startScreen);

      const choicePlayMode = document.querySelector('.allGames__choice');
      choicePlayMode.addEventListener('click', setPlayMod);

      // клик по слову
      const wordsContainer = document.querySelector('.words__container');
      wordsContainer.addEventListener('click', wordClick);

      // клик по кнопке "Speak" (начать запись)
      const speakButton = document.querySelector('.button__speak');
      speakButton.addEventListener('click', speak);

      // клик по кнопке "Restart" в игре (сброс)
      const restartButton = document.querySelector('.button__restart');
      restartButton.addEventListener('click', restart);

      // клик по кнопке "Results" в игре (показать статистику)
      const resultsButton = document.querySelector('.button__results');
      resultsButton.addEventListener('click', results);

      // статистика
      const statsResultButtons = document.querySelector('.result__buttons');

      const statsRestartButton = statsResultButtons.querySelector('.button__restart');
      statsRestartButton.addEventListener('click', restart);

      // клик по кнопке "Results" в игре (показать статистику)
      const statsRepeatButton = statsResultButtons.querySelector('.button__next');
      statsRepeatButton.addEventListener('click', next);

      // проиграть произношение слова на статистике
      const statWordsContainer = document.querySelector('.results');
      statWordsContainer.addEventListener('click', statsWordClick);

      // показать глобальную статистику приложения
      const globalStatsButton = document.querySelector('.button__global');
      globalStatsButton.addEventListener('click', globalStats);

      // вернуться из глобальной статистики к статистике последней игры
      const globalStatsButtonBack = document.querySelector('.global__buttons .button__stats');
      globalStatsButtonBack.addEventListener('click', results);
    }

    Game.startGame();
    addListeners();
    view.showPage('start');
    createLevels();
  },
};

export default SpeakIt;
