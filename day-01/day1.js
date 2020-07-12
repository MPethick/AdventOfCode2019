"use strict";
exports.__esModule = true;
var fs = require("fs");
// Define variables
var filename = "./day1.txt";
var fuelRequiredPart1 = 0;
var fuelRequiredPart2 = 0;
var massArray = [];
// Import the text file into a string and then split each row into a seperate array element
var textFile = fs
    .readFileSync(filename, "utf8")
    .toString()
    .split("\n");
// Remove the carriage return (\r) present in the elements and then convert the elements into integers
textFile.forEach(function (rowValue, index) { return (massArray[index] = parseInt(rowValue.replace("\r", ""))); });
///////////////////////
// Part 1 of exercise
///////////////////////
// Calculate the fuel required for each module and add it to the total fuel required
massArray.forEach(function (massValue) {
    return (fuelRequiredPart1 = fuelRequiredPart1 + Math.floor(massValue / 3) - 2);
});
// Print the total fuel required disregarding the mass of the fuel
console.log("The fuel required for all of the modules on my spacecraft equals " + fuelRequiredPart1 + ".");
///////////////////////
// Part 2 of exercise
///////////////////////
// Calculate the fuel required for each module and add it to the total fuel required
massArray.forEach(function (massValue) {
    var totalFuelRequiredForModule = 0;
    // Calculate the fuel required without taking into account the mass of the added fuel
    var fuelMass = Math.floor(massValue / 3) - 2;
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
console.log("The fuel required for all of the modules on my spacecraft taking into account the mass of the added fuel equals " + fuelRequiredPart2 + ".");
