$(document).ready(initializeApp);

var card;
var cardFront = $('.main__Card-front');
var cardBack = $('.main__Card-back');
var gamesCount = $('.main__Aside-Games-Count');
var attemptsCount = $('.main__Aside-Attempts-Count');
var accuracyCount = $('.main__Aside-Accuracy-Count');
var mainContainer = $('.main__Container');
var winContainer = $('.win');
var button = $('.btn');
var backButton = $('.win__Buttons-back');
var playAgainButton = $('.win__Buttons-play');

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var firstCardFront = null;
var secondCardFront = null;
var firstSibling = null;
var secondSibling = null;
var championName = null;
var audio = null;
var attempts = null;
var games_played = 0;
var percentage = 0;
var streak = 0;

var imgClasses = ['aatrox', 'ahri', 'azir', 'braum', 'yasuo', 'diana', 'elise', 'jinx', 'zed',
                  'aatrox', 'ahri', 'azir', 'braum', 'yasuo', 'diana', 'elise', 'jinx', 'zed'];
var newArray = [];
var maxMatches = imgClasses.length / 2;

function initializeApp() {

  shuffleCards();
  winContainer.addClass('invisible');
  cardBack.mouseenter(function () {
    if (!($(this).hasClass('invisible'))) {
      playSoundWav('Hover');
    }
  })
  cardBack.click(function () {
    if (!($(this).hasClass('invisible'))) {
      playSoundWav('Click');
    }
  })
  cardBack.click(checkMatch);
}

function checkMatch (event) {
  var card = this;

  if (!($(card).hasClass('invisible'))) {
    $(card).addClass('invisible');
    if (firstCardClicked === null) {
      firstCardClicked = $(event.currentTarget);
      firstSibling = $(event.currentTarget).siblings()[0];
      firstCardFront = $(event.currentTarget).siblings().attr('class');
    } else {
      secondCardClicked = $(event.currentTarget);
      secondSibling = $(event.currentTarget).siblings()[0];
      secondCardFront = $(event.currentTarget).siblings().attr('class');
    }

    if (firstCardFront === secondCardFront) {
      matches++
      attempts++
      streak++
      championName = firstCardFront.split(' ')[1];
      switch (championName) {
        case 'aatrox':
          playSoundMp3('Aatrox');
          break;
        case 'ahri':
          playSoundMp3('Ahri');
          break;
        case 'azir':
          playSoundMp3('Azir');
          break;
        case 'braum':
          playSoundMp3('Braum');
          break;
        case 'yasuo':
          playSoundMp3('Yasuo');
          break;
        case 'diana':
          playSoundMp3('Diana');
          break;
        case 'elise':
          playSoundMp3('Elise');
          break;
        case 'jinx':
          playSoundMp3('Jinx');
          break;
        case 'zed':
          playSoundMp3('Zed');
          break;
        default:
          console.log('That\'s not a champion!');
      }


      $(firstSibling).addClass('matching');
      $(secondSibling).addClass('matching');

      resetValues();
      displayStats();
      $('.main__Game_Container').css('pointer-events', 'none');
      setTimeout(function() {
        $('.main__Game_Container').css('pointer-events', 'auto');
      }, 500)

      if (streak === matches) {
        switch (streak) {
          case 2:
            playSoundMp3('DoubleKill');
            break;
          case 3:
            playSoundMp3('TripleKill');
            break;
          case 4:
            playSoundMp3('QuadraKill');
            break;
          case 5:
            playSoundMp3('PentaKill');
            break;
          default:
            console.log('Nice');
        }
      }

      if (matches === maxMatches) {
        //GAME WON
        winGame();
      }


    } else if (secondCardClicked !== null && firstCardFront !== secondCardFront) {
      attempts++
      streak = 0;
      displayStats();
      $('.main__Game_Container').css('pointer-events', 'none');
      setTimeout(function () {
        $(firstCardClicked).removeClass('invisible');
        $(secondCardClicked).removeClass('invisible');
        resetValues();
        $('.main__Game_Container').css('pointer-events', 'auto');
      }, 500);
    }
  }
}

function shuffleArray(array) {
  for (var arrayIndex = array.length-1 ; arrayIndex > 0 ; arrayIndex--) {
    var j = Math.floor(Math.random() * (arrayIndex + 1));
    var temp = array[arrayIndex];
    array[arrayIndex] = array[j];
    array[j] = temp;
  }
  return array;
}

function shuffleCards() {
  newArray = shuffleArray(imgClasses);

  for (var classIndex = 0 ; classIndex < newArray.length ; classIndex++) {
    $(`#card${classIndex}`).addClass(newArray[classIndex]);
  }
}

function calculateAccuracy() {
  if (attempts === 0 ) {
    percentage = (matches / 1) * 100;
  } else {
    percentage = (matches / attempts) * 100;
  }
  return percentage;
}

function playSoundMp3(name) {
  audio = new Audio(`/assets/sounds/${name}.mp3`);
  audio.volume = 0.5;
  audio.play();
}

function playSoundWav(name) {
  audio = new Audio(`/assets/sounds/${name}.wav`);
  audio.volume = 0.1;
  audio.play();
}

function resetValues() {
  firstCardClicked = null;
  secondCardClicked = null;
  firstCardFront = null;
  secondCardFront = null;
}

function resetCards() {
  $(cardFront).attr('class', 'main__Card-front');
}

function displayStats() {
  var accuracy = calculateAccuracy();
  accuracyRounded = Math.round(accuracy);
  $(gamesCount).text(games_played);
  $(attemptsCount).text(attempts);
  $(accuracyCount).text(accuracyRounded + '%');
}

function resetStats() {
  resetCards();
  resetValues();
  shuffleCards();
  $(cardFront).removeClass('matching');
  $(cardBack).removeClass('invisible');

  matches = 0;
  attempts = 0;
  resetValues();
  displayStats();

  mainContainer.removeClass('blur');
  winContainer.removeClass('zIndexUp').removeClass('indicatorFadeIn').addClass('invisible');
  $('.main__Game_Container').css('pointer-events', 'auto');
}

function goBack() {
  mainContainer.removeClass('blur');
  winContainer.removeClass('zIndexUp').removeClass('indicatorFadeIn').addClass('invisible');
  $('.main__Game_Container').css('pointer-events', 'auto');
}

function winGame() {
  games_played++
  mainContainer.addClass('blur');
  winContainer.addClass('zIndexUp').removeClass('invisible').addClass('indicatorFadeIn');
  $('.main__Game_Container').css('pointer-events', 'none');
  playSoundMp3('Victory');

  button.mouseenter(function() {
    playSoundWav('Hover');
  })

  button.click(function() {
    playSoundWav('Click');
  })

  playAgainButton.click(resetStats);
  backButton.click(goBack);
}

function pentakill() {
  
}
