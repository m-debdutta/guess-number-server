const net = require('node:net');

const NEWLINE = '\n';

const generateWelcomeMessage = (maxAttempts, minNumber, maxNumber) => {
  let message = '';
  message += NEWLINE;
  message += 'Welcome to my Guessing Game !';
  message += NEWLINE;
  message += `Guess a number from ${minNumber} to ${maxNumber}`;
  message += NEWLINE;
  message += `You have only ${maxAttempts} chances.`;
  message += NEWLINE;
  message += NEWLINE;

  return message;
}

const checkGuess = (secretNumber, guessedNumber) => {
  const result = { isWon: false, isBigger: false, isSmaller: false };
  if (secretNumber === guessedNumber) result.isWon = true;
  if (guessedNumber > secretNumber) result.isBigger = true;
  if (guessedNumber < secretNumber) result.isSmaller = true;

  return result;
}

const runGuessingGame = ({ secretNumber, guessedNumber, remainingAttempts }) => {
  const gameStats = { isWon: false, isGameOver: false };

  if (guessedNumber === secretNumber) {
    gameStats.isWon = true;
    gameStats.isGameOver = true;
    return gameStats;
  }

  if (remainingAttempts === 0) gameStats.isGameOver = true;

  if (guessedNumber) gameStats.hint = checkGuess(secretNumber, guessedNumber);

  return gameStats;
}

const generateSecretNumber = (lowerLimit, upperLimit) => {
  return Math.floor(Math.random() * (upperLimit - lowerLimit)) + lowerLimit;
}


const initiateGame = (server, maxAttempts, lowerLimit, upperLimit) => {
  const gameMessage = {};
  gameMessage.gameInfo = generateWelcomeMessage(maxAttempts, lowerLimit, upperLimit);

  server.on('connection', (socket) => {
    const secretNumber = generateSecretNumber(lowerLimit, upperLimit);
    let remainingAttempts = maxAttempts;

    socket.setEncoding('utf-8');
    socket.write(JSON.stringify(gameMessage));

    socket.on('data', (number) => {
      const guessedNumber = parseInt(number);
      setTimeout(() => {
        const gameStats = runGuessingGame({ secretNumber, guessedNumber, remainingAttempts });

        gameStats.secretNumber = secretNumber;
        socket.write(JSON.stringify(gameStats));

        if (gameStats.isWon || gameStats.isGameOver) socket.end();

        remainingAttempts -= 1;
      }, 10);
    });
  });
}

const main = () => {
  const maxAttempts = 4;
  const lowerLimit = 0;
  const upperLimit = 50;
  const server = net.createServer();
  server.listen(8000);
  initiateGame(server, maxAttempts, lowerLimit, upperLimit);
}

main();