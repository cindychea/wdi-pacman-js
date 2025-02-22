// Setup initial game stats
let score = 0;
let lives = 2;
let powerPellets = 4;
let dots = 240;
let level = 1;

// Define your ghosts here
const Inky = {
  menu_option: '1',
  name: 'Inky',
  colour: 'red',
  character: 'shadow',
  edible: false
};
const Blinky = {
  menu_option: '2',
  name: 'Blinky',
  colour: 'cyan',
  character: 'speedy',
  edible: false
};
const Pinky = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'pink',
  character: 'bashful',
  edible: false
};
const Clyde = {
  menu_option: '4',
  name: 'Clyde',
  colour: 'orange',
  character: 'pokey',
  edible: false
};

ghosts = [Inky, Blinky, Pinky, Clyde]
ghosts_eaten = []

// Draw the screen functionality
function drawScreen() {
  clearScreen();
  setTimeout(() => {
    displayStats();
    displayMenu();
    displayPrompt();
  }, 10);
}

function clearScreen() {
  console.log('\x1Bc');
}

function displayStats() {
  console.log(`Level: ${level}     Score: ${score}     Lives: ${lives}`);
  console.log(`\nPower-Pellets: ${powerPellets}`);
  console.log(`\nDots Remaining: ${dots}`);
}

function displayMenu() {
  console.log('\n\nSelect Option:\n');  // each \n creates a new line
  console.log('(d) Eat Dot');
  if (dots > 9) {
    console.log('(t) Eat 10 Dots');
  }
  if (dots > 99) {
    console.log('(h) Eat 100 Dots');
  }
  if (powerPellets > 0) {
    console.log('(p) Eat Power-Pellet');
  }
  console.log(`(1) Eat Inky (${edibleOrNot(Inky)})`);
  console.log(`(2) Eat Blinky (${edibleOrNot(Blinky)})`);
  console.log(`(3) Eat Pinky (${edibleOrNot(Pinky)})`);
  console.log(`(4) Eat Clyde (${edibleOrNot(Clyde)})`);
  console.log('(q) Quit');
}

function displayPrompt() {
  // process.stdout.write is similar to console.log except it doesn't add a new line after the text
  process.stdout.write('\nWaka Waka :v '); // :v is the Pac-Man emoji.
}


// Menu Options
function eatDot() {
  console.log('\nChomp!');
  dots -= 1;
  score += 10;
}

function eatTenDots() {
  if (dots > 9) {
    console.log('\nChomp! Chomp!');
    dots -= 10;
    score += 100;
  } 
}

function eatHundredDots() {
  if (dots > 99) {
    console.log('\nChomp! Chomp! CHOMP!');
    dots -= 100;
    score += 1000;
  } 
}

function eatPowerPellet() {
  for (g=0; g < ghosts.length; g++) {
    ghosts[g].edible = true;
  }
  score += 50;
  powerPellets -= 1;
}

function eatGhost(ghost) {
  if (ghost.edible == true) {
    console.log(`\n Pac-Man ate the ${ghost.character} ghost, ${ghost.name}!`);
    ghosts_eaten.push(ghost.name);
    ghost.edible = false;
    if (ghosts_eaten.length == 1) {
      score += 200;
    } else if (ghosts_eaten.length == 2) {
      score += 400;
    } else if (ghosts_eaten.length == 3) {
      score += 800;
    } else if (ghosts_eaten.length == 4) {
      score += 1600;
    }
  } else if (ghost.edible == false) {
    console.log(`\nPac-Man was killed by the ${ghost.colour} ghost, ${ghost.name}!`);
    lives -= 1;
    gameOver();
  }
}

function edibleOrNot(ghost) {
  if (ghost.edible == true) {
    return 'edible';
  } else if (ghost.edible == false) {
    return 'inedible';
  }
}

function levelUp() {
  if (powerPellets == 0 && dots == 0) {
    level += 1;
    powerPellets = 4;
    dots = 240;
    for (g=0; g < ghosts.length; g++) {
      ghosts[g].edible = false;
    }
    console.log(`You levelled up!`);
  }
}

function gameOver() {
  if (lives < 0) {
    process.exit();
  }
}


// Process Player's Input
function processInput(key) {
  switch(key) {
    case '\u0003': // This makes it so CTRL-C will quit the program
    case 'q':
      process.exit();
      break;
    case 'd':
      if (dots > 0) {
        eatDot();
        levelUp()
        break;
      } else {
        console.log('\nNo dots left!');
        levelUp()
        break;
      }
    case 't':
      if (dots > 9) {
        eatTenDots();
        levelUp()
        break;
      } else {
        console.log(`Not enough dots left to eat 10!`);
      }
    case 'h':
      if (dots > 99) {
        eatHundredDots();
        levelUp()
        break;
      } else {
        console.log(`Not enough dots left to eat 100!`);
      }
    case 'p':
      if (powerPellets > 0) {
        eatPowerPellet();
        levelUp()
        break;
      } else {
        console.log('\nNo power-pellets left!');
        break;
      }
    case '1':
      eatGhost(Inky);
      break;
    case '2':
      eatGhost(Blinky);
      break;
    case '3':
      eatGhost(Pinky);
      break;
    case '4':
      eatGhost(Clyde);
      break;
    default:
      console.log('\nInvalid Command!');
  }
}


//
// YOU PROBABLY DON'T WANT TO CHANGE CODE BELOW THIS LINE
//

// Setup Input and Output to work nicely in our Terminal
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// Draw screen when game first starts
drawScreen();

// Process input and draw screen each time player enters a key
stdin.on('data', (key) => {
  process.stdout.write(key);
  processInput(key);
  setTimeout(drawScreen, 300); // The command prompt will flash a message for 300 milliseoncds before it re-draws the screen. You can adjust the 300 number to increase this.
});

// Player Quits
process.on('exit', () => {
  console.log('\n\nGame Over!\n');
});
