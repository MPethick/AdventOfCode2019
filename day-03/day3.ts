// Define imports
import * as fs from "fs";

// Define variables
const filename: string = "./day3.txt";

// Import the text file into a string and then split each row (which represents a wire) into a seperate array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split("\n");

// Split each wire element into seperate array elements detailing the wire's path
let wireOne: Array<string> = textFile[0].split(",");
let wireTwo: Array<string> = textFile[1].split(",");

//////////////////////
// Start of exercise
//////////////////////

// Define variables
interface Coordinate {
  longitude: number;
  latitude: number;
}
interface Intersection {
  coordinate: Coordinate;
  manhattanDistance: number;
  steps: number;
}
let wireOnePoints: Array<Coordinate> = [{ longitude: 0, latitude: 0 }];
let wireTwoPoints: Array<Coordinate> = [{ longitude: 0, latitude: 0 }];
let intersection: Array<Intersection> = [];
let closestIntersectionManhattan: [Coordinate, number] = [
  { longitude: 0, latitude: 0 },
  0,
];
let closestIntersectionSteps: [Coordinate, number] = [
  { longitude: 0, latitude: 0 },
  0,
];

// Function which decodes the location a wire is due to follow from the path given
// by the command. Each of the coordiantes the wire crosses along this section is
// then stored in an array and returned where the function is called.
function calcuateWirePath(previousCoordinate: Coordinate, rowValue: string) {
  // Define variables
  let direction = rowValue[0];
  let length = parseInt(rowValue.slice(1, rowValue.length));
  let newCoordinates: Array<Coordinate> = [];

  // Loop through the length of this section of the wire to plot all the coordinates the wire flows over
  for (let i: number = 0; i < length; i++) {
    // Calcuate coordinates for thissection of the wire so that it follows the direction expected
    switch (direction) {
      // When an 'R' is detected, ensure the wire goes positively along the x-axis
      case "R":
        newCoordinates.push({
          latitude: previousCoordinate.latitude + i + 1,
          longitude: previousCoordinate.longitude,
        });
        break;
      // When an 'L' is detected, ensure the wire goes negatively along the x-axis
      case "L":
        newCoordinates.push({
          latitude: previousCoordinate.latitude - i - 1,
          longitude: previousCoordinate.longitude,
        });
        break;
      // When an 'U' is detected, ensure the wire goes positively along the y-axis
      case "U":
        newCoordinates.push({
          latitude: previousCoordinate.latitude,
          longitude: previousCoordinate.longitude + i + 1,
        });
        break;
      // When an 'D' is detected, ensure the wire goes negatively along the y-axis
      case "D":
        newCoordinates.push({
          latitude: previousCoordinate.latitude,
          longitude: previousCoordinate.longitude - i - 1,
        });
        break;
      // When a non-valid direction is detected, throw an error
      default:
        throw new Error("A non-valid direction was detected");
    }
  }

  // Return all the newly calcualted coordinates the wire travels along
  return newCoordinates;
}

// For each path followed by wire one, find the wires current coordinate location and then use this along with
// the paths value to calculate the new coordinates wire one flows over via the 'calcuateWirePath' function.
wireOne.forEach(function (rowValue) {
  let previousCoordinate: Coordinate = wireOnePoints[wireOnePoints.length - 1];

  wireOnePoints = wireOnePoints.concat(
    calcuateWirePath(previousCoordinate, rowValue)
  );
});

// For each path followed by wire two, find the wires current coordinate location and then use this along with
// the paths value to calculate the new coordinates wire two flows over via the 'calcuateWirePath' function.
wireTwo.forEach(function (rowValue) {
  let previousCoordinate: Coordinate = wireTwoPoints[wireTwoPoints.length - 1];

  wireTwoPoints = wireTwoPoints.concat(
    calcuateWirePath(previousCoordinate, rowValue)
  );
});

// Loop through the two wires coordinates to calcuates where all the intersections occur. For each of the intersections
// then calcuated the Manhattan distance and combined steps from the central port the intersection is located.
wireOnePoints.forEach(function (wireOneCoord, wireOneStepCount) {
  for (
    let wireTwoStepCount: number = 0;
    wireTwoStepCount < wireTwoPoints.length;
    wireTwoStepCount++
  ) {
    if (wireTwoPoints[wireTwoStepCount].longitude === wireOneCoord.longitude) {
      if (wireTwoPoints[wireTwoStepCount].latitude === wireOneCoord.latitude) {
        let manhattan: number =
          Math.abs(wireOneCoord.latitude) + Math.abs(wireOneCoord.longitude);

        intersection.push({
          coordinate: wireOneCoord,
          manhattanDistance: manhattan,
          steps: wireOneStepCount + wireTwoStepCount,
        });
      }
    }
  }
});

// Loop through all the intersections occur to find which coordinate has the lowest Manhattan distance and
// which coordinate has the fewest combined steps form the central port.
intersection.forEach(function (intersectionValue) {
  // Check if this intersection has a lower Manhattan distance that the currently stored value and is so replace it.
  if (
    intersectionValue.manhattanDistance < closestIntersectionManhattan[1] ||
    closestIntersectionManhattan[1] === 0
  ) {
    closestIntersectionManhattan = [
      intersectionValue.coordinate,
      intersectionValue.manhattanDistance,
    ];
  }

  // Check if this intersection has fewer combined steps that the currently stored value and is so replace it.
  if (
    intersectionValue.steps < closestIntersectionSteps[1] ||
    closestIntersectionSteps[1] === 0
  ) {
    closestIntersectionSteps = [
      intersectionValue.coordinate,
      intersectionValue.steps,
    ];
  }
});

// Print the closest intersection from the central port using the Manhatten distance
console.log(
  `The closest intersection from the central port is located at [${closestIntersectionManhattan[0].longitude}, ${closestIntersectionManhattan[0].latitude}] at a Manhatten distance of ${closestIntersectionManhattan[1]}.`
);

// Print the intersection that is the fewest combined steps from the central port
console.log(
  `The fewest combined steps an intersection is located from the central port is located at [${closestIntersectionSteps[0].longitude}, ${closestIntersectionSteps[0].latitude}] which occurs after ${closestIntersectionSteps[1]} steps along both wires.`
);
