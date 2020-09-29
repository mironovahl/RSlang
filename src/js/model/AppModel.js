import WordsHelper from './helpers/WordsHelper';
import DateHelper from './helpers/DateHelper';
import AuthHelper from './helpers/AuthHelper';

export default class AppModel {
  constructor() {
    this.searchString = 'https://afternoon-falls-25894.herokuapp.com/words?';
    this.backendURL = 'https://afternoon-falls-25894.herokuapp.com/';
    this.contentBookURL = 'https://raw.githubusercontent.com/dispector/rslang-data/master/data/book';
    this.contentURL = 'https://raw.githubusercontent.com/dispector/rslang-data/master/';
    this.backendWordIdPrefix = '5e9f5ee35eb9e72bc21';
    this.backendFirstWordId = '5e9f5ee35eb9e72bc21af4a0';
    this.userName = 'defaultUser';
    this.maxDictionaryLength = 3600;
    this.learnedWordsCounter = 100;
    this.learnedWords = [];
    this.newWords = [];
    this.difficultWords = [];
    this.deletedWords = [];
    this.dailyQuote = 20;
    this.maxWordsPerExampleSentence = 50;
    this.wordSetLength = 600;
    this.defaultPageLength = 20;
    this.numberOfDifficulties = 6;
    this.currentWordSet = [];
    this.gameStatistics = {
      audition: {},
      englishPuzzle: {},
      savannah: {},
      speakIt: {},
      sprint: {},
      square: {},
    };
    this.maxDaysStats = 5;
    this.defaultUserEmail = '66group@gmail.com';
    this.defaultUserPassword = 'Gfhjkm_123';
    this.defaultUserId = '5ef6f4c5f3e215001785d617';
    this.authToken = null;
    this.userId = null;
    this.emailValidator = /^[-.\w]+@(?:[a-z\d]{2,}\.)+[a-z]{2,6}$/;
    this.passwordValidator = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[+\-_@$!%*?&#.,;:[\]{}])[\S]{8,}$/;
    this.serverErrorMessage = 'Ошибка при обращении к серверу';

    this.wordsHelper = WordsHelper;
    this.dateHelper = DateHelper;
    this.authHelper = AuthHelper;

    this.getTokenAndId();
  }

  getTokenAndId() {
    const userSettings = this.getUserFromLocalStorage();
    this.authToken = (userSettings && userSettings.token) ? userSettings.token : null;
    this.userId = (userSettings && userSettings.userId) ? userSettings.userId : null;
  }

  // change current user to new one
  changeUser(userName) {
    this.userName = userName;
  }

  // get a single learned word
  async getRandomLearnedWord() {
    if (this.learnedWordsCounter <= 0) {
      return { error: true, errorText: 'Недостаточно выученных слов' };
    }
    const randomIndex = Math.floor(Math.random() * Math.floor(this.learnedWordsCounter));
    return this.getWordDataByIndex(randomIndex);
  }

  // get a single unknown word
  async getNewUnknownWord() {
    return this.getWordDataByIndex(this.learnedWordsCounter);
  }

  // get a single random word with set difficulty and round
  async getRandomWordByDifficulty(difficulty, round, roundLength) {
    if (difficulty > 5 || difficulty < 0) {
      return null;
    }
    const startOfDifficultyGroup = Math.floor(difficulty * this.wordSetLength);
    const startOfRound = startOfDifficultyGroup
      + Math.floor((this.wordSetLength / roundLength) * round);
    const index = startOfRound + Math.floor(Math.random() * roundLength);
    const result = await this.getWordDataByIndex(index);
    return result;
  }

  // manually set counter for learned words, supposed to be used only for debugging!!
  setLearnedWords(num) {
    this.learnedWordsCounter = num;
  }

  // increase counter forlearned words by 1
  increaseLearnedWordsBy1() {
    this.learnedWordsCounter += 1;
  }

  // decrease counter forlearned words by 1
  decreaseLearnedWordsBy1() {
    this.learnedWordsCounter -= 1;
  }

  // utility function, cuts useless word data and sets correct paths for img/mp3 assets
  reformatWordData(wordData, isDashBeforeId) {
    return {
      id: (!isDashBeforeId) ? wordData.id : wordData._id,
      textExample: wordData.textExample,
      textExampleTranslate: wordData.textExampleTranslate,
      textMeaning: wordData.textMeaning,
      textMeaningTranslate: wordData.textMeaningTranslate,
      word: wordData.word,
      wordTranslate: wordData.wordTranslate,
      transcription: wordData.transcription,
      audio: `${this.contentURL}${wordData.audio}`,
      audioMeaning: `${this.contentURL}${wordData.audioMeaning}`,
      audioExample: `${this.contentURL}${wordData.audioExample}`,
      image: `${this.contentURL}${wordData.image}`,
      difficulty: wordData.group,
      userWord: (!isDashBeforeId) ? null : wordData.userWord,
      // wordsPerExampleSentence: wordData.wordsPerExampleSentence,
    };
  }

  // utilty function, gets word data from API by its index
  async getWordDataByIndex(index) {
    if (index < 0 || index >= this.maxDictionaryLength) {
      return { error: true, errorText: 'Неверный индекс слова' };
    }
    const group = Math.floor(index / this.wordSetLength);
    const page = Math.floor((index - group * this.wordSetLength) / this.defaultPageLength);
    const wordIndex = index - (group * this.wordSetLength) - (page * this.defaultPageLength);
    const url = `${this.searchString}group=${group}&page=${page}`;
    try {
      const responce = await fetch(url);
      const data = await responce.json();
      const result = this.reformatWordData(data[wordIndex]);
      return result;
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  // выдает случайное слово и 4 неправильных перевода к нему
  async getFivePossibleTranslations() {
    const correctWordData = await this.getNewUnknownWord();
    const incorrectTranslation1Promise = this.getRandomLearnedWord();
    const incorrectTranslation2Promise = this.getRandomLearnedWord();
    const incorrectTranslation3Promise = this.getRandomLearnedWord();
    const incorrectTranslation4Promise = this.getRandomLearnedWord();
    const incorrectTranslation1 = await incorrectTranslation1Promise;
    const incorrectTranslation2 = await incorrectTranslation2Promise;
    const incorrectTranslation3 = await incorrectTranslation3Promise;
    const incorrectTranslation4 = await incorrectTranslation4Promise;
    if (correctWordData.error) {
      return correctWordData.errorText;
    }
    if (incorrectTranslation1.error) {
      return incorrectTranslation1.errorText;
    }
    if (incorrectTranslation2.error) {
      return incorrectTranslation2.errorText;
    }
    if (incorrectTranslation3.error) {
      return incorrectTranslation3.errorText;
    }
    if (incorrectTranslation4.error) {
      return incorrectTranslation4.errorText;
    }
    return {
      correct: correctWordData,
      incorrect: [
        incorrectTranslation1,
        incorrectTranslation2,
        incorrectTranslation3,
        incorrectTranslation4,
      ],
    };
  }

  // выдает случайное слово и один неправильный перевод
  async getTwoPossibleTranslations() {
    const correctWordDataPromise = this.getRandomLearnedWord();
    const incorrectTranslationPromise = this.getRandomLearnedWord();
    const correctWordData = await correctWordDataPromise;
    const incorrectTranslation = await incorrectTranslationPromise;
    if (correctWordData.error) {
      return correctWordData.errorText;
    }
    if (incorrectTranslation.error) {
      return incorrectTranslation.errorText;
    }
    return {
      correct: correctWordData,
      incorrect: incorrectTranslation.wordTranslate,
    };
  }

  // выдает набор из 20 слов по указанным данным. Аргументы:
  // group -  сложность, от 0 до 5
  // page - страница, от 0 до 29
  async getSetOfWords(group, page) {
    if (group < 0 || group > 5 || page < 0 || page > 29) {
      return { error: true, errorText: 'Некорректные аргументы функции' };
    }
    const url = `${this.searchString}group=${group}&page=${page}`;
    try {
      const responce = await fetch(url);
      const data = await responce.json();
      const result = data.map((x) => this.reformatWordData(x));
      return result;
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  // выдает набор слов указанной длины по данным параметрам. Аргументы:
  // group -  сложность, от 0 до 5
  // page - страница, page * wordsPerPage не может быть больше 600
  // wordsPerPage - количество запрашиваемых слов
  async getSetOfWordsCustomLength(
    group,
    page,
    wordsPerPage = 10,
    wordsPerExampleSentenceLTE = this.maxWordsPerExampleSentence,
  ) {
    if (group < 0 || group > 5 || page < 0 || wordsPerPage < 0 || page * wordsPerPage > 600) {
      return { error: true, errorText: 'Некорректные аргументы функции' };
    }
    try {
      const url = `${this.searchString}group=${group}&page=${page}&wordsPerExampleSentenceLTE=${wordsPerExampleSentenceLTE}&wordsPerPage=${wordsPerPage}`;
      const responce = await fetch(url);
      const data = await responce.json();
      const result = data.map((x) => this.reformatWordData(x));
      return result;
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  // служебная функция, записывающая массив слов данной сложности из гитхаба в модель
  async getWordsDataFromGithub(difficulty) {
    try {
      const url = `${this.contentBookURL}${difficulty}.json`;
      const responce = await fetch(url);
      const data = await responce.json();
      this.currentWordSet = await data;
      return { error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  // служебная ф-я, достающая из данных модели набор слов для указанного раунда
  getRoundDataFromModel(round, roundLength) {
    return this.currentWordSet.slice(round * roundLength, (round + 1) * roundLength);
  }

  // предполагается что это будет основная ф-я для получения слов из бекенда в миниигры
  // на входе: difficulty - сложность (от 1 до 6)
  // round - номер раунда. в зависимости от длины раунда может быть  0 - 29, 0-19 или 0-59.
  // roundLength - количество слов в раунде игры. допустимые значения 10/20/30
  // numberOfTranslations - количество НЕПРАВИЛЬНЫХ переводов идущих вместе с правильным (от 1 до 5)
  async getSetOfWordsAndTranslations(difficulty, round, roundLength, numberOfTranslations) {
    const incorrectTranslationsRounds = [];
    const incorrectTranslations = [];
    let incorrectTranslationsSubArray = [];
    let numberOfCurrentRound;
    let githubData = {};
    const finalArray = [];
    const totalNumberOfRounds = this.wordSetLength / roundLength;
    githubData = await this.getWordsDataFromGithub(difficulty);
    if (githubData.error) {
      return { error: true, errorText: this.serverErrorMessage };
    }
    const correctResults = this.getRoundDataFromModel(round, roundLength)
      .map((x) => this.reformatWordData(x));
    do {
      numberOfCurrentRound = Math.floor(Math.random() * totalNumberOfRounds);
      if (
        !incorrectTranslationsRounds.includes(numberOfCurrentRound)
        && numberOfCurrentRound !== round
      ) {
        incorrectTranslationsRounds.push(numberOfCurrentRound);
      }
    } while (incorrectTranslationsRounds.length < numberOfTranslations);
    for (let i = 0; i < numberOfTranslations; i += 1) {
      incorrectTranslations[i] = this
        .getRoundDataFromModel(incorrectTranslationsRounds[i], roundLength);
    }
    for (let i = 0; i < roundLength; i += 1) {
      incorrectTranslationsSubArray = [];
      for (let j = 0; j < numberOfTranslations; j += 1) {
        incorrectTranslationsSubArray.push(incorrectTranslations[j][i]);
      }
      finalArray.push({ correct: correctResults[i], incorrect: incorrectTranslationsSubArray });
    }
    return finalArray;
  }

  // функция, выдающая набор заданной длины из ВЫУЧЕННЫХ слов и неправильных переводов к ним
  // numberOfWords - кол-во запрашиваемых слов, функция тестировалась для значений 10, 20, 30, 60
  // numberOfTranslations - количество переводов для каждого слова, от 0 до 4
  async getSetOfLearnedWordsAndTranslations(numberOfWords, numberOfTranslations) {
    if (numberOfWords > this.learnedWordsCounter) {
      return null;
    }
    // выбираем случайное число от 0 до this.learnedWordsCounter чтобы выбрать сложность
    const randomSeed = Math.floor(Math.random() * (this.learnedWordsCounter - numberOfWords));
    let randomDifficulty = Math.floor(randomSeed / this.wordSetLength) + 1;
    // находим начальный индекс сложности, из которой мы будем брать слова
    // если в данной сложности слов нехватает для запроса, опускаемся на одну ниже
    let startIndex = (randomDifficulty - 1) * this.wordSetLength;
    if (this.learnedWordsCounter - startIndex < numberOfWords) {
      randomDifficulty -= 1;
      startIndex -= this.wordSetLength;
    }
    // находим количество слов в массиве, из которого мы будем брать слова
    // это будет или 600 или разница  this.learnedWordsCounter - startIndex
    let sourceArrAmount;
    if (this.learnedWordsCounter - startIndex > this.wordSetLength) {
      sourceArrAmount = this.wordSetLength;
    } else {
      sourceArrAmount = this.learnedWordsCounter - startIndex;
    }
    // находим количество возможных раундов, которые могут уместиться в этом массиве
    const numberOfPossibleRounds = sourceArrAmount / numberOfWords;
    // выбираем случайный раунд
    const indexOfRandomRound = Math.floor(Math.random() * numberOfPossibleRounds);
    // вызываем функцию getSetOfWordsAndTranslations с найденными параметрами
    const result = await this.getSetOfWordsAndTranslations(
      randomDifficulty,
      indexOfRandomRound,
      numberOfWords,
      numberOfTranslations,
    );
    return result;
  }

  // выдает рандомный массив выученных слов заданной длины
  async getSetOfLearnedWords(numberOfWords) {
    if (numberOfWords > this.learnedWordsCounter || numberOfWords < 1) {
      return { error: true, errorText: 'Некорректные аргументы функции' };
    }
    let startIndex = 0;
    let githubData = {};
    if (githubData.error) {
      return { error: true, errorText: this.serverErrorMessage };
    }
    const randomSeed = Math.floor(Math.random() * (this.learnedWordsCounter - numberOfWords));
    const randomDifficulty = Math.floor(randomSeed / this.wordSetLength) + 1;
    githubData = await this.getWordsDataFromGithub(randomDifficulty);
    startIndex = randomSeed - randomDifficulty * this.wordSetLength;
    return this.currentWordSet.slice(startIndex, startIndex + numberOfWords)
      .map((x) => this.reformatWordData(x));
  }


  // создание пользователя
  async createUser(user) {
    const validation = this.validateUserData(user);
    if (!validation.valid) {
      return { data: null, error: validation.error, errorText: validation.errorText };
    }
    try {
      const rawResponse = await fetch(`${this.backendURL}users`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (rawResponse.status !== 200) {
        return { error: true, errorText: 'Пользователь с таким email уже существует' };
      }
      const content = await rawResponse.json();
      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  // логин пользователя
  async loginUser(user) {
    const validation = this.validateUserData(user);
    if (!validation.valid) {
      return { data: null, error: validation.error, errorText: validation.errorText };
    }
    try {
      const rawResponse = await fetch(`${this.backendURL}signin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (rawResponse.status !== 200) {
        return { error: true, errorText: 'Неверный логин/пароль' };
      }
      const content = await rawResponse.json();
      this.authToken = content.token;
      this.userId = content.userId;
      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Сервер авторизации недоступен' };
    }
  }

  /** авторизовать пользователя и сохранить его данные в localStorage
   * @param {Object} user {email: ... , password: ...} - данные пользователя из формы
   * @return {Object} {userId: ..., token: ..., refreshToken: ...}
  */
  async loginAndSetUser(user) {
    const userData = await this.loginUser(user);
    if (!userData.error) {
      this.saveUserToLocalStorage(userData.data);
    }

    return userData;
  }

  /** создать пользователя, авторизовать, сохранить его данные в localStorage,
   * дать настройки словаря и карточек по умолчанию
   * @param {Object} user {email: ... , password: ...} - данные пользователя из формы
   * @return {Object} {userId: ..., token: ..., refreshToken: ...}
  */
  async createAndSetUser(user) {
    const userData = await this.createUser(user);
    if (!userData.error) {
      await this.loginAndSetUser(user);
    }

    const defaultWordsSettings = this.wordsHelper.getDefaultWordsSettings();
    await this.saveSettings(defaultWordsSettings);
    await this.saveDefaultStats();

    return userData;
  }

  /** сохранить данные пользователя в localStorage
   * т.к. ничего кроме данных авторизации не планируется, перетираем все
   * @param {Object} user {userId: ..., token: ..., refreshToken: ...}
  */
  saveUserToLocalStorage({ userId, token, refreshToken }) {
    const userSettings = {
      userId,
      token,
      refreshToken,
    };
    localStorage.setItem('rslang66', JSON.stringify(userSettings));
  }

  /** стереть все даныне пользователя из localStorage */
  resetLocalStorage() {
    localStorage.setItem('rslang66', null);
  }

  /** "разлогинить пользователя" - стереть его данные из localStorage */
  logOutUser() {
    this.resetLocalStorage();
    this.authHelper.redirectToMain();
  }

  /** получить данные пользователя из localStorage
   * @return {Object|null} - {userId: ..., token: ..., refreshToken: ...} или null
  */
  getUserFromLocalStorage() {
    const userSettings = JSON.parse(localStorage.getItem('rslang66'));
    return userSettings;
  }

  // служебная функция для валидации вводимых данных пользователя
  validateUserData(user) {
    if (!user.email || !this.emailValidator.test(user.email)) {
      return { error: true, errorText: 'Введен некорректный email-адрес', valid: false };
    }
    if (!user.password || !this.passwordValidator.test(user.password)) {
      return {
        error: true,
        errorText: 'Пароль должен содержать 8 символов, 1 цифру, 1 заглавную букву, 1 строчную букву, 1 спецсимвол',
        valid: false,
      };
    }
    return { error: false, errorText: '', valid: true };
  }

  // сохранение статистики
  async saveStats(stats) {
    try {
      const rawResponse = await fetch(`${this.backendURL}users/${this.userId}/statistics`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      });
      const content = await rawResponse.json();
      return content;
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  // получение статистики залогиненного пользователя
  async getStats() {
    try {
      const rawResponse = await fetch(`${this.backendURL}users/${this.userId}/statistics`, {
        method: 'GET',
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
        },
      });
      const content = await rawResponse.json();
      return content;
    } catch (e) {
      return { error: true, errorText: this.serverErrorMessage };
    }
  }

  /** получить статистику по всем играм, если ее нет, сохранить и отдать объект по умолчанию */
  async getAllStats() {
    const allStats = await this.getStats();
    let newStats = { ...allStats };
    if (!newStats) {
      newStats = await this.saveDefaultStats();
    }
    /** backend возвращает статистику с полем id, но т.к. передавать
     * его при сохранении нельзя, создаем объект без него */
    const { learnedWords, optional } = newStats;
    const returnNewStats = {
      learnedWords,
      optional,
    };
    return returnNewStats;
  }

  /** получить статистику по игре
   * @param {String} gameName - сокращенное название игры
   * @return {Array} [ - массив объектов за последние 5 игр
   *  {
   *    d - дата,
   *    y - правильных слов,
   *    n - неправильных слов
   *  }, ...
   * ]
   */
  async getStatForGame(gameName = 'au') {
    const allStats = await this.getAllStats();
    const gameStats = allStats.optional.games[gameName];
    return gameStats;
  }

  /** сохранить статистику за игру (1 сеанс)
   * @param {Object} gameObj - объект игры - {
   *  name - название игры,
   *  y - кол-во правильных слов,
   *  n - кол-во неправильных слов
   * }
  */
  async saveStatForGame({ name, y, n }) {
    const allStats = await this.getAllStats();
    const { learnedWords: newLearnedWords, optional: newOptional } = allStats;
    const gameStats = newOptional.games[name];
    const sliceDays = (gameStats.length < this.maxDaysStats) ? 0 : 1;
    const lastGamesStats = gameStats.slice(sliceDays);
    lastGamesStats.push({
      d: this.dateHelper.getBeutifyTodayDate(),
      y,
      n,
    });
    newOptional.games[name] = lastGamesStats;

    const newStats = {
      learnedWords: newLearnedWords,
      optional: newOptional,
    };

    const saved = await this.saveStats(newStats);
    return saved;
  }

  /** получить объект для статистики по умолчанию */
  getDefaultStatsObj() {
    return this.wordsHelper.getDefaultStatsObj();
  }

  /** сохранить объект для статистики по умолчанию (при создании польз.) */
  async saveDefaultStats() {
    const defaultStatsObj = this.getDefaultStatsObj();
    const saved = await this.saveStats(defaultStatsObj);
    return saved;
  }

  /** получить количество слов, изученных сегодня */
  async getTodayWordsCount() {
    const allStats = await this.getAllStats();
    const todayWordsObj = allStats.optional.todayWords;
    const { date: dateTrain, counter: dateWordsCount } = todayWordsObj;
    const todayDate = this.dateHelper.getBeutifyTodayDate();
    return (dateTrain === todayDate) ? dateWordsCount : 0;
  }

  /** обновить количество слов на сегодня и общий счетчик слов */
  async increaseTodayWordsCount() {
    const allStats = await this.getAllStats();
    const { learnedWords: newLearnedWords, optional: newOptional } = allStats;
    const { todayWords: todayWordsObj } = newOptional;
    const { date: dateTrain, counter: dateWordsCount } = todayWordsObj;
    const todayDate = this.dateHelper.getBeutifyTodayDate();
    const isDateToday = (dateTrain === todayDate);
    const newDate = todayDate;
    const newCount = (isDateToday) ? (dateWordsCount + 1) : 1;
    newOptional.todayWords = {
      date: newDate,
      counter: newCount,
    };
    const newStats = {
      learnedWords: newLearnedWords,
      optional: newOptional,
    };

    const saved = await this.saveStats(newStats);
    return saved;
  }

  /** выставить нужно кол-во пройденных слов за сегодня
   * по умолчанию - сбросить счетчик
   */
  async setTodayWordsCount(count = 0) {
    const allStats = await this.getAllStats();
    const { learnedWords: newLearnedWords, optional: newOptional } = allStats;
    newOptional.todayWords = {
      date: this.dateHelper.getBeutifyTodayDate(),
      counter: count,
    };
    const newStats = {
      learnedWords: newLearnedWords,
      optional: newOptional,
    };

    const saved = await this.saveStats(newStats);
    return saved;
  }

  /**
   * сохранить на бэкенде настройки приложения
   *
   * @param {Object} settingsObj - объект с настройками
   * settingsObj = {
   *  newWordsPerDay, // number, кол-во новых слов в день
   *  maxWordsPerDay, // number, макс кол-во карточек за день
   *  isWordTranslate, // bool, перевод слова
   *  isTextMeaning, // bool, предложение с объяснением значения слова
   *  isTextExample, // bool, предложение с примером использования изучаемого слова
   *  isTextMeaningTranslate, // bool, перевод предложения с объяснением значения слова
   *  isTextExampleTranslate, // bool, Перевод предложения с примером использования изучаемого слова
   *  isTranscription, // bool, транскрипция слова
   *  isImage, // bool, картинка-ассоциация
   *  isAnswerButton, // bool, кнопка "Показать ответ"
   *  isDeleteWordButton, // bool, кнопка "Удалить слово из изучения"
   *  isMoveToDifficultButton, // bool, кнопка - поместить слово в группу «Сложные»
   *  isIntervalButtons, // bool, блок кнопок для интервального повторения
   *  dictionary: {
   *    example,
   *    meaning,
   *    transcription,
   *    img,
   *   }
   * }
   * @return bool - успешно ли прошло сохранение настроек
   * */
  async saveSettings(settingsObj) {
    const settingsToSave = {
      wordsPerDay: settingsObj.newWordsPerDay,
      optional: {
        maxWordsPerDay: settingsObj.maxWordsPerDay,
        isWordTranslate: settingsObj.isWordTranslate,
        isTextMeaning: settingsObj.isTextMeaning,
        isTextExample: settingsObj.isTextExample,
        isTextMeaningTranslate: settingsObj.isTextMeaningTranslate,
        isTextExampleTranslate: settingsObj.isTextExampleTranslate,
        isTranscription: settingsObj.isTranscription,
        isImage: settingsObj.isImage,
        isAnswerButton: settingsObj.isAnswerButton,
        isDeleteWordButton: settingsObj.isDeleteWordButton,
        isMoveToDifficultButton: settingsObj.isMoveToDifficultButton,
        isIntervalButtons: settingsObj.isIntervalButtons,
        dictionary: {
          example: settingsObj.dictionary.example,
          meaning: settingsObj.dictionary.meaning,
          transcription: settingsObj.dictionary.transcription,
          img: settingsObj.dictionary.img,
        },
      },
    };
    try {
      const url = `${this.backendURL}users/${this.userId}/settings`;
      const rawResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });
      const content = await rawResponse.json();
      return content;
    } catch (e) {
      return { error: true, errorText: 'Ошибка при сохранении настроек. Попробуйте еще раз попозже' };
    }
  }

  /**
   * сохранить настройки словаря (не затронув при этом настройки приложения)
   * @param {Object} settingsObj - {example, meaning, transcription, img}
  */
  async saveDictionarySettings(settingsObj) {
    const appSettingsRaw = await this.getSettings();
    const appSettings = appSettingsRaw.data;
    const newSettings = appSettings;
    newSettings.dictionary = settingsObj;
    await this.saveSettings(newSettings);
  }

  /** сохранить настройки приложения (не затронув настройки словаря) */
  async saveCardsSettings(settingsObj) {
    const appSettingsRaw = await this.getSettings();
    const { dictionary } = appSettingsRaw.data;
    const newSettings = settingsObj;
    newSettings.dictionary = dictionary;
    await this.saveSettings(newSettings);
  }

  /** получить с бэкенда ВСЕ настройки приложения */
  async getSettings() {
    try {
      const url = `${this.backendURL}users/${this.userId}/settings`;
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (rawResponse.status !== 200) {
        const defaultWordsSettings = this.wordsHelper.getDefaultWordsSettings();
        await this.saveSettings(defaultWordsSettings);
        return { data: defaultWordsSettings, error: false, errorText: '' };
      }
      const content = await rawResponse.json();
      const settingsObj = {
        newWordsPerDay: content.wordsPerDay,
        maxWordsPerDay: content.optional.maxWordsPerDay,
        isWordTranslate: content.optional.isWordTranslate,
        isTextMeaning: content.optional.isTextMeaning,
        isTextExample: content.optional.isTextExample,
        isTextMeaningTranslate: content.optional.isTextMeaningTranslate,
        isTextExampleTranslate: content.optional.isTextExampleTranslate,
        isTranscription: content.optional.isTranscription,
        isImage: content.optional.isImage,
        isAnswerButton: content.optional.isAnswerButton,
        isDeleteWordButton: content.optional.isDeleteWordButton,
        isMoveToDifficultButton: content.optional.isMoveToDifficultButton,
        isIntervalButtons: content.optional.isIntervalButtons,
        dictionary: content.optional.dictionary,
      };
      return { data: settingsObj, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении настроек. Попробуйте еще раз попозже' };
    }
  }

  /**
   * получить с бэкенда все изученные пользователем слова
   * */
  async getAllLearnedWordsFromBackend() {
    try {
      const url = `${this.backendURL}users/${this.userId}/words`;
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content = await rawResponse.json();
      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }

  /**
   * получить все слова за сегодня (изученные + новые), с учетом интервалов
   */
  async getWordsForDay() {
    const settings = await this.getSettings();
    const { data: { maxWordsPerDay, newWordsPerDay } } = settings;
    const needToBeLearnedWords = maxWordsPerDay - newWordsPerDay;
    const learnedWordsObj = await this.getAllLearnedWordsFromBackend();
    /** @var learnedWords - все выученные слова - массив [
     * { difficulty: string, // сложность - normal|hard
     *   wordId: string, // id данного слова на бэкенде
     *   optional: {
     *     wordId: number, // id слова в bookN.js
     *     state: string, // none|deleted,
     *     date: dateTime, // none|dateTime - дата следующего повторения
     *     dateLearned: dateTime, // none|dateTime - дата изучения слова
     *    }
     *  }
     * ]
     * */
    const { data: allLearnedWordsWithDeleted } = learnedWordsObj;
    /** оставляем только слова без метки "deleted" */
    const allLearnedWords = this.wordsHelper.removeDeletedWords(allLearnedWordsWithDeleted);

    // добавить проверку на непустоту

    const dateToday = this.dateHelper.getBeutifyTodayDate();
    /** сначала берем слова с сегодняшней датой */
    const wordsWithDateToday = this.wordsHelper.filterWordsWithDate(allLearnedWords, dateToday);

    /** ищем слова, у которых дата не указана */
    const wordsWithoutDate = this.wordsHelper.filterWordsWithDate(allLearnedWords, 'none');

    /** ищем слова, у которых дата указана и она не сегодня, чтобы добить ими массив */
    const wordsWithDateSpecified = this.wordsHelper
      .filterWordsDateSpecNotToday(allLearnedWords, dateToday);

    const wordsArraysObj = {
      todayWords: wordsWithDateToday,
      withoutDateWords: wordsWithoutDate,
      withDateWords: wordsWithDateSpecified,
    };

    /** получаем максимальный массив из выученных слов (но не более, чем needToBeLearnedWords) */
    const resLearnedArr = this.wordsHelper.formLearnedArray(wordsArraysObj, needToBeLearnedWords);

    const wordsIds = (resLearnedArr.length !== 0)
      ? this.wordsHelper.getWordsIds(resLearnedArr)
      : [this.backendFirstWordId];

    const wordsRaw = await this.getAggregateUserWords(wordsIds);
    const words = wordsRaw.data[0].paginatedResults
      .map((word) => this.reformatWordData(word, true));

    /** @var resWordsArr - массив изученных слов для вывода */
    const resWordsArr = this.wordsHelper.prepareArrayForOutput(words);

    /** дальше происходит магия - берем айдишники выученных слов (последние 5 цифр каждого)
     * переводим их в десятичную систему счисления, находим максимальное число,
     * берем это число + 1 и формируем newWordsPerDay последовательных id,
     * которые конвертируем в 16-систему счисления, добавляя префикс - это айдишники новых слов
     */
    const learnedWordsIds = (allLearnedWordsWithDeleted.length !== 0)
      ? this.wordsHelper.getWordsIds(allLearnedWordsWithDeleted)
      : [this.backendFirstWordId];
    const convertIdsFromHex = this.wordsHelper.convertIdsFromHex(learnedWordsIds);

    // const convertIdsFromHex = this.wordsHelper.convertIdsFromHex(wordsIds);

    const maxId = Math.max(...convertIdsFromHex);
    const idsArr = this.wordsHelper.createArrOfIds(
      newWordsPerDay,
      maxId + 1,
      this.backendWordIdPrefix,
    );

    const resNewWordsArr = this.wordsHelper.addNewMark(idsArr);

    /** @var returnArray - итоговый, но пока НЕ перемешанный массив из новых и изученных слов */
    const returnArray = resWordsArr.concat(resNewWordsArr);
    const shuffledReturnArray = this.wordsHelper.shuffleArray(returnArray);
    return shuffledReturnArray;
  }

  /** получить слова по агрегированному запросу - объект, в котором есть ВСЁ */
  async getAggregateUserWords(wordsIdsArr) {
    const aggrObj = this.wordsHelper.getAggrWordsIds(wordsIdsArr);
    try {
      const url = `${this.backendURL}users/${this.userId}/aggregatedWords?wordsPerPage=100&filter=${JSON.stringify(aggrObj)}`;
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content = await rawResponse.json();

      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }

  /** получить слово с бэкенда */
  async getNextWord(wordObj) {
    const { id } = wordObj;
    const wordRaw = await this.getWordById(id);
    // добавить обработку ошибок
    return this.reformatWordData(wordRaw.data);
  }

  /** подготовить объект для создания нового слова */
  prepareObjForNewWord(newWordId) {
    const dateToday = this.dateHelper.getBeutifyTodayDate();
    return {
      difficulty: 'normal',
      optional: {
        wordId: newWordId,
        state: 'none',
        date: 'none', // когда слово будет показываться в след. раз
        dateLearned: dateToday, // когда было выучено
        dateLast: dateToday, // когда было показано в послед. раз
        count: 1, // счетчик показов
      },
    };
  }

  /** подготовить объект для обновления слова */
  prepareObjForUpdatedWord(wordObj) {
    const { difficulty, optional } = wordObj;
    const dateToday = this.dateHelper.getBeutifyTodayDate();
    const oldCount = optional.count;
    const newCount = (!oldCount) ? 1 : (oldCount + 1);
    // для существующего слова просто обновляем дату последнего показа и счетчик показов
    optional.dateLast = dateToday;
    optional.count = newCount;

    const newWordObj = {
      difficulty,
      optional,
    };

    return newWordObj;
  }

  /** обработать угаданное слово - Нажатие на кнопку "Далее"
   * @param {Object} wordObj - объект слова
   * wordObj = {
   *   id: String // "5e9f5ee35eb9e72bc21af4a0" - id слова на бэкенде
   *   isNew: Boolean // новое слово или изученное
   *   ... + другие поля для уже изученных слов
   * }
  */
  async processSolvedWord(wordObj) {
    this.increaseTodayWordsCount(); // без await, результат ждать не нужно
    const res = (!wordObj.isNew)
      ? await this.processLearnedWord(wordObj)
      : await this.processNewWord(wordObj);

    return res;
  }

  /** обработать новое слово - подготовить стандрартный объект,
   * сделать POST */
  async processNewWord(wordObj) {
    const { id } = wordObj;
    const newWordObj = this.prepareObjForNewWord(id);
    const res = await this.createLearnedWord(id, newWordObj);
    return res;
  }

  /** обработать существующее слово - получить слово по id,
   * обновить счетчик и дату, сделать PUT */
  async processLearnedWord(wordObj) {
    const { id } = wordObj;
    const existedWordRaw = await this.getUserWordById(id);
    const { data: existedWord } = existedWordRaw;
    const newWordObj = this.prepareObjForUpdatedWord(existedWord);
    const res = await this.updateUserWord(id, newWordObj);
    return res;
  }

  /** добавить слово в слова пользователя на бэкенде */
  async createLearnedWord(wordId, wordObj) {
    try {
      const url = `${this.backendURL}users/${this.userId}/words/${wordId}`;
      const rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordObj),
      });
      const content = await rawResponse.json();

      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }

  /** обновить слово в словах пользователя на бэкенде */
  async updateUserWord(wordId, wordObj) {
    try {
      const url = `${this.backendURL}users/${this.userId}/words/${wordId}`;
      const rawResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordObj),
      });
      const content = await rawResponse.json();

      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }

  /** получить слово с бэкенда по id */
  async getWordById(id) {
    const url = `${this.backendURL}words/${id}?noAssets=true`;
    try {
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const content = await rawResponse.json();

      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }

  /** установить нужную сложность слову
   * @param {String} wordId - id слова на бэкенде
   * @param {String} difficulty - сложность (weak|normal|hard)
  */
  async setWordDifficultAs(wordId, newDifficulty = 'normal') {
    const { data: { optional } } = await this.getUserWordById(wordId);
    const newWord = {
      difficulty: newDifficulty,
      optional,
    };
    const res = await this.updateUserWord(wordId, newWord);
    return res;
  }

  /** установить нужное состояние слову
   * @param {String} wordId - id слова на бэкенде
   * @param {String} newState - состояние (none|deleted)
  */
  async setWordStateAs(wordId, newState = 'none') {
    const { data: { difficulty, optional } } = await this.getUserWordById(wordId);
    const newOptional = { ...optional };

    newOptional.state = newState;
    const newWord = {
      difficulty,
      optional: newOptional,
    };

    const res = await this.updateUserWord(wordId, newWord);
    return res;
  }

  /** установить нужную дату следующего показа слову
   * @param {String} wordId - id слова на бэкенде
   * @param {String} newDate - дата (в формате YYYY-MM-DD)
  */
  async setWordDateAs(wordId, newDate) {
    const { data: { difficulty, optional } } = await this.getUserWordById(wordId);
    const newOptional = { ...optional };

    newOptional.date = newDate;
    const newWord = {
      difficulty,
      optional: newOptional,
    };

    const res = await this.updateUserWord(wordId, newWord);
    return res;
  }

  /** добавить слово в сложные */
  async addWordToHard(wordId) {
    const res = await this.setWordDifficultAs(wordId, 'hard');
    return res;
  }

  /** сделать слово нормальным (удалить из сложных) */
  async addWordToNormal(wordId) {
    const res = await this.setWordDifficultAs(wordId, 'normal');
    return res;
  }

  /** сделать слово легким (удалить из сложных) */
  async addWordToWeak(wordId) {
    const res = await this.setWordDifficultAs(wordId, 'weak');
    return res;
  }

  /** добавить слово в удаленные */
  async addWordToDeleted(wordId) {
    const res = await this.setWordStateAs(wordId, 'deleted');
    return res;
  }

  /** удалить слово из удаленных */
  async removeWordFromDeleted(wordId) {
    const res = await this.setWordStateAs(wordId, 'none');
    return res;
  }

  /** установить интервал для кнопки "Просто" - 1 месяц */
  async setIntervalAsEasy(wordId) {
    const date = DateHelper.getNextMonthDate();
    const res = await this.setWordDateAs(wordId, date);
    return res;
  }

  /** установить интервал для кнопки "Хорошо" - 1 неделя */
  async setIntervalAsGood(wordId) {
    const date = DateHelper.getNextWeekDate();
    const res = await this.setWordDateAs(wordId, date);
    return res;
  }

  /** установить интервал для кнопки "Сложно" - 1 день */
  async setIntervalAsHard(wordId) {
    const date = DateHelper.getTomorrowDate();
    const res = await this.setWordDateAs(wordId, date);
    return res;
  }

  /** установить интервал для кнопки "Снова" - сегодня */
  async setIntervalAsAgain(wordId) {
    const date = DateHelper.getTodayDate();
    const res = await this.setWordDateAs(wordId, date);
    return res;
  }


  /** получить слово ПОЛЬЗОВАТЕЛЯ с бэкенда по id */
  async getUserWordById(wordId) {
    const url = `${this.backendURL}users/${this.userId}/words/${wordId}`;
    try {
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const content = await rawResponse.json();

      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }


  /** APP DICTIONARY METHODS - BEGIN */

  /** получить слова для словаря в объекте из 3 массивов:
   * 1) все, кроме удаленных,
   * 2) все сложные,
   * 3) все удаленные
   */
  async getWordsForDictionary() {
    const aggrAllLearnedWordsObj = this.wordsHelper.getAggrObgForAllLearnedWords();
    const allLearnedWordsWithDeletedRaw = await this
      .getAggregateUserWordsByObj(aggrAllLearnedWordsObj, 1000);
    const allLearnedWordsWithDeleted = allLearnedWordsWithDeletedRaw.data[0].paginatedResults
      .map((word) => this.reformatWordData(word, true));
    const mappedWordsForDictionary = this.wordsHelper
      .getLearnHardDeletedWords(allLearnedWordsWithDeleted);
    return mappedWordsForDictionary;
  }

  /** APP DICTIONARY METHODS - END */

  /** получить все слова, изученные за переданную дату
   * @param {String} date - дата в формате YYYY-MM-DD (если не передана - сегодняшняя дата)
   * @return {Array} - массив выученных слов за переданную дату
   */
  async getLearnedWordsByDate(date = null) {
    const searchDate = (date) || this.dateHelper.getBeutifyTodayDate();
    const { data: learnedWords } = await this.getAllLearnedWordsFromBackend();
    return this.wordsHelper.getWordsByDate(learnedWords, searchDate);
  }

  /** получить КОЛИЧЕСТВО выученных слов за переданную дату
   * @param {String} date - дата в формате YYYY-MM-DD (если не передана - сегодняшяя дата)
   * @return {Number} - кол-во выученных слов за дату
  */
  async getHowManyLearnedWordsByDate(date = null) {
    const learnedWordsByDate = await this.getLearnedWordsByDate(date);
    return learnedWordsByDate.length;
  }

  /** APP STATISTICS METHODS - BEGIN */

  /** получить объекты всех изученных слова с указанной датой изучения, сгруппир. по датам */
  async groupLearnedWordsByDates() {
    const aggrObjForDatesLearned = this.wordsHelper.getAggrObgForDateLearned();
    const aggrWordsRaw = await this.getAggregateUserWordsByObj(aggrObjForDatesLearned, 1000);
    const aggrWords = aggrWordsRaw.data[0].paginatedResults
      .map((word) => this.reformatWordData(word, true));
    const mappedWords = this.wordsHelper.getWordsMappedByDates(aggrWords);
    return mappedWords;
  }

  /** получить массив объектов вида {Дата:Кол-во изученных слов} для всех дат */
  async getLearnedWordsCountByDates() {
    const rawWordsByDates = await this.groupLearnedWordsByDates();
    const wordsCountByDates = this.wordsHelper.getWordsCountByDates(rawWordsByDates);
    return wordsCountByDates;
  }

  /** получить массив объектов вида {Дата:[слова]} для всех дат */
  async getLearnedWordsByDates() {
    const rawWordsByDates = await this.groupLearnedWordsByDates();
    const wordsByDates = this.wordsHelper.getWordsByDates(rawWordsByDates);
    return wordsByDates;
  }

  /**
   * получить универсальный объект для статистики
   * {
   *  wordsByDates: [{дата: массив слов, изученных в эту дату},...]
   *  wordsCountByDates: [{дата: кол-во слов, изученных в эту дату},...]
   * }
   * */
  async getBothWordsAndCountByDates() {
    const rawWordsByDates = await this.groupLearnedWordsByDates();
    const wordsCountByDates = this.wordsHelper.getWordsCountByDates(rawWordsByDates);
    const wordsByDates = this.wordsHelper.getWordsByDates(rawWordsByDates);
    return {
      wordsByDates,
      wordsCountByDates,
    };
  }

  /** APP STATISTICS METHODS - END */

  /**
   * получить агрегированные слова пользователя в соответствии с запросом
   * @param {JSON} aggrObj - объект с агрегированным запросом (валидный JSON)
   * @param {Number} count - кол-во записей (по умолчанию 50)
  */
  async getAggregateUserWordsByObj(aggrObj, count = 1000) {
    try {
      const url = `${this.backendURL}users/${this.userId}/aggregatedWords?wordsPerPage=${count}&filter=${aggrObj}`;
      const rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const content = await rawResponse.json();

      return { data: content, error: false, errorText: '' };
    } catch (e) {
      return { error: true, errorText: 'Ошибка при получении слов. Попробуйте еще раз попозже' };
    }
  }

  /** АВТОРИЗАЦИЯ */

  /** проверить, что в localStorage есть данные и они валидны (токен действует) */
  async checkUser() {
    const isUserLogged = await this.authHelper.checkUser();
    return isUserLogged;
  }

  /** перенаправить на страницу  */
  redirectToLogin() {
    this.authHelper.redirectToLogin();
  }

  redirectToMain() {
    this.authHelper.redirectToMain();
  }
}
