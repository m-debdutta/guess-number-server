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
};

const checkGuess = (secretNumber, guessedNumber) => {
  const result = { isBigger: false, isSmaller: false };
  if (guessedNumber > secretNumber) result.isBigger = true;
  if (guessedNumber < secretNumber) result.isSmaller = true;

  return result;
};

const runGuessingGame = ({ secretNumber, guessedNumber, remainingAttempts }) => {
  const gameStats = { isWon: false, isLost: false };

  if (guessedNumber === secretNumber) {
    gameStats.isWon = true;
    gameStats.secretNumber = secretNumber;
    return gameStats;
  }

  if (remainingAttempts === 0) {
    gameStats.isLost = true;
    gameStats.secretNumber = secretNumber;
    return gameStats;
  }

  if (guessedNumber) gameStats.hint = checkGuess(secretNumber, guessedNumber);

  return gameStats;
};

const generateSecretNumber = (lowerLimit, upperLimit) => {
  return Math.floor(Math.random() * (upperLimit - lowerLimit)) + lowerLimit;
};


const initiateGame = ({ server, maxAttempts, lowerLimit, upperLimit }) => {
  const message = {};
  message.welcomingMessage = generateWelcomeMessage(maxAttempts, lowerLimit, upperLimit);

  server.on('connection', (socket) => {
    const secretNumber = generateSecretNumber(lowerLimit, upperLimit);
    let remainingAttempts = maxAttempts;

    socket.setEncoding('utf-8');
    
    socket.on('data', () => {
      remainingAttempts -= 1;
      
      const guessedNumber = parseInt(number);
      const response = runGuessingGame({ secretNumber, guessedNumber, remainingAttempts });
      
      response.remainingAttempts = remainingAttempts;
      response.guessedNumber = guessedNumber;
      socket.write(JSON.stringify({ response, message }));

      if (response.isWon || response.isLost) socket.end();

    });
  });
};

const main = () => {
  const maxAttempts = 5;
  const lowerLimit = 0;
  const upperLimit = 1024;
  const server = net.createServer();
  server.listen(8000);
  initiateGame({ server, maxAttempts, lowerLimit, upperLimit });
};

main();