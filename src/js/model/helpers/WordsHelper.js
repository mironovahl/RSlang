const WordsHelper = {
  /** вернуть массив НЕудаленных слов */
  removeDeletedWords: (wordsArr) => wordsArr.filter((wordObj) => wordObj.optional.state !== 'deleted'),

  /** вернуть слова, у которых дата совпадает с переданной датой */
  filterWordsWithDate: (wordsArr, date) => wordsArr
    .filter((wordObj) => wordObj.optional.date === date),

  /** вернуть слова, у которых дата указана, и она не соответствует переданной */
  filterWordsDateSpecNotToday: (wordsArr, date) => wordsArr.filter((wordObj) => (wordObj.optional.date !== 'none' && wordObj.optional.date !== date)),

  /**
   * сформировать готовый массив выученных слов
   * @param {Array} wordsArraysObj - {
   *  wordsWithDateToday - слова с датой на сегодня,
   *  wordsWithoutDate - слова без даты,
   *  wordsWithDateSpecified - слова с датой, но НЕ сегодняшней
   * @param {Number} needToBeLearnedWords - массив какой длины должен быть на выходе
   *
   * @return {Array} - массив переданной длины или меньше
   * */
  formLearnedArray: (wordsArraysObj, needToBeLearnedWords) => {
    const { todayWords, withoutDateWords, withDateWords } = wordsArraysObj;
    let resArr = todayWords.slice(0, needToBeLearnedWords);
    if (resArr.length >= needToBeLearnedWords) {
      return resArr;
    }

    resArr = resArr.concat(withoutDateWords).slice(0, needToBeLearnedWords);
    if (resArr >= needToBeLearnedWords) {
      return resArr;
    }

    resArr = resArr.concat(withDateWords).slice(0, needToBeLearnedWords);
    return resArr;
  },

  /** получить массив из id-шников  */
  getIdsFromBook: (wordsArr) => wordsArr.map((wordObj) => wordObj.optional.idInBook),

  /** получить id книг (по 600 слов) на основании id слов */
  getBooksIds: (wordsIdsArr) => wordsIdsArr.map((wordId) => (Math.floor(wordId / 600) + 1)),

  /** вернуть массив из wordId переданных слов */
  getWordsIds: (wordsArr) => wordsArr.map((word) => word.wordId),

  /**
   * подготовить объект для поиска по агрегированным словам
   * @param {Array} wordsIdsArr - массив айдишников [idInBook],
   *
   * @return {Object} - объект для запроса по агрегированным словамм
   * */
  getAggrWordsIds: (wordsIdsArr) => {
    const resArr = [];
    wordsIdsArr.forEach((id) => {
      const resObj = { 'userWord.optional.wordId': id };
      // const resObj = { 'userWord.optional.idInBook': id };
      resArr.push(resObj);
    });
    return { $or: resArr };
  },

  /** подготовить массив для вывода на карточках
   * @return {Array}:
   * все свойства из объекта слова (как в bookN.json) плюс:
   * userWord: {Object} - объект слова с бэкенда,
   * isNew: {Bool} - новое слово или изученное
  */
  prepareArrayForOutput: (wordsArr, isNewWord = false) => wordsArr.map((wordObj) => {
    const newWordObj = { ...wordObj };
    newWordObj.isNew = isNewWord;
    return newWordObj;
  }),

  addNewMark: (wordsArr) => wordsArr.map((id) => ({ id, isNew: true })),

  /** создать массив айдишников заданной длины */
  createArrOfIds: (countEls, startFrom, prefix) => {
    const newArr = Array(countEls);
    newArr.fill(startFrom);
    for (let i = 0; i < countEls; i += 1) {
      newArr[i] += i;
    }

    return newArr.map((id) => `${prefix}${id.toString(16)}`);
  },

  /** сконвертировать id-шники из hex в dec */
  convertIdsFromHex: (idsArr) => idsArr.map((id) => parseInt(id.slice(id.length - 5), 16)),

  /** перемешать массив и вернуть новый перемешанный массив */
  shuffleArray: (arr) => {
    const newArr = arr.slice(0);
    for (let i = newArr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  },

  /** вычислить group и page слова по его id */
  getGroupPageById: (id) => {
    const group = Math.floor(id / 600);
    const div = group % 600;
    const page = Math.floor(div / 20);
    return { group, page };
  },

  findWordInBatch: (batchArr, word) => batchArr.filter((wordObj) => wordObj.word === word)[0],

  /** профильтровать массив и оставить только те, которые были изучены сегодня */
  getWordsByDate: (wordsArr, date) => wordsArr
    .filter((wordObj) => (wordObj.optional.dateLearned && wordObj.optional.dateLearned === date)),

  /** сгруппировать выученные слова по датам */
  getWordsMappedByDates: (wordsArr) => {
    // взять только те слова, у которых даты указаны
    const wordsWithDate = wordsArr.filter(((wordObj) => wordObj.userWord.optional.dateLearned));
    const resObj = {};
    wordsWithDate.forEach((wordObj) => {
      const key = wordObj.userWord.optional.dateLearned;
      const value = wordObj;
      if (!(key in resObj)) {
        resObj[key] = [];
      }
      resObj[key].push(value);
    });
    return resObj;
  },

  /**
   * получить агрегированный объект для запроса "слова с указанными dateLearned"
   * @param {Boolean} isJson - отдать в виде Json или в виде js-объекта
   * @return {JSON | Object}
   * */
  getAggrObgForDateLearned: (isJson = true) => {
    const aggrObj = { $and: [{ 'userWord.optional.dateLearned': { $gt: '1' } }] };
    return (!isJson)
      ? aggrObj
      : JSON.stringify(aggrObj);
  },

  /**
   * получить агрегированный объект для запроса "изученные слова"
   * @param {Boolean} isJson - отдать в виде Json или в виде js-объекта
   * @return {JSON | Object}
   * */
  getAggrObgForAllLearnedWords: (isJson = true) => {
    const aggrObj = { $and: [{ 'userWord.optional.state': { $gt: '1' } }] };
    return (!isJson)
      ? aggrObj
      : JSON.stringify(aggrObj);
  },

  /** получить массив объектов вида {дата:кол-во изуч слов}  */
  getWordsCountByDates: (aggrObj) => {
    const resObj = {};
    Object.entries(aggrObj).forEach(([key, value]) => {
      resObj[key] = value.length;
    });
    return resObj;
  },

  /** получить массив объектов вида {дата:изуч слова}  */
  getWordsByDates: (aggrObj) => {
    const resObj = {};
    Object.entries(aggrObj).forEach(([key, value]) => {
      resObj[key] = value.map((wordObj) => wordObj.word);
    });
    return resObj;
  },

  /** получить 3 массива слов для словаря:
   * - все, кроме удаленных,
   * - все сложные,
   * - все удаленные
  */
  getLearnHardDeletedWords: (wordsArr) => {
    const deletedWords = wordsArr
      .filter((word) => word.userWord.optional.state === 'deleted');
    const hardWords = wordsArr
      .filter((word) => word.userWord.difficulty === 'hard');
    const allWords = wordsArr
      .filter((word) => word.userWord.optional.state !== 'deleted');

    return {
      allWords,
      hardWords,
      deletedWords,
    };
  },

  /** объект настроек по умолчанию для словаря и карточек */
  getDefaultWordsSettings: () => ({
    newWordsPerDay: 20,
    maxWordsPerDay: 40,
    isWordTranslate: true,
    isTextMeaning: true,
    isTextExample: true,
    isTextMeaningTranslate: true,
    isTextExampleTranslate: true,
    isTranscription: true,
    isImage: false,
    isAnswerButton: false,
    isDeleteWordButton: false,
    isMoveToDifficultButton: false,
    isIntervalButtons: false,
    dictionary: {
      example: true,
      meaning: true,
      transcription: true,
      img: true,
    },
  }),

  /** объект статистики по умолчанию для словаря и карточек */
  getDefaultStatsObj: () => ({
    learnedWords: 0,
    optional: {
      todayWords: {
        date: '',
        counter: 0,
      },
      games: {
        au: [],
        ep: [],
        sv: [],
        si: [],
        sp: [],
        sq: [],
      },
    },
  }),
};

export default WordsHelper;
