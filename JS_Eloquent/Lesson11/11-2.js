//해설 보고 따라해봄
function Promise_all(promises) {
    return new Promise((resolve, reject) => {
      let results = [];
      let pending = promises.length; //여기가 핵심
      for (let i = 0; i < promises.length; i++){
        promises[i].then(result => {
            results[i] = result;
            pending--;
            if( pending == 0 ) resolve(results); // 다 끝났으면 결과 주고 끝남
        }).catch(reject) // 오류 발생하면 전체 종료
      }
      if (promises.length == 0 ) resolve(results);
    });
  }
  
  // Test code.
  Promise_all([]).then(array => {
    console.log("This should be []:", array);
  });
  function soon(val) {
    return new Promise(resolve => {
      setTimeout(() => resolve(val), Math.random() * 500);
    });
  }
  Promise_all([soon(1), soon(2), soon(3)]).then(array => {
    console.log("This should be [1, 2, 3]:", array);
  });
  Promise_all([soon(1), Promise.reject("X"), soon(3)])
    .then(array => {
      console.log("We should not get here");
    })
    .catch(error => {
      if (error != "X") {
        console.log("Unexpected failure:", error);
      }
    });