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

const main = () => {
  const client = net.createConnection(8000);
  const guessingAssistant = new GuessingAssistant({ min: 1, max: 50 });
  client.setEncoding('utf-8');
  
  client.on('connect', () => {
    client.write(guessingAssistant.guess().toString());
  });

  client.on('data', (hint) => {
    // console.log(hint);
    const guessResult = JSON.parse(hint);
    guessingAssistant.previousGuessResult(guessResult);
    client.write(guessingAssistant.guess().toString());
    console.log(guessingAssistant.guess());
  });
};

main();