import '../../../css/pages/statistics.scss';

const Statistics = {
  render: async () => {
    const view = `
    <section class="statistic statistic__background">
    <div class="statistic__card">
      <h1 class="statistic__heading"></h1>
      <div class="statistic__container">
        <div class="statistic__numberWordsStudied"></div>
        <div class="statistic__wordList"></div>
      </div>
      <canvas id="canvas" width="600px" height="300px"></canvas>
      <p class="statistic__data"></p>
      <canvas id="canvas2" width="600px" height="300px"></canvas>
     <div class="statistic__percentageLearnedWords"></div>
    </div>
    </section>
          `;
    return view;
  },
  afterRender: async (model) => {
    const word = await model.getLearnedWordsCountByDates();
    const words = await model.getLearnedWordsByDates();
    function drawStatistics(nameStatistics) {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let percentageLearnedWords = 0;
      const amountDays = word;
      const x0 = 80.5;
      const y1 = 280.5;
      let x1 = 480.5;
      let y0 = 10.5;

      /** массив количества слов */
      const learnedWordsСount = Object.values(amountDays);

      /** рисуем сетку */
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y0);
        ctx.closePath();
        ctx.strokeStyle = 'rgb(65, 65, 65)';
        ctx.stroke();
        y0 += 54;
      }
      y0 = 10.5;
      x1 = 80.5;
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x1, y0);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        ctx.strokeStyle = 'rgb(65, 65, 65)';
        ctx.stroke();
        x1 += 80;
      }

      /** добавляем подписи к графику */
      ctx.font = 'small-caps 15px Arial';
      for (let i = 0; i < 6; i += 1) {
        ctx.fillText(`${(5 - i) * 20}%`, 38.5, i * 52 + 19);
        ctx.beginPath();
        ctx.moveTo(30.5, i * 8 + 6);
        ctx.lineTo(30, i * 8 + 6);
        ctx.stroke();
      }

      function percentageWords(learnedWordsСount) {
        percentageLearnedWords = (learnedWordsСount * 100) / 3600;
        return percentageLearnedWords;
      }

      let X = 80;
      let Y = 280;

      /** рисуем график */
      function drawGraph(learnedWordsСount) {
        const learnedWords = learnedWordsСount;
        for (let i = 0; i < learnedWords.length; i += 1) {
          for (let j = 0; j < i; j += 1) {
            learnedWords[i] += learnedWords[j];
          }
          percentageWords(learnedWords[i]);
          ctx.beginPath();
          ctx.moveTo(X, Y);
          ctx.lineTo((learnedWords[i] * 400) / 3600 + 80, 280
            - ((percentageLearnedWords * 270) / 100));
          X = (learnedWords[i] * 400) / 3600 + 80;
          Y = 280 - ((percentageLearnedWords * 270) / 100);
          ctx.closePath();
          ctx.strokeStyle = 'rgb(0, 90, 5)';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(X, Y, 3, 0, Math.PI * 2, false);
          ctx.fillStyle = 'rgb(0, 90, 5)';
          ctx.fill();
          ctx.closePath();
          ctx.stroke();
        }
      }

      drawGraph(learnedWordsСount);

      /** рисуем линию с процентом изученных слов */
      const canvas2 = document.getElementById('canvas2');
      const ctx2 = canvas2.getContext('2d');
      percentageWords(learnedWordsСount[learnedWordsСount.length - 1]);
      const a = percentageLearnedWords * 5;

      ctx2.beginPath();
      ctx2.moveTo(60.5, 10);
      ctx2.lineTo(500.5, 10);
      ctx2.closePath();
      ctx2.strokeStyle = 'rgb(65, 65, 65)';
      ctx2.stroke();

      ctx2.beginPath();
      ctx2.moveTo(60.5, 10);
      ctx2.lineTo(a + 60.5, 10);
      ctx2.arc(a + 60.5, 10, 5, 0, Math.PI * 2, false);
      ctx2.fillStyle = 'rgb(0, 90, 5)';
      ctx2.fill();
      ctx2.closePath();
      ctx2.strokeStyle = 'rgb(0, 90, 5)';
      ctx2.stroke();
      document.querySelector('.statistic__heading').innerHTML = `${nameStatistics}`;
      document.querySelector('.statistic__wordList').innerHTML = 'Cписок слов';
      document.querySelector('.statistic__numberWordsStudied').innerHTML = `Всего слов: ${learnedWordsСount[learnedWordsСount.length - 1]}`;
      document.querySelector('.statistic__percentageLearnedWords').innerHTML = `${Math.round(percentageLearnedWords)}% слов любого текста`;

      const wordsDatesList = document.createElement('div');
      wordsDatesList.setAttribute('class', 'statistic__wordsDatesList statistic__hidden');
      document.querySelector('.statistic__card').appendChild(wordsDatesList);

      const wordsArray = Object.entries(words);
      for (let i = 0; i < wordsArray.length; i += 1) {
        const dates = document.createElement('div');
        dates.setAttribute('class', 'statistic__datesItem');
        dates.innerHTML = `${wordsArray[i][0]}`;
        document.querySelector('.statistic__wordsDatesList').appendChild(dates);
        for (let j = 0; j < wordsArray[i][1].length; j += 1) {
          const wordItem = document.createElement('div');
          wordItem.setAttribute('class', 'statistic__wordItem');
          wordItem.innerHTML = `${wordsArray[i][1][j]}`;
          document.querySelector('.statistic__wordsDatesList').appendChild(wordItem);
        }
      }

      const back = document.createElement('div');
      back.setAttribute('class', 'statistic__back statistic__hidden');
      back.innerHTML = 'Назад';
      document.querySelector('.statistic__card').appendChild(back);

      const wordList = document.querySelector('.statistic__wordList');
      wordList.onclick = () => {
        document.querySelector('#canvas').classList.add('statistic__hidden');
        document.querySelector('#canvas2').classList.add('statistic__hidden');
        document.querySelector('.statistic__percentageLearnedWords').classList.add('statistic__hidden');
        document.querySelector('.statistic__wordsDatesList').classList.remove('statistic__hidden');
        document.querySelector('.statistic__back').classList.remove('statistic__hidden');
      };

      const backBtn = document.querySelector('.statistic__back');

      backBtn.onclick = () => {
        document.querySelector('.statistic__wordsDatesList').classList.add('statistic__hidden');
        document.querySelector('.statistic__back').classList.add('statistic__hidden');
        document.querySelector('#canvas').classList.remove('statistic__hidden');
        document.querySelector('#canvas2').classList.remove('statistic__hidden');
        document.querySelector('.statistic__percentageLearnedWords').classList.remove('statistic__hidden');
      };
    }
    drawStatistics('Статистика изученных слов');
  },
};

export default Statistics;
