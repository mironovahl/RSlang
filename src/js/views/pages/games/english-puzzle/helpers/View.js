const View = {
  getHtml() {
    return `
    <div class="englishPuzzle">
    <div class="englishPuzzle__background"></div>

    <div class="englishPuzzle__startScreen allGames__startScreen">
      <h1 class="englishPuzzle__heading allGames__heading">English Puzzle</h1>
      <p class="englishPuzzle__description allGames__description">
        Тебе предстоит собирать предложения из слов-фрагментов.<br>
        Чтобы поставить слово на нужное место, кликни по нему или перетащи мышкой.<br>
        В одном раунде - 10 предложений, каждому раунду соответствует шедевр живописи.<br>
        Попробуй открыть их все!
      </p>
      <div class="englishPuzzle__choice allGames__choice">
        <p class="allGames__choice_learn select">Игра с изученными словами</p>
        <p class="allGames__choice_new">Игра с новыми словами</p>
        <div class="allGames__choice_levels hidden">
          <label>Уровень:</label>
          <select name="levels" id="levels">
            disabled selected
          </select>
          <label>Раунд:</label>
          <select name="pages" id="pages" size="0">
          </select>
        </div>
      </div>
      <button class="allGames__startBtn">Начать</button>
    </div>

    <div class="englishPuzzle__timerScreen allGames__timerScreen  allGames__timerScreen-hidden">
      <div class="allGames__timer">3</div>
      <div class="timerScreen__tip allGames__tip">Используй подсказки "Перевод", "Произношение" и "Фоновый рисунок",
        если нужна помощь
      </div>
    </div>

    <div class="englishPuzzle__field englishPuzzle__block-hidden allGames__playScreen">
      <div class="englishPuzzle__menu menu">
        <div class="menu__tips tips">
          <div class="tips__button tips__button-autosound" data-tip="autosound" title="Автопроизношение"></div>
          <div class="tips__button tips__button-translate" data-tip="translate" title="Перевод предложения"></div>
          <div class="tips__button tips__button-audio" data-tip="audio" title="Прослушать произношение"></div>
          <div class="tips__button tips__button-picture" data-tip="picture" title="Фоновое изображение"></div>
        </div>
      </div>
      <div class="englishPuzzle__sound sound">
        <div class="sound__icon"></div>
      </div>
      <div class="englishPuzzle__translation"></div>

      <div class="englishPuzzle__phrases phrases">

        <div class="englishPuzzle__phrases-done"></div>

        <div class="englishPuzzle__phrases-round"></div>

        <div class="englishPuzzle__task task">
          <div class="task__words"></div>
        </div>

      </div>

      <div class="englishPuzzle__buttons gameButtons">
        <div class="gameButtons__button gameButtons__button-idk" data-button="idk">Не знаю</div>
        <div class="gameButtons__button gameButtons__button-check" data-button="check">Проверить</div>
        <div class="gameButtons__button gameButtons__button-cont" data-button="cont">Продолжить</div>
        <div class="gameButtons__button gameButtons__button-res" data-button="res">Результаты</div>
      </div>
    </div>

    <div class="englishPuzzle__results englishPuzzle__block-hidden">
      <div class="englishPuzzle__resultsField">

        <div class="englishPuzzle__pictureMinField">
          <div class="pictureMin__img"></div>
          <div class="pictureMin__desc"></div>
        </div>

        <div class="englishPuzzle__results-fail">
          <div class="block__title fail__title">
            Я не знаю <span class="count__idk"></span>
          </div>
          <div class="block__words fail__words">
          </div>
        </div>

        <div class="englishPuzzle__results-success">
          <div class="block__title success__title">
            Я знаю <span class="count__iknow"></span>
          </div>
          <div class="block__words success__words">
          </div>
        </div>

        <div class="englishPuzzle__buttons results__buttons">
          <div class="results__button gameButtons__button gameButtons__button-repeat" data-button="repeat">
            Повторить</div>
          <div class="results__button gameButtons__button gameButtons__button-resCont">Продолжить</div>
        </div>
        <div class="englishPuzzle__link englishPuzzle__link-stats">Статистика</div>
        <div class="englishPuzzle__link englishPuzzle__link-start">На Главную</div>

      </div>
    </div>

    <div class="englishPuzzle__picture englishPuzzle__block-hidden">

      <div class="englishPuzzle__pictureField">
        <div class="picture__img"></div>
        <div class="picture__desc"></div>
        <div class="englishPuzzle__buttons">
          <div class="gameButtons__button gameButtons__button-res" data-button="res">Результаты</div>
        </div>
      </div>
    </div>

    <div class="englishPuzzle__stats englishPuzzle__block-hidden">
      <div class="englishPuzzle__statsField">
        <table class="englishPuzzle__statsTable">
          <tr>
            <th>#</th>
            <th>Знаю</th>
            <th>Не знаю</th>
            <th>Дата игры</th>
          </tr>
        </table>

        <div class="englishPuzzle__statsButtons englishPuzzle__buttons">
          <div class="englishPuzzle__statsButtons gameButtons__button gameButtons__button-repeat" data-button="repeat">
            Повторить</div>
          <div class="englishPuzzle__statsButtons gameButtons__button gameButtons__button-resCont">Продолжить
          </div>
        </div>
        <div class="englishPuzzle__link englishPuzzle__link-start">На Главную</div>
      </div>
    </div>
  </div>
  `;
  },
};

export default View;
