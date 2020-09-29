import AppModel from '../../../../../model/AppModel';

export default class Storage {
  saveGame(errors, wordsArr) { // записать результаты игры в localStorage
    const model = new AppModel();
    model.saveStatForGame({ name: 'si', y: wordsArr.length, n: errors });
  }

  saveLevelAndPage(level, page) {
    localStorage.setItem('speakItlevel', JSON.stringify({ levels: level, pages: page }));
  }

  getData(data) {
    return JSON.parse(localStorage.getItem(data));
  }
}
