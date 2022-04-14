const evenOrOdd = function(n){
    if (n == 0){return `even`}
    else if(n == 1){return `odd`}
    else{return evenOrOdd(n-2)}
}

console.log(evenOrOdd(-1))