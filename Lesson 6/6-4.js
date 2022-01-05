let map = {one: true, two: true, hasOwnProperty: true};

// 해설 봄 - 반대로 해석하기 
console.log(Object.prototype.hasOwnProperty.call(map, "one"));
// → true

// call()은 인수목록을 apply()는 인수배열을 