// Define imports
import * as fs from "fs";
import { intcodeComputer } from "../day-02/intcodeComputer";

// Define variables
const filename: string = "./day5.txt";
let textArray: Array<number> = [];
let answerPartOne: number | undefined;
let answerPartTwo: number | undefined;

// Import the text file into a string and then split each number into a seperate string array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split(",");

// Parse the string array into an integer array
textFile.forEach(
  (rowValue, index) => (textArray[index] = parseInt(rowValue))
);

///////////////////////
// Part 1 of exercise
///////////////////////

// Calculate the output of the intcode program when an input value of 1 is used
[answerPartOne, ] = intcodeComputer(1, 1, 0, textArray);

// Print the diagnostic code of the intcode program when an input 1 is used
console.log(
  `The diagnostic code after executing the program with input value of 1 is ${answerPartOne}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// Calculate the output of the intcode program when an input value of 5 is used
[answerPartTwo, ] = intcodeComputer(5, 5, 0, textArray);

// Print the diagnostic code of the intcode program when an input 5 is used
console.log(
  `The diagnostic code after executing the program with input value of 5 is ${answerPartTwo}.`
);
