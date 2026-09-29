export function permutation(array: Array<number>) {
    function p(array: Array<number>, temp: Array<number>) {
        let x: number;
        if (!array.length) {
            result.push(temp);
        }
        for (let i = 0; i < array.length; i++) {
            x = array.splice(i, 1)[0];
            p(array, temp.concat(x));
            array.splice(i, 0, x);
        }
    }
  
    var result: Array<Array<number>> = [];
    p(array, []);
    return result;
  }