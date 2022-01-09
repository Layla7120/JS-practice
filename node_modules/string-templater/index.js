var tokenRegex = /\{(.+?)\}/g;

function templater(source, scope){
    var result = source.replace(
        tokenRegex,
        function(match, key) {
            return typeof scope[key] !== 'undefined' ? scope[key] : match;
        }
    );

    return result;
}

module.exports = templater;