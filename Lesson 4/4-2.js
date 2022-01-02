const reverseArray = (arr) => {
    let newArr = []
    for (let i = arr.length -1; i > -1; i--){
        newArr.push(arr[i]);
    }
    return newArr;
}

const reverseArrayInPlace = (arr) => {
    for (let i = 0; i < Math.round(arr.length / 2); i++){
        temp = arr[i];
        arr[i] = arr[arr.length - i - 1];
        arr[arr.length - i - 1] = temp;
    }
    return arr;
}
 
// console.log(reverseArray([1,2,3]));
console.log(reverseArrayInPlace([1,2,3]));