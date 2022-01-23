  const products = [
      {name: '반팔티', price: 15000},
      {name: '긴팔티', price: 20000},
      {name: '핸드폰케이스', price: 15000},
      {name: '후드티', price: 30000},
      {name: '바지', price: 25000}
    ];


  //원하는 만큼의 인자가 들어올때까지 기다렸다가 함수 실행 
  const curry = f => 
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a,..._);

  const filter = curry((f, iter) => {
    let res = [];
    for (const a of iter){
      if (f(a)) res.push(a);
    }
    return res;
  });

  const reduce = curry((f, acc, iter) => {
    if(!iter){
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    }
    for (const n of iter){
      acc = f(acc, n);
    }
    return acc;
  });

  const map = curry((f, iter) => {
      let res = [];
      for (const a of iter) {
        res.push(f(a));
      }
      return res;
    });

    // let names = [];
    // for (const p of products) {
    //     names.push(p.name);
    // }

    // console.log(map(p => p.name, products))

    // console.log(names);

  let prices = [];
  for (const p of products){
      prices.push(p.price);
  }

  // console.log(prices);

  const nums = [1, 2, 3, 4, 5];
  let total = 0;

  for (const n of nums){
    total = total + n;
  }
  console.log(total);

  const add = (a, b) => a + b;
  console.log(reduce(add, total, nums));
  console.log(reduce(add, [1, 2, 3, 4, 5]));
  //console.log(reduce(add, 1, [2, 3, 4, 5]));


  console.log(
    reduce(
      add,
      map(p => p.price, 
        filter (p => p.price < 20000, products))
    )
  );

  const go = (...args) => reduce((a, f) => f(a), args);
  const pipe = (...fs) => (a) => go(a, ...fs);

  go(
      0,
      a => a + 1,
      a => a + 10,
      a => a + 100,
      console.log
  );

  const f = pipe(
      a => a + 1,
      a => a + 10, 
      a => a + 100);
  console.log(f(0));

  const mult = curry((a, b) => a * b);
  console.log(mult(1, 2));

  const mult3 = mult(3);
  console.log(mult3(10));

  //curry 적용 예시
  go(
    products,
    products => filter(p => p.price < 20000, products),
    products => map(p => p.price, products),
    prices => reduce(add, prices),
    console.log
  );

  go(
    products,
    filter(p => p.price < 20000),
    map(p => p.price),
    reduce(add),
    console.log
  );


