// Define imports
import * as fs from "fs";

// Define variables
const filename: string = "./day2.txt";
let memoryArray: Array<number> = [];
let gravityArray: Array<number> = [];

// Import the text file into a string and then split each row into a seperate array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split(",");

// Remove the carriage return (\r) present in the elements and then convert the elements into integers
textFile.forEach(
  (rowValue, index) => (memoryArray[index] = parseInt(rowValue.replace("\r", "")))
);

///////////////////////
// Part 1 of exercise
///////////////////////

gravityArray = memoryArray;
gravityArray[1] = 12;
gravityArray[2] = 2;

for (let i : number = 0;  gravityArray[i] !== 99; i+=4) {
  switch(gravityArray[i]) {
    case 1: 
      gravityArray[gravityArray[i+3]] = gravityArray[gravityArray[i+1]] + gravityArray[gravityArray[i+2]];
      break;
    case 2: 
      gravityArray[gravityArray[i+3]] = gravityArray[gravityArray[i+1]] * gravityArray[gravityArray[i+2]];
      break;
    default:
      throw new Error("A non-valid Opcode was detected");
  }
}

console.log(`The value in position 0 after executing the program with inputs [1]=12 and [2]=2 is ${gravityArray[0]}.`);

///////////////////////
// Part 2 of exercise
///////////////////////

