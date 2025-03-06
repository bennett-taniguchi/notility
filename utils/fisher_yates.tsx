 

export function shuffleArray(array:any ) {
  
console.log(array)

const min = 0;
const max = array.length-1;
const range = max - min + 1;




  for (let i = array.length - 1; i > 0; i--) {
    // const j = Math.floor( Math.random() * (i + 1)); // Random index

    const arr = new Uint32Array(1);
crypto.getRandomValues(arr);
const randomNumber = arr[0];
const j = min + (randomNumber % range);

  
    if(!array[i]||!array[j])continue
    [array[i], array[j]] = [array[j], array[i]];  // Swap elements
  }
  return array;
}
 
 