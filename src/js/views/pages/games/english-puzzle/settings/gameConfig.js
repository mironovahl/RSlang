const EnglishPuzzleConfig = {
  general: {
    maxLevels: 6,
    maxPages: 20,
    max: {
      level: 6,
      page: 20,
    },
    pictureOffset: -200,
    timerSeconds: 3,
    modes: {
      learn: 'learn',
      new: 'new',
    },
    wordsPerPage: 10,
    wordsPerSentenceLTE: 10,
  },

  api: {
    githubRawData: 'https://raw.githubusercontent.com/dispector/rslang-data/master/',
    githubPicturesData: 'https://raw.githubusercontent.com/dispector/rslang_data_paintings/master/',
  },

  pages: {
    start: 'startScreen',
    timer: 'timerScreen',
    game: 'gameField',
    results: 'resultsField',
    picture: 'pictureField',
    stats: 'statsField',
  },

  containers: {
    // general
    header: '.header',
    footer: '.footer',

    startScreen: '.englishPuzzle__startScreen',
    timerScreen: '.englishPuzzle__timerScreen',
    gameField: '.englishPuzzle__field',
    resultsField: '.englishPuzzle__results',
    pictureField: '.englishPuzzle__picture',
    statsField: '.englishPuzzle__stats',

    // start
    start: {
      menus: {
        ids: { // селекты выбора уровня и страницы
          level: 'levels',
          page: 'pages',
        },
      },
    },

    learnMode: '.allGames__choice_learn',

    // timer
    timer: '.allGames__timer',

    // game
    menus: {
      current: {
        level: '.menu__level .level__current',
        page: '.menu__page .page__current',
      },
      dropDownClass: {
        level: '.level__menu.dropdown__menu',
        page: '.page__menu.dropdown__menu',
      },
      menuTitle: {
        level: '.level__list',
        page: '.page__list',
      },
    },

    gameButtons: '.englishPuzzle__buttons.gameButtons',
    tips: '.menu__tips.tips',
    tipsAll: '.menu__tips.tips .tips__button',

    translation: '.englishPuzzle__translation',
    audioIcon: '.englishPuzzle__sound .sound__icon',

    donePhrases: '.englishPuzzle__phrases-done',
    roundPhrase: '.englishPuzzle__phrases-round',
    roundPhraseWords: '.englishPuzzle__phrases-round .phrase__words',
    roundPhraseAll: '.phrase__words',
    roundWordsAll: '.phrase__word',
    roundNumbersAll: '.phrase__number',

    taskPhrase: '.englishPuzzle__task .task__words',
    taskPhraseAll: '.task__words',

    // picture
    picture: '.englishPuzzle__picture',
    pictureImg: '.picture__img',
    pictureDesc: '.picture__desc',

    // results

    pictureMin: '.englishPuzzle__pictureMinField',
    pictureMinImg: '.pictureMin__img',
    pictureMinDesc: '.pictureMin__desc',

    wholeResultsField: '.englishPuzzle__resultsField',

    resultsWord: '.block__word',

    resultsFail: '.englishPuzzle__results-fail',
    failCount: '.count__idk',
    failWords: '.fail__words',

    resultsSuccess: '.englishPuzzle__results-success',
    successCount: '.count__iknow',
    successWords: '.success__words',

    resultsButtons: '.englishPuzzle__results .results__buttons',
    resultLinkToMain: '.englishPuzzle__link-start',
    resultLinkToStats: '.englishPuzzle__link-stats',

    // stats

    statsTable: '.englishPuzzle__statsTable',
    statsButtons: '.englishPuzzle__statsButtons',
    statsLink: '.englishPuzzle__stats .englishPuzzle__link-start',

  },

  startButtons: {
    start: '.allGames__startBtn',
  },

  buttons: {
    prefix: '.gameButtons__button-',
    idkButton: '.gameButtons__button-idk',
    checkButton: '.gameButtons__button-check',
    contButton: '.gameButtons__button-cont',
    resButton: '.gameButtons__button-res',
  },

  resultsButtons: {
    continue: '.gameButtons__button-resCont',
    repeat: '.gameButtons__button-repeat',
    stats: '.gameButtons__button-stats',
  },

  statsButtons: {
    continue: '.gameButtons__button-resCont',
    repeat: '.gameButtons__button-repeat',
  },

  cssStyles: {

    modeSelected: 'select',

    menuItem: 'menu__item',
    hidden: 'englishPuzzle__block-hidden',
    hiddenAll: 'allGames__startScreen-hidden',

    tipButton: 'tips__button',
    tipPushed: 'tips__button-pushed',

    roundWord: 'phrase__word',
    roundWordCorrect: 'phrase__word-correct',
    roundWordIncorrect: 'phrase__word-incorrect',

    taskWord: 'task__word',

    emptyWord: 'empty',

    soundIconDisabled: 'sound__icon-disabled',
    soundIconBlink: 'sound__icon-blink',

    dragged: 'task__word-dragged',
    areaUnderDragged: 'englishPuzzle__area-underDrag',
  },
};

export default EnglishPuzzleConfig;
