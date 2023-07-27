class GuessingAssistant {
  #minNumber;
  #maxNumber;
  #currentGuess;
  constructor({ min, max }) {
    this.#minNumber = min;
    this.#maxNumber = max;
  }

  #guessNumberWithin(a, b) {
    this.#currentGuess = Math.round((a - b) / 2);
  }

  start() {
    this.#guessNumberWithin(this.#maxNumber, this.#minNumber);
  }

  #guessSmallerNumber() {
    this.#guessNumberWithin(this.#currentGuess, this.#minNumber);
  }

  #guessBiggerNumber() {
    this.#guessNumberWithin(this.#maxNumber, this.#currentGuess);
  }

  guess({ isGreater, isSmaller, isAccurate }) {
    if (isAccurate) return;
    if (isGreater) this.#guessSmallerNumber();
    if (isSmaller) this.#guessBiggerNumber();
  }

  get currentGuess() {
    return this.#currentGuess;
  }
}