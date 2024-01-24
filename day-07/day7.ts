// Define imports
import { Console } from "console";
import * as fs from "fs";
import { intcodeComputer } from "../day-02/intcodeComputer"
import { permutation } from "./permutation";

// Define variables
const filename: string = "./day7.txt";
let textArray: Array<number> = [];
let amplifierA : number = 0;
let amplifierB : number = 0;
let amplifierC : number = 0;
let amplifierD : number = 0;
let amplifierE : number = 0;
let amplifierConfigruationsPartOne: Array<Array<number>> = [];
let amplifierOutputsPartOne: Array<number> = [];
let answerPartOne: number;
let answerConfigurationPartOne: number = 0;
let firstLoopFlag:boolean;
let currentPositionA:number;
let currentPositionB:number;
let currentPositionC:number;
let currentPositionD:number;
let currentPositionE:number;
let amplifierConfigruationsPartTwo: Array<Array<number>> = [];
let amplifierOutputsPartTwo: Array<number> = [];
let answerPartTwo: number;
let answerConfigurationPartTwo: number = 0;

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

// Calculate all permutations possible for the amplifiers
amplifierConfigruationsPartOne = permutation([0,1,2,3,4])
 

// Calculate the output of the amplifier chain for each possible permutation
amplifierConfigruationsPartOne.forEach((currentConfigruation, index) => {
  [amplifierA, ] = intcodeComputer(currentConfigruation[0], 0, 0, textArray) as [number, number];
  [amplifierB, ] = intcodeComputer(currentConfigruation[1], amplifierA, 0, textArray) as [number, number];
  [amplifierC, ] = intcodeComputer(currentConfigruation[2], amplifierB, 0, textArray) as [number, number];
  [amplifierD, ] = intcodeComputer(currentConfigruation[3], amplifierC, 0, textArray) as [number, number];
  [amplifierE, ] = intcodeComputer(currentConfigruation[4], amplifierD, 0, textArray) as [number, number];
  if (Number.isInteger(amplifierE)) {
    amplifierOutputsPartOne[index] = amplifierE;
  } else {
    amplifierOutputsPartOne[index] = 0;
  }
});

// Find the highest signal that can be sent to the thrusters
answerPartOne = Math.max(...amplifierOutputsPartOne);
amplifierOutputsPartOne.findIndex((output, index) => {
  if(output == answerPartOne) {
    answerConfigurationPartOne = index;
  }
});

// Print the highest signal that can be sent to the thrusters
console.log(
  `The highest signal that can be sent to the thrusters is ${answerPartOne} when using the following configuration: ${amplifierConfigruationsPartOne[answerConfigurationPartOne]}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// Calculate all permutations possible for the feedback amplifiers
amplifierConfigruationsPartTwo = permutation([5,6,7,8,9])
 

// Calculate the output of the feedback amplifier chain for each possible permutation
 amplifierConfigruationsPartTwo.forEach((currentConfigruation, index) => {
  firstLoopFlag = true;
  currentPositionA = 0;
  currentPositionB = 0;
  currentPositionC = 0;
  currentPositionD = 0;
  currentPositionE = 0;
  // Loop through the feedback loop until an exit condition is found
  while(true) {
    // Provide each amplifier its phase setting at its first input instruction and then use all further inputs instructions as the previous amplifiers output.
    // Also, remember the position that the amplifier reaches in the software to ensure it restarts from the sme location instead of resetting to the start.
    if (firstLoopFlag) {
      [amplifierA, currentPositionA] = intcodeComputer(currentConfigruation[0], 0, currentPositionA, textArray) as [number, number];
      [amplifierB, currentPositionB] = intcodeComputer(currentConfigruation[1], amplifierA, currentPositionB, textArray) as [number, number];
      [amplifierC, currentPositionC] = intcodeComputer(currentConfigruation[2], amplifierB, currentPositionC, textArray) as [number, number];
      [amplifierD, currentPositionD] = intcodeComputer(currentConfigruation[3], amplifierC, currentPositionD, textArray) as [number, number];
      [amplifierE, currentPositionE] = intcodeComputer(currentConfigruation[4], amplifierD, currentPositionE, textArray) as [number, number];
      firstLoopFlag = false;
    } else {
      [amplifierA, currentPositionA] = intcodeComputer(amplifierE, amplifierE, currentPositionA, textArray) as [number, number];
      [amplifierB, currentPositionB] = intcodeComputer(amplifierA, amplifierA, currentPositionB, textArray) as [number, number];
      [amplifierC, currentPositionC] = intcodeComputer(amplifierB, amplifierB, currentPositionC, textArray) as [number, number];
      [amplifierD, currentPositionD] = intcodeComputer(amplifierC, amplifierC, currentPositionD, textArray) as [number, number];
      [amplifierE, currentPositionE] = intcodeComputer(amplifierD, amplifierD, currentPositionE, textArray) as [number, number];
    }
    if (Number.isInteger(amplifierE)) {
      amplifierOutputsPartTwo[index] = amplifierE;
    } else {
      break;
    }
  }
 });

// Find the highest signal that can be sent to the thrusters
answerPartTwo = Math.max(...amplifierOutputsPartTwo);
amplifierOutputsPartTwo.findIndex((output, index) => {
  if(output == answerPartTwo) {
    answerConfigurationPartTwo = index;
  }
});

// Print the highest signal that can be sent to the thrusters
console.log(
  `The highest signal that can be sent to the thrusters using a feedback loop is ${answerPartTwo} when using the following configuration: ${amplifierConfigruationsPartTwo[answerConfigurationPartTwo]}.`
);
