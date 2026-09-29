// Function which decodes the intcode program using the passed noun and verb values and returns the output

import { relative } from "path";
import { start } from "repl";

// (the value from position 0 in intcode after the program is run)
export function intcodeComputer(firstInputValue: number, secondInputValue: number, startPosition: number, memoryArray: Array<number>) : Array<[number | undefined, number]> {
  // Define array to hold intcode program from the memory
  let gravityArray: Array<number> = [];
  let opcode: string = "";
  let firstInputFlag: boolean = true;
  let basicOperationFlag: boolean = false;
  let parameter: Array<number> = [];
  let relativeBase: number = 0;
  let outputArray: Array<[number | undefined, number]> = [];

  // Assign corresponding intcode program from the memory
  gravityArray = memoryArray.slice();

  // Write in the input values to the first available positions and signals to output the value of position 0 at an exit code (this is required for the initial day 2 operation of the intcode)
  if(startPosition == -1) {
    basicOperationFlag = true;
    startPosition = 0;
    gravityArray[1] = firstInputValue;
    gravityArray[2] = secondInputValue;
  }

  // Loop through the intcode instructions until an exit opcode ('99') is detected. An instruction is formatted
  // as follows: The first value is the opcode, the second two values are the positions of the two inputs, and
  // the fourth value is the position of the output
  intcodeLoop: for (let i: number = 0 + startPosition; gravityArray[i] !== 99; i += 2) {
    // If an opcode doesn't exist at the expected address, finish the computation
    if(isNaN(gravityArray[i])) {
      break intcodeLoop;
    } else {
      // Convert the current opcode to a string to allow for the identification of its parameters
      opcode = gravityArray[i].toString();
    }

    // Check if parameters one and two are in either position or immediate mode. A parameter in position mode uses
    // the value stored at the address pointed to by the parameter while a parameter in immediate mode uses the value
    // of the parameter. A position mode is denoted by a "1" in the relevant section of the opcode instruction while an
    // "0" or an ommited value denotes a immediate mode. Parameters in relative mode denoted by a "2", behave very similarly
    // to parameters in position mode: the parameter is interpreted as a position. Like position mode, parameters in relative
    // mode can be read from or written to.An example of a decoded opcode instruction is seen below:
    //
    // A B C D E
    //   1 0 0 2
    // DE - two-digit opcode,      02 = opcode 2
    // C  - mode of 1st parameter,  0 = position mode
    // B  - mode of 2nd parameter,  1 = immediate mode
    // A  - mode of 3rd parameter,  0 = position mode, omitted due to being a leading zero
    
    // mode of 1st parameter, note that a check if requried to see if it is used as an address or not
    if (opcode.length >= 3) {
      switch (opcode[opcode.length - 3]) {
        // Position Mode
        case "0":
          if (opcode[opcode.length - 1] == "3") {
            parameter[0] = isNaN(gravityArray[i + 1]) ? 0 : gravityArray[i + 1]; 
          } else {
            parameter[0] = isNaN(gravityArray[gravityArray[i + 1]]) ? 0 : gravityArray[gravityArray[i + 1]]; 
          }
          break;
        // Immediate mode
        case "1":
          if (opcode[opcode.length - 1] == "3") {
            parameter[0] = i + 1; 
          } else {
            parameter[0] = isNaN(gravityArray[i + 1]) ? 0 : gravityArray[i + 1]; 
          }
          break;
        // Relative mode
        case "2":
          if (opcode[opcode.length - 1] == "3") {
            parameter[0] = isNaN(gravityArray[i + 1]) ? relativeBase : (relativeBase + gravityArray[i + 1]);
          } else {
            parameter[0] = isNaN(gravityArray[relativeBase + gravityArray[i + 1]]) ? 0 : gravityArray[relativeBase + gravityArray[i + 1]]; 
          }
          break;
      }
    } else {
      // default to position mode if no mode is set in the opcode
      parameter[0] = gravityArray[gravityArray[i + 1]];
    }
    // mode of 2nd parameter
    if (opcode.length >= 4) {
      switch (opcode[opcode.length - 4]) {
        // Position Mode
        case "0":
          parameter[1] = isNaN(gravityArray[gravityArray[i + 2]]) ? 0 : gravityArray[gravityArray[i + 2]]; 
          break;
        // Immediate mode
        case "1":
          parameter[1] = isNaN(gravityArray[i + 2]) ? 0 : gravityArray[i + 2]; 
          break;
        // Relative mode
        case "2":
          parameter[1] = isNaN(gravityArray[relativeBase + gravityArray[i + 2]]) ? 0 : gravityArray[relativeBase + gravityArray[i + 2]]; 
          break;
      }
    } else {
      // default to position mode if no mode is set in the opcode
      parameter[1] = gravityArray[gravityArray[i + 2]];
    }
    // mode of 3rd parameter
    if (opcode.length >= 5) {
      switch (opcode[opcode.length - 5]) {
        // Position Mode
        case "0":
          parameter[2] = isNaN(gravityArray[i + 3]) ? 0 : gravityArray[i + 3]; 
          break;
        // Immediate mode
        case "1":
          parameter[2] = i + 3; 
          break;
        // Relative mode
        case "2":
          parameter[2] = isNaN(gravityArray[i + 3]) ? relativeBase : (relativeBase + gravityArray[i + 3]); 
          break;
      }
    } else {
      // default to position mode if no mode is set in the opcode
      parameter[2] = gravityArray[i + 3];
    }

    // Perform the action on the instruction related to the opcode
    switch (opcode[opcode.length - 1]) {
      // When an opcode '1' is detected, perform an addition
      case "1":
        gravityArray[parameter[2]] = parameter[0] + parameter[1];
        i += 2;
        break;
      // When an opcode '2' is detected, perform an multiplication
      case "2":
        gravityArray[parameter[2]] = parameter[0] * parameter[1];
        i += 2;
        break;
      // When an opcode '3' is detected, perform an input
      case "3":
        if(firstInputFlag) {
          gravityArray[parameter[0]] = firstInputValue; 
          firstInputFlag = false;   
        } else {
          gravityArray[parameter[0]] = secondInputValue;  
        }
        break;
      // When an opcode '4' is detected, perform an output
      case "4":
        // Return the diagnostic code if the value output is not equal to 0
        if (parameter[0] !== 0) {
          outputArray.push([parameter[0], i]);
        }
        break;
      // When an opcode '5' is detected, perform a jump-if-true
      case "5":
        if (parameter[0] !== 0) {
          i = parameter[1] - 2;
        } else {
          i += 1;
        }
        break;
      // When an opcode '6' is detected, perform a jump-if-false
      case "6":
        if (parameter[0] === 0) {
          i = parameter[1] - 2;
        } else {
          i += 1;
        }
        break;
      // When an opcode '7' is detected, perform a less than
      case "7":
        gravityArray[parameter[2]] = parameter[0] < parameter[1] ? 1 : 0;
        i += 2;
        break;
      // When an opcode '8' is detected, perform an equal to
      case "8":
        gravityArray[parameter[2]] = (parameter[0] === parameter[1]) ? 1 : 0;
        i += 2;
        break;
      // When an opcode '9' is detected, check if its an exit code and if it is not perform an adjust to the relative base
      case "9":
        if (opcode[opcode.length - 2] === "9") {
          // Breaks out of the for loop instead of the switch statement
          break intcodeLoop;
        } else {
          relativeBase += parameter[0];
        }
        break;
      // When a non-valid opcode is detected, finish the computation
      default:
        break intcodeLoop;
    }  
  }

  // Return an undefined if no diagonostic code is found
  if (outputArray.length == 0) {
  return [[(basicOperationFlag ? gravityArray[0] : undefined), -1]];
  } else {
    return outputArray;
  }
}