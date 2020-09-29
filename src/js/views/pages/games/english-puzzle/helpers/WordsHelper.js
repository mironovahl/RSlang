
const WordsHelper = {
  /**
   * вернуть массив слов с удаленными тегами <b>
   *
   * @param {Object[]} words - массив объектов со словами:
   * [ {id, group, page, word, translate, textExample, textExampleTranslate ...}]
   *
   * @return {Object[]} - массив объектов со словами без тегов <br>
   */
  correctWords(words) {
    return words
      .map((word) => Object
        .assign(word, { textExample: this.replaceTags(word.textExample) }));
  },

  /**
   * удалить теги <b> из строки
   * @param {string} phrase
   *
   * @return {string} строка без тегов <b>
   */
  replaceTags(phrase) { //
    const regExp = /<b>(.+)<\/b>/;
    return phrase.replace(regExp, '$1');
  },

  /**
   * вернуть массив из угаданных слов из текущего раунда и страницы
   * @param {Object[]} allWords - все слова раунда
   * @param {Object[]} round - текущий раунд
   *
   * @return [] - массив хар-ками одного слова
   */
  getSolvedBySettings(allWords, round) {
    return allWords.slice(0, round);
  },

  /**
   * вернуть объект слова для текущего раунда
   * @param {Object[]} allWords - все слова раунда
   * @param {Object[]} round - текущий раунд
   *
   * @return [] - массив хар-ками одного слова
   */
  getCurrentBySettings(allWords, round) {
    return allWords.slice(round, round + 1)[0];
  },

  shuffleCurrent(currentWordObj) {
    const { textExample: phrase } = currentWordObj;
    const phraseArr = phrase.split(' ');
    this.shuffleArray(phraseArr);
    const shuffledWordObjArr = phraseArr.map((word, index) => ({
      text: word,
      order: index,
      width: null,
    }));
    return shuffledWordObjArr;
  },

  /**
   * перемешать слова в предложении (алгоритм Фишера-Ейтса)
   * */
  shuffleArray(wordsArr) {
    const newArr = wordsArr; // чтобы избежать "no-param-reassign" eslint
    for (let i = newArr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  },
};

export default WordsHelper;
