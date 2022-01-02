const every1 = function(arr, cond){
    let a = true;
    for(let i=0; i<arr.length; i++){
        a = a && cond(arr[i]);
    }
    return a 
}

// some으로 어떻게 구현하는지 모르겠음.
const every2 = function(arr, cond){
    console.log(arr.some(cond));
}

const cond = (a) => a % 2 == 0;

console.log(every1([1, 2, 3, 4, 5], cond));
every2([1, 2, 3, 4, 5], cond);