$(document).ready(function() {
  $(".loader").fadeOut('slow');
  $(".loader__Container").fadeOut('slow');
  initializeApp();
});

var cardFront = $('.main__Card-front');
var cardBack = $('.main__Card-back');
var stats = $('.main__Aside-Stats');
var timerText = $('.main__Aside-Timer');
var gamesText = $('.main__Aside-Games-Text');
var gamesCount = $('.main__Aside-Games-Count');
var attemptsText = $('.main__Aside-Attempts-Text')
var attemptsCount = $('.main__Aside-Attempts-Count');
var accuracyText = $('.main__Aside-Accuracy-Text');
var accuracyCount = $('.main__Aside-Accuracy-Count');
var mainContainer = $('.main__Container');
var winContainer = $('.win');
var startContainer = $('.start')
var button = $('.btn');
var backButton = $('.win__Buttons-back');
var playAgainButton = $('.win__Buttons-play');

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var globalMatches = null;
var firstCardFront = null;
var secondCardFront = null;
var firstSibling = null;
var secondSibling = null;
var championName = null;
var audio = null;
var attempts = 0;
var globalAttempts = 0;
var games_played = 0;
var percentage = 0;
var streak = 0;
var streakMatch = 0;
var streakArr = [];
var countDown;

var imgClasses = ['aatrox', 'ahri', 'azir', 'braum', 'yasuo', 'diana', 'elise', 'jinx', 'zed',
                  'zed', 'jinx', 'elise', 'diana', 'yasuo', 'braum', 'azir', 'ahri', 'aatrox'];

var newArray = [];
var maxMatches = imgClasses.length / 2;

function initializeApp() {

  shuffleCards();
  winContainer.addClass('invisible');
  mainContainer.addClass('indicatorFadeIn');
  cardBack.mouseenter(function () {
    if (!($(this).hasClass('invisible'))) {
      playSound('Hover');
    }
  })
  cardBack.click(function () {
    if (!($(this).hasClass('invisible'))) {
      playSound('Click');
    }
  })
  stats.mouseenter(function () {
    playSound('Hover');
  })
  stats.click(function() {
    playSound('Click');
    if ($(stats).hasClass('clicked')) {
      $(stats).removeClass('clicked');
      displayStats();
    } else {
      $(stats).addClass('clicked');
      displayGlobalStats();
    }
  })


  cardBack.click(checkMatch);
}

function checkMatch (event) {
  var card = this;
  var cardNotFlipped = !($(card).hasClass('invisible'));


  if (cardNotFlipped) {
    $(card).addClass('invisible');
    if (!firstCardClicked) {
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
      globalMatches++
      attempts++
      globalAttempts++
      streak++
      streakMatch++
      championName = firstCardFront.split(' ')[1];
      switch (championName) {
        case 'aatrox':
          playSound('Aatrox');
          break;
        case 'ahri':
          playSound('Ahri');
          break;
        case 'azir':
          playSound('Azir');
          break;
        case 'braum':
          playSound('Braum');
          break;
        case 'yasuo':
          playSound('Yasuo');
          break;
        case 'diana':
          playSound('Diana');
          break;
        case 'elise':
          playSound('Elise');
          break;
        case 'jinx':
          playSound('Jinx');
          break;
        case 'zed':
          playSound('Zed');
          break;
        default:
          alert('That\'s not a champion!');
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
          case 1:
            break;
          case 2:
            muteSound();
            playSound('DoubleKill');
            break;
          case 3:
            muteSound();
            playSound('TripleKill');
            break;
          case 4:
            muteSound();
            playSound('QuadraKill');
            break;
          case 5:
            muteSound();
            playSound('PentaKill');
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
        streakArr.push(streak);
      }

      if (streak !== 6  && matches === maxMatches) {
        muteSound();
        winGame();
      }

    } else if (secondCardClicked !== null && firstCardFront !== secondCardFront) {
      attempts++
      globalAttempts++

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

function calculateAccuracy(attemptsVar, matchesVar) {
  if (attemptsVar === 0 ) {
    percentage = (matchesVar / 1) * 100;
  } else {
    percentage = (matchesVar / attemptsVar) * 100;
  }
  return percentage;
}

function loadSound() {
  var mp3Array = ['Aatrox', 'Ahri', 'Azir', 'Braum', 'Diana', 'Elise', 'Jinx', 'Yasuo', 'Zed', 'DoubleKill', 'TripleKill', 'QuadraKill', 'PentaKill', 'Godlike', 'Victory', 'Click', 'Hover'];
  for (var i = 0 ; i < mp3Array.length; i++) {
    createjs.Sound.registerSound(`/assets/sounds/${mp3Array[i]}.mp3`, mp3Array[i]);
  }
}

function playSound(name) {
  audio = createjs.Sound.play(name);
  audio.volume = 0.3;
  if (name === 'Hover' && window.matchMedia('(max-width: 450px)').matches) {
    audio.volume = 0;
  }
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
  var accuracy = calculateAccuracy(attempts, matches);
  var accuracyRounded = Math.round(accuracy);
  $(gamesText).text('Games Played');
  $(gamesCount).text(games_played);
  attemptsText.text('Attempts');
  $(attemptsCount).text(attempts);
  accuracyText.text('Accuracy');
  $(accuracyCount).text(accuracyRounded + '%');
}

function displayGlobalStats() {
  var totalAccuracy = calculateAccuracy(globalAttempts, globalMatches);
  var totalAccuracyRounded = Math.round(totalAccuracy);
  var longestStreak = Math.max(...streakArr);
  $(gamesText).text('Longest Streak')
  if (!streakArr.length) {
    $(gamesCount).text(0);
  } else {
    $(gamesCount).text(longestStreak);
  }
  $(attemptsText).text('Total Attempts');
  $(attemptsCount).text(globalAttempts);
  $(accuracyText).text('Total Accuracy');
  $(accuracyCount).text(totalAccuracyRounded + '%');
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
  enableClick('.main__Container');
  disableClick('.win');
}

function goBack() {
  mainContainer.removeClass('blur');
  winContainer.removeClass('zIndexUp').removeClass('indicatorFadeIn').addClass('invisible');
  enableClick('.main__Container');
  disableClick('.win');
}

function winGame() {
  games_played++
  mainContainer.addClass('blur').removeClass('transitionUp');
  winContainer.addClass('zIndexUp').removeClass('invisible').addClass('indicatorFadeIn');
  enableClick('.win');
  disableClick('.main__Container');

  setTimeout(function() {
    if ($('.win__Logo').text() === 'Godlike!') {
      playSound('Godlike');
    } else {
      playSound('Victory');
    }
  }, 1000)

  button.mouseenter(function() {
    playSound('Hover');
  })

  button.click(function() {
    playSound('Click');
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

function pentakill() {
  $('.main__Card-front.matching').addClass('indicatorPentaKill').addClass('addGlow');
  disableClick('.main__Card');

  setTimeout(function() {
    enableClick('.main__Card');
    $('.main__Card-front.matching').removeClass('indicatorPentaKill').removeClass('addGlow');
  }, 3000)
}