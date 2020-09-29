import '../../../../../css/pages/games/english-puzzle/english-puzzle.scss';
import '../../../../../css/pages/games/allGames.scss';
import Utils from '../../../../services/Utils';
import Model from './helpers/Model';
import WordsHelper from './helpers/WordsHelper';
import HtmlHelper from './helpers/HtmlHelper';
import ArrayHelper from './helpers/ArrayHelper';
import View from './helpers/View';
import Config from './settings/gameConfig';
import Game from '../Game';

const EnglishPuzzle = {

  settings: {
    game: {}, /** { level, page, round } */
    gameMode: null, // new (новые слова) / learn (изученные слова)
    tips: {}, /** { autosound, translate, audio, picture } */
    words: [
      /** allWords: [ {id, group, page, word, translate, textExample, textExampleTranslate ...}]  */
      /** solvedWords: [] - слова (предложения), которые пользователь уже угадал */
      /** currentWord: {} - слово (предложение) текущего раунда */
      /** shuffledCurrentWord: [] - слова текущего предложения в случайном порядке */
    ],
    localStat: { // статистика для хранения данных текущего раунда
      knowWords: [],
      idkWords: [],
    },
    results: { // результат для вывода на странице результатов
      knowWords: [],
      idkWords: [],
    },
    picture: {}, /** {author, imageSrc, name, year, id, cut } */
    taskPictureConfig: [],
  },

  appModel: null, // модель для общения с бэкендом

  beforeRender: async () => {
    // localStorage.clear();
    EnglishPuzzle.clearHeaderAndFooter();
  },

  /** обновить данные игры (слова, подсказки, текущий раунд/уровень) данными из LocalStorage */
  updateGameData: async () => {
    const userSettings = await Model.getUserSettings();

    EnglishPuzzle.settings.game = userSettings.progress;
    EnglishPuzzle.settings.tips = userSettings.tips;
    EnglishPuzzle.settings.localStat = userSettings.localStat;

    const { game: gameSettings } = EnglishPuzzle.settings;

    const { gameMode } = EnglishPuzzle.settings;

    const isGameWithNewWords = (gameMode === Config.general.modes.new);

    const words = isGameWithNewWords
      // ? await Model.getWordsFromBackend(gameSettings.level, gameSettings.page)
      ? await EnglishPuzzle.appModel.getSetOfWordsCustomLength(
        gameSettings.level,
        gameSettings.page,
        Config.general.wordsPerPage,
        Config.general.wordsPerSentenceLTE,
      )
      : await EnglishPuzzle.appModel.getSetOfLearnedWords(10);

    const allWords = WordsHelper.correctWords(words);
    const solvedWords = WordsHelper.getSolvedBySettings(allWords, gameSettings.round);
    const currentWord = WordsHelper.getCurrentBySettings(allWords, gameSettings.round);
    const shuffledCurrentWord = WordsHelper.shuffleCurrent(currentWord);

    EnglishPuzzle.settings.words = {
      allWords,
      solvedWords,
      currentWord,
      shuffledCurrentWord,
    };

    // если режим "Новые слова", level и page для картины берутся из настроек приложения,
    // если режим "Изученные слова", level и page для картины генерируются случайно
    const picLev = isGameWithNewWords
      ? gameSettings.level
      : Math.floor(Math.random() * (Config.general.maxLevels));

    const picPage = isGameWithNewWords
      ? gameSettings.page
      : Math.floor(Math.random() * (Config.general.maxPages));

    const pictureObj = await Model.getPictureInfoFromGithub(picLev, picPage);
    EnglishPuzzle.settings.picture = pictureObj;
  },


  clearHeaderAndFooter: () => {
    Utils.clearBlock(Config.containers.header);
    Utils.clearBlock(Config.containers.footer);
  },

  render: async (appModel) => {
    EnglishPuzzle.beforeRender();
    EnglishPuzzle.appModel = appModel;
    const view = View.getHtml();
    return view;
  },

  afterRender: () => {
    EnglishPuzzle.loadStart();
  },

  /** загрузить стартовую страницу */
  loadStart() {
    EnglishPuzzle.loadPage('start');
    EnglishPuzzle.fillStartScreen();
    EnglishPuzzle.addListenersToStart();

    Game.initStartScreen();
    Game.startGame(() => EnglishPuzzle.loadGame());
  },

  /** загрузить страницу с игрой */
  loadGame() {
    EnglishPuzzle.loadPage('game');
    EnglishPuzzle.fillGamePage();
    EnglishPuzzle.addListeners();
  },

  /** загрузить страницу с картиной */
  loadPicture() {
    EnglishPuzzle.loadPage('picture');
    EnglishPuzzle.fillPictureInfo();
    EnglishPuzzle.addListenersToPicture();
  },

  /** загрузить страницу с результатами */
  loadResults() {
    EnglishPuzzle.loadPage('results');
    EnglishPuzzle.fillResults();
    EnglishPuzzle.addListenersToResults();
  },

  /** загрузить страницу со статистикой со всеми играми */
  loadStats() {
    EnglishPuzzle.loadPage('stats');
    EnglishPuzzle.fillStats();
    EnglishPuzzle.addListenersToStats();
  },

  /** отобразить нужную страницу, скрыть остальные */
  loadPage(pageName) {
    HtmlHelper.clearAndHideAll();
    HtmlHelper.showPage(Config.containers[Config.pages[pageName]]);
  },

  /** склонировать стартовый экран, заполнить меню, поставить начальное знач таймеру */
  fillStartScreen() {
    EnglishPuzzle.cloneStartScreen();
    EnglishPuzzle.fillStartMenus();
    EnglishPuzzle.fillTimer();
  },

  /** костыль, чтобы снять слушатель событий клика, который ускоряет таймер каждый раз */
  cloneStartScreen() {
    const oldStartScreen = document.querySelector(Config.containers.startScreen);
    const newStartScrene = oldStartScreen.cloneNode(true);
    oldStartScreen.parentNode.replaceChild(newStartScrene, oldStartScreen);
  },

  fillTimer() {
    const timerContainer = document.querySelector(Config.containers.timer);
    timerContainer.innerHTML = Config.general.timerSeconds;
  },

  /** заполнить меню на стартовой странице */
  fillStartMenus() {
    EnglishPuzzle.fillStartMenu('level');
    EnglishPuzzle.fillStartMenu('page');
  },

  /** заполнить меню уровней/страниц на стартовом экране значениями */
  fillStartMenu(menuKey) {
    const menuContainer = document.getElementById(Config.containers.start.menus.ids[menuKey]);

    const menuValues = [...Array(Config.general.max[menuKey])];
    menuValues.forEach((value, i) => {
      Utils.createBlockInside('option', '', menuContainer, i + 1, { value: i + 1 });
    });
    menuContainer.value = (this.settings.game[menuKey] || 0) + 1;
  },

  /** повесить слушатели на нажатие кнопки "Start" и выбор уровня */
  addListenersToStart() {
    const startButton = document.querySelector(Config.startButtons.start);
    startButton.addEventListener('click', EnglishPuzzle.processStartClick);
  },

  /** нажатие на кнопку "Start" на стартовом экране */
  processStartClick: async () => {
    const gameMode = EnglishPuzzle.getGameMode();
    EnglishPuzzle.settings.gameMode = gameMode;

    const { level, page } = EnglishPuzzle.getStartLevelPage();

    const newGameSettings = {
      level,
      page,
      round: 0,
    };

    const newGameStats = {
      knowWords: [],
      idkWords: [],
    };

    Model.saveProgress(newGameSettings);
    Model.saveStats(newGameStats);

    EnglishPuzzle.updateGameData();
  },

  /** получить режим игры - "Новые слова" / "Изученные слова" */
  getGameMode() {
    const learnContainer = document.querySelector(Config.containers.learnMode);
    return learnContainer.classList.contains(Config.cssStyles.modeSelected)
      ? Config.general.modes.learn
      : Config.general.modes.new;
  },

  /** получить значения уровня и страницы из селектов на стартовом экране */
  getStartLevelPage() {
    const levelSelect = document.getElementById(Config.containers.start.menus.ids.level);
    const pageSelect = document.getElementById(Config.containers.start.menus.ids.page);

    return {
      level: (parseInt((levelSelect.value || 1), 10) - 1),
      page: (parseInt((pageSelect.value || 1), 10) - 1),
    };
  },

  /** заполнить страницу */
  fillGamePage() {
    EnglishPuzzle.fillDonePhrases();
    EnglishPuzzle.fillRoundPhrase();
    EnglishPuzzle.fillTaskPhrase();
    EnglishPuzzle.fillTaskPictureConfig();
    EnglishPuzzle.setButtons();
    EnglishPuzzle.setTips();
    EnglishPuzzle.setBlocksByTips();
  },

  /** установить начальную видимость кнопок */
  setButtons() {
    const buttonsContainer = document.querySelector(Config.containers.gameButtons);
    const idkButton = buttonsContainer.querySelector(Config.buttons.idkButton);
    const checkButton = buttonsContainer.querySelector(Config.buttons.checkButton);
    const contButton = buttonsContainer.querySelector(Config.buttons.contButton);
    const resButton = buttonsContainer.querySelector(Config.buttons.resButton);

    // кнопка "I dont know" на старте должна быть видна всегда
    if (idkButton.classList.contains(Config.cssStyles.hidden)) {
      idkButton.classList.remove(Config.cssStyles.hidden);
    }

    const hideButtonsArr = [checkButton, contButton, resButton];
    hideButtonsArr.forEach((button) => button.classList.add(Config.cssStyles.hidden));
  },

  /** установить видимость подсказок (начальный конфиг с подсказками) */
  setTips() {
    const tipsButtons = document.querySelectorAll(Config.containers.tipsAll);
    const { tips } = this.settings;

    tipsButtons.forEach((tip) => {
      const tipData = tip.dataset.tip;
      if (tips[tipData]) {
        tip.classList.add(Config.cssStyles.tipPushed);
      }
    });
  },

  /** отобразить перевод и возможность озвучивания на основании конфига подсказок */
  setBlocksByTips() {
    const { tips, words } = this.settings;
    const translationContainer = document.querySelector(Config.containers.translation);
    const audioIconBlock = document.querySelector(Config.containers.audioIcon);
    const taskPhraseContainer = Array.from(document.querySelectorAll(`${Config.containers.taskPhrase} .task__word`));
    const roundPhraseContainer = Array.from(document.querySelectorAll(`${Config.containers.roundPhrase} ${Config.containers.roundWordsAll}`));

    translationContainer.innerHTML = (tips.translate)
      ? words.currentWord.textExampleTranslate : '';

    if (tips.audio) {
      audioIconBlock.classList.remove(Config.cssStyles.soundIconDisabled);
    } else {
      audioIconBlock.classList.add(Config.cssStyles.soundIconDisabled);
    }

    if (tips.picture) { // если включена подсказка "Картина"
      // показать картины на всех НЕПУСТЫХ словах в блоке перемешанных
      taskPhraseContainer.forEach((taskWord, i) => {
        if (taskWord.classList.contains('empty')) {
          return;
        }
        const taskWordConfig = EnglishPuzzle.settings.taskPictureConfig[i];
        HtmlHelper.showBgImageByConfig(taskWord, taskWordConfig);
      });

      // показать картины на всех НЕПУСТЫХ словах в поле сбора
      roundPhraseContainer.forEach((roundWord) => {
        if (roundWord.classList.contains('empty')) {
          return;
        }
        const order = roundWord.dataset.orderTask;
        const picImg = EnglishPuzzle.settings.taskPictureConfig[order - 1];
        HtmlHelper.showBgImageByConfig(roundWord, picImg);
      });
    } else { // если отключена, убрать все картины из поля сбора и из поля перемешанных
      taskPhraseContainer.forEach((taskWord) => HtmlHelper.deleteBgImage(taskWord));
      roundPhraseContainer.forEach((roundWord) => HtmlHelper.deleteBgImage(roundWord));
    }
  },

  /** наполнить поле с выполненными фразами */
  fillDonePhrases() {
    const donePhrasesContainer = document.querySelector(Config.containers.donePhrases);
    const donePhrases = this.settings.words.solvedWords;

    donePhrases.forEach((phrase, i) => {
      const phraseBlock = Utils.createBlockInside('div', 'englishPuzzle__phrase');
      Utils.createBlockInside('div', 'phrase__number', phraseBlock, i + 1);
      const phraseWordsBlock = Utils.createBlockInside('div', 'phrase__words', phraseBlock, '', {}, {}, {
        backgroundImage: `url('${Config.api.githubPicturesData}${EnglishPuzzle.settings.picture.imageSrc}')`,
        backgroundPosition: `0px ${Config.general.pictureOffset - 40 * i}px`,
      });

      const wordsArr = phrase.textExample.split(' ');
      wordsArr.forEach((word) => Utils
        .createBlockInside('div', 'phrase__word', phraseWordsBlock, word));
      donePhrasesContainer.append(phraseBlock);
    });
  },

  /** наполнить поле для текущего раунда - номер раунда + пустые слова для сбора фразы */
  fillRoundPhrase() {
    const wordsInRound = this.settings.words.shuffledCurrentWord.length;
    const doneRounds = this.settings.words.solvedWords.length;
    const roundPhrases = [...Array(wordsInRound)];

    const roundPhraseContainer = document.querySelector(Config.containers.roundPhrase);
    const roundPhraseInnerContainer = Utils.createBlockInside('div', 'englishPuzzle__phrase', roundPhraseContainer);
    Utils.createBlockInside('div', ['phrase__number', 'phrase__number-current'], roundPhraseInnerContainer, doneRounds + 1);
    const currentPhraseContainer = Utils.createBlockInside('div', 'phrase__words', roundPhraseInnerContainer);

    roundPhrases.forEach(() => {
      Utils.createBlockInside('div', ['phrase__word', 'empty'], currentPhraseContainer);
    });
  },

  /** наполнить поле с заданием (для перемешанных слов) */
  fillTaskPhrase() {
    const { shuffledCurrentWord } = this.settings.words;
    const taskPhraseContainer = document.querySelector(Config.containers.taskPhrase);
    shuffledCurrentWord.forEach((word) => {
      Utils
        .createBlockInside('div', 'task__word', taskPhraseContainer, word.text, { draggable: true }, { orderTask: word.order + 1 });
    });
  },

  /** конфиг для позиционирования куска картины на каждом паззле */
  fillTaskPictureConfig() {
    const { currentWord, solvedWords } = EnglishPuzzle.settings.words;

    const roundWord = currentWord.textExample;
    const roundWordArr = roundWord.split(' ');
    // массив со словами в правильном порядке и их позицией
    const roundWordArrWithPos = roundWordArr.map((el, i) => ({ word: el, pos: i + 1 }));

    const verticalPos = solvedWords.length;

    const taskPhraseContainer = Array.from(document.querySelectorAll(`${Config.containers.taskPhrase} .task__word`));
    /** массив объектов с данными об элементах в поле с заданием */
    const taskArr = taskPhraseContainer.map((word) => {
      const newEl = {
        element: word,
        text: word.innerHTML,
        wid: word.offsetWidth,
        corPos: roundWordArrWithPos.find((el) => el.word === word.innerHTML).pos,
        bgImg: null,
        bgPos: null,
      };
      // находим элемент с индексом в массиве слов с индексами и удаляем его, чтобы избежать дублей
      const foundElIndex = roundWordArrWithPos.findIndex((el) => el.pos === newEl.corPos);
      roundWordArrWithPos.splice(foundElIndex, 1);

      return newEl;
    });

    /** массив объектов со словами в ВЕРНОМ порядке */
    const sortedArr = taskArr.slice().sort((a, b) => a.corPos - b.corPos);

    taskArr.forEach((word) => {
      const copyWord = word;
      let prevWid = 0; // смещение в пикселях каждого блока с паззлом относительно ВЕРНОГО
      const arrBefore = sortedArr.slice(0, word.corPos - 1);
      arrBefore.forEach((el) => {
        prevWid += el.wid;
        return true;
      });
      copyWord.bgImg = `url('${Config.api.githubPicturesData}${EnglishPuzzle.settings.picture.imageSrc}')`;
      copyWord.bgPos = `-${prevWid}px ${Config.general.pictureOffset - 40 * verticalPos}px`;
    });

    EnglishPuzzle.settings.taskPictureConfig = taskArr;
  },

  /** наполнить контейнер информацией о картине */
  fillPictureInfo() {
    const pictureContainer = document.querySelector(Config.containers.picture);
    const pictureImg = pictureContainer.querySelector(Config.containers.pictureImg);
    const pictureDesc = pictureContainer.querySelector(Config.containers.pictureDesc);

    const { picture } = EnglishPuzzle.settings;
    pictureImg.style.backgroundImage = `url('${Config.api.githubPicturesData}${picture.imageSrc}')`;
    pictureDesc.innerHTML = HtmlHelper.beautifyAuthorText(picture);
  },

  /** повесить слушатели событий */
  addListeners() {
    const taskWordsContainer = document.querySelector(Config.containers.taskPhrase);

    // drag and drop - разрешить drop в контейнер с перемешанными словами
    taskWordsContainer.addEventListener('dragover', this.processDragOverTask);
    taskWordsContainer.addEventListener('dragenter', this.processDragEnterTask);

    // drag and drop - действия на начале перетаскивания из task, попытке дропа в task
    taskWordsContainer.addEventListener('dragstart', this.processDragStartTaskWord);
    taskWordsContainer.addEventListener('dragend', this.processDragEndTaskWord);
    taskWordsContainer.addEventListener('drop', this.processDropToTask);

    // click
    taskWordsContainer.addEventListener('click', this.processTaskWordClick);

    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    // drag and drop - разрешить drop в контейнер для сбора слов
    roundWordsContainer.addEventListener('dragover', this.processDragOverRound);
    roundWordsContainer.addEventListener('dragenter', this.processDragEnterRound);

    // drag and drop - действия на начале перетаскивания из round, попытке дропа в round
    roundWordsContainer.addEventListener('dragstart', this.processDragStartRoundWord);
    roundWordsContainer.addEventListener('dragend', this.processDragEndRoundWord);
    roundWordsContainer.addEventListener('drop', this.processDropToRound);

    // click
    roundWordsContainer.addEventListener('click', this.processRoundWordClick);

    const buttonsContainer = document.querySelector(Config.containers.gameButtons);
    const idkButton = buttonsContainer.querySelector(Config.buttons.idkButton);
    const checkButton = buttonsContainer.querySelector(Config.buttons.checkButton);
    const contButton = buttonsContainer.querySelector(Config.buttons.contButton);

    idkButton.addEventListener('click', this.processIdkClick);
    checkButton.addEventListener('click', this.processCheckClick);
    contButton.addEventListener('click', this.processContClick);

    const tipsContainer = document.querySelector(Config.containers.tips);
    tipsContainer.addEventListener('click', this.processTipClick);

    const soundIconBlock = document.querySelector(Config.containers.audioIcon);
    soundIconBlock.addEventListener('click', this.processSoundClick);
  },

  /** удалить все слушатели событий
   * листенеры автоматически удаляются при удалении эл-та и отсутствии ссылок, но...
  */
  removeListeners() {
    const taskWordsContainer = document.querySelector(Config.containers.taskPhrase);
    taskWordsContainer.removeEventListener('click', this.processTaskWordClick);

    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    roundWordsContainer.removeEventListener('click', this.processRoundWordClick);

    const buttonsContainer = document.querySelector(Config.containers.gameButtons);
    const idkButton = buttonsContainer.querySelector(Config.buttons.idkButton);
    const checkButton = buttonsContainer.querySelector(Config.buttons.checkButton);
    const contButton = buttonsContainer.querySelector(Config.buttons.contButton);

    idkButton.removeEventListener('click', this.processIdkClick);
    checkButton.removeEventListener('click', this.processCheckClick);
    contButton.removeEventListener('click', this.processContClick);

    const tipsContainer = document.querySelector(Config.containers.tips);
    tipsContainer.removeEventListener('click', this.processTipClick);

    const soundIconBlock = document.querySelector(Config.containers.audioIcon);
    soundIconBlock.removeEventListener('click', this.processSoundClick);
  },

  /**
   * обработка drop'а в контейнер раунда - из task или внутри round
   * @param {Event} event - объект события (event.target - НА КАКОЙ блок происходит drop)
   * */
  processDropToRound: (event) => {
    EnglishPuzzle.deleteHighlightAreas();
    const underElement = event.target;

    let order = 0;
    let draggedEl = null; // перетаскиваемый элемент
    const textParam = event.dataTransfer.getData('text');

    /** для того, чтобы определить, из какого контейнера перетаскивается эл-т
     *  используется "флаг" @@ в параметре 'text' перетаскиваемого эл-та:
     * - если эл-т тянется из round, у него есть @@ - формат "order@@word"
     * - если из task, то нет - формат "order"
    */
    if (textParam.includes('@@')) { // эл-т тянется из round (перенос внутри строки)
      const textParamArr = textParam.split('@@');
      [order] = textParamArr;
      // order = textParamArr[0];
      draggedEl = document.querySelector(`${Config.containers.roundPhraseWords} .phrase__word[data-order-task="${order}"]`);
      if (!draggedEl) {
        return;
      }
      EnglishPuzzle.dropToSpecElement(draggedEl, underElement, true);
    } else { // элемент тянется из task
      try { // на случай глюка, когда выбраны и тянутся несколько элементов
        order = textParam;
        draggedEl = document.querySelector(`${Config.containers.taskPhrase} .task__word[data-order-task="${order}"]`);
        // console.log('dragged element from task', draggedEl);
        if (!draggedEl) {
          return;
        }
        EnglishPuzzle.dropToSpecElement(draggedEl, underElement);
      } catch (error) {
        // console.log('error while drop to round', error);
      }
    }
  },

  /**
   * drop элемента на другой элемент (пустой или нет)
   *
   * @param {HTMLElement} dragEl - элемент, который юзер тянет
   * @param {HTMLElement} dropEl - элемент, на который юзер опускает dragEl
   * @param {boolean} isNeedUpdate - true, если элемент тянется ВНУТРИ строки round
   * */
  dropToSpecElement(dragEl, dropEl, isNeedUpdate = false) {
    let roundArr = EnglishPuzzle.getRoundArr();
    const dropPosition = EnglishPuzzle.getDropPosition(dropEl);

    let newRoundArr = [];

    /** draggedParams: { width, order, text } - параметры перетаскиваемого эл-та */
    const draggedParams = HtmlHelper.getClickedElParams(dragEl);

    /** поместить пустой элемент на место, с которого забрали слово */
    HtmlHelper.makeElementEmpty(dragEl, draggedParams.width);

    // если перенос внутри раунда, то обновить массив слова после удаления слова
    if (isNeedUpdate) {
      roundArr = EnglishPuzzle.getRoundArr();
    }

    if (!roundArr[dropPosition]) { // если на места сброса нет элемента, просто вставляем новый
      newRoundArr = roundArr.slice();
      newRoundArr[dropPosition] = draggedParams;
    } else { // если на месте сброса есть элемент, двигаем массив по-умному
      newRoundArr = ArrayHelper.getShiftedArray(roundArr.slice(), dropPosition);
      newRoundArr[dropPosition] = draggedParams;
    }

    /** отрендерить слова в раунде на основании массива */
    EnglishPuzzle.renderRoundWordsFromArr(newRoundArr);

    if (EnglishPuzzle.checkRoundWordFilled()) {
      EnglishPuzzle.showButton('check');
    }
  },

  /**
   * рендер слов в раунде на основании массива
   * @param {Array} configArr - массив для рендера в формате:
   * [null, ..., null, {order, text, width, ...}, {order, text, width}, ..., null]
   * */
  renderRoundWordsFromArr(configArr) {
    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    HtmlHelper.clearContainers([roundWordsContainer]);
    configArr.forEach((elem) => { /** elem: { width, order, text, bgImg, bgPos } */
      if (!elem) { // если null - рендер пустой строки
        Utils.createBlockInside('div', ['phrase__word', 'empty'], roundWordsContainer);
      } else { // иначе, рендер строки со словом и картиной
        Utils.createBlockInside('div', ['phrase__word'], roundWordsContainer, elem.text,
          { draggable: true }, { orderTask: elem.order },
          {
            width: `${elem.width}px`,
            flexGrow: '0',
            backgroundImage: elem.bgImg,
            backgroundPosition: elem.bgPos,
          });
      }
    });
  },

  /** получить позицию, на которую сбрасывается элемент внутри своего контейнера */
  getDropPosition(dropEl) {
    const index = [...dropEl.parentElement.children].indexOf(dropEl);
    return index;
  },

  /** получить элементы в блоке раунда в виде массива */
  getRoundArr() {
    const roundWords = Array.from(document.querySelectorAll(`
      ${Config.containers.roundPhraseWords}
      ${Config.containers.roundWordsAll}
    `));

    const roundArr = roundWords.map((block) => ((block.classList.contains('empty'))
      ? null
      : HtmlHelper.getClickedElParams(block)));
    return roundArr;
  },

  /** drop в контейнер для перемешанных слов */
  processDropToTask: (event) => {
    EnglishPuzzle.deleteHighlightAreas();
    try { // на случай, если юзер захватил несколько элементов
      const order = event.dataTransfer.getData('text').split('@@')[0];
      const draggedEl = document.querySelector(`${Config.containers.roundPhrase} .phrase__word[data-order-task="${order}"]`);
      if (!draggedEl) {
        return;
      }
      EnglishPuzzle.processRoundWordClick({ target: draggedEl });
    } catch (error) {
      // return;
      // console.log('error while drop', error);
    }
  },

  /** установить передаваемые данные, подсветить поле для drop */
  processDragStartTaskWord: (event) => {
    event.stopPropagation();
    if (!event.target.classList) { // глюк, когда выбирается несколько эл-тов
      return;
    }
    if (event.target.classList.contains(Config.cssStyles.emptyWord)) {
      return;
    }
    if (event.target.classList.contains(Config.cssStyles.roundWord)) {
      return;
    }
    event.dataTransfer.setData('text', event.target.dataset.orderTask);
    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    roundWordsContainer.classList.add(Config.cssStyles.areaUnderDragged);
  },

  /** установить передаваемые данные, подсветить поле для drop */
  processDragStartRoundWord: (event) => {
    event.stopPropagation();
    if (!event.target.classList) { // глюк, когда выбирается несколько эл-тов
      return;
    }
    if (event.target.classList.contains(Config.cssStyles.emptyWord)) {
      return;
    }
    if (event.target.classList.contains(Config.cssStyles.taskWord)) {
      return;
    }
    event.dataTransfer.setData('text', `${event.target.dataset.orderTask}@@${event.target.innerHTML}`);

    const taskWordsContainer = document.querySelector(Config.containers.taskPhrase);
    taskWordsContainer.classList.add(Config.cssStyles.areaUnderDragged);
  },

  /** разрешить drop на поле round */
  processDragOverRound: (event) => {
    event.preventDefault();
  },

  /** разрешить drop на поле round */
  processDragEnterRound: (event) => {
    event.preventDefault();
  },

  /** разрешить drop на поле task */
  processDragOverTask: (event) => {
    event.preventDefault();
  },

  /** разрешить drop на поле task */
  processDragEnterTask: (event) => {
    event.preventDefault();
  },

  processDragEndRoundWord: () => {
    EnglishPuzzle.deleteHighlightAreas();
  },

  processDragEndTaskWord: () => {
    EnglishPuzzle.deleteHighlightAreas();
  },

  /** удалить зеленую подсветку с обоих полей после сбрасывания элемента */
  deleteHighlightAreas() {
    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    if (roundWordsContainer.classList.contains(Config.cssStyles.areaUnderDragged)) {
      roundWordsContainer.classList.remove(Config.cssStyles.areaUnderDragged);
    }
    const taskWordsContainer = document.querySelector(Config.containers.taskPhrase);
    if (taskWordsContainer.classList.contains(Config.cssStyles.areaUnderDragged)) {
      taskWordsContainer.classList.remove(Config.cssStyles.areaUnderDragged);
    }
  },

  /** наполнить страницу результатами */
  fillResults() {
    const { knowWords, idkWords } = this.settings.results;
    const { picture } = EnglishPuzzle.settings;

    const pictureMinContainer = document.querySelector(Config.containers.pictureMin);
    const pictureMinImg = pictureMinContainer.querySelector(Config.containers.pictureMinImg);
    const pictureMinDesc = pictureMinContainer.querySelector(Config.containers.pictureMinDesc);

    pictureMinImg.style.backgroundImage = `url('${Config.api.githubPicturesData}${picture.imageSrc}')`;
    pictureMinDesc.innerHTML = HtmlHelper.beautifyAuthorText(picture);

    const failContainer = document.querySelector(Config.containers.resultsFail);
    const failCount = failContainer.querySelector(Config.containers.failCount);
    const failWordsContainer = failContainer.querySelector(Config.containers.failWords);

    failCount.innerHTML = this.settings.results.idkWords.length;
    idkWords.forEach((word, i) => {
      const failWordBlock = Utils.createBlockInside('div', ['block__word', 'fail__word'], failWordsContainer, '', {}, { sound: `fail-${i}` });
      Utils.createBlockInside('div', 'word__soundicon', failWordBlock);
      Utils.createBlockInside('div', 'word__text', failWordBlock, word.textExample);
    });

    const successContainer = document.querySelector(Config.containers.resultsSuccess);
    const successCount = successContainer.querySelector(Config.containers.successCount);
    const successWordsContainer = successContainer.querySelector(Config.containers.successWords);

    successCount.innerHTML = this.settings.results.knowWords.length;
    knowWords.forEach((word, i) => {
      const successWordBlock = Utils.createBlockInside('div', ['block__word', 'success__word'], successWordsContainer, '', {}, { sound: `success-${i}` });
      Utils.createBlockInside('div', 'word__soundicon', successWordBlock);
      Utils.createBlockInside('div', 'word__text', successWordBlock, word.textExample);
    });
  },

  addListenersToResults() {
    const wordsContainer = document.querySelector(Config.containers.wholeResultsField);
    wordsContainer.addEventListener('click', this.processResWordClick);

    const resultsButtonContainer = document.querySelector(Config.containers.resultsButtons);

    const resultsContButton = resultsButtonContainer.querySelector(Config.resultsButtons.continue);
    resultsContButton.addEventListener('click', this.processResultsContClick);

    const resultsRepeatButton = resultsButtonContainer.querySelector(Config.resultsButtons.repeat);
    resultsRepeatButton.addEventListener('click', this.processResultsRepeatClick);

    const resultsMainLink = document.querySelector(Config.containers.resultLinkToMain);
    resultsMainLink.addEventListener('click', this.processResultsMainClick);

    const resultsStatsLink = document.querySelector(Config.containers.resultLinkToStats);
    resultsStatsLink.addEventListener('click', this.processResultsStatsClick);
  },

  /** клик по строке со словом на странице результатов (угаданной или нет) */
  processResWordClick: ({ target }) => {
    const wordBlock = target.closest(Config.containers.resultsWord);
    if (!wordBlock) {
      return;
    }
    const { knowWords, idkWords } = EnglishPuzzle.settings.results;

    const id = wordBlock.dataset.sound;
    const idArr = id.split('-');
    const [wordArrName, wordId] = idArr;
    const arr = (wordArrName === 'fail') ? idkWords : knowWords;

    const audio = arr[wordId].audioExample;
    EnglishPuzzle.playAudio(audio);
  },

  /** клик по ссылке "На Главную" на стр. результатов */
  processResultsMainClick: async () => {
    EnglishPuzzle.deleteLocalStat();
    EnglishPuzzle.loadStart();
  },

  /** клик по кнопке "Повторить" на стр результатов */
  processResultsRepeatClick: async () => {
    EnglishPuzzle.deleteLocalStat();
    const { settings } = EnglishPuzzle;

    const { gameMode } = EnglishPuzzle.settings;
    const isGameWithNewWords = (gameMode === Config.general.modes.new);
    if (isGameWithNewWords) {
      const newGameSettings = EnglishPuzzle.getRepeatLevelPageRound(settings.game);
      settings.game = { ...newGameSettings };
      Model.saveProgress(newGameSettings);
      await EnglishPuzzle.updateGameData();
    } else {
      EnglishPuzzle.setWordsForRepeat();
    }

    EnglishPuzzle.loadGame();
  },

  /** установить в новом раунде те же слова, что были в предыдущем */
  setWordsForRepeat() {
    const { words } = EnglishPuzzle.settings;
    const { allWords } = words;
    const solvedWords = [];
    const currentWord = WordsHelper.getCurrentBySettings(allWords, 0);
    const shuffledCurrentWord = WordsHelper.shuffleCurrent(currentWord);

    const repeatWordsObj = {
      allWords,
      solvedWords,
      currentWord,
      shuffledCurrentWord,
    };

    EnglishPuzzle.settings.words = { ...repeatWordsObj };
  },

  /** клик по кнопке "Статистика" */
  processResultsStatsClick: async () => {
    EnglishPuzzle.loadStats();
  },

  /** наполнить таблицу статистики результатами */
  fillStats: async () => {
    // const stats = Model.getGlobalStats('english-puzzle');
    const stats = await EnglishPuzzle.appModel.getStatForGame('ep');
    const statsTable = document.querySelector(Config.containers.statsTable);
    stats.forEach((game, i) => {
      const tr = Utils.createBlockInside('tr', '', statsTable);
      Utils.createBlockInside('td', '', tr, i + 1);
      Utils.createBlockInside('td', '', tr, (game.y || '0'));
      Utils.createBlockInside('td', '', tr, (game.n || '0'));
      Utils.createBlockInside('td', '', tr, game.d);
    });
  },

  /** добавить слушатели событий на страницу статистики */
  addListenersToStats() {
    const statsButtonContainer = document.querySelector(Config.containers.statsButtons);

    const statsContButton = statsButtonContainer.querySelector(Config.resultsButtons.continue);
    statsContButton.addEventListener('click', this.processResultsContClick);

    const statsRepeatButton = statsButtonContainer.querySelector(Config.resultsButtons.repeat);
    statsRepeatButton.addEventListener('click', this.processResultsRepeatClick);

    const statsMainLink = document.querySelector(Config.containers.statsLink);
    statsMainLink.addEventListener('click', this.processResultsMainClick);
  },

  /**
   * сохранить в настройки (EnglishPuzzle.settings.localStats)
   * пустой объект с выученными/невыученными словами,
   * а потом сохранить его в localStorage
   */
  deleteLocalStat() {
    EnglishPuzzle.settings.localStat = {
      knowWords: [],
      idkWords: [],
    };
    Model.saveStats(EnglishPuzzle.settings.localStat);
  },

  /** клик по кнопке "Continue" на странице результатов */
  processResultsContClick: async () => {
    EnglishPuzzle.deleteLocalStat();
    await EnglishPuzzle.updateGameData();
    EnglishPuzzle.loadGame();
  },

  /** клик по подсказке */
  processTipClick: ({ target }) => {
    if (!target.classList.contains(Config.cssStyles.tipButton)) {
      return;
    }

    const { tips } = EnglishPuzzle.settings;
    const dataTip = target.dataset.tip;
    target.classList.toggle(Config.cssStyles.tipPushed);
    tips[dataTip] = !tips[dataTip];

    EnglishPuzzle.setTips();
    EnglishPuzzle.setBlocksByTips();
  },

  /** показать перевод и разрешить прослушать слово в конце раунда */
  showTipsBlocksInRoundEnd: () => {
    const translationContainer = document.querySelector(Config.containers.translation);
    const audioIconBlock = document.querySelector(Config.containers.audioIcon);

    translationContainer.innerHTML = EnglishPuzzle.settings.words.currentWord.textExampleTranslate;
    audioIconBlock.classList.remove(Config.cssStyles.soundIconDisabled);
  },

  /** клик на иконке аудио */
  processSoundClick: () => {
    const audioIconBlock = document.querySelector(Config.containers.audioIcon);
    if (!audioIconBlock.classList.contains(Config.cssStyles.soundIconDisabled)) {
      EnglishPuzzle.processCurrentAudio();
    }
  },

  /** проиграть файл, поморгать иконкой */
  processCurrentAudio() {
    const { audioExample } = this.settings.words.currentWord;
    this.playAudio(audioExample);
    this.blinkAudioIcon();
  },

  /** проигрывание аудиофайла */
  playAudio(audioPath) {
    const audio = new Audio(audioPath);
    audio.play();
  },

  /** моргание иконки */
  blinkAudioIcon() {
    const soundIcon = document.querySelector(Config.containers.audioIcon);
    soundIcon.classList.add(Config.cssStyles.soundIconBlink);
    setTimeout(() => {
      soundIcon.classList.remove(Config.cssStyles.soundIconBlink);
    }, 5000);
  },

  /** получить следующие level, page, round на основании текущих */
  getNewLevelPageRound(gameConfig) {
    const { level, page, round } = gameConfig;
    const maxLevel = 5;
    const maxPage = 19;
    const maxRound = 9;

    let newRound = round + 1;
    let newPage = page;
    let newLevel = level;

    if (newRound > maxRound) {
      newRound = 0;
      newPage = page + 1;
    }

    if (newPage > maxPage) {
      newPage = 0;
      newLevel = level + 1;
    }

    if (newLevel > maxLevel) {
      newLevel = 0;
      newPage = 0;
    }

    return {
      level: newLevel,
      page: newPage,
      round: newRound,
    };
  },

  /** получить предыдущие level, page, round на основании текущих */
  getRepeatLevelPageRound(gameConfig) {
    const { level, page } = gameConfig;
    let newPage = page - 1;
    let newLevel = level;

    if (newPage < 0) {
      newPage = 19;
      newLevel = level - 1;
    }

    if (newLevel < 0) {
      newLevel = 5;
    }

    return {
      level: newLevel,
      page: newPage,
      round: 0,
    };
  },

  updateWordsByRound(round) {
    const { allWords } = this.settings.words;
    const solvedWords = WordsHelper.getSolvedBySettings(allWords, round);
    const currentWord = WordsHelper.getCurrentBySettings(allWords, round);
    const shuffledCurrentWord = WordsHelper.shuffleCurrent(currentWord);

    EnglishPuzzle.settings.words = {
      allWords,
      solvedWords,
      currentWord,
      shuffledCurrentWord,
    };
  },

  /** перезагрузить поле - очистить и снять слушатели событий */
  clearGameField() {
    this.removeListeners();
    HtmlHelper.clearGameField();
  },

  /** нажатие на кнопку "I don't know":
   * 1) вставить слова в правильном порядке в поле сбора,
   * 2) удалить все слова из поля с перемешанными словами,
   * 3) снять слушатели кликов с поля сбора, перемешанных слов, подсказок
   * 4) показать кнопку "Continue"
   * 5) проигрывание предложения, если автопроизношение включено
   */
  processIdkClick: () => {
    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    const taskWordsContainer = document.querySelector(Config.containers.taskPhrase);
    HtmlHelper.clearContainers([roundWordsContainer, taskWordsContainer]);

    const currentWordArr = EnglishPuzzle.settings.words.currentWord.textExample.split(' ');
    currentWordArr.forEach((word) => {
      Utils.createBlockInside('div', 'phrase__word', roundWordsContainer, word);
      Utils.createBlockInside('div', ['task__word', 'empty'], taskWordsContainer);
    });

    roundWordsContainer.style.backgroundImage = `url('${Config.api.githubPicturesData}${EnglishPuzzle.settings.picture.imageSrc}')`;
    roundWordsContainer.style.backgroundPosition = `0px ${Config.general.pictureOffset - 40 * (EnglishPuzzle.settings.words.solvedWords.length)}px`;

    const { tips } = EnglishPuzzle.settings;
    if (tips.autosound) {
      EnglishPuzzle.processCurrentAudio();
    }

    EnglishPuzzle.showTipsBlocksInRoundEnd(); // показать перевод и иконку звука в конце раунда

    const { currentWord } = EnglishPuzzle.settings.words;
    EnglishPuzzle.settings.localStat.idkWords.push(currentWord);
    Model.saveStats(EnglishPuzzle.settings.localStat);

    taskWordsContainer.removeEventListener('click', EnglishPuzzle.processTaskWordClick);
    roundWordsContainer.removeEventListener('click', EnglishPuzzle.processRoundWordClick);

    EnglishPuzzle.hideButton('idk');
    EnglishPuzzle.hideButton('check');
    EnglishPuzzle.showButton('cont');

    const tipsContainer = document.querySelector(Config.containers.tips);
    tipsContainer.removeEventListener('click', EnglishPuzzle.processTipClick);
  },

  /** нажатие на кнопку "Check"
   * 1) подсветить правильные/неправильные слова,
   * 2) если предложение угадано верно, снять слушатели, показать/спрятать кнопки, проиграть фразу
  */
  processCheckClick: () => {
    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    const taskWordsContainer = document.querySelector(Config.containers.taskPhrase);

    const roundWordsElsArr = Array
      .from(roundWordsContainer.querySelectorAll(Config.containers.roundWordsAll));
    const roundWordsArr = roundWordsElsArr.map((element) => element.innerHTML);
    const currentWordArr = EnglishPuzzle.settings.words.currentWord.textExample.split(' ');

    let corrects = 0;
    roundWordsArr.forEach((word, i) => {
      const cond = (word === currentWordArr[i]);
      corrects = (cond) ? (corrects + 1) : corrects;
      const cssClass = (cond)
        ? Config.cssStyles.roundWordCorrect
        : Config.cssStyles.roundWordIncorrect;

      roundWordsElsArr[i].classList.add(cssClass);
    });

    if (corrects === currentWordArr.length) { // если угадано верно
      const { tips } = EnglishPuzzle.settings;

      const { currentWord } = EnglishPuzzle.settings.words;
      EnglishPuzzle.settings.localStat.knowWords.push(currentWord);
      Model.saveStats(EnglishPuzzle.settings.localStat);

      if (tips.autosound) {
        EnglishPuzzle.processCurrentAudio();
      }
      EnglishPuzzle.showTipsBlocksInRoundEnd();

      taskWordsContainer.removeEventListener('click', EnglishPuzzle.processTaskWordClick);
      roundWordsContainer.removeEventListener('click', EnglishPuzzle.processRoundWordClick);
      roundWordsContainer.removeEventListener('dragstart', EnglishPuzzle.processDragStartRoundWord);

      EnglishPuzzle.hideButton('idk');
      EnglishPuzzle.hideButton('check');
      EnglishPuzzle.showButton('cont');
    }
  },

  /**
   * нажатие на кнопку "Continue":
   * 1) задать новый раунд,
   * 2) обновить угаданные и текущее слова на основе нового раунда
   * 3) перерендерить всё
   */
  processContClick: async () => {
    const tipsContainer = document.querySelector(Config.containers.tips);
    tipsContainer.removeEventListener('click', EnglishPuzzle.processTipClick);

    const { settings } = EnglishPuzzle;
    const newGameSettings = EnglishPuzzle.getNewLevelPageRound(settings.game);
    settings.game = { ...newGameSettings };
    Model.saveProgress(newGameSettings);
    Model.saveTips(settings.tips);

    if (settings.game.round !== 0) { // собрано меньше 10 раундов - не надо загружать новые слова
      EnglishPuzzle.clearGameField();
      EnglishPuzzle.updateWordsByRound(settings.game.round);
      EnglishPuzzle.loadGame();
    } else { // собрано все 10 раундов - загрузить картину
      EnglishPuzzle.settings.results = { ...EnglishPuzzle.settings.localStat };

      // Model.saveGameToGlobalStat({
      //   gameName: 'english-puzzle',
      //   date: Date.now(),
      //   knowCount: EnglishPuzzle.settings.results.knowWords.length,
      //   dontKnowCount: EnglishPuzzle.settings.results.idkWords.length,
      // });
      await EnglishPuzzle.appModel.saveStatForGame({
        name: 'ep',
        y: EnglishPuzzle.settings.results.knowWords.length,
        n: EnglishPuzzle.settings.results.idkWords.length,
      });

      EnglishPuzzle.deleteLocalStat();
      EnglishPuzzle.loadPicture();
    }
  },

  /** добавить слушатели на страницу с картиной */
  addListenersToPicture() {
    const pictureContainer = document.querySelector(Config.containers.picture);
    const resultsButton = pictureContainer.querySelector(Config.buttons.resButton);
    resultsButton.addEventListener('click', this.processPictureResClick);
  },

  /** нажатие на клик по результатам на странице картины */
  processPictureResClick() {
    EnglishPuzzle.loadResults();
  },

  /**
   * клик по слову в блоке с перемешанными словами:
   * 1) сделать кликнутое слово пустым с сохранением ширины,
   * 2) добавить копию слова в ПЕРВУЮ ПУСТУЮ ячейку блока сбора
   * */
  processTaskWordClick: ({ target }) => {
    if (!target.classList.contains(Config.cssStyles.taskWord)) {
      return;
    }

    if (target.classList.contains(Config.cssStyles.emptyWord)) {
      return;
    }

    const roundArr = EnglishPuzzle.getRoundArr();
    const firstNullInd = ArrayHelper.getFirstNullInd(roundArr);

    /** clickedParams: { width, order, text, bgImg, bgPos } */
    const clickedParams = HtmlHelper.getClickedElParams(target);

    /** поместить пустой элемент на месте, по которому кликнули */
    HtmlHelper.makeElementEmpty(target, clickedParams.width);

    /** поместить элемент, по которому кликнули на первом свободное место */
    roundArr[firstNullInd] = clickedParams;

    /** отрендерить слова в раунде на основании массива */
    EnglishPuzzle.renderRoundWordsFromArr(roundArr);

    if (EnglishPuzzle.checkRoundWordFilled()) {
      EnglishPuzzle.showButton('check');
    }
  },

  /** показать кнопку с переданным именем */
  showButton(buttonName) {
    const buttonsContainer = document.querySelector(Config.containers.gameButtons);
    const button = buttonsContainer.querySelector(`${Config.buttons.prefix}${buttonName}`);
    if (button.classList.contains(Config.cssStyles.hidden)) {
      button.classList.remove(Config.cssStyles.hidden);
    }
  },

  /** спрятать кнопку с переданным именем */
  hideButton(buttonName) {
    const buttonsContainer = document.querySelector(Config.containers.gameButtons);
    const button = buttonsContainer.querySelector(`${Config.buttons.prefix}${buttonName}`);
    if (!button.classList.contains(Config.cssStyles.hidden)) {
      button.classList.add(Config.cssStyles.hidden);
    }
  },

  /**
   * клик по слову в поле для сбора слова:
   * 1) удалить кликнутое слово из поля сбора
   * 2) вернуть кликнутое слово на свое место в блоке с перемешанными словами,
   * 3) удалить стили проверенных слов (красный/зеленый цвет)
   * */
  processRoundWordClick: ({ target }) => {
    if (!target.classList.contains(Config.cssStyles.roundWord)) {
      return;
    }

    if (target.classList.contains(Config.cssStyles.emptyWord)) {
      return;
    }
    const {
      width, text, order, bgImg,
    } = HtmlHelper.getClickedElParams(target);

    // сделать пустым элемент, по которому кликнули
    HtmlHelper.makeElementEmpty(target, width);

    const taskEmptyWord = document.querySelectorAll('.task__words .task__word')[order - 1];
    HtmlHelper.updateElement(taskEmptyWord, text, width, order, bgImg);

    EnglishPuzzle.deleteCheckingStyles();

    if (!EnglishPuzzle.checkRoundWordFilled()) {
      EnglishPuzzle.hideButton('check');
    }
  },

  /** удалить цвета фонов, которые остались после проверки */
  deleteCheckingStyles() {
    const roundWordsContainer = document.querySelector(Config.containers.roundPhraseWords);
    const roundWordsElsArr = Array
      .from(roundWordsContainer.querySelectorAll(Config.containers.roundWordsAll));
    roundWordsElsArr.forEach((el) => {
      if (el.classList.contains(Config.cssStyles.roundWordIncorrect)) {
        el.classList.remove(Config.cssStyles.roundWordIncorrect);
      }
      if (el.classList.contains(Config.cssStyles.roundWordCorrect)) {
        el.classList.remove(Config.cssStyles.roundWordCorrect);
      }
    });
  },

  /** проверить, что все слова перемещены в поле сбора */
  checkRoundWordFilled() {
    const howManyWordsInRound = this.settings.words.shuffledCurrentWord.length;
    const howManyWordCollected = document
      .querySelectorAll('.englishPuzzle__phrases-round .phrase__word:not(.empty)')
      .length;
    return (howManyWordsInRound === howManyWordCollected);
  },
};

export default EnglishPuzzle;
