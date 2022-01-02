const range = (start, end, step = 1) => {
    let numArr = [];
    if (start < end){
        for (start; start < end + 1; start += step){
            numArr.push(start);
        }
    }
    else{
        for(start; start > end - 1; start += step){
            numArr.push(start);
        }
    }
    return numArr
}

const sum = function(numArr){
    let sum = 0;
    for (let i = 0; i < numArr.length; i++){
        sum += numArr[i];
    }
    return sum;
}

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 결과가 좀 이상함 
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55