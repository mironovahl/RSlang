import '../../../../../css/pages/games/Sprint/Sprint.scss';
import '../../../../../css/pages/games/allGames.scss';
import Utils from '../../../../services/Utils';
import { generateNewWord, generateLearnWord, timerw } from './SprintGame';
import Game from '../Game';

const Sprint = {
  settings: {
    model: null,
  },

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },

  render: (model) => {
    Sprint.beforeRender();
    Sprint.settings.model = model;
    const view = `
    <div class="sprint allGames">
      <section class="allGames__startScreen">
        <h1 class="allGames__heading">Спринт</h1>
        <p class="allGames__description">Тренировка спринт развивает способности быстрого перевода слов и выражений с английского языка на русский.<br>За более чем три правильных ответа подряд будет начисляться удвоенное количество баллов.</p>
        <div class="allGames__choice">
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

        <button class="allGames__startBtn  btn">Начать</button>
      </section>
      <section class="allGames__timerScreen  allGames__timerScreen-hidden">
        <div class="allGames__timer">3</div>
        <div class="allGames__tip">Используй клавиши влево и вправо, чтобы дать ответ.</div>
      </section>
      <section class="sprint--game  allGames__playScreen  allGames__playScreen-hidden">
        <div class="sprint--game__result">
          <div class="sprint--game__result_points">0</div>
          <div class="sprint--game__result_addPoints"></div>
        </div>
        <div class="sprint--game__card">
          <div class="sprint--card__title">
            <span class="sprint--card__title_check"></span>
            <span class="sprint--card__title_check"></span>
            <span class="sprint--card__title_check"></span>
          </div>
          <div class="sprint--card__list"></div>          
          <div class="sprint--card__list2 hidden"></div>          
          <div class="sprint--card__word">
            <p class="word">word</p>
            <p class="translate">слово</p>
          </div>
          <div class="sprint--card__button">
            <button class="sprint--button__correct">Верно</button>
            <button class="sprint--button__error">Неверно</button>
            <button class="sprint--button__warn hidden">Ок</button>
          </div>
        </div>
        <div class="sprint--game__time">60</div>
        <div class="sprint--game__arrow">
          <div class="sprint--game__arrow_left"></div>          
          <div class="sprint--game__arrow_right"></div>          
        </div>
      </section>

      <section class="sprint--end hidden">
        <div class="sprint--end__message">
          <div class="sprint--card__title">
            <h2 class=sprint--end__title>Результаты тренировки</h2>
          </div>
          <p class="sprint__result">Твой результат <span class="sprint__message__result"></span> очков.</p>
          <p class="sprint__averge">Твой средний результат <span class="sprint__message__average"></span> очков.</p>
          <p class="sprint__record">Твой рекорд <span class="sprint__message__record"></span> очков.</p>
          <button class="sprint--end__button_repeat" onclick="document.location.reload()">Играть еще раз</button>
          <button class="sprint--end__button_continue" onclick="document.location.reload()">Продолжить</button>
          <button class="sprint--end__button_main" onclick="location.href='/'">Главная страница</button>
          <button class="sprint--end__button_global" onclick="location.href='/'">Глобальная статистика</button>
        </div>
        <div class="sprint--end__statistic hidden">
          <div class="sprint--end__statistic_correct">
            <p class="sprint--end__statistic_correct_text">Правильные ответы</p>
          </div>
          <div class="sprint--end__statistic_error">
            <p class="sprint--end__statistic_error_text">Ответы с ошибками</p>
          </div>
        </div>
        <div class="sprint--end__globalStatistic hidden">
          <table class="globalStatistic__statTable">
            <thead class="statTable__head">
              <tr class="statTable__headRow">
              <th class="statTable__headData">№</th>
                <th class="statTable__headData">Верных ответов</th>
                <th class="statTable__headData">Неверных ответов</th>
                <th class="statTable__headData">Дата игры</th>
              </tr>
            </thead>
            <tbody class="statTable__body">
            </tbody>  
          </table>
          <button class="sprint-globalStatistic__button">Вернуться назад</button>
        </div>

        <div class ="sprint--end__slide">
          <span class="sprint--end__slide_main active"></span>
          <span class="sprint--end__slide_statistic"></span>
        </div>
      </section>
    </div>
    `;
    return view;
  },

  afterRender: async () => {
    const { model } = Sprint.settings;
    Game.startGame(timerw);
    let data = JSON.parse(localStorage.getItem('data'));
    if (data == null) {
      data = [];
      localStorage.setItem('data', JSON.stringify(data));
      data = JSON.parse(localStorage.getItem('data'));
    }

    const startBtn = document.querySelector('.allGames__startBtn');
    startBtn.addEventListener('click', async () => {
      const isNewWords = document.querySelector('.allGames__choice_new').classList.contains('select');

      const level = document.querySelector('#levels').value;
      let round = document.querySelector('#pages').value;

      if (level && round && isNewWords) {
        round -= 1;
        generateNewWord(model, round, level);
      } else {
        generateLearnWord(model);
      }
    });

    Game.initStartScreen();
  },
};

export default Sprint;
