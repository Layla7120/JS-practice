let stock = "1 lemon, 2 cabbages, and 101 eggs";

function minusOne(match, amount, unit){
    amount = Number(amount) - 1;
    if (amount == 1){
        unit = unit.slice(0, unit.length - 1);
    }else if(amount == 0){
        amount = "no";
    }
    return amount + " " + unit;
}

console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
 