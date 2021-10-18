const fs = require('fs');

// const data = fs.readFileSync('./data.txt', 'utf-8');

const data = fs.readFile('./data.txt', 'utf-8', (err, data) => {
  console.log('1 : ', data);
})

console.log('2 : ', data);