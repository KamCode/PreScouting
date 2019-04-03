const readline = require('readline');

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

rl.question('Team Number: ', (answer) => {
   console.log('Generating a list for:', answer);
   rl.close();
})