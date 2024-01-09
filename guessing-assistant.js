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

  #generatePseudoRandomNumber() {
    this.#currentGuess = Math.floor(Math.random() * (this.#maxNumber - this.#minNumber)) + this.#minNumber;
  }

  guess() {
    this.#generatePseudoRandomNumber();
    return this.#currentGuess;
  }

  previousGuessResult({ isBigger, isSmaller }) {
    if (isSmaller) this.#minNumber = this.#currentGuess;
    if (isBigger) this.#maxNumber = this.#currentGuess;
  }
}

const display = (gameResponse) => {
  console.log('Your guess: ', gameResponse.guessedNumber);

  if (gameResponse.isWon) {
    console.log('Congratulations! you won!!');
    return;
  }

  if (gameResponse.isLost) {
    console.log('Oops! You loose!!');
    console.log('Secret number is: ' + gameResponse.secretNumber);
    return;
  }

  if (gameResponse.hint) {
    const message = gameResponse.hint.isBigger ? '  ==> Too big' : '  ==> Too small';
    console.log(message, '\n');
  }
};

const isGameOver = (gameStats) => !gameStats.isWon && !gameStats.isLost;

const main = () => {
  const client = net.createConnection(8000);
  const guessingAssistant = new GuessingAssistant({ min: 0, max: 1024 });
  client.setEncoding('utf-8');
  const playerRequest = {};

  client.on('connect', () => {
    playerRequest.play = true;
    playerRequest.guess = null;
    client.write(JSON.stringify(playerRequest));
    // client.write(guessingAssistant.guess().toString());
  });

  client.on('data', (gameDetails) => {
    const { message, response } = JSON.parse(gameDetails);
    if (response.remainingAttempts === 4) {
      console.log(message.welcomingMessage);
    }

    display(response);

    if (isGameOver(response)) {
      guessingAssistant.previousGuessResult(response.hint);

      client.write(guessingAssistant.guess().toString());
    }
  });
};

main();