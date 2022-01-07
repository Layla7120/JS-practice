class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b){
    if(Math.random() < 0.2){
        return a*b
    }else{
        throw new MultiplicatorUnitFailure("Multiply Error");
    }
    
}

for(;;){
    try{
        let multiply = primitiveMultiply(3, 5);
        console.log(multiply);
        break;
    }
    catch(e){
        if (e instanceof MultiplicatorUnitFailure){
            console.log("Not a valid direction.");
        }
        else{
            throw e;
        }
    }
}
