export default function gamePageRendering() {
  return `
  <section class="allGames__startScreen letterSquare letterSquare__startScreen">
    <h1 class="allGames__heading letterSquare__heading">Буквенный квадрат</h1>
      <p class="allGames--description letterSquare--description">Буквенный квадрат — классическое упражнение для запоминания новых слов.</p>
      <div class="allGames allGames__choice">
            <p class="allGames__choice_learn select">Игра с изученными словами</p>
            <p class="allGames__choice_new">Игра с новыми словами</p>
            <div class="allGames__choice_levels hidden">
              <label>Уровень:</label>
              <select name="levels" id="levels">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              <label>Раунд:</label>
              <select name="pages" id="pages">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
    <button class="allGames__startBtn letterSquare--btn__startBtn">Начать</button>
  </section>

  <section class="allGames__timerScreen  allGames__timerScreen-hidden letterSquare">
    <div class="allGames__timer">3</div>
    <div class="allGames__tip letterSquare__tip">Слова могут располагаться слева направо, сверху вниз и наоборот соответственно.
    Ваша задача — найти все за две минуты!</div>
  </section>

    <section class="letterSquare letterSquare__game letterSquare-hidden">
      <div class="letterSquare--game__time">120</div>
      <div class="letterSquare--container">
      <div class="letterSquare--playingField"></div>
      <div id="words" class="letterSquare--wordList">
        <div class="letterSquare--wordList__list">
          <div class="letterSquare--wordList__titleList">
          <div class="letterSquare--wordList__title">Спрятанные слова:</div>
          </div>
        </div>
        <button class="letterSquare--wordList__btnCheck">Найдено слово</button>
        <button class="letterSquare--wordList__btnRemove">Сброс</button>
      </div>
    </div>
    </section>

    <section class="letterSquare letterSquare__statistic letterSquare-hidden">
      <div class="letterSquare--statistic__card">
        <div class="letterSquare--statistic__title">
        <div class="letterSquare--wordList__title">Статистика игры</div>
        </div>
        <div class="letterSquare--statistic__numberWordsFound">Найденные слова: </div>
        <div class="letterSquare--statistic__numberWordsNotFound">Ненайденные слова: </div>
        <button class="letterSquare--statistic__button--play" onclick="document.location.reload()">Играть снова</button>
        <button class="letterSquare--statistic__button--next">Продолжить</button><br>
        <a class="letterSquare--statistic__button--back" onclick="location.href='/'">Перейти на главную страницу</a><br>
        <a class="letterSquare--statistic__button--statistics">Статистика за все игры</a><br>
      </div>
    </section>

    <section class="letterSquare letterSquare--globalStatistic letterSquare-hidden">
      <table class="letterSquare--globalStatistic__statTable">
        <thead class="letterSquare--statTable__head">
          <tr class="letterSquare--statTable__headRow">
          <th class="letterSquare--statTable__headData">№</th>
            <th class="letterSquare--statTable__headData">Верных ответов</th>
            <th class="letterSquare--statTable__headData">Неверных ответов</th>
            <th class="letterSquare--statTable__headData">Дата игры</th>
          </tr>
          </thead>
          <tbody class="letterSquare--statTable__body">
        </tbody>  
      </table>
      <button class="letterSquare--globalStatistic__button">Вернуться назад</button>
    </section>
        `;
}
