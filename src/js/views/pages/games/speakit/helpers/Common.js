export default class Common {
  shuffleWords(wordsArr) { // перемешать слова в массиве
    const wordsArray = wordsArr;
    for (let i = wordsArr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordsArray[i], wordsArray[j]] = [wordsArray[j], wordsArray[i]];
    }
    return wordsArray;
  }

  playSound(sound) { // проиграть слово
    const soundPath = sound;
    const audio = new Audio(soundPath);
    audio.play();
  }

  resetSpeak() { // убрать стиль с кнопки "speak", откл+вкл прослушивание кнопки
    const speakButton = document.querySelector('.button__speak');
    speakButton.classList.remove('activated');
  }
}
