/*
 * Create a list that holds all of your cards
 */

const cardList = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'anchor', 'anchor', 'bolt', 'bolt', 'cube', 'cube', 'leaf', 'leaf', 'bicycle', 'bicycle', 'bomb', 'bomb'];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

shuffle(cardList);


/*
 * Create each card's coding and add the coding to the deck element
 */

const Card = function(suit){
	this.suit = suit;
	this.code = '<div class="card ' + suit + '"><div class="front"></div><div class="back"><i class="fa fa-' + suit + '"></i></div></div>'
};


let newCards = [];

const createCard = function(array){
	for (i = 0; i < array.length; i++){
		let obj = new Card(array[i]);
		newCards.push(obj);
	}
	return array;
};

createCard(cardList);

const buildDeck = function(array){
	for (i = 0; i < array.length; i++) {
		$('.deck').append(newCards[i].code);
	}
	return array;
};

buildDeck(newCards);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let clickedList = [];

let numMoves = 0;

let numMatches = 0;

/*
 * Window prompt that comes up if user wins
 */

const windowPrompt = function() {
			setTimeout(function(){
				if (numMatches === 8) {
					let result = confirm('Congrats! Your rating was ' + currentRating + ', it took you ' + $(".timer").text() + ' to complete, and your move count was ' + numMoves + '! Would you like to play again?');
						$('.timer').removeClass('timer');
						if (result === true) {
							location.reload();
						}
						else {
							alert('OK, hope to see you again soon!');
						}
				}
			},800);
		};


$('.restart').on('click', function(evt) {
	location.reload();
});


/*
 * Event listener for each card
 */


$('.card').on('click', function(evt) {
	$(this).addClass('open show');
	$(this).css('pointer-events', 'none');
	clickedList.push(this);
	if (clickedList.length === 2) {
		if (String(clickedList[0].classList) === String(clickedList[1].classList)) {
			console.log('Match!');
			setTimeout(function(){
				$(clickedList[0]).css('background-color', 'green');
				$(clickedList[1]).css('background-color', 'green');
				$(clickedList[0]).off('click');
				$(clickedList[1]).off('click');
				clickedList.length = 0;
			},200);
			numMoves += 1;
			starRating(numMoves);
			numMatches += 1;
			$('span.moves').html(numMoves);
			windowPrompt();
		}
		else {
			console.log('Not match!')
			setTimeout(function(){
				$(clickedList[0]).css('pointer-events', 'auto');
				$(clickedList[1]).css('pointer-events', 'auto');
				$(clickedList[0]).css('background-color', 'red');
				$(clickedList[1]).css('background-color', 'red');
			},200);
			numMoves += 1;
			starRating(numMoves);
			$('span.moves').html(numMoves);
			$('.card').css('pointer-events', 'none');
			setTimeout(function(){
				$(clickedList[0]).css('background-color', '');
				$(clickedList[1]).css('background-color', '');
				$(clickedList[0]).removeClass('open show');
				$(clickedList[1]).removeClass('open show');
				clickedList.length = 0;
				$('.card').css('pointer-events', 'auto');
			},800);

		}
	}

});

/*
 * Updates number of moves and adjusts the rating based on that
 */

$('span.moves').html(numMoves);

let currentRating = "3 stars (excellent)"

const starRating = function(moves) {
	if (numMoves === 15) {
		$('#star3').css('color','black');
		currentRating = "2 stars (good)"
		return currentRating;
	}
	else if (numMoves === 25) {
		$('#star2').css('color','black');
		currentRating = "1 star (fair)"
		return currentRating;
	}

};


/*
 * Timer function, found at https://stackoverflow.com/questions/2604450/how-to-create-a-jquery-clock-timer
 */


function get_elapsed_time_string(total_seconds) {
  function pretty_time_string(num) {
    return ( num < 10 ? '0' : '' ) + num;
  }

  let hours = Math.floor(total_seconds / 3600);
  total_seconds = total_seconds % 3600;

  let minutes = Math.floor(total_seconds / 60);
  total_seconds = total_seconds % 60;

  let seconds = Math.floor(total_seconds);

  // Pad the minutes and seconds with leading zeros, if required
  hours = pretty_time_string(hours);
  minutes = pretty_time_string(minutes);
  seconds = pretty_time_string(seconds);

  // Compose the string for display
  let currentTimeString = hours + ':' + minutes + ':' + seconds;

  return currentTimeString;
}

/*
 * Event listener for the deck element that starts the timer when clicked
 */


$('.deck').on('click', function(evt) {

	let elapsed_seconds = 0;
	setInterval(function() {
  		elapsed_seconds = elapsed_seconds + 1;
  		$('.timer').text(get_elapsed_time_string(elapsed_seconds));
	}, 1000);

	$('.deck').off('click');

});



