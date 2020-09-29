const CardsHandler = {
  currentWord: null,
  isWrongWord: false,
  model: null,
  generateNextCard: null,
  ourWordObj: null,
  homeSettings: null,
  isWordCorrect: false,
  isGuessedOnFirstTry: true,
  wordToRepeat: null,

  statistic: {
    cardsCompleted: 0,
    correctAnswers: 0,
    newWords: 0,
    currentCorrectSeries: 0,
    bestCorrectSeries: 0,
  },

  settings: {
    sentenceTranslate: true,
    audioAutoplay: true,
  },

  playAudio: () => {
    const wordAudio = new Audio(CardsHandler.currentWord.audio);
    const wordAudioExample = new Audio(CardsHandler.currentWord.audioExample);
    const wordAudioMeaning = new Audio(CardsHandler.currentWord.audioMeaning);
    wordAudio.play();
    setTimeout(() => wordAudioExample.play(), 1000);
    setTimeout(() => wordAudioMeaning.play(), 7000);
  },

  showTranslate: () => {
    const textMeaningTranslate = document.querySelector('.learn--card__textMeaningTranslate');
    const textExampleTranslate = document.querySelector('.learn--card__textExampleTranslate');
    if (CardsHandler.homeSettings.isTextMeaning) {
      textMeaningTranslate.innerText = CardsHandler.currentWord.textMeaningTranslate;
    }
    if (CardsHandler.homeSettings.isTextExample) {
      textExampleTranslate.innerText = CardsHandler.currentWord.textExampleTranslate;
    }
  },

  showCorrectButtons: () => {
    const nextButton = document.querySelector('.learn--button-next');
    const intervalButtons = document.querySelector('.learn--card__complexity');
    nextButton.classList.remove('learn--button-hidden');
    if (CardsHandler.homeSettings.isIntervalButtons) intervalButtons.classList.remove('learn--card__complexity-hidden');
  },

  hideCorrectButtons: () => {
    const nextButton = document.querySelector('.learn--button-next');
    const intervalButtons = document.querySelector('.learn--card__complexity');
    nextButton.classList.add('learn--button-hidden');
    intervalButtons.classList.add('learn--card__complexity-hidden');
  },

  closeShowAnswerButton: () => {
    const showAnswerButton = document.querySelector('.learn--button-show');
    showAnswerButton.classList.add('learn--button-hidden');
  },

  insertSentenceWithWord: () => {
    const textMeaning = document.querySelector('.learn--card__textMeaning');
    const textExample = document.querySelector('.learn--card__textExample');
    textMeaning.innerHTML = CardsHandler.currentWord.textMeaning;
    textExample.innerHTML = CardsHandler.currentWord.textExample;
  },

  showHeaderIcons: () => {
    const iconBrain = document.querySelector('.learn--card__icon-brain');
    const iconDelete = document.querySelector('.learn--card__icon-delete');
    if (CardsHandler.homeSettings.isDeleteWordButton) {
      iconDelete.classList.remove('learn--card__icon-hidden');
    }
    if (CardsHandler.homeSettings.isMoveToDifficultButton) {
      iconBrain.classList.remove('learn--card__icon-hidden');
    }
  },

  addWordTranscription: () => {
    const wordTranscription = document.querySelector('.learn--card__transcription');
    if (CardsHandler.homeSettings.isTranscription) {
      wordTranscription.innerText = CardsHandler.currentWord.transcription;
    }
  },

  clearWordTranscription: () => {
    const wordTranscription = document.querySelector('.learn--card__transcription');
    wordTranscription.innerText = '';
  },

  correctAnswer: async () => {
    CardsHandler.isWordCorrect = true;
    const cardInput = document.querySelector('.learn--card__input');

    if (CardsHandler.isGuessedOnFirstTry) CardsHandler.statistic.correctAnswers += 1;
    CardsHandler.statistic.currentCorrectSeries += 1;
    if (CardsHandler.statistic.currentCorrectSeries
      > CardsHandler.statistic.bestCorrectSeries) {
      CardsHandler.statistic.bestCorrectSeries = CardsHandler.statistic.currentCorrectSeries;
    }
    CardsHandler.insertSentenceWithWord();
    CardsHandler.showCorrectButtons();
    CardsHandler.closeShowAnswerButton();
    CardsHandler.showHeaderIcons();
    CardsHandler.addWordTranscription();

    CardsHandler.model.processSolvedWord(CardsHandler.ourWordObj);
    if (!CardsHandler.isGuessedOnFirstTry) CardsHandler.addWordToRepeate();

    cardInput.innerText = CardsHandler.currentWord.word;
    cardInput.removeAttribute('contenteditable');
    cardInput.style.backgroundColor = 'rgb(145, 247, 112)';
    if (CardsHandler.settings.audioAutoplay === true) {
      CardsHandler.playAudio();
    }
    if (CardsHandler.settings.sentenceTranslate === true) {
      CardsHandler.showTranslate();
    }
    await CardsHandler.model.increaseTodayWordsCount();
  },

  setWrongLetters: () => {
    const cardInput = document.querySelector('.learn--card__input');
    const userWord = cardInput.innerText;
    const correctWord = CardsHandler.currentWord.word;
    let wrongWordCount = 0;
    let WrongLettersColor = 'orange';
    for (let i = 0; i < correctWord.length; i += 1) {
      if (correctWord[i] !== userWord[i]) {
        wrongWordCount += 1;
      }
    }
    if (wrongWordCount > correctWord.length / 2) WrongLettersColor = 'red';
    let coloredWord = '';
    for (let i = 0; i < correctWord.length; i += 1) {
      if (correctWord[i] === userWord[i]) {
        coloredWord += `<span style="color: green; transition: 0.5s ease; opacity: 1;">${correctWord[i]}</span>`;
      } else {
        coloredWord += `<span style="color: ${WrongLettersColor}; transition: 0.5s ease; opacity: 1;">${correctWord[i]}</span>`;
      }
    }
    cardInput.innerHTML = coloredWord;
    CardsHandler.isWrongWord = true;
    setTimeout(() => {
      const letters = document.querySelectorAll('.learn--card__input > span');
      for (let i = 0; i < letters.length; i += 1) {
        letters[i].style.opacity = '0.5';
      }
    }, 1000);
    cardInput.onkeydown = () => {
      if (CardsHandler.isWrongWord) cardInput.innerHTML = '';
      CardsHandler.isWrongWord = false;
    };
  },

  wrongAnswer: () => {
    CardsHandler.setWrongLetters();
    CardsHandler.isGuessedOnFirstTry = false;
    CardsHandler.statistic.currentCorrectSeries = -1;
  },

  getTextWidth: (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  },

  addWordToRepeate: () => {
    CardsHandler.wordToRepeat = CardsHandler.ourWordObj;
  },

  CardClickHandler: ({ target }) => {
    if (target.classList.contains('learn--card__complexity-repeat')) {
      CardsHandler.addWordToRepeate();
    }
    if (target.classList.contains('learn--card__complexity-hard')) {
      CardsHandler.model.setIntervalAsHard(CardsHandler.currentWord.id);
    }
    if (target.classList.contains('learn--card__complexity-well')) {
      CardsHandler.model.setIntervalAsGood(CardsHandler.currentWord.id);
    }
    if (target.classList.contains('learn--card__complexity-easy')) {
      CardsHandler.model.setIntervalAsEasy(CardsHandler.currentWord.id);
    }
    if (target.classList.contains('learn--card__enterAnswer') && !CardsHandler.isWordCorrect) {
      const userWord = document.querySelector('.learn--card__input').innerText;
      if (userWord === CardsHandler.currentWord.word) {
        CardsHandler.correctAnswer();
      } else if (userWord !== '') {
        CardsHandler.wrongAnswer();
      }
    }
  },

  addCardClickHandler: () => {
    const card = document.querySelector('.learn--card');
    card.addEventListener('click', CardsHandler.CardClickHandler);
  },

  addCardKeyHandler: () => {
    const card = document.querySelector('.learn--card');
    card.onkeydown = (event) => {
      const userWord = document.querySelector('.learn--card__input').innerText;
      if (event.key === 'Enter' && document.activeElement.classList.contains('learn--card__input') && !CardsHandler.isWordCorrect) {
        event.preventDefault();
        if (userWord === CardsHandler.currentWord.word) {
          CardsHandler.correctAnswer();
        } else if (userWord !== '') {
          CardsHandler.wrongAnswer();
        }
      }
    };
  },

  clearInput: () => {
    const cardInput = document.querySelector('.learn--card__input');
    cardInput.style.width = '';
    cardInput.style.backgroundColor = '';
    cardInput.innerText = '';
    cardInput.setAttribute('contenteditable', 'true');
  },

  buttonsClickHandler: ({ target }) => {
    if (target.classList.contains('learn--button-show') && !CardsHandler.isWordCorrect) {
      CardsHandler.isGuessedOnFirstTry = false;
      CardsHandler.statistic.currentCorrectSeries = -1;
      CardsHandler.correctAnswer();
    }
    if (target.classList.contains('learn--button-next')) {
      const userWord = document.querySelector('.learn--card__input').innerText;
      CardsHandler.hideCorrectButtons();
      if (userWord.toLowerCase() === CardsHandler.currentWord.word.toLowerCase()) {
        CardsHandler.clearInput();
        CardsHandler.clearWordTranscription();
        CardsHandler.statistic.cardsCompleted += 1;
        CardsHandler.generateNextCard();
      } else if (userWord !== '') {
        CardsHandler.wrongAnswer();
      }
    }
  },

  addButtonsClickHandler: () => {
    const learnButtons = document.querySelector('.learn--buttons');
    learnButtons.addEventListener('click', CardsHandler.buttonsClickHandler);
  },

  saveSettingsToLocalStorage: () => {
    localStorage.setItem('homeSettings', JSON.stringify(CardsHandler.settings));
  },

  setSettingsToHTML: () => {
    const translateIcon = document.querySelector('.learn--card__icon-book');
    const audioIcon = document.querySelector('.learn--card__icon-headphones');
    const brainIcon = document.querySelector('.learn--card__icon-brain');
    const deletedIcon = document.querySelector('.learn--card__icon-delete');
    if (CardsHandler.settings.sentenceTranslate === false) {
      translateIcon.classList.add('learn--card__icon-inactive');
    }
    if (CardsHandler.settings.audioAutoplay === false) {
      audioIcon.classList.add('learn--card__icon-inactive');
    }
    if (CardsHandler.currentWord.userWord.difficulty === 'hard') {
      brainIcon.classList.add('learn--card__icon-active');
    } else {
      brainIcon.classList.remove('learn--card__icon-active');
    }
    if (CardsHandler.currentWord.userWord.optional.state === 'deleted') {
      deletedIcon.classList.add('learn--card__icon-active');
    } else {
      deletedIcon.classList.remove('learn--card__icon-active');
    }
  },

  initSettings: () => {
    if (localStorage.getItem('homeSettings') === null) CardsHandler.saveSettingsToLocalStorage();
    else CardsHandler.settings = JSON.parse(localStorage.getItem('homeSettings'));

    CardsHandler.addSettingsClickHandler();
    CardsHandler.setSettingsToHTML();
  },

  SettingsClickHandler: ({ target }) => {
    if (target.classList.contains('learn--card__icon-book') || target.classList.contains('learn--card__icon-headphones')) {
      target.classList.toggle('learn--card__icon-inactive');
      if (target.classList.contains('learn--card__icon-book')) CardsHandler.settings.sentenceTranslate = !CardsHandler.settings.sentenceTranslate;
      if (target.classList.contains('learn--card__icon-headphones')) CardsHandler.settings.audioAutoplay = !CardsHandler.settings.audioAutoplay;
      CardsHandler.saveSettingsToLocalStorage();
    }
    if (target.classList.contains('learn--card__icon-brain')) {
      if (CardsHandler.currentWord.userWord.difficulty === 'hard') {
        CardsHandler.model.addWordToNormal(CardsHandler.currentWord.id);
        target.classList.remove('learn--card__icon-active');
        CardsHandler.currentWord.userWord.difficulty = 'normal';
      } else {
        CardsHandler.model.addWordToHard(CardsHandler.currentWord.id);
        target.classList.add('learn--card__icon-active');
        CardsHandler.currentWord.userWord.difficulty = 'hard';
      }
    }
    if (target.classList.contains('learn--card__icon-delete')) {
      if (CardsHandler.currentWord.userWord.optional.state === 'deleted') {
        CardsHandler.model.removeWordFromDeleted(CardsHandler.currentWord.id);
        target.classList.remove('learn--card__icon-active');
        CardsHandler.currentWord.userWord.optional.state = 'none';
      } else {
        CardsHandler.model.addWordToDeleted(CardsHandler.currentWord.id);
        target.classList.add('learn--card__icon-active');
        CardsHandler.currentWord.userWord.optional.state = 'deleted';
      }
    }
    CardsHandler.saveSettingsToLocalStorage();
  },

  addSettingsClickHandler: () => {
    const headerSettings = document.querySelector('.learn--card__header');
    headerSettings.addEventListener('click', CardsHandler.SettingsClickHandler);
  },

  setInputWidthAndFocus: () => {
    const cardInput = document.querySelector('.learn--card__input');
    cardInput.focus();
    const inputWidth = Math.ceil(CardsHandler.getTextWidth(CardsHandler.currentWord.word, 'bold 20px Montserrat'));
    cardInput.style.width = `${inputWidth}px`;
  },

  wordProcessing: async () => {
    if (CardsHandler.ourWordObj.isNew || !CardsHandler.ourWordObj.userWord) {
      CardsHandler.currentWord.userWord = {
        difficulty: 'normal',
        optional: {
          state: 'none',
        },
      };
    } else {
      CardsHandler.currentWord = CardsHandler.ourWordObj;
    }
  },

  initCardHandler: async (word, ourWordObj, model, generateNextCard, settings) => {
    CardsHandler.currentWord = word;
    CardsHandler.ourWordObj = ourWordObj;
    CardsHandler.wordProcessing();
    CardsHandler.wordToRepeat = null;
    if (CardsHandler.ourWordObj.isNew) {
      CardsHandler.statistic.newWords += 1;
    }
    CardsHandler.model = model;
    CardsHandler.generateNextCard = generateNextCard;
    CardsHandler.homeSettings = settings;

    CardsHandler.isGuessedOnFirstTry = true;
    CardsHandler.isWordCorrect = false;
    CardsHandler.setInputWidthAndFocus();
    CardsHandler.addCardClickHandler();
    CardsHandler.addCardKeyHandler();
    CardsHandler.addButtonsClickHandler();
    CardsHandler.initSettings();
  },
};

export default CardsHandler;
