import AppModel from '../../../../../model/AppModel';

export default class Render {
  async results(words, errors) { // вывести страницу с результатом
    const errorsContainer = document.querySelector('.results__errors');
    const correctWordsContainer = document.querySelector('.results__correct__words');
    const uncorrectWordsContainer = document.querySelector('.results__uncorrect__words');
    this.clearContainer(uncorrectWordsContainer);
    this.clearContainer(correctWordsContainer);

    errorsContainer.innerText = `Ошибок: ${errors}`;
    const correctDivListWords = document.querySelectorAll('.words__container .correct');
    const correctDivWords = Array.from(correctDivListWords);
    const correctWords = [];
    const unCorrectWords = [];
    words.forEach((element) => {
      let correct = false;
      correctDivWords.forEach((word) => {
        if (word.dataset.word.toLowerCase() === element.word.toLowerCase()) {
          correct = true;
          correctWords.push(element);
        }
      });
      if (!correct) unCorrectWords.push(element);
    });

    correctWords.forEach((word) => this.statForWord(word, '.results__correct__words'));
    unCorrectWords.forEach((word) => this.statForWord(word, '.results__uncorrect__words'));
  }

  async globalResults() {
    const model = new AppModel();
    const gamesInfo = await model.getStatForGame('si');
    if (gamesInfo) {
      gamesInfo.forEach((game) => this.gameRes(game));
    }
  }

  clearGlobalResults() {
    const resTable = document.querySelector('.global__results table');
    const tds = resTable.querySelectorAll('td');
    tds.forEach((td) => td.remove());
  }

  async clearWords() { // удалить все слова из блоков, заменить картинку, удалить перевод
    const words = document.querySelectorAll('.words__container .word');
    words.forEach((word) => {
      this.clearContainer(word);
      word.classList.remove('pushed');
      word.classList.remove('correct');
    });

    // поставить стандартную картинку
    const imgContainer = document.querySelector('.pic__image img');
    imgContainer.src = '';
    const translateContainer = document.querySelector('.pic__translate');
    translateContainer.innerText = '';
    translateContainer.classList.remove('translation-correct');
    translateContainer.classList.remove('translation-error');
  }

  div(cssClass, text, container) {
    const el = document.createElement('div');
    el.classList.add(cssClass);
    el.innerText = text;
    container.append(el);
    return el;
  }

  clearContainer(container) { // очистить переданный контейнер
    const cont = container;
    cont.innerHTML = '';
  }

  gameRes(gameObj) {
    const globalResContainer = document.querySelector('.global__results table');

    const newTr = document.createElement('tr');

    const dateTd = document.createElement('td');
    dateTd.innerText = gameObj.d;
    newTr.append(dateTd);

    const wordsTd = document.createElement('td');
    wordsTd.innerText = gameObj.y;
    newTr.append(wordsTd);

    const errorsTd = document.createElement('td');
    errorsTd.innerText = gameObj.n;
    newTr.append(errorsTd);

    globalResContainer.append(newTr);
  }

  async statForWord(wordObj, selector) { // вывести статистику для одного слова
    const wordsContainer = document.querySelector(selector);
    const newWord = document.createElement('div');
    newWord.classList.add('stat__word');

    const newWordSoundIcon = document.createElement('div');
    newWordSoundIcon.classList.add('sound__icon');
    newWordSoundIcon.dataset.audio = wordObj.audio;
    newWord.append(newWordSoundIcon);

    const newWordText = document.createElement('div');
    newWordText.classList.add('text');
    newWordText.innerText = wordObj.word;
    newWord.append(newWordText);

    const newWordTransciption = document.createElement('div');
    newWordTransciption.classList.add('transcription');
    newWordTransciption.innerText = wordObj.transcription;
    newWord.append(newWordTransciption);

    const newWordTranslate = document.createElement('div');
    newWordTranslate.classList.add('translate');
    newWordTranslate.innerText = wordObj.wordTranslate;
    newWord.append(newWordTranslate);
    wordsContainer.append(newWord);
  }

  words(words) { // отрисовать слова в контейнере
    const wordsContainer = document.querySelectorAll('.words__container .word');
    words.forEach((word, i) => this.word(word, wordsContainer[i]));
  }

  word(word, container) { // отрисовать блок со словом
    const cont = container;
    cont.dataset.word = word.word.toLowerCase();
    this.div('word__icon', '', container);
    const container2 = this.div('word__word', null, container);
    this.div('word__english', word.word, container2);
    this.div('word__transcription', word.transcription, container2);
  }
}
