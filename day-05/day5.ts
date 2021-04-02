// Define imports
import * as fs from "fs";

// Define variables
const filename: string = "./day5.txt";
let memoryArray: Array<number> = [];
let answerPartOne: number | undefined;
let answerPartTwo: number | undefined;

// Import the text file into a string and then split each number into a seperate string array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split(",");

// Parse the string array into an integer array
textFile.forEach(
  (rowValue, index) => (memoryArray[index] = parseInt(rowValue))
);

///////////////////////
// Part 1 of exercise
///////////////////////

// Function which decodes the intcode program using the passed noun and verb values and returns the output
// (the value from position 0 in intcode after the program is run)
function intcodeComputer(inputValue: number) : number | undefined {
  // Define array to hold intcode program from the memory
  let gravityArray: Array<number> = [];
  let opcode: string = "";

  // Assign corresponding intcode program from the memory
  gravityArray = memoryArray.slice();

  // Loop through the intcode instructions until an exit opcode ('99') is detected. An instruction is formatted
  // as follows: The first value is the opcode, the second two values are the positions of the two inputs, and
  // the fourth value is the position of the output
  for (let i: number = 0; gravityArray[i] !== 99; i += 2) {
    // Convert the current opcode to a string to allow for the identification of its parameters
    opcode = gravityArray[i].toString();

    // Check if parameters one and two are in either position or immediate mode. A parameter in position mode uses
    // the value stored at the address pointed to by the parameter while a parameter in immediate mode uses the value
    // of the parameter. A position mode is denoted by a "1" in the relevant section of the opcode instruction while an
    //  "0" or an ommited value denotes a immediate mode. An example of a decoded opcode instruction is seen below:
    //
    // A B C D E
    //   1 0 0 2
    // DE - two-digit opcode,      02 = opcode 2
    // C  - mode of 1st parameter,  1 = position mode
    // B  - mode of 2nd parameter,  0 = immediate mode
    // A  - mode of 3rd parameter,  0 = position mode, omitted due to being a leading zero
    //
    let parameterOne: number =
      opcode[opcode.length - 3] === "1"
        ? gravityArray[i + 1]
        : gravityArray[gravityArray[i + 1]];
    let parameterTwo: number =
      opcode[opcode.length - 4] === "1"
        ? gravityArray[i + 2]
        : gravityArray[gravityArray[i + 2]];

    // Perform the action on the instruction related to the opcode
    switch (opcode[opcode.length - 1]) {
      // When an opcode '1' is detected, perform an addition
      case "1":
        gravityArray[gravityArray[i + 3]] = parameterOne + parameterTwo;
        i += 2;
        break;
      // When an opcode '2' is detected, perform an multiplication
      case "2":
        gravityArray[gravityArray[i + 3]] = parameterOne * parameterTwo;
        i += 2;
        break;
      // When an opcode '3' is detected, perform an input
      case "3":
        gravityArray[gravityArray[i + 1]] = inputValue;
        break;
      // When an opcode '4' is detected, perform an output
      case "4":
        // Return the diagnostic code if the value output is not equal to 0
        if (parameterOne !== 0) {
          return parameterOne;
        }
        console.log(`An output of ${parameterOne} was detected at ${i}`);
        break;
      // When an opcode '5' is detected, perform a jump-if-true
      case "5":
        if (parameterOne !== 0) {
          i = parameterTwo - 2;
        } else {
          i += 1;
        }
        break;
      // When an opcode '6' is detected, perform a jump-if-false
      case "6":
        if (parameterOne === 0) {
          i = parameterTwo - 2;
        } else {
          i += 1;
        }
        break;
      // When an opcode '7' is detected, perform a less than
      case "7":
        gravityArray[gravityArray[i + 3]] = parameterOne < parameterTwo ? 1 : 0;
        i += 2;
        break;
      // When an opcode '8' is detected, perform an equal to
      case "8":
        gravityArray[gravityArray[i + 3]] =
          parameterOne === parameterTwo ? 1 : 0;
        i += 2;
        break;
      // When an opcode '9' is detected, check if its an exit code and if it is not, throw an error
      case "9":
        if (opcode[opcode.length - 2] === "9") {
          return undefined;
        } else {
          throw new Error(
            `A non-valid Opcode of ${opcode} was detected at position ${i}`
          );
        }
      // When a non-valid opcode is detected, throw an error
      default:
        throw new Error(
          `A non-valid Opcode of ${opcode} was detected at position ${i}`
        );
    }
  }

  // Return an undefined if no diagonostic code is found
  return undefined;
}

// Calculate the output of the intcode program when an input value of 1 is used
answerPartOne = intcodeComputer(1);

// Print the diagonostic code of the intcode program when an input 1 is used
console.log(
  `The diagonostic code after executing the program with input value of 1 is ${answerPartOne}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// Calculate the output of the intcode program when an input value of 5 is used
answerPartTwo = intcodeComputer(5);

// Print the diagonostic code of the intcode program when an input 5 is used
console.log(
  `The diagonostic code after executing the program with input value of 5 is ${answerPartTwo}.`
);
