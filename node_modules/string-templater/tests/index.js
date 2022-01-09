var test = require('tape'),
    templater = require('../');

test('works with objects', function(t) {
    t.plan(1);

    t.equal(
        templater('I like {food}', {food: 'Bacon'}),
        'I like Bacon',
        'works with objects'
    );
});

test('works with arrays', function(t) {
    t.plan(1);

    t.equal(
        templater('First do {0} then {1}', ['things', 'stuff']),
        'First do things then stuff',
        'works with arrays'
    );
});

test('works non existing keys', function(t) {
    t.plan(1);

    t.equal(
        templater('First do {0} then {1}, and then also {2}', ['things', 'stuff']),
        'First do things then stuff, and then also {2}',
        'works with arrays'
    );
});