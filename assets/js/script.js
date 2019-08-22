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
var streakMatch = 0;

var imgClasses = ['aatrox', 'ahri', 'azir', 'braum', 'yasuo', 'diana', 'elise', 'jinx', 'zed',
                  'zed', 'jinx', 'elise', 'diana', 'yasuo', 'braum', 'azir', 'ahri', 'aatrox'];

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

    console.log(firstCardClicked, secondCardClicked);

    if (firstCardFront === secondCardFront) {
      matches++
      attempts++
      streak++
      streakMatch++
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
      disableClick('.main__Game_Container');
      disableClick('.main__Card');
      setTimeout(function() {
        enableClick('.main__Game_Container');
        enableClick('.main__Card');
      }, 500)

      if (streak === streakMatch) {
        switch (streak) {
          case 0:
            break;
          case 2:
            muteSound();
            playSoundMp3('DoubleKill');
            break;
          case 3:
            muteSound();
            playSoundMp3('TripleKill');
            break;
          case 4:
            muteSound();
            playSoundMp3('QuadraKill');
            break;
          case 5:
            muteSound();
            playSoundMp3('PentaKill');
            pentakill();
            break;
          case 6:
            muteSound();
            $('.win__Logo').text('Godlike!')
            winGame();
            break;
          default:
            break;
        }
      }

      if (streak !== 6  && matches === maxMatches) {
        muteSound();
        winGame();
      }

    } else if (secondCardClicked !== null && firstCardFront !== secondCardFront) {
      attempts++
      streak = 0;
      streakMatch = 0;

      displayStats();
      disableClick('.main__Game_Container')
      disableClick('.main__Card');
      setTimeout(function () {
        $(firstCardClicked).removeClass('invisible');
        $(secondCardClicked).removeClass('invisible');
        resetValues();
        enableClick('.main__Game_Container');
        enableClick('.main__Card');
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
  audio.volume = 0.3;
  audio.play();
}

function playSoundWav(name) {
  audio = new Audio(`/assets/sounds/${name}.wav`);
  audio.volume = 0.1;
  audio.play();
}

function muteSound() {
  audio.volume = 0;
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
  shuffleCards();
  $(cardFront).removeClass('matching');
  $(cardBack).removeClass('invisible');
  $('.win__Logo').text('Victory');

  streak = 0;
  streakMatch = 0;
  matches = 0;
  attempts = 0;
  resetValues();
  displayStats();

  mainContainer.removeClass('blur');
  winContainer.removeClass('zIndexUp').removeClass('indicatorFadeIn').addClass('invisible');
  enableClick('.main__Game_Container');
  disableClick('.win');
}

function goBack() {
  mainContainer.removeClass('blur');
  winContainer.removeClass('zIndexUp').removeClass('indicatorFadeIn').addClass('invisible');
  enableClick('.main__Game_Container');
  disableClick('.win');
}

function winGame() {
  games_played++
  mainContainer.addClass('blur');
  winContainer.addClass('zIndexUp').removeClass('invisible').addClass('indicatorFadeIn');
  enableClick('.win');
  disableClick('.main__Game_Container');

  setTimeout(function() {
    if ($('.win__Logo').text() === 'Godlike!') {
      playSoundMp3('Godlike');
    } else {
      playSoundMp3('Victory');
    }
  }, 1000)

  button.mouseenter(function() {
    playSoundWav('Hover');
  })

  button.click(function() {
    playSoundWav('Click');
  })

  playAgainButton.click(resetStats);
  backButton.click(goBack);
}

function enableClick(name) {
  $(name).css('pointer-events', 'auto');
}

function disableClick(name) {
  $(name).css('pointer-events', 'none');
}

function addStyle(element, style) {
  $(element).addClass(style);
}

function removeStyle(element, style) {
  $(element).removeClass(style)
}

function pentakill() {
  $('.main__Card-front.matching').addClass('indicatorPentaKill').addClass('addGlow');
  disableClick('.main__Card');

  setTimeout(function() {
    enableClick('.main__Card');
    $('.main__Card-front.matching').removeClass('indicatorPentaKill').removeClass('addGlow');
  }, 3000)
}
