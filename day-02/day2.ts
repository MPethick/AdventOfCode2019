// Define imports
import * as fs from "fs";

// Define variables
const filename: string = "./day2.txt";
let memoryArray: Array<number> = [];
let answerPartOne: number = 0;
interface AnswerPartTwo {
  output: number;
  noun: number;
  verb: number;
  calculation: number;
}
let answerPartTwo: AnswerPartTwo = {
  output: 0,
  noun: 0,
  verb: 0,
  calculation: 0,
};

// Import the text file into a string and then split each number into a seperate string array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split(",");

// Parse the string array into an integer array
textFile.forEach(
  (rowValue, index) =>
    (memoryArray[index] = parseInt(rowValue))
);

///////////////////////
// Part 1 of exercise
///////////////////////

// Function which decodes the intcode program using the passed noun and verb values and returns the output
// (the value from position 0 in intcode after the program is run)
function intcodeComputer(noun: number, verb: number) {
  // Define array to hold intcode program from the memory
  let gravityArray: Array<number> = [];

  // Assign corresponding intcode program from the memory
  gravityArray = memoryArray.slice();
  // Assign noun and verb values into the intcode program
  gravityArray[1] = noun;
  gravityArray[2] = verb;

  // Loop through the intcode instructions until an exit opcode ('99') is detected. An instruction is formatted 
  // as follows: The first value is the opcode, the second two values are the positions of the two inputs, and  
  // the fourth value is the position of the output.  
  for (let i: number = 0; gravityArray[i] !== 99; i += 4) {
    // Perform the action on the instruction related to the opcode
    switch (gravityArray[i]) {
      // When an opcode '1' is detected, perform an addition
      case 1:
        gravityArray[gravityArray[i + 3]] =
          gravityArray[gravityArray[i + 1]] + gravityArray[gravityArray[i + 2]];
        break;
      // When an opcode '2' is detected, perform an multiplication
      case 2:
        gravityArray[gravityArray[i + 3]] =
          gravityArray[gravityArray[i + 1]] * gravityArray[gravityArray[i + 2]];
        break;
      // When a non-valid opcode is detected, throw an error
      default:
        throw new Error("A non-valid Opcode was detected");
    }
  }

  return gravityArray[0];
}

// Calculate the output of the intcode program when an input of noun = 12  and verb = 2 are used
answerPartOne = intcodeComputer(12, 2);

// Print the output of the intcode program when an input of noun = 12 and verb = 2 are used
console.log(
  `The value in position 0 after executing the program with inputs noun = 12 and verb = 2 is ${answerPartOne}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// Iterate through possible noun and verb combinations until a combination which produces an output of
// 19690720 is found
for (let noun: number = 1; answerPartTwo.output !== 19690720; noun++) {
  for (
    let verb: number = 1;
    verb < 100 && answerPartTwo.output !== 19690720;
    verb++
  ) {
    answerPartTwo = {
      output: intcodeComputer(noun, verb),
      noun: noun,
      verb: verb,
      calculation: 0,
    };
  }
}

// Print the noun and verb combination which produces an output of 19690720
console.log(
  `When noun = ${answerPartTwo.noun} and verb = ${answerPartTwo.verb}, the value in position 0 after executing
   the program is ${answerPartTwo.output}.`
);

// Calculte (100 * noun) + verb
answerPartTwo.calculation = 100 * answerPartTwo.noun + answerPartTwo.verb;

// print answer to  (100 * noun) + verb
console.log(
  `(100 * noun) + verb = (100 * ${answerPartTwo.noun}) + ${answerPartTwo.verb} = ${answerPartTwo.calculation}`
);
