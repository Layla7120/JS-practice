const countBs = (string, pos) => {
    const index = string.indexOf('B', pos);
    if (index == -1){return 0}
    else{
        console.log(index);
        countBs(string, index + 1);
    }
}

countBs('ABSCB', 0);