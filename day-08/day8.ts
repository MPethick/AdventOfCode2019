// Define imports
import { Console, count } from "console";
import * as fs from "fs";
import { type } from "os";
// Define variables
const filename: string = "./day8.txt";
let textArray: Array<number> = [];

interface Layer {
  count0: number;
  count1: number;
  count2: number;
}

interface Image {
  [layer: number]: Layer
};

let pixel_width: number = 25;
let pixel_height: number = 6;
let image: Image = {};
let answerPartOne: number;
let decodedImage: number[][] = [];
let answerPartTwo: string = "";

// Import the text file into a string and then split each number into a seperate string array element
let textFile: Array<string> = fs
  .readFileSync(filename, "utf8")
  .toString()
  .split("");

// Parse the string array into an integer array
textFile.forEach(
  (rowValue, index) => (textArray[index] = parseInt(rowValue))
);

///////////////////////
// Part 1 of exercise
///////////////////////

// Loop through all the layers found in the image
for (let curr_layer = 0; curr_layer < (textArray.length / (pixel_width * pixel_height)); curr_layer++) {
  // Create a new object entry for data relating to this layer
  image[curr_layer] = {count0: 0, count1: 0, count2: 0};
  // Loop through this current layers widith and height
  for (let height = 0; height < pixel_height; height++) {
    for (let width = 0; width < pixel_width; width++) {
      // Calculate current position in image
      let offset: number = curr_layer * (pixel_width * pixel_height);
      let position: number = offset + width + (height * 25);
      // Iterate up counter related to digit found at current image location
      switch(textArray[position]) { 
        case 0: { 
          image[curr_layer].count0++;
          break; 
        } 
        case 1: {
          image[curr_layer].count1++;
          break; 
        } 
        case 2: { 
          image[curr_layer].count2++;
          break; 
        } 
        default: { 
          throw new Error(`A non-valid pixel of ${textArray[position]} was detected at position ${position}`);
        } 
      } 
    }
  }
}

// Find the layer with the fewest 0 digits
const leastNumberOf0: Layer = Object.values(image).reduce((previous, current) => {
  return current.count0 < previous.count0 ? current : previous;
});

answerPartOne = leastNumberOf0.count1 * leastNumberOf0.count2;

// Print the number of 1 digits multiplied by the number of 2 digits found on the layer that contains the fewest 0 digits
console.log(
  `On the layer that contains the fewest 0 digits. The number of 1 digits multiplied by the number of 2 digits is ${answerPartOne}.`
);

///////////////////////
// Part 2 of exercise
///////////////////////

// Loop through all the layers found in the image
for (let curr_layer = 0; curr_layer < (textArray.length / (pixel_width * pixel_height)); curr_layer++) {
  // Loop through this current layers widith and height
  for (let height = 0; height < pixel_height; height++) {
    // Ensure array is initialised in first layer loop
    if (curr_layer == 0) {
      decodedImage[height] = [];
    }     
    for (let width = 0; width < pixel_width; width++) {
      // Calculate current position in image
      let offset: number = curr_layer * (pixel_width * pixel_height);
      let position: number = offset + width + (height * 25);
      // Initiailise array with values from first layer
      if (curr_layer == 0) {
        decodedImage[height][width] = textArray[position];
      } else {
        // Overwrite only transparent pixels from previous layer(s)
        switch(textArray[position]) { 
          case 0: {
            if (decodedImage[height][width] != 1) {
              decodedImage[height][width] = 0;
            }  
            break; 
          } 
          case 1: {
            if (decodedImage[height][width] != 0) {
              decodedImage[height][width] = 1;
            }  
            break; 
          } 
          case 2: { 
            break; 
          } 
          default: { 
            throw new Error(`A non-valid pixel of ${textArray[position]} was detected at position ${position}`);
          } 
        }
      } 
    }
  }
}

// Convert array of 0/1 into equivilant of black and white text
answerPartTwo = decodedImage.map(arr => arr.join("")).join("\n");
answerPartTwo = answerPartTwo.replace(/0/g, " ")
answerPartTwo = answerPartTwo.replace(/1/g, "#")

// Print the now formatted string to reveal the decoded image
console.log(answerPartTwo);