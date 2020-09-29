import '../../../css/pages/games.scss';

const AllGames = {
  render: () => {
    const view = `
    <div class="allGames">
      <div class="wrapper">
        <h1 class="allGames__title">Все игры</h1>
        <p class="allGames__description"> В наших играх ты сможешь потренировать свои навыки и улучшить знания английского языка.</p>
        <div class="allGames__cards">

          <div class="allGames__gameCard auditionGame" id="audition">
            <div class="gameCard__title">Аудиовызов</div>
            <div class="gameCard__icon"></div>
            <div class="gameCard__hint auditionGame">
              <div class="gameCard__hint-description">Улучшает восприятие английской речи на слух.</div>
              <div class="gameCard__hint-skills">
                <div class="gameCard__hint-icon listening"></div>
                <div class="gameCard__hint-icon vocabulary"></div>
              </div>
            </div>
          </div>

          <div class="allGames__gameCard sprintGame" id="sprint">
            <div class="gameCard__title">Спринт</div>
            <div class="gameCard__icon"></div>
            <div class="gameCard__hint sprintGame">
                <div class="gameCard__hint-description">Учит быстро переводить с английского на ваш родной язык.</div>
                <div class="gameCard__hint-skills">
                  <div class="gameCard__hint-icon vocabulary"></div>
                </div>
            </div>
          </div>

          <div class="allGames__gameCard speakitGame" id="speakit">
            <div class="gameCard__title">Скажи это</div>
            <div class="gameCard__icon"></div>
            <div class="gameCard__hint speakitGame">
              <div class="gameCard__hint-description">Тренировка произношения слов.</div>
              <div class="gameCard__hint-skills">
                <div class="gameCard__hint-icon vocabulary"></div>
                <div class="gameCard__hint-icon voice"></div>
              </div>
            </div>
          </div>

          <div class="allGames__gameCard english-puzzleGame" id="english-puzzle">
            <div class="gameCard__title">Пазл</div>
            <div class="gameCard__icon"></div>
            <div class="gameCard__hint english-puzzleGame">
              <div class="gameCard__hint-description">Учит правильно составлять предложения.</div>
              <div class="gameCard__hint-skills">
                <div class="gameCard__hint-icon grammar"></div>
                <div class="gameCard__hint-icon writing"></div>
              </div>
            </div>
          </div>

          <div class="allGames__gameCard savannahGame" id="savannah">
            <div class="gameCard__title">Саванна</div>
            <div class="gameCard__icon"></div>
            <div class="gameCard__hint savannahGame">
              <div class="gameCard__hint-description">Тренировка развивает словарный запас.</div>
              <div class="gameCard__hint-skills">
                <div class="gameCard__hint-icon vocabulary"></div>
                <div class="gameCard__hint-icon writing"></div>
              </div>
            </div>
          </div>

          <div class="allGames__gameCard squareGame" id="letter-square">
            <div class="gameCard__title">Буквенный квадрат</div>
            <div class="gameCard__icon"></div>
            <div class="gameCard__hint squareGame">
              <div class="gameCard__hint-description">Буквенный квадрат — классическое упражнение для запоминания новых слов.</div>
              <div class="gameCard__hint-skills">
                <div class="gameCard__hint-icon vocabulary"></div>
                <div class="gameCard__hint-icon writing"></div>
                <div class="gameCard__hint-icon grammar"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    `;
    return view;
  },

  addInfoMouseHandler() {
    const cardInfoButton = document.querySelectorAll('.gameCard__icon');
    cardInfoButton.forEach((elem) => {
      elem.addEventListener('mouseover', ({ target }) => {
        const cardBlock = target.closest('.allGames__gameCard');
        const hintBlock = cardBlock.lastElementChild;
        hintBlock.classList.add('visible');
      });
      elem.addEventListener('mouseout', ({ target }) => {
        const cardBlock = target.closest('.allGames__gameCard');
        const hintBlock = cardBlock.lastElementChild;
        hintBlock.classList.remove('visible');
      });
    });
  },

  afterRender: async () => {
    AllGames.addInfoMouseHandler();

    const gameCards = document.querySelectorAll('.allGames__gameCard');
    gameCards.forEach((elem) => {
      elem.setAttribute('onclick', `location.href='#/games/${elem.id}'`);
    });
  },
};

export default AllGames;
