// Fill in this regular expression.
let number = /^(\+|-)?\d*((((e|E)(\+|-)?)?\d+\.?)|(\.?\d+((e|E)(\+|-)?)?)\d*)$/;

// 해설 let number = /^[+\-]?(\d+(\.\d*)?|\.\d+)([eE][+\-]?\d+)?$/; 보아하니 조건 하나만 언급하면 되는군 순서는 상관없네
// Tests:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",

                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}