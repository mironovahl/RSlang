import '../../../css/pages/dictionary.scss';

const Dictionary = {
  render: async () => {
    const view = /* html */`
    <section class="section dictionary--container">
        <nav class = "dictionarry--navigation">
        <div class = "dictionary--wordsButton">
          <div data-container ='.dictionary--currentWords' class = "dictionary--currentWordsButton button">На изучении</div>
          <div data-container ='.dictionary--hardWords' class = "dictionary--hardWordsButton button">Сложные</div>
          <div data-container ='.dictionary--deletedWords' class = "dictionary--deletedWordsButton button">Удалённые</div>
        </div>
        <div class = "dictionarry--settings"</div>
          <div class = "dictionarry--buttonExample" title="Показывать примеры"></div>
          <div class = "dictionarry--buttonExplanation" title="Показывать объяснения"></div>
          <div class = "dictionarry--buttonTranscription" title="Показывать транскрипцию"></div>
          <div class = "dictionarry--buttonImg" title="Показывать изображения"></div>
        </div>
      </nav>
      
      <div class="dictionary--currentWords page">
       
      </div>
      
      <div class="dictionary--hardWords hidden page">
        
      </div>
      
      <div class="dictionary--deletedWords hidden page">
       
      </div>
    </section>
          `;

    return view;
  },
  afterRender: async (model) => {
    let settings = null;

    function createNewElement(type, selector, innerText, title) {
      const container = document.createElement(type);
      if (title) container.setAttribute('title', title);
      container.classList.add(selector);
      if (innerText) container.innerHTML = innerText;
      return container;
    }

    function createCommonElementsForCards(wordObj, newWord) {
      const wordData = createNewElement('div', 'wordData');
      newWord.append(wordData);

      const newWordSoundIcon = createNewElement('div', 'sound__icon');
      const audio = new Audio(wordObj.audio);
      newWordSoundIcon.onclick = () => audio.play();
      wordData.append(newWordSoundIcon);

      const mainWordAttributes = createNewElement('div', 'mainWordAttributes');
      wordData.append(mainWordAttributes);

      const newWordTextTranscription = createNewElement('div', 'textTranscription');
      mainWordAttributes.append(newWordTextTranscription);

      const newWordText = createNewElement('div', 'text', wordObj.word);
      newWordTextTranscription.append(newWordText);

      const newWordTransciption = createNewElement('div', 'transcription', wordObj.transcription);
      newWordTextTranscription.append(newWordTransciption);

      const newWordTranslate = createNewElement('div', 'translation', wordObj.wordTranslate);
      mainWordAttributes.append(newWordTranslate);

      const longRead = createNewElement('div', 'longRead');
      wordData.append(longRead);

      const newWordExample = createNewElement('q', 'example', wordObj.textExample);
      longRead.append(newWordExample);

      const newWordMeaning = createNewElement('div', 'meaning', wordObj.textMeaning);
      longRead.append(newWordMeaning);

      const newWordProgress = createNewElement('div', 'progress');


      if (wordObj.userWord.optional.dateLearned) {
        const learnDate = wordObj.userWord.optional.dateLearned.split('-').join('.');
        const learnDateBlock = createNewElement('div', 'next-date', `Выучено ${learnDate}`);
        newWordProgress.append(learnDateBlock);
      }

      if (wordObj.userWord.optional.date) {
        const nextDate = wordObj.userWord.optional.date.split('-').join('.');
        const nextDateBlock = createNewElement('div', 'next-date', `Следующее повторение ${nextDate}`);
        if (nextDate !== 'none') newWordProgress.append(nextDateBlock);
      }


      if (wordObj.userWord.optional.count) {
        const repeats = wordObj.userWord.optional.count;
        const repeatsBlock = createNewElement('div', 'repeat-count');
        if (repeats === 2 || repeats === 3 || repeats === 4) {
          repeatsBlock.innerHTML = `Повторялось ${repeats} раза`;
        } else {
          repeatsBlock.innerHTML = `Повторялось ${repeats} раз`;
        }
        newWordProgress.append(repeatsBlock);
      }


      longRead.append(newWordProgress);
      const wordImg = createNewElement('img', 'wordImg');
      wordImg.src = wordObj.image;
      const newWordImg = createNewElement('div', 'imgContainer');
      newWordImg.append(wordImg);
      wordData.append(newWordImg);
    }
    function changeSettingForOneCard(block, divSelector) {
      block.querySelector(divSelector).classList.add('hidden');
    }
    function applaySettingsToOneCard(block) {
      if (!settings.example) changeSettingForOneCard(block, '.example');
      if (!settings.meaning) changeSettingForOneCard(block, '.meaning');
      if (!settings.transcription) changeSettingForOneCard(block, '.transcription');
      if (!settings.img) changeSettingForOneCard(block, '.imgContainer');
    }

    async function constructCurd(wordObj, mode) {
      const newWord = createNewElement('div', 'wordCard');
      createCommonElementsForCards(wordObj, newWord);
      const wordButtonContainer = createNewElement('div', 'wordButtonContainer');
      newWord.append(wordButtonContainer);

      const sameHardWord = document.querySelector(`.dictionary--hardWords .${wordObj.word}`);

      if (mode === 'deleted') {
        const wordRestoreButton = createNewElement('div', 'wordRestoreButton', '', 'Восстановить');
        wordButtonContainer.append(wordRestoreButton);
        wordRestoreButton.onclick = () => {
          newWord.remove();
          if (sameHardWord) {
            sameHardWord.remove();
            constructCurd(wordObj, 'hard');
          }
          constructCurd(wordObj, 'current');
          model.removeWordFromDeleted(wordObj.id);
        };
        if (sameHardWord) {
          const wordCurrentButton = createNewElement('div', 'wordCurrentButton', '', 'В несложные');
          wordButtonContainer.append(wordCurrentButton);
          wordCurrentButton.onclick = () => {
            newWord.remove();
            sameHardWord.remove();
            constructCurd(wordObj, 'deleted');
            model.addWordToNormal(wordObj.id);
          };
          newWord.classList.add('hardInDeleted');
          // Устонавливаем onclick для карточек из блока Hard
          const sameHardWordButtonContainer = sameHardWord.querySelector('.wordButtonContainer');
          const sameHardRestoreButton = createNewElement('div', 'wordRestoreButton', '', 'Восстановить');
          sameHardWordButtonContainer.append(sameHardRestoreButton);

          const sameHardCurrentButton = createNewElement('div', 'wordCurrentButton', '', 'В несложные');
          sameHardWordButtonContainer.append(sameHardCurrentButton);

          sameHardRestoreButton.onclick = () => {
            newWord.remove();
            sameHardWord.remove();
            constructCurd(wordObj, 'hard');
            constructCurd(wordObj, 'current');
            model.removeWordFromDeleted(wordObj.id);
          };

          sameHardCurrentButton.onclick = () => {
            newWord.remove();
            sameHardWord.remove();
            constructCurd(wordObj, 'deleted');
            model.addWordToNormal(wordObj.id);
          };
        } else {
          const wordHardButton = createNewElement('div', 'wordHardButton', '', 'В сложные');
          wordButtonContainer.append(wordHardButton);
          wordHardButton.onclick = () => {
            newWord.remove();
            constructCurd(wordObj, 'hard');
            constructCurd(wordObj, 'deleted');
            model.addWordToHard(wordObj.id);
          };
        }

        const deletedWordsContainer = document.querySelector('.dictionary--deletedWords');
        deletedWordsContainer.append(newWord);
        newWord.classList.add('deleted');
      }
      if (mode === 'current') {
        // ставим onclick на кнопку удаления
        const wordDeleteButton = createNewElement('div', 'wordDeleteButton', '', 'Удалить');
        wordButtonContainer.append(wordDeleteButton);
        wordDeleteButton.onclick = () => {
          newWord.remove();
          if (sameHardWord) {
            sameHardWord.remove();
          }
          constructCurd(wordObj, 'deleted');
          model.addWordToDeleted(wordObj.id);
        };

        if (sameHardWord) {
          const wordCurrentButton = createNewElement('div', 'wordCurrentButton', '', 'В несложные');
          wordButtonContainer.append(wordCurrentButton);
          wordCurrentButton.onclick = () => {
            newWord.remove();
            sameHardWord.remove();
            constructCurd(wordObj, 'current');
            model.addWordToNormal(wordObj.id);
          };
          newWord.classList.add('hardInCurrent');
          // Устонавливаем onclick для карточек из блока Hard
          const sameHardWordButtonContainer = sameHardWord.querySelector('.wordButtonContainer');
          const sameHardDeleteButton = createNewElement('div', 'wordDeleteButton', '', 'Удалить');
          if (sameHardWordButtonContainer) {
            sameHardWordButtonContainer.append(sameHardDeleteButton);
            const sameHardCurrentButton = createNewElement('div', 'wordCurrentButton', '', 'В несложные');
            sameHardWordButtonContainer.append(sameHardCurrentButton);

            sameHardDeleteButton.onclick = () => {
              newWord.remove();
              sameHardWord.remove();
              constructCurd(wordObj, 'hard');
              constructCurd(wordObj, 'deleted');
              model.addWordToDeleted(wordObj.id);
            };

            sameHardCurrentButton.onclick = () => {
              newWord.remove();
              sameHardWord.remove();
              constructCurd(wordObj, 'current');
              model.addWordToNormal(wordObj.id);
            };
          }
        } else {
          const wordHardButton = createNewElement('div', 'wordHardButton', '', 'В сложные');
          wordButtonContainer.append(wordHardButton);
          wordHardButton.onclick = () => {
            newWord.remove();
            constructCurd(wordObj, 'hard');
            constructCurd(wordObj, 'current');
            model.addWordToHard(wordObj.id);
          };
          newWord.classList.add('current');
        }

        const currentWordsContainer = document.querySelector('.dictionary--currentWords');
        currentWordsContainer.append(newWord);
      }
      if (mode === 'hard') {
        const hardWordsContainer = document.querySelector('.dictionary--hardWords');
        hardWordsContainer.append(newWord);
        newWord.classList.add('hard');
        newWord.classList.add(wordObj.word);
      }
      applaySettingsToOneCard(newWord);
    }

    async function start() {
      const wordsForDictionary = await model.getWordsForDictionary();
      const { allWords: currentWords, hardWords, deletedWords } = wordsForDictionary;
      if (!currentWords.length && !deletedWords.length) {
        const currentWordsContainer = document.querySelector('.dictionary--currentWords');
        const emptyBlock = createNewElement('div', 'wordCard', '<p class="emptyText">Словарь пуст</p>');

        currentWordsContainer.append(emptyBlock);
      }

      await hardWords.forEach((word) => {
        constructCurd(word, 'hard');
      });

      await currentWords.forEach((word) => {
        constructCurd(word, 'current');
      });

      await deletedWords.forEach((word) => {
        constructCurd(word, 'deleted');
      });
    }
    function changeSetting(buttonSelect, divSelector) {
      const button = document.querySelector(buttonSelect);
      button.classList.toggle('unactive');
      if (divSelector) {
        const list = document.querySelectorAll(divSelector);
        const array = Array.from(list);
        array.forEach((element) => {
          element.classList.toggle('hidden');
        });
      }
    }

    async function getSettings() {
      const settingsGetRaw = await model.getSettings();
      const { data: allSettings } = settingsGetRaw;
      settings = allSettings.dictionary;

      if (!settings.example) changeSetting('.dictionarry--buttonExample');
      if (!settings.meaning) changeSetting('.dictionarry--buttonExplanation');
      if (!settings.transcription) changeSetting('.dictionarry--buttonTranscription');
      if (!settings.img) changeSetting('.dictionarry--buttonImg');
    }


    function clickSettings(target) {
      if (target.classList.contains('dictionarry--buttonExample')) {
        settings.example = !settings.example;
        changeSetting('.dictionarry--buttonExample', '.example');
      }
      if (target.classList.contains('dictionarry--buttonExplanation')) {
        settings.meaning = !settings.meaning;
        changeSetting('.dictionarry--buttonExplanation', '.meaning');
      }
      if (target.classList.contains('dictionarry--buttonTranscription')) {
        settings.transcription = !settings.transcription;
        changeSetting('.dictionarry--buttonTranscription', '.transcription');
      }
      if (target.classList.contains('dictionarry--buttonImg')) {
        settings.img = !settings.img;
        changeSetting('.dictionarry--buttonImg', '.imgContainer');
      }
      model.saveDictionarySettings(settings);
    }

    function showPage(target) {
      const pages = document.querySelectorAll('.page');
      const pagesArr = Array.from(pages);
      pagesArr.forEach((element) => {
        element.classList.add('hidden');
      });
      document.querySelector(target.dataset.container).classList.remove('hidden');
    }

    function setEventListeners() {
      const wordsButton = document.querySelector('.dictionary--wordsButton');
      wordsButton.addEventListener('click', ({ target }) => {
        if (target.classList.contains('button')) showPage(target);
      });

      const settings = document.querySelector('.dictionarry--settings');
      settings.addEventListener('click', ({ target }) => clickSettings(target));
    }

    async function go() {
      await setEventListeners();
      await getSettings();
      start();
    }
    go();
  },

};

export default Dictionary;
