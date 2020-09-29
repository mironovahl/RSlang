import '../../../../../css/pages/games/letterSquare/letterSquare.scss';
import '../../../../../css/pages/games/allGames.scss';
import Utils from '../../../../services/Utils';

import gamePageRendering from './helpers/gamePageRendering';
import wordFilling from './helpers/addingWordsToTable';

const letterSquare = {
  settings: {
    model: null,
  },

  correctAnswers: [],
  wrongAnswers: [],

  beforeRender() {
    this.clearHeaderAndFooter();
  },

  clearHeaderAndFooter: () => {
    Utils.clearBlock('.header');
    Utils.clearBlock('.footer');
  },

  reformat(wordsArray) {
    return wordsArray.map((words) => {
      const temp = [];
      temp.push(words.correct);
      return temp;
    });
  },

  render: (model) => {
    letterSquare.beforeRender();
    letterSquare.settings.model = model;
    const view = gamePageRendering();
    return view;
  },

  afterRender: () => {
    let timer1;
    let time1 = 3;
    let word = '';
    let cellNumbers = '';
    let column = '';
    let line = '';
    let counterWord = 0;
    let lineSort;
    let columnSort;
    let words = [];
    const guessedWords = [];
    const correctAudio = new Audio('src/audio/correct.mp3');
    const errorAudio = new Audio('src/audio/error.mp3');
    const startBtn = document.querySelector('.letterSquare--btn__startBtn');
    const nextBtn = document.querySelector('.letterSquare--statistic__button--next');
    let round = 0;
    let difficulty = 0;
    let timer;
    let time = 120;
    let arr1 = '';
    let arr2 = '';
    const comma = ',';
    let unfoundWord = [];
    let foundWord = [];
    let subStr1 = '';
    let subStr2 = '';

    function searchAudio(words) {
      document.querySelector('.letterSquare--statistic__card').addEventListener('click', (event) => {
        if (event.target.classList.value === 'letterSquare--statistics__audio') {
          for (let i = 0; i < words.length; i += 1) {
            if (words[i].word === event.target.id) {
              const audio = new Audio(words[i].audio);
              audio.play();
            }
          }
        }
      });
    }

    function generateStatistic() {
      unfoundWord = [];
      arr1 = '';
      arr2 = '';
      unfoundWord = document.querySelectorAll('.letterSquare--wordList__itemList');
      unfoundWord.forEach((item) => {
        arr2 += item.innerHTML + comma;
      });
      foundWord = [];
      foundWord = document.querySelectorAll('.letterSquare--wordList__foundWord');
      foundWord.forEach((item) => {
        arr1 += item.innerHTML + comma;
      });
      subStr1 = '';
      subStr1 = arr1.split(',');
      subStr1.splice(-1, 1);
      subStr2 = '';
      subStr2 = arr2.split(',');
      subStr2.splice(-1, 1);

      document.querySelector('.letterSquare__game').classList.add('letterSquare-hidden');
      document.querySelector('.letterSquare__statistic').classList.remove('letterSquare-hidden');

      function addingWordsStatistics(selector, words) {
        const list = document.querySelector(`${selector}`);
        for (let i = 0; i < words.length; i += 1) {
          const listItem = document.createElement('div');
          listItem.setAttribute('class', 'letterSquare--statistics__container');
          const listItemWord = document.createElement('div');
          const audio = document.createElement('div');
          audio.setAttribute('class', 'letterSquare--statistics__audio');
          audio.setAttribute('id', `${words[i]}`);
          listItemWord.setAttribute('class', 'letterSquare--statistic__wordList__itemList');
          listItemWord.innerHTML = words[i];
          listItem.appendChild(audio);
          listItem.appendChild(listItemWord);
          list.appendChild(listItem);
        }
      }
      letterSquare.correctAnswers = subStr1;
      letterSquare.wrongAnswers = subStr2;

      if (document.querySelector('.letterSquare--statistics__container')) {
        const items = document.querySelectorAll('.letterSquare--statistics__container');
        for (let i = 0; i < items.length; i += 1) {
          items[i].remove();
        }
      }
      if (document.querySelector('.letterSquare--wordList__foundWord')) {
        const items = document.querySelectorAll('.letterSquare--wordList__foundWord');
        for (let i = 0; i < items.length; i += 1) {
          items[i].remove();
        }
      }

      addingWordsStatistics('.letterSquare--statistic__numberWordsFound', subStr1);
      addingWordsStatistics('.letterSquare--statistic__numberWordsNotFound', subStr2);

      letterSquare.saveGlobalStatistic();

      searchAudio(words);
    }

    function findingWord(words) {
      function check(words) {
        for (let i = 0; i < words.length; i += 1) {
          let wordsProto = words[i].word;
          let wordProto = word;
          wordsProto = wordsProto.split('').sort().join('');
          wordProto = wordProto.split('').sort().join('');
          if (wordsProto === wordProto) {
            correctAudio.play();
            const tdGuessedItem = document.querySelectorAll('.letterSquare--td_active');
            tdGuessedItem.forEach((item) => {
              item.classList.add('letterSquare--td_guessed');
            });
            const worList = document.querySelectorAll('.letterSquare--wordList__itemList');
            worList.forEach((item) => {
              if (item.innerHTML.split('').sort().join('') === wordProto) {
                item.classList.remove('letterSquare--wordList__itemList');
                item.classList.add('letterSquare--wordList__foundWord');
              }
            });
            guessedWords.push(word);
            word = '';
            column = '';
            line = '';
            cellNumbers = '';
            lineSort = '';
            columnSort = '';
            counterWord -= 1;
            if (counterWord === 0) {
              clearTimeout(timer);
              generateStatistic();
            }
            break;
          } else if (words[i] !== word && i === words.length - 1) {
            errorAudio.play();
          }
        }
      }

      function checkWord(letter, idLetters) {
        word += String(letter);
        cellNumbers += idLetters;
        const btnCheck = document.querySelector('.letterSquare--wordList__btnCheck');
        const btnRemove = document.querySelector('.letterSquare--wordList__btnRemove');
        btnRemove.onclick = () => {
          const tdActive = document.querySelectorAll('.letterSquare--td_active');
          tdActive.forEach((item) => {
            item.classList.remove('letterSquare--td_active');
          });
          word = '';
          column = '';
          line = '';
          cellNumbers = '';
          lineSort = '';
          columnSort = '';
        };

        btnCheck.onclick = () => {
          const arr = cellNumbers.split('');
          for (let i = 0; i < arr.length; i += 1) {
            if (i % 2 === 0) {
              line += arr[i];
            } else {
              column += arr[i];
            }
          }
          lineSort = line.split('').sort().join('');
          columnSort = column.split('').sort().join('');

          const resultColumn = [];
          const resultLine = [];
          for (let i = 0; i < columnSort.length; i += 1) {
            const str = columnSort[i];
            if (!resultColumn.includes(str)) {
              resultColumn.push(str);
            }
          }
          for (let i = 0; i < lineSort.length; i += 1) {
            const str = lineSort[i];
            if (!resultLine.includes(str)) {
              resultLine.push(str);
            }
          }

          if (resultColumn.length !== 1) {
            for (let i = 1; i < lineSort.length; i += 1) {
              if (lineSort[i] - lineSort[i - 1] !== 0) {
                errorAudio.play();
                return;
              }
            }
          }

          if (resultLine.length !== 1) {
            for (let i = 1; i < resultColumn.length; i += 1) {
              if (resultColumn[i] - resultColumn[i - 1] !== 0) {
                errorAudio.play();
                return;
              }
            }
          }
          check(words);
        };
      }

      function catchLetters(idLetters) {
        if (idLetters === 'myTable') {
          return;
        }
        const letter = document.getElementById(idLetters).innerHTML;
        if (document.getElementById(`${idLetters}`).classList.contains('letterSquare--td_active')) {
          document.getElementById(`${idLetters}`).classList.remove('letterSquare--td_active');
          word = word.replace(`${letter}`, '');
          cellNumbers = cellNumbers.replace(`${idLetters}`, '');
          column = '';
          line = '';
          return;
        }
        document.getElementById(`${idLetters}`).classList.add('letterSquare--td_active');
        checkWord(letter, idLetters);
      }

      document.querySelector('#myTable').addEventListener('click',
        (element) => {
          const { id } = element.target;
          catchLetters(id);
        });
    }

    const timerw = () => {
      document.querySelector('.letterSquare--game__time').innerHTML = time;
      time -= 1;
      if (time < 0) {
        clearTimeout(timer);
        generateStatistic();
      } else {
        timer = setTimeout(timerw, 1000);
      }
    };

    function playGame(words) {
      if (document.querySelector('#myTable')) {
        document.querySelector('#myTable').remove();
      }
      if (document.querySelector('.letterSquare--wordList__itemList')) {
        const items = document.querySelectorAll('.letterSquare--wordList__itemList');
        for (let i = 0; i < items.length; i += 1) {
          items[i].remove();
        }
      }
      if (document.querySelector('.letterSquare--wordList__foundWord')) {
        const items = document.querySelectorAll('.letterSquare--wordList__foundWord');
        for (let i = 0; i < items.length; i += 1) {
          items[i].remove();
        }
      }
      const numberСell = 10;
      const playField = document.createElement('table');
      playField.setAttribute('id', 'myTable');
      playField.setAttribute('class', 'letterSquare--table');
      for (let i = 0; i < numberСell; i += 1) {
        const tr = document.createElement('tr');
        for (let j = 0; j < numberСell; j += 1) {
          const td = document.createElement('td');
          td.setAttribute('class', 'letterSquare--td');
          td.setAttribute('id', `${i}${j}`);
          tr.appendChild(td);
        }
        playField.appendChild(tr);
      }

      document.querySelector('.letterSquare--playingField').appendChild(playField);
      for (let i = 0; i < words.length; i += 1) {
        wordFilling(words[i].word);
      }

      function addingWords(selector, words) {
        const list = document.querySelector(`${selector}`);
        for (let i = 0; i < words.length; i += 1) {
          const listItem = document.createElement('div');
          listItem.setAttribute('class', 'letterSquare--wordList__itemList');
          listItem.innerHTML = words[i].word;
          list.appendChild(listItem);
        }
      }

      for (let r = 0; r < playField.rows.length; r += 1) {
        for (let c = 0; c < playField.rows[r].cells.length; c += 1) {
          if (playField.rows[r].cells[c].innerHTML === '') {
            let cellValue = '';
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';
            while (cellValue.length < 1) {
              cellValue += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            playField.rows[r].cells[c].innerHTML = cellValue;
          }
        }
      }
      addingWords('.letterSquare--wordList__list', words);
      findingWord(words);
    }

    function startGame(screen) {
      document.querySelector(`${screen}`).classList.add('letterSquare-hidden');
      document.querySelector('.allGames__timerScreen').classList.remove('allGames__timerScreen-hidden');
      document.querySelector('.allGames__timerScreen').classList.remove('letterSquare-hidden');
      const timerStart = () => {
        document.querySelector('.allGames__timer').innerHTML = time1;
        time1 -= 1;
        if (time1 < 0) {
          clearTimeout(timer1);
          document.querySelector('.letterSquare__game').classList.remove('letterSquare-hidden');
          document.querySelector('.allGames__timerScreen').classList.add('letterSquare-hidden');
          playGame(words);
          timerw();
        } else {
          timer1 = setTimeout(timerStart, 1000);
        }
      };
      timerStart();
    }

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

    startBtn.addEventListener('click', async () => {
      const isNewWords = document.querySelector('.allGames__choice_new').classList.contains('select');
      difficulty = document.getElementById('levels').value;
      round = document.getElementById('pages').value;
      if (difficulty && round && isNewWords) {
        const data = await letterSquare.settings.model.getSetOfWordsAndTranslations(difficulty,
          round - 1, 8, 0);
        letterSquare.data = letterSquare.reformat(data);
        data.forEach((element) => words.push(element.correct));
        counterWord = words.length;
        for (let i = 0; i < words.length; i += 1) {
          if (words[i].word.toString().length > 9) {
            words.splice(i, 1);
          }
        }
      } else {
        const data = await letterSquare.settings.model.getSetOfLearnedWords(8);
        letterSquare.data = letterSquare.reformat(data);
        data.forEach((element) => words.push(element));
        counterWord = words.length;
        for (let i = 0; i < words.length; i += 1) {
          if (words[i].word.toString().length > 9) {
            words.splice(i, 1);
          }
        }
      }
      startGame('.allGames__startScreen');
    });

    const globalStatBtn = document.querySelector('.letterSquare--statistic__button--statistics');
    const globalStatisticButton = document.querySelector('.letterSquare--globalStatistic__button');
    globalStatBtn.addEventListener('click', () => {
      document.querySelector('.letterSquare__statistic').classList.add('letterSquare-hidden');
      document.querySelector('.letterSquare--globalStatistic').classList.remove('letterSquare-hidden');
      letterSquare.setGlobalStatisticData();
    });

    globalStatisticButton.onclick = () => {
      document.querySelector('.letterSquare__statistic').classList.remove('letterSquare-hidden');
      document.querySelector('.letterSquare--globalStatistic').classList.add('letterSquare-hidden');
    };
    nextBtn.addEventListener('click', async () => {
      /** получить следующие level, page, round на основании текущих */
      difficulty = parseInt(difficulty, 10);
      round = parseInt(round, 10);
      const maxLevel = 6;
      const maxRound = 20;

      if (difficulty < maxLevel && round < maxRound) {
        round += 1;
      }

      if (difficulty === maxLevel && round === maxRound) {
        round = 1;
        difficulty = 1;
      }

      if (round === maxRound) {
        difficulty += 1;
        round = 1;
      }

      if (difficulty && round) {
        words = [];
        time1 = 3;
        time = 120;
        counterWord = 0;
        const data = await letterSquare.settings.model.getSetOfWordsAndTranslations(difficulty,
          round - 1, 8, 0);
        letterSquare.data = letterSquare.reformat(data);
        data.forEach((element) => words.push(element.correct));
        for (let i = 0; i < words.length; i += 1) {
          if (words[i].word.toString().length > 9) {
            words.splice(i, 1);
          }
        }
        startGame('.letterSquare__statistic');
      }
    });
  },

  async saveGlobalStatistic() {
    const CorrectAnswers = letterSquare.correctAnswers.length;
    const WrongAnswers = letterSquare.wrongAnswers.length;
    await letterSquare.settings.model.saveStatForGame({ name: 'sq', y: CorrectAnswers, n: WrongAnswers });
  },

  async setGlobalStatisticData() {
    const tableBody = document.querySelector('.letterSquare--statTable__body');
    const statistic = await letterSquare.settings.model.getStatForGame('sq');
    let template = '';
    statistic.forEach((elem, num) => {
      template += `
        <tr class="letterSquare--statTable__bodyRow">
          <td class="letterSquare--statTable__bodyData">${num + 1}</td>
          <td class="letterSquare--statTable__bodyData">${elem.y}</td>
          <td class="letterSquare--statTable__bodyData">${elem.n}</td>
          <td class="letterSquare--statTable__bodyData">${elem.d}</td>
        </tr>
      `;
    });
    tableBody.innerHTML = template;
  },
};

export default letterSquare;
