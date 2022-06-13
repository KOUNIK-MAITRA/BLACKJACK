let blackjackGame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,

};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('static/BlackJack Assets/sounds/swish.m4a')
const winSound = new Audio('static/BlackJack Assets/sounds/cash.mp3');
const lossSound = new Audio('static/BlackJack Assets/sounds/aww.mp3');
const drawSound = new Audio('static/BlackJack Assets/sounds/draw.wav');
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }

}

function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (let i = 0; i < yourImages.length; i++) { yourImages[i].remove(); }

        for (let i = 0; i < dealerImages.length; i++) { dealerImages[i].remove(); }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#your-blackjack-result').style.textShadow = '3px 2px 8px rgb(4, 153, 4)';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.textShadow = '3px 2px 8px rgb(4, 153, 4)';


        document.querySelector('#blackjack-result').textContent = "LET'S PLAY !";
        document.querySelector('#blackjack-result').style.color = 'white';
        blackjackGame['isStand'] = false;
        blackjackGame['turnsOver'] = false;
    }
}

function showCard(activePlayer, card) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `static/BlackJack Assets/images/${card}.png`;
        cardImage.style.width = "60px";
        cardImage.style.height = "80px";
        cardImage.style.padding = "3px";
        cardImage.style.boxShadow = "2px 4px 8px darkgreen";

        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();

    }
}

function updateScore(card, activePlayer) {   // If adding 11 keeps you below 21 add 11 else add 1
    if (card == 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }

}


function showScore(activePlayer) {
    if (activePlayer['score'] <= 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = ' GOT BUSTED !';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        document.querySelector(activePlayer['scoreSpan']).style.textShadow = '2px 2px 6px darkred';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    if (blackjackGame['turnsOver'] === false) {
        blackjackGame['isStand'] = true;

        while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
            let card = randomCard();
            showCard(DEALER, card);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(400);
        }


        blackjackGame['turnsOver'] = true;
        showResult(computeWinner());
    }
}



function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;
        }


        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        }

        else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }

        else if (YOU['score'] > 21 && DEALER['score'] > 21) {
            blackjackGame['draws']++;
        }

    }

    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) { blackjackGame['draws']++; }


    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'YOU WON !'
            messageColor = 'green';
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'YOU LOST !';
            messageColor = 'red';
            lossSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = " IT'S a DRAW";
            messageColor = 'yellow';
            drawSound.play();
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}

