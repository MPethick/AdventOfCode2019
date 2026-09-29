///////////////////////////////////////
// Puzzle input range is 372037-905157
///////////////////////////////////////

export{}

// Define variables
let validPasswordsPartOne: Array<number> = [];
let validPasswordsPartTwo: Array<number> = [];


// Loop through each password in the puzzles input range and check whether they meet the criteria
for (let password: number = 372037; password <= 905157; password++) {
  // Define variables  
  let increasingFlag: boolean = true;
  let adjacentFlagPartOne: boolean = false;
  let adjacentFlagPartTwo: boolean = false;
  let passwordString: string = password.toString();

  // Loop through each digit of the password to check whether the entire password follows the criteria
  for (let i: number = 0; i < passwordString.length - 1; i++) {
    // If going from left to right, the digits decreases, flag this criteria password as invalid
    if (parseInt(passwordString[i]) > parseInt(passwordString[i + 1])) {
      increasingFlag = false;
      break;
    }
    // For part one: if two adjacent digits are the same, flag this criteria password as valid
    // For part one: if two adjacent digits are the same and not part of a larger group of matching 
    // digits, flag this criteria password as valid
    if (passwordString[i] === passwordString[i + 1]) {
      adjacentFlagPartOne = true;
      if (
        passwordString[i] !== passwordString[i + 2] &&
        passwordString[i] !== passwordString[i - 1]
      ) {
        adjacentFlagPartTwo = true;
      }
    }
  }

  // If both part criteria are met, add the password to the array of valid passwords
  if (adjacentFlagPartOne === true && increasingFlag === true) {
    validPasswordsPartOne.push(password);
  }
  if (adjacentFlagPartTwo === true && increasingFlag === true) {
    validPasswordsPartTwo.push(password);
  }
}

// Print the number of passwords which meet the criteria
console.log(
  `The number of different passwords within the range 372037-905157 which fits the part one criteria is ${validPasswordsPartOne.length}.`
);
console.log(
  `The number of different passwords within the range 372037-905157 which fits the part two criteria is ${validPasswordsPartTwo.length}.`
);
