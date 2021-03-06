/* 
    코드를 값으로 다루어 표현력 높이기
*/
const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const n of iter) {
    acc = f(acc, n);
  }
  return acc;
};

const go = (...args) => reduce((a, f) => f(a), args);
//합성된 함수를 만듬
const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs);

//원하는 만큼의 인자가 들어올때까지 기다렸다가 원하는 시점에 함수 실행
const curry =
  (f) =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._);

go(
  0,
  (a) => a + 1,
  (a) => a + 10,
  (a) => a + 100,
  console.log
);

const f = pipe(
  (a, b) => a + b,
  (a) => a + 10,
  (a) => a + 100
);
console.log(f(0));

const mult = curry((a, b) => a * b);
console.log(mult(1, 2));

const mult3 = mult(3);
console.log(mult3(10));
