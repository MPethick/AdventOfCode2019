// Define imports
import { Console, count } from "console";
import * as fs from "fs";
import { type } from "os";

// Define variables
const filename: string = "./day10.txt";
let textArray: Array<string> = [];

// Import the text file into a string and then split each number into a seperate string array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split("\n");

// Parse the string array into an integer array
textFile.forEach((rowValue, index) => (textArray[index] = rowValue));

//////////////////////
// Start of exercise
//////////////////////

// Define variables
interface Coordinate {
  longitude: number;
  latitude: number;
}
interface MonitoringStation {
  coordinate: Coordinate;
  visibleAsteroids: number;
}
let possiblemonitoringStations: Array<MonitoringStation> = [];
let mostAsteroidsVisible: [Coordinate, number] = [
  { longitude: 0, latitude: 0 },
  0,
];
let max_x: number = textArray[0].length;
let max_y: number = textArray.length;

///////////////////////
// Part 1 of exercise
///////////////////////

function visibleAsteroidCounter(coordinate: Coordinate): number {
  let counter: number = 0;
  // Check for asteroids at all locations regardless of station position
  for (let y: number = 0; y < max_y; y++) {
    for (let x: number = 0; x < max_x; x++) {
      // Don't check the asteroid the station will be built upon
      if ((x == coordinate.latitude) && (y == coordinate.longitude)) {
        continue;
      }

      if (textArray[y][x] === "#") {
        // for direction -1 is location north/west of the station while +1 is south/east
        let xDirection: number = coordinate.latitude > x ? -1 : 1;
        let yDirection: number = coordinate.longitude > y ? -1 : 1;
        let xDelta: number =
          coordinate.latitude > x
            ? coordinate.latitude - x
            : x - coordinate.latitude;
        let yDelta: number =
          coordinate.longitude > y
            ? coordinate.longitude - y
            : y - coordinate.longitude;
        let largestDelta: number = xDelta > yDelta ? xDelta : yDelta;
        let smallestDelta: number = xDelta < yDelta ? xDelta : yDelta;
        // Account for an asteroid in a horizontal/vertical line from the station
        let angle: number =
          smallestDelta > 0 ? smallestDelta / largestDelta : 1;
        let blockedFlag: boolean = false;

        // Check if any other asteroids block the sight of this one
        for (let i: number = 1; i < largestDelta; i++) {
          let xBlock: number;
          let yBlock: number;
          // Check if the coordinate that could block has a valid x AND y value if not skip
          // (decimals are used with a modulus to allow for imperfect rounding in initial division)
          if ((angle * i) % 1 < 0.001 || (angle * i) % 1 > 0.999) {
            // Take into account for asteroids position with respect to station
            if (largestDelta == xDelta) {
              xBlock = xDelta
              ? coordinate.latitude + xDirection * i
              : coordinate.latitude;
            yBlock = yDelta
              ? coordinate.longitude + yDirection * Math.round(angle * i)
              : coordinate.longitude;
            } else {
              xBlock = xDelta
                ? coordinate.latitude + xDirection * Math.round(angle * i)
                : coordinate.latitude;
              yBlock = yDelta
                ? coordinate.longitude + yDirection * i
                : coordinate.longitude;
            }

            if (textArray[yBlock][xBlock] === "#") {
              blockedFlag = true;
              break;
            }
          }
        }

        if (blockedFlag == false) {
          counter++;
        }
      }
    }
  }

  return counter;
}

// Loop through all the coordinated found in the image
for (let y: number = 0; y < max_y; y++) {
  for (let x: number = 0; x < max_x; x++) {
    // Only perform check for viable monitoring station locations (aka if there is an asteroid at the coordinate)
    if (textArray[y][x] === "#") {
      let asteroidCount: number = visibleAsteroidCounter({
        longitude: y,
        latitude: x,
      });

      possiblemonitoringStations.push({
        coordinate: { latitude: x, longitude: y },
        visibleAsteroids: asteroidCount,
      });
    }
  }
}

possiblemonitoringStations.forEach(function (monitoringStation) {
  // Check if this intersection has a lower Manhattan distance that the currently stored value and is so replace it
  if (
    monitoringStation.visibleAsteroids > mostAsteroidsVisible[1] ||
    mostAsteroidsVisible[1] === 0
  ) {
    mostAsteroidsVisible = [
      monitoringStation.coordinate,
      monitoringStation.visibleAsteroids,
    ];
  }
});

// Print the location that will provide the monitoring with the most visible asteroids (and the amount that are visible)
console.log(`The location with the most visible asteroids ([${mostAsteroidsVisible[0].latitude}, ${mostAsteroidsVisible[0].longitude}]) can see ${mostAsteroidsVisible[1]} asteroids.`);

///////////////////////
// Part 2 of exercise
///////////////////////
