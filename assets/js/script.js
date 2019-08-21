$(document).ready(initializeApp);

var card;
var cardFront = $('.main__Card-front');
var cardBack = $('.main__Card-back');

var firstCardClicked = null;
var secondCardClicked = null;
var matches = null;
var firstCardFront = null;
var secondCardFront = null;
var firstSibling = null;
var secondSibling = null;

var imgClasses = ['aatrox', 'ahri', 'azir', 'braum', 'yasuo', 'diana', 'elise', 'jinx', 'zed',
                  'aatrox', 'ahri', 'azir', 'braum', 'yasuo', 'diana', 'elise', 'jinx', 'zed'];
var newArray = [];
var championName;
var audio;

function initializeApp() {

  shuffleCards();
  cardBack.mouseenter(function () {
    playSoundWav('Hover');
  })
  cardBack.click(function () {
    playSoundWav('Click');
  })
  cardBack.click(flipCard);

}


// function handleCardClick(event) {
//   var card = event.target;

//   $(card).addClass('hidden');
//   $('.main__Card-front').addClass('inline');
// }

function flipCard (event) {
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

      firstCardClicked = null;
      secondCardClicked = null;
      firstCardFront = null;
      secondCardFront = null;
      $('.main__Game_Container').css('pointer-events', 'none');
      setTimeout(function() {
        $('.main__Game_Container').css('pointer-events', 'auto');
      }, 500)


    } else if (secondCardClicked !== null && firstCardFront !== secondCardFront) {
      $('.main__Game_Container').css('pointer-events', 'none');
      setTimeout(function () {
        $(firstCardClicked).removeClass('invisible');
        $(secondCardClicked).removeClass('invisible');
        firstCardClicked = null;
        secondCardClicked = null;
        firstCardFront = null;
        secondCardFront = null;
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
