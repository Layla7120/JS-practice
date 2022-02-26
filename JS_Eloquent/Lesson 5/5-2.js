const loop = function(n, test, update, main){
    while(true){
        if(test(n)){
            main(n);
            n = update(n);
        }
        else{break}
    }
}

loop(3, n => n > 0, n => n - 1, console.log);