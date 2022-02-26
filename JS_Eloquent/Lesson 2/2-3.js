const size = 8;
for (let i = 0; i < size; i++){
    let line = ""
    for( let j = 0; j < size; j++){
        if((i+j) % 2 == 0){
            line = line + " ";
        }
        else{
            line = line + "#";
        }
    }
    console.log(line);
}