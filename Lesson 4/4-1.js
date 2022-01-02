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

console.log(sum(range(1,10)));
console.log(range(5, 2, -1));