import '../../../css/layout/header.scss';

const Header = {
  render: async () => {
    const view = `
<div class="header__wrapper">
            <div id="burger">
              <button class="header__burger"></button>
                <div class="header__burger-navigation notdisplay">
                    <div class="header__burger-nav">
                        <button class="header__burger rotate"></button>
                        <a href="#/" class="logo logo-burger">
                            <h1>RS Lang</h1>
                        </a>
                        <nav class="header__navigation">
                            <a href="#/cards" class="cards">Изучение слов</a>
                            <a href="#/stats" class="stats">Статистика</a>
                            <a href="#/dictionary" class="dictionary">Словарь</a>
                            <a href="#/games/all" class="all">Игры</a>
                            <a href="#/promo" class="promo">О приложении</a>
                            <a href="#/team" class="team">Команда</a>
                            <a href="#/login" class="logout login">Войти</a>
                        </nav>
                    </div>
                </div>

            </div>
            <a href="#/" class="logo">
                <h1>RS Lang</h1>
            </a>
            <nav class="header__navigation">
                <ul id="navigation">
                    <li class="nav-item__navigation"><a href="#/cards" class="cards">Изучение слов</a></li>
                    <li class="nav-item__navigation"><a href="#/stats" class="stats">Статистика</a></li>
                    <li class="nav-item__navigation"><a href="#/dictionary" class="dictionary">Словарь</a></li>
                    <li class="nav-item__navigation"><a href="#/games/all" class="all">Игры</a></li>
                    <li class="nav-item__navigation "><a href="#/login" class="logout login">Войти</a></li>
                </ul>

            </nav>
        </div>
  `;
    return view;
  },
  afterRender: async (model) => {
    const BURGER_BUTTON = document.querySelector('.header #burger');
    const HEADER = document.querySelector('.header');
    BURGER_BUTTON.addEventListener('click', (event) => {
      if (event.target.classList.contains('header__burger')) {
        if (document.querySelector('.header__burger-navigation').classList.contains('notdisplay')) {
          document.querySelector('.header__burger-navigation').classList.remove('notdisplay');
        } else {
          document.querySelector('.header__burger-navigation').classList.add('notdisplay');
        }
      }
    });

    const logList = document.querySelectorAll('.header .logout');
    const logArray = Array.from(logList);

    if (await model.checkUser()) {
      logArray.forEach((logs) => {
        const log = logs;
        log.onclick = () => model.logOutUser();
        log.textContent = 'Выйти';
      });
    }

    const { href } = window.location;
    const hrefArray = href.split('/');
    const currentPage = hrefArray[hrefArray.length - 1];
    HEADER.querySelectorAll('a').forEach((el) => el.classList.remove('nav_selected'));
    if (currentPage && currentPage !== '#') {
      const currentLink = HEADER.querySelectorAll(`.${currentPage}`);

      currentLink.forEach((el) => el.classList.add('nav_selected'));
    }
  },

};

export default Header;
