import '../../../css/pages/main.scss';

const Home = {
  render: async () => {
    const view = /* html */`
          <div class="mainPage">
            <div class="wrapper">
              <div class="maimPage__content">
                <div class="mainPage__content_promo">
                  <div class="mainPage_promo_image"></div>
                  <div class="mainPage_promo_text">
                    <h2 class="mainPage_promo_title">Английский язык - это просто</h2>
                    <p class="mainPage_promo_description">
                      RS Lang - это приложение для веселого и эффективного изучения английского языка. Узнавай новые слова, закрепляй их с помощью мини-игр, зарабатывай очки и отслеживай свой прогресс, когда тебе удобно!
                    </p>
                    <div class="mainPage_promo_button">
                      <a class="mainPage-button-link" href="#/login">
                        <button class="mainPage_button-login">Войти</button>
                      </a>
                      <a class="mainPage-button-link" href="#/login">
                        <button class="mainPage_button-signin">Зарегистироваться</button>
                      </a>
                    </div>
                  </div>
                  <div class="mainPage_promo_description"></div>
                </div>
                <div class="mainPage__content_message hidden">
                  <div class="mainPage_message-card">
                    <div class="mainPage_message-card_title">
                      <p>Раздел заблокирован</p>
                      <button class="mainPage_message-buttonClose"></button>
                    </div>
                    <p class="mainPage_message-card_description">Для того чтобы перейти в этот раздел, необходимо авторизоваться.</p>
                    <a class="mainPage-message-link" href="#/login">
                      <button class="mainPage_message-card_button">Войти</button>
                    </a>
                  </div>
                </div>
                <div class="mainPage__content_blocks">
                  <div class="mainPage_block-card mainPage-bigCard"">
                    <h2 class="mainPage_block-title">Изучение слов</h2>
                    <a class="mainPage-card-link" href="#/cards"></a>
                    <div class="mainPage-card-shadow"></div>
                    <div class="mainPage-card-locking"></div>
                  </div>
                  <div class="mainPage_block-game mainPage-smallCard">
                    <h2 class="mainPage_block-title">Игры</h2>
                    <a class="mainPage-card-link" href="#/games/all"></a>
                    <div class="mainPage-card-shadow"></div>
                    <div class="mainPage-card-locking"></div>
                  </div>
                  <div class="mainPage_block-statistics mainPage-smallCard">
                    <h2 class="mainPage_block-title">Статистика</h2>
                    <a class="mainPage-card-link" href="#/stats"></a>
                    <div class="mainPage-card-shadow"></div>
                    <div class="mainPage-card-locking"></div>
                  </div>
                  <div class="mainPage_block-team mainPage-smallCard">
                    <h2 class="mainPage_block-title">О команде</h2>
                    <a class="mainPage-card-linkAll" href="#/team"></a>
                  </div>
                  <div class="mainPage_block-promo mainPage-smallCard">
                    <h2 class="mainPage_block-title">Промо</h2>
                    <a class="mainPage-card-linkAll" href="#/promo"></a>
                  </div>
                  <div class="mainPage_block-dictionary mainPage-bigCard">
                    <h2 class="mainPage_block-title">Словарь</h2>
                    <a class="mainPage-card-link" href="#/dictionary"></a>
                    <div class="mainPage-card-shadow"></div>
                    <div class="mainPage-card-locking"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;

    return view;
  },
  afterRender: async (model) => {
    if (await model.checkUser()) {
      document.querySelectorAll('.mainPage-card-locking').forEach((item) => {
        item.classList.add('hidden');
      });
      document.querySelectorAll('.mainPage-card-shadow').forEach((item) => {
        item.classList.add('hidden');
      });
      document.querySelector('.mainPage_promo_button').classList.add('hidden');
    } else {
      document.querySelectorAll('mainPage-card-link').forEach((item) => {
        item.removeAttribute('href');
      });
    }
    document.querySelector('.mainPage__content_blocks').addEventListener('click', ({ target }) => {
      if (target.classList.contains('mainPage-card-locking')) {
        document.querySelector('.mainPage__content_message').classList.remove('hidden');
        document.querySelector('.mainPage_message-buttonClose').onclick = () => {
          document.querySelector('.mainPage__content_message').classList.add('hidden');
        };
      }
    });
  },
};

export default Home;
