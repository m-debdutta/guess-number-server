const net = require('node:net');

const NEWLINE = '\n';
const server = net.createServer();
server.listen(8000);

const generateMessage = () => {
  let message = '';
  message += 'Welcome to my Guessing Game !';
  message += NEWLINE;
  message += 'You have only 5 chances.';
  message += NEWLINE;
  message += NEWLINE;

  return message;
}

const checkGuess = (secretNumber, guessedNumber) => {
  const result = { isWon: false, isGreater: false, isSmaller: false };
  if (secretNumber === guessedNumber) result.isWon = true;
  if (guessedNumber > secretNumber) result.isGreater = true;
  if (guessedNumber < secretNumber) result.isSmaller = true;

  return result;
}

server.on('connection', (socket) => {
  const secretNumber = 5;
  let remainingAttempts = 5;
  const message = generateMessage();

  socket.write(message);
  socket.setEncoding('utf-8');

  socket.on('data', (number) => {
    const guessedNumber = parseInt(number);

    if (guessedNumber === secretNumber) {
      socket.write('Congratulations! you won!!' + NEWLINE);
      socket.end();
      return;
    }
    
    if (guessedNumber) {
      const guessResult = checkGuess(secretNumber, guessedNumber);
      socket.write(JSON.stringify(guessResult) + NEWLINE);
      remainingAttempts -= 1;
    }

    if (remainingAttempts === 0) {
      socket.write('Oops! You loose!!' + NEWLINE);
      socket.end();
      return;
    }
  });

  socket.on('end', () => {
    console.log('connection ended');
  });
});