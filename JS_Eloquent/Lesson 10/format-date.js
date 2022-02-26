const ordinal = require("ordinal");
const { days, months } = require("date-names");

exports.formatDate = function (date, format) {
    return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
        if (tag == "YYYY")
            return date.getFullYear();
        if (tag == "M")
            return date.getMonth();
        if (tag == "MMMM")
            return months[date.getMonth()];
        if (tag == "D")
            return date.getDate();
        if (tag == "Do")
            return ordinal(date.getDate());
        if (tag == "dddd")
            return days[date.getDay()];
    });
};


// require.cache = Object.create(null);

// function require(name){
//     if(!(name in require.cache)){
//         let code = readFile(name);
//         let module = {exports: {}};
//         require.cache[name] = module;
//         let wrapper = Function("require, exports, module", code);
//         wrapper(require, module.exports, module);
//     }
//     return require.cache[name].exports;
// }

// const {parse} = require("ini");

// console.log(parse("x = 10\ny = 20"));
