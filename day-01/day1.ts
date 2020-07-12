// Define imports
import * as fs from "fs";

// Define variables
const filename: string = "./day1.txt";
let fuelRequiredPart1: number = 0;
let fuelRequiredPart2: number = 0;
let massArray: Array<number> = [];

// Import the text file into a string and then split each row into a seperate array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split("\n");

// Remove the carriage return (\r) present in the elements and then convert the elements into integers
textFile.forEach(
  (rowValue, index) => (massArray[index] = parseInt(rowValue.replace("\r", "")))
);

///////////////////////
// Part 1 of exercise
///////////////////////

// Calculate the fuel required for each module and add it to the total fuel required
massArray.forEach(
  (massValue) =>
    (fuelRequiredPart1 = fuelRequiredPart1 + Math.floor(massValue / 3) - 2)
);

// Print the total fuel required disregarding the mass of the fuel
console.log(
  `The fuel required for all of the modules on my spacecraft equals ${fuelRequiredPart1}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// Calculate the fuel required for each module and add it to the total fuel required
massArray.forEach(function (massValue) {
  let totalFuelRequiredForModule: number = 0;
  // Calculate the fuel required without taking into account the mass of the added fuel
  let fuelMass: number = Math.floor(massValue / 3) - 2;
  while (true) {
    // Calculate the total mass of fuel required for the module
    totalFuelRequiredForModule = totalFuelRequiredForModule + fuelMass;
    // Calculate the mass of the fuel still to be taken into account
    fuelMass = Math.floor(fuelMass / 3) - 2;
    // If all the fuel is taken into account, add the total mass of fuel required for the
    // module to the running total for all modules and then break to start the calculation
    // for the next module
    if (fuelMass <= 0) {
      fuelRequiredPart2 = fuelRequiredPart2 + totalFuelRequiredForModule;
      break;
    }
  }
});

// Print the total fuel required taking into account the mass of the added fuel
console.log(
  `The fuel required for all of the modules on my spacecraft taking into account the mass of the added fuel equals ${fuelRequiredPart2}.`
);
