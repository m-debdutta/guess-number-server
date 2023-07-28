const net = require('node:net');

const NEWLINE = '\n';

const generateWelcomeMessage = () => {
  let message = '';
  message += NEWLINE;
  message += 'Welcome to my Guessing Game !';
  message += NEWLINE;
  message += 'Guess a number from 1 to 50';
  message += NEWLINE;
  message += 'You have only 5 chances.';
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

const generateHint = (result) => {
  return result.isBigger ? 'Number is bigger' : 'Number is smaller';
}

const runGuessingGame = (socket, secretNumber, guessedNumber, remainingAttempts) => {

  if (guessedNumber === secretNumber) {
    console.log('Congratulations! you won!!' + NEWLINE);
    console.log('Secret number is: ' + secretNumber + NEWLINE);
    socket.end();
    return;
  }

  if (guessedNumber) {
    const guessResult = checkGuess(secretNumber, guessedNumber);
    console.log(generateHint(guessResult));
    socket.write(JSON.stringify(guessResult) + NEWLINE);
    remainingAttempts -= 1;
  }

  if (remainingAttempts === 0) {
    console.log('Oops! You loose!!' + NEWLINE);
    console.log('Secret number is: ' + secretNumber + NEWLINE);
    socket.end();
    return;
  }
}

const generateSecretNumber = (lowerLimit, upperLimit) => {
  return Math.floor(Math.random() * (upperLimit - lowerLimit)) + lowerLimit;
}

const initiateGame = (server, maxAttempts, maxLimit) => {
  server.on('connection', (socket) => {
    const secretNumber = generateSecretNumber(0, maxLimit);
    let remainingAttempts = maxAttempts;

    console.log(generateWelcomeMessage());
    // socket.write(generateWelcomeMessage());
    socket.setEncoding('utf-8');

    socket.on('data', (number) => {
      const guessedNumber = parseInt(number);
      runGuessingGame(socket, secretNumber, guessedNumber, remainingAttempts)
      remainingAttempts -= 1;
    });
  });
}

const main = () => {
  const maxAttempts = 5;
  const maxLimit = 50;
  const server = net.createServer();
  server.listen(8000);
  initiateGame(server, maxAttempts, maxLimit);
}

main();