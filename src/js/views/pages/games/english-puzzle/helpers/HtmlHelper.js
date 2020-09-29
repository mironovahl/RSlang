import Config from '../settings/gameConfig';

const HtmlHelper = {

  /** удалить весь динамический контент, спрятать все блоки (игра, результаты) */
  clearAndHideAll() {
    this.clearAll();
    this.hideAll();
  },

  /** очистить и скрыть все поля (игра, статистика) */
  clearAll() {
    this.clearStartScreen();
    // this.clearTimerScreen(); // нечего удалять
    this.clearGameField();
    this.clearResults();
    this.clearPicture();
    this.clearStats();
  },

  /** очистить меню на стартовом экране */
  clearStartScreen() {
    const menuLevelContainer = document.getElementById(Config.containers.start.menus.ids.level);
    const menuPageContainer = document.getElementById(Config.containers.start.menus.ids.page);

    const containers = [
      menuLevelContainer,
      menuPageContainer,
    ];

    this.clearContainers(containers);
  },

  /** очистить игровое поле - собранные слова, поле сбора, перемеш. слова и т.д. */
  clearGameField() {
    const donePhrasesContainer = document.querySelector(Config.containers.donePhrases);
    const roundPhraseContainer = document.querySelector(Config.containers.roundPhrase);
    const taskPhraseContainer = document.querySelector(Config.containers.taskPhrase);
    const translationContainer = document.querySelector(Config.containers.translation);

    const containers = [
      donePhrasesContainer,
      roundPhraseContainer,
      taskPhraseContainer,
      translationContainer,
    ];

    this.clearContainers(containers);
  },

  /** очистить страницу с результатами */
  clearResults() {
    const failContainer = document.querySelector(Config.containers.resultsFail);
    const failCount = failContainer.querySelector(Config.containers.failCount);
    const failWordsContainer = failContainer.querySelector(Config.containers.failWords);
    const successContainer = document.querySelector(Config.containers.resultsSuccess);
    const successCount = successContainer.querySelector(Config.containers.successCount);
    const successWordsContainer = successContainer.querySelector(Config.containers.successWords);

    const containers = [
      failCount,
      failWordsContainer,
      successCount,
      successWordsContainer,
    ];

    this.clearContainers(containers);
  },

  /** очистить контейнер с картиной */
  clearPicture() {
    const pictureContainer = document.querySelector(Config.containers.picture);
    const pictureImg = pictureContainer.querySelector(Config.containers.pictureImg);
    const pictureDesc = pictureContainer.querySelector(Config.containers.pictureDesc);
    pictureImg.style.backgroundImage = 'none';
    pictureDesc.innerHTML = '';
  },

  /** очистить таблицу со статистикой */
  clearStats() {
    const statsTable = document.querySelector(Config.containers.statsTable);
    const trs = Array.from(statsTable.querySelectorAll('tr'));
    const trsWithData = trs.slice(1);
    trsWithData.forEach((tr) => tr.remove());
  },

  /** спрятать все контейнеры (добавить класс) - игра, статистика */
  hideAll() {
    const { pages, containers } = Config;
    const containersArr = [];
    Object.values(pages).forEach((key) => {
      const container = document.querySelector(containers[key]);
      containersArr.push(container);
    });

    this.hideContainers(containersArr);
  },

  /** очистить переданные контейнеры (стереть контент) */
  clearContainers(containersArr) {
    // containersArr.forEach((container) => container.innerHTML = '');
    const copyConts = containersArr;
    copyConts.forEach((container) => this.clearContainer(container));
  },

  /** очистить один контейнер (стереть контент) */
  clearContainer(container) {
    const copyCont = container;
    copyCont.innerHTML = '';
  },

  /** спрятать контейнеры */
  hideContainers(containersArr) {
    containersArr.forEach((container) => {
      if (!container.classList.contains(Config.cssStyles.hidden)) {
        container.classList.add(Config.cssStyles.hidden);
      }
      return true;
    });
  },

  /** показать страницу (удалить спрятанный класс у нее) */
  showPage(selectorStyle) {
    const page = document.querySelector(selectorStyle);
    page.classList.remove(Config.cssStyles.hidden);
    page.classList.remove(Config.cssStyles.hiddenAll);
  },

  /**
   * сделать элемент пустым - серый цвет, фикс ширина, flex-grow = 0;
   *
   * @param {HTMLElement} elem - элемент, который нужно сделать пустым
   * @param {float} width - ширина, которую нужно назначить пустому элементу
   * */
  makeElementEmpty(elem, width) {
    const copyEl = elem;
    copyEl.classList.add(Config.cssStyles.emptyWord);
    copyEl.innerHTML = '';
    copyEl.style.width = `${width}px`;
    copyEl.style.flexGrow = '0';
    copyEl.draggable = false;
    copyEl.style.backgroundImage = 'none';
  },

  /** получить название картины для вывода (автор - название (год))
   * @param {Object} pictureObj - объект картины { author, name, year }
   * @return {String}
   */
  beautifyAuthorText(pictureObj) {
    const { author, name, year } = pictureObj;
    const authorWoCommas = author.replace(/,/g, '');
    const authorWoCommasArr = authorWoCommas.split(' ');
    const [authorName] = authorWoCommasArr;
    const beautifyName = authorName.charAt(0).toUpperCase() + authorName.slice(1).toLowerCase();
    const fullName = (authorWoCommasArr.length > 1)
      ? `${beautifyName} ${authorWoCommasArr[1]}`
      : `${beautifyName}`;
    return `${fullName} - ${name} (${year})`;
  },

  /** привести тайстамп к формату ДД-ММ-ГГГГ ЧЧ:MM:CC */
  beautifyUnixDate(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = `${date.getMinutes()}`;
    const seconds = `${date.getSeconds()}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    // const formattedTime = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    return formattedTime;
  },

  /** удалить бэкграунд контейнера */
  deleteBgImage(cont) {
    const copyCont = cont;
    copyCont.style.backgroundImage = 'none';
  },

  /** отрисовать бэкграунд эл-та в зависимости от конфига */
  showBgImageByConfig(elem, config) {
    const elemCopy = elem;
    elemCopy.style.backgroundImage = config.bgImg;
    elemCopy.style.backgroundPosition = config.bgPos;
  },

  /** обновить слово - задать новые текст, ширину, порядок */
  updateElement: (element, newText, newWidth, newOrder, newBgImg, newBgPos) => {
    const copyEl = element;
    copyEl.innerHTML = newText;
    copyEl.classList.remove('empty');
    copyEl.style.width = `${newWidth}px`;
    copyEl.style.flexGrow = '0';
    copyEl.dataset.orderTask = newOrder;
    copyEl.draggable = true;
    copyEl.style.backgroundImage = newBgImg;
    copyEl.style.backgroundPosition = newBgPos;
  },

  /**
   * вернуть параметры кликнутого слова - ширину, текст, порядок, задник и позиционирование
   * @param {HTMLElement} element - html-элемент
   */
  getClickedElParams: (element) => ({
    width: element.getBoundingClientRect().width,
    text: element.innerHTML,
    order: element.dataset.orderTask,
    bgImg: element.style.backgroundImage,
    bgPos: element.style.backgroundPosition,
  }),

};

export default HtmlHelper;
