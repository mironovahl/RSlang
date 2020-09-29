const Game = {
  initStartScreen: () => {
    document.querySelector('.allGames__choice_learn').onclick = () => {
      document.querySelector('.allGames__choice_learn').classList.add('select');
      document.querySelector('.allGames__choice_new').classList.remove('select');
      document.querySelector('.allGames__choice_levels').classList.add('hidden');
    };
    document.querySelector('.allGames__choice_new').onclick = () => {
      document.querySelector('.allGames__choice_new').classList.add('select');
      document.querySelector('.allGames__choice_learn').classList.remove('select');
      document.querySelector('.allGames__choice_levels').classList.remove('hidden');
    };
  },

  startGame: (cb) => {
    const startScreen = document.querySelector('.allGames__startScreen');
    const timerScreen = document.querySelector('.allGames__timerScreen');
    const playScreen = document.querySelector('.allGames__playScreen');
    const timer = document.querySelector('.allGames__timer');

    // отображаем таймер при клике
    startScreen.addEventListener('click', ({ target }) => {
      if (!target.classList.contains('allGames__startBtn')) {
        return;
      }

      startScreen.classList.add('allGames__startScreen-hidden');
      timerScreen.classList.remove('allGames__timerScreen-hidden');

      // меняем значение на таймере каждую секунду
      const timerId = setInterval(() => {
        const seconds = timer.textContent;
        timer.textContent = +seconds - 1;
      }, 1000);

      // останавливаем таймер через 3 секунды
      setTimeout(() => clearInterval(timerId), 3000);

      // отображаем экран игры после остановки таймера
      setTimeout(() => {
        timerScreen.classList.add('allGames__timerScreen-hidden');
        playScreen.classList.remove('allGames__playScreen-hidden');
        if (cb) cb();
      }, 3000);
    });
  },
};

export default Game;
