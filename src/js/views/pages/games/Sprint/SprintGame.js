let countCorrect = 0;
const data = JSON.parse(localStorage.getItem('data'));
const correctAnswer = [];
const errorAnswer = [];
const correctAudio = new Audio('src/audio/correct.mp3');
const errorAudio = new Audio('src/audio/error.mp3');
let obj = {};
let timer;
let time = 60;
let wordNumber = 0;
let arrayWord;
let round;
let level;
const lengthRound = 19;
const lengthLevel = 6;
let checkAnswer = true;
let myModel = null;

const generate = (words) => {
  const word = words[0];
  const translate = words[1];
  const notranslate = words[2];
  const audio = words[3];
  obj.correctword = word;
  obj.correcttranslate = translate;
  obj.audio = audio;
  let result;
  document.querySelector('.sprint--card__word > .word').innerHTML = word;
  if (Math.round(Math.random())) {
    document.querySelector('.sprint--card__word > .translate').innerHTML = translate;
    result = 1;
  } else {
    document.querySelector('.sprint--card__word > .translate').innerHTML = notranslate;
    result = 0;
  }
  return result;
};

const check = (count) => {
  checkAnswer = false;
  setTimeout(() => {
    checkAnswer = true;
  }, 670);
  if (count % 2 === 0) {
    correctAudio.play();
    countCorrect += 1;
    if (obj.correctword !== undefined) {
      correctAnswer.push(obj);
    }
    obj = {};
    const k = Number(document.querySelector('.sprint--game__result_points').innerText);
    if (countCorrect >= 4) {
      document.querySelector('.sprint--game__result_addPoints').classList.remove('hide');
      document.querySelector('.sprint--game__result_points').innerHTML = k + 20;
      document.querySelector('.sprint--game__result_addPoints').innerHTML = '+20';
      document.querySelector('.sprint--card__list2').classList.remove('hide');
    } else {
      document.querySelector('.sprint--game__result_addPoints').classList.remove('hide');
      document.querySelector('.sprint--game__result_points').innerHTML = k + 10;
      document.querySelector('.sprint--game__result_addPoints').innerHTML = '+10';
      document.querySelector('.sprint--card__title').children[countCorrect - 1].classList.add('active');
    }
    setTimeout(() => {
      document.querySelector('.sprint--game__result_addPoints').classList.add('hide');
    }, 300);
    return 1;
  }
  if (obj.correctword !== undefined) {
    errorAudio.play();
    errorAnswer.push(obj);
  }
  obj = {};
  document.querySelector('.sprint--card__title').children[0].classList.remove('active');
  document.querySelector('.sprint--card__title').children[1].classList.remove('active');
  document.querySelector('.sprint--card__title').children[2].classList.remove('active');
  countCorrect = 0;
  document.querySelector('.sprint--card__list2').classList.add('hidden');
  return 0;
};

const generateStatisticWord = (masCorrect, masError) => {
  const correctList = document.querySelector('.sprint--end__statistic_correct');
  masCorrect.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'sprint--statistic__line';
    let template = '<div class="sprint--statistic__audio"></div>';
    template += `<p id="${item.correctword}">${item.correctword} - ${item.correcttranslate}</p>`;
    div.innerHTML = template;
    correctList.append(div);
  });
  const errorList = document.querySelector('.sprint--end__statistic_error');
  masError.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'sprint--statistic__line';
    let template = '<div class="sprint--statistic__audio"></div>';
    template += `<p id="${item.correctword}">${item.correctword} - ${item.correcttranslate}</p>`;
    div.innerHTML = template;
    errorList.append(div);
  });
};

const playAudio = (mas, elem) => {
  mas.forEach((item) => {
    if (item.correctword === elem) {
      const audio = new Audio(item.audio);
      audio.play();
    }
  });
};

const searchAudio = () => {
  document.querySelector('.sprint--end__statistic').addEventListener('click', (event) => {
    if (event.target.classList.value === 'sprint--statistic__audio') {
      const idElement = event.target.nextElementSibling.id;
      if (event.target.parentElement.parentElement.className === 'sprint--end__statistic_error') {
        playAudio(errorAnswer, idElement);
      }
      if (event.target.parentElement.parentElement.className === 'sprint--end__statistic_correct') {
        playAudio(correctAnswer, idElement);
      }
    }
  });
};

const setGlobalStatisticData = async () => {
  const tableBody = document.querySelector('.statTable__body');
  const statistic = await myModel.getStatForGame('sp');
  let template = '';
  statistic.forEach((elem, num) => {
    template += `
      <tr class="statTable__bodyRow">
        <td class="statTable__bodyData">${num + 1}</td>
        <td class="statTable__bodyData">${elem.y}</td>
        <td class="statTable__bodyData">${elem.n}</td>
        <td class="statTable__bodyData">${elem.d}</td>
      </tr>
    `;
  });
  tableBody.innerHTML = template;
};

const saveGlobalStatistic = async () => {
  const correctAnswersCount = correctAnswer.length;
  const wrongAnswersCount = errorAnswer.length;
  await myModel.saveStatForGame({ name: 'sp', y: correctAnswersCount, n: wrongAnswersCount });
};

const addStatisticButtonsHandler = () => {
  const statisticMessage = document.querySelector('.sprint--end__message');
  const globalStatisticScreen = document.querySelector('.sprint--end__globalStatistic');
  const statisticScreenDots = document.querySelector('.sprint--end__slide');
  const statisticButton = document.querySelector('.sprint--end__button_global');
  const globalStatisticButton = document.querySelector('.sprint-globalStatistic__button');
  statisticButton.onclick = () => {
    statisticMessage.classList.add('hidden');
    statisticScreenDots.classList.add('hidden');
    globalStatisticScreen.classList.remove('hidden');
  };
  globalStatisticButton.onclick = () => {
    statisticMessage.classList.remove('hidden');
    statisticScreenDots.classList.remove('hidden');
    globalStatisticScreen.classList.add('hidden');
  };
};

const generateStatistic = async () => {
  document.querySelector('.sprint--game').classList.add('hidden');
  document.querySelector('.sprint--end').classList.remove('hidden');
  const result = document.querySelector('.sprint--game__result_points').innerHTML;
  document.querySelector('.sprint__message__result').innerHTML = result;
  data.push(result);
  localStorage.setItem('data', JSON.stringify(data));
  document.querySelector('.sprint__message__record').innerHTML = Math.max(...data);
  const average = data.reduce((accum, item) => Number(accum) + Number(item)) / data.length;
  document.querySelector('.sprint__message__average').innerHTML = Math.round(average);
  await saveGlobalStatistic();
  await setGlobalStatisticData();
  addStatisticButtonsHandler();
  document.querySelector('.sprint--end__slide_main').onclick = () => {
    document.querySelector('.sprint--end__slide_main').classList.add('active');
    document.querySelector('.sprint--end__slide_statistic').classList.remove('active');
    if (!document.querySelector('.sprint--end__statistic').classList.contains('hidden')) {
      document.querySelector('.sprint--end__statistic').classList.add('hidden');
      document.querySelector('.sprint--end__message').classList.remove('hidden');
    }
  };

  document.querySelector('.sprint--end__slide_statistic').onclick = () => {
    document.querySelector('.sprint--end__slide_statistic').classList.add('active');
    document.querySelector('.sprint--end__slide_main').classList.remove('active');
    if (!document.querySelector('.sprint--end__message').classList.contains('hidden')) {
      document.querySelector('.sprint--end__statistic').classList.remove('hidden');
      document.querySelector('.sprint--end__message').classList.add('hidden');
    }
  };
  searchAudio();
};

const timerw = () => {
  document.querySelector('.sprint--game__time').innerHTML = time;
  time -= 1;
  if (time < 0) {
    clearTimeout(timer);
    generateStatistic();
    generateStatisticWord(correctAnswer, errorAnswer);
  } else {
    timer = setTimeout(timerw, 1000);
  }
};

const nextWord = () => {
  round += 1;
  if (round > lengthRound) {
    round = 0;
    level += 1;
    if (level > lengthLevel) {
      level = lengthLevel;
    }
  }
};

const game = (model, data) => {
  const dataCor = data.correct;
  const dataErr = data.incorrect[0].wordTranslate;
  let count = generate([dataCor.word, dataCor.wordTranslate, dataErr, dataCor.audio]);
  document.querySelector('.sprint--button__correct').onclick = () => {
    if (checkAnswer) {
      count += 1;
      check(count);
      wordNumber += 1;
      game(model, arrayWord[wordNumber]);
    }
  };
  document.querySelector('.sprint--button__error').onclick = () => {
    if (checkAnswer) {
      count += 0;
      check(count);
      wordNumber += 1;
      game(model, arrayWord[wordNumber]);
    }
  };
  document.onkeyup = (event) => {
    if (time < 60 && checkAnswer) {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        if (event.code === 'ArrowLeft') {
          count += 1;
          document.querySelector('.sprint--game__arrow_left').classList.add('click');
          setTimeout(() => {
            document.querySelector('.sprint--game__arrow_left').classList.remove('click');
          }, 100);
        }
        if (event.code === 'ArrowRight') {
          count += 0;
          document.querySelector('.sprint--game__arrow_right').classList.add('click');
          setTimeout(() => {
            document.querySelector('.sprint--game__arrow_right').classList.remove('click');
          }, 100);
        }
        check(count);
        wordNumber += 1;
        game(model, arrayWord[wordNumber]);
      }
    }
  };
};

const generateNewWord = (model, choiseRound, choiseLevel) => {
  myModel = model;
  round = Number(choiseRound);
  level = Number(choiseLevel);
  model.getSetOfWordsAndTranslations(level, round, 30, 1).then((data) => {
    arrayWord = data;
  });
  nextWord();
  model.getSetOfWordsAndTranslations(level, round, 30, 1).then((data) => {
    arrayWord = arrayWord.concat(data);
  });
  nextWord();
  model.getSetOfWordsAndTranslations(level, round, 30, 1).then((data) => {
    arrayWord = arrayWord.concat(data);
    game(model, arrayWord[wordNumber]);
  });
};

const generateLearnWord = (model) => {
  myModel = model;
  model.getSetOfLearnedWordsAndTranslations(100, 1).then((data) => {
    arrayWord = data;
    game(model, arrayWord[wordNumber]);
  });
};

export { generateNewWord, generateLearnWord, timerw };
