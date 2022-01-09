# string-templater

Basic string templater

## Usage

``` javascript

    var templater = require('string-templater');

    templater('I like {food}', {food: 'Bacon'});
    // I like Bacon

    templater('First do {0} then {1}', ['things', 'stuff']);
    // First do things then stuff

```
