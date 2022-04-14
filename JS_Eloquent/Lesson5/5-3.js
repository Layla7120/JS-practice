const every = function(arr, cond){
    let a = true;
    for(let i=0; i<arr.length; i++){
        a = a && cond(arr[i]);
    }
    return a 
}

// some으로 어떻게 구현하는지 모르겠음. -> 해설봄 !some = every
const every2 = function(arr, cond){
    return !arr.some(element => !cond(element));
}

console.log(every2([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true