const net = require('node:net');

class GuessingAssistant {
  #minNumber;
  #maxNumber;
  #currentGuess;
  constructor({ min, max }) {
    this.#minNumber = min;
    this.#maxNumber = max;
    this.#currentGuess = 0;
  }

  guess() {
    this.#currentGuess = Math.round((this.#maxNumber + this.#minNumber) / 2);
    return this.#currentGuess;
  }

  previousGuessResult({ isBigger, isSmaller }) {
    if (isSmaller) this.#minNumber = this.#currentGuess;
    if (isBigger) this.#maxNumber = this.#currentGuess;
  }
}

const display = (guessStats) => {
  console.log('Your guess: ', guessStats.guessedNumber);

  if (guessStats.isWon) {
    console.log('Congratulations! you won!!');
    return;
  }

  if (guessStats.isLost) {
    console.log('Oops! You loose!!');
    console.log('Secret number is: ' + guessStats.secretNumber);
    return;
  }

  if (guessStats.hint) {
    const message = guessStats.hint.isBigger ? '  ==> Too big' : '  ==> Too small';
    console.log(message, '\n');
  }
};

const isGameOver = (gameStats) => !gameStats.isWon && !gameStats.isLost;

const main = () => {
  // const assistantDetails = {};
  const client = net.createConnection(8000);
  const guessingAssistant = new GuessingAssistant({ min: 1, max: 50 });
  client.setEncoding('utf-8');

  client.on('connect', () => {
    client.write(guessingAssistant.guess().toString());
  });

  client.on('data', (gameDetails) => {
    // console.log(gameDetails);
    const gameStats = JSON.parse(gameDetails);
    if (gameStats.gameInfo) {
      console.log(gameStats.gameInfo);
      return;
    }

    display(gameStats);

    if (isGameOver(gameStats)) {
      guessingAssistant.previousGuessResult(gameStats.hint);

      client.write(guessingAssistant.guess().toString());
    }
  });
};

main();