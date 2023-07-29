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
  if (guessStats.isWon) {
    console.log('Congratulations! you won!!');
    return;
  }

  if (guessStats.isGameOver) {
    console.log('Oops! You loose!!');
    console.log('Secret number is: ' + guessStats.secretNumber);
    return;
  }

  if (guessStats.hint.isBigger) {
    console.log('==> Too big');
  }

  if (guessStats.hint.isSmaller) {
    console.log('==> Too small');
  }
}

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

    if (!gameStats.isGameOver) {
      guessingAssistant.previousGuessResult(gameStats.hint);

      client.write(guessingAssistant.guess().toString());
    }
  });
};

main();