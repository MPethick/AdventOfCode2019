// Define imports
import * as fs from "fs";

// Define variables
interface Planet {
  name: string;
  orbitingPlanets: Array<string>;
  inOrbitOf: string;
}
const filename: string = "./day6.txt";
let orbitArray: Array<Planet> = [];
let totalOrbits: number = 0;
let distanceToSanta: number = 0;

// Import the text file into a string and then split each entry into a seperate string array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split("\n");

// Parse the string array into an array which comprimising of objects which detail: a planets name,
// which planets orbit the named planet, and which planet the named planet itself orbits.
textFile.forEach(function (rowValue) {
  // Define variables
  let foundPlanet: boolean = false;
  let foundOrbit: boolean = false;
  let planets: Array<string>;
  // Remove the carriage return (\r) present in the strings and split each string into two seperate strings.
  // The planet string prior to the ')' is orbited by the planet after the ')'.
  planets = rowValue.replace("\r", "").split(")");
  // Loop through all the existing planet objects and add data relating to how the planet string prior to the
  // ')' is orbited by the planet after the ')' to the objects which are related to these two planet strings.
  for (var i: number = 0; i < orbitArray.length; i++) {
    if (orbitArray[i].name === planets[0]) {
      orbitArray[i].orbitingPlanets.push(planets[1]);
      foundPlanet = true;
    } else if (orbitArray[i].name === planets[1]) {
      orbitArray[i].inOrbitOf = planets[0];
      foundOrbit = true;
    }
  }
  // If the planet string found prior to the ')' does not have an object relating to it yet, create such an object.
  if (foundPlanet === false) {
    orbitArray.push({
      name: planets[0],
      orbitingPlanets: [planets[1]],
      inOrbitOf: "",
    });
  }
  // If the planet string found after the ')' does not have an object relating to it yet, create such an object.
  if (foundOrbit === false) {
    orbitArray.push({
      name: planets[1],
      orbitingPlanets: [],
      inOrbitOf: planets[0],
    });
  }
});

///////////////////////
// Part 1 of exercise
///////////////////////

// A recursive function used to calculate how many direct and indirect orbits a planet has
function calculateNumberOfOrbits(planet: Planet): number {
  // Define variable
  let numberOfOrbits: number = 0;
  // If the central planet is the one the current planet orbits, end the recurion and begin the
  // sequence to return the number of direct and indirect orbits. If not, loop through the list 
  // of planets to find the planet the current planet orbits. Once this is found, add one to the
  // count of the number of orbits and begin the function again for the planet being orbited
  if (planet.name === "COM") {
    return 0;
  } else {
    for (var i: number = 0; i < orbitArray.length; i++) {
      if (orbitArray[i].name === planet.inOrbitOf) {
        numberOfOrbits += 1;
        numberOfOrbits += calculateNumberOfOrbits(orbitArray[i]);
        break;
      }
    }
    // Return the number of direct and indirect orbits for the current planet
    return numberOfOrbits;
  }
}

// For each planet, calculate the number of direct and indirect orbits for the planet and sum
// the value to the running total of orbits
for (var i: number = 0; i < orbitArray.length; i++) {
  totalOrbits += calculateNumberOfOrbits(orbitArray[i]);
}

// Print the total number of direct and indirect orbits for all planets
console.log(
  `The total number of direct and indirect orbits is ${totalOrbits}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// A recursive function used to calculate how many orbit transfers are required so that SAN 
// and YOU orbit the same planet
function calculateDistanceToSanta(
  planet: Planet,
  previousPlanet: string
): [number, boolean] {
  // Define variable
  let numberOfOrbits: number = 0;
  // If SAN is the current planet , end the recurion and begin the sequence to return the
  // number of orbit transfers are required (removing 2 off the number so that SAN and YOU
  // oribt the same planet and not one another). If not, loop through the list of planets 
  // to find the planet the current planet orbits and finf the planets which orbit the current 
  // planet (unless SAN is found then break the loop to reduce redundant searching). Once these 
  // planets are found, begin the function again for the next planet
  if (planet.name === "SAN") {
    return [-2, true];
  } else {
    let santaFound: boolean = false;
    for (
      var i: number = 0;
      i < orbitArray.length && santaFound === false;
      i++
    ) {
      if (
        orbitArray[i].name === planet.inOrbitOf &&
        orbitArray[i].name !== previousPlanet
      ) {
        [numberOfOrbits, santaFound] = calculateDistanceToSanta(
          orbitArray[i],
          planet.name
        );
      }
      for (var j: number = 0; j < planet.orbitingPlanets.length; j++) {
        if (
          orbitArray[i].name === planet.orbitingPlanets[j] &&
          orbitArray[i].name !== previousPlanet
        ) {
          [numberOfOrbits, santaFound] = calculateDistanceToSanta(
            orbitArray[i],
            planet.name
          );
        }
      }
    }
    // Add one to the count of the number of orbit transfers required if SAN is found and
    // return the value. If SAN is not yet found, return 0 instead
    if (santaFound) {
      return [numberOfOrbits + 1, true];
    } else {
      return [0, false];
    }
  }
}

// Loop through each planet until YOU is found and then calcuate the number of orbit
// transfers required so that YOU and SAN orbit the same planet
for (var i: number = 0; i < orbitArray.length; i++) {
  if (orbitArray[i].name === "YOU") {
    [distanceToSanta] = calculateDistanceToSanta(orbitArray[i], "");
    break;
  }
}

// Print the number of orbit transfers required so that YOU and SAN orbit the same planet
console.log(
  `The minimum number of orbital transfers required so that YOU and SAN orbit the same object is ${distanceToSanta}.`
);
