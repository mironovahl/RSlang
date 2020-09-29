const ArrayHelper = {

  /**
   * получить новый массив с учетом сдвига от нового элемента
   * @param {Array} arr - массив с хар-ками эл-тов [null, null, {order: 1, text: The, width: 100px}]
   * @param {Number} pos - позиция, на которую добавляется элемент
   *
   * @return {Array} - массив, который получился после добавления нового эл-та
   * */
  getShiftedArray(arr, pos) {
    const newArr = arr.slice();
    let beforeArr = [];
    let middleArr = [];
    let afterArr = [];
    let resArr = [];

    const nullIndPos = this.getNullIndexPos(newArr, pos);
    if (nullIndPos.dir === 'r') {
      const nullPosToRight = nullIndPos.ind;
      beforeArr = newArr.slice(0, pos);
      middleArr = newArr.slice(pos, pos + nullPosToRight);
      afterArr = newArr.slice(pos + nullPosToRight + 1);
      resArr = [].concat(beforeArr, null, middleArr, afterArr);
    } else {
      const nullPosToLeft = nullIndPos.ind;
      beforeArr = newArr.slice(0, pos - nullPosToLeft);
      middleArr = newArr.slice(pos - nullPosToLeft + 1, pos + 1);
      afterArr = newArr.slice(pos + 1);
      resArr = [].concat(beforeArr, middleArr, null, afterArr);
    }
    return resArr;
  },

  /** найти через сколько элементов будет пустой элемент
   * сначала ищутся null-элементы справа, если их нет - слева
   * @param {Array} arr - массив с хар-ками эл-тов [null, null, {order: 1, text: The, width: 100px}]
   * @param {Number} pos - позиция, на которую добавляется элемент
   *
   * @return {Object} {dir: 'l' | 'r', ind: Number}
   *  dir - в каком направлении найден null-эл-т (слева или справа)
   *  ind - сколько элементов до него от pos
  */
  getNullIndexPos(arr, pos) {
    let resObj = {};

    const arrToRight = arr.slice(pos);
    const arrToLeft = arr.slice(0, pos + 1).reverse();

    const nullIndex = arrToRight.findIndex((element) => (element === null));

    if (nullIndex > -1) { // если пустой элемент справа, он уже найден
      resObj = {
        dir: 'r',
        ind: nullIndex,
      };
    } else { // если пустой элемент слева, найти его индекс
      resObj = {
        dir: 'l',
        ind: arrToLeft.findIndex((element) => (element === null)),
      };
    }
    return resObj;
  },

  /** найти индекс первого null-элемента в массиве */
  getFirstNullInd(arr) {
    return arr.findIndex((elem) => elem === null);
  },

};

export default ArrayHelper;
