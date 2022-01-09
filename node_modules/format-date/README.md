## format-date
Forked from http://github.com/azer/format-date and republished.

Takes a string and a date object, returns what you expect.

## Install

```bash
$ npm install format-date
```

## Example
```js
var formatDate = require('format-date');

formatDate('{month}/{day}/{year}', new Date());
// 21/09/2014

formatDate('{hours}:{minutes}:{seconds} {day-name}', new Date());
// 13:30:53 Monday

formatDate('{month-name} {year}', new Date());
// January 2014
```

## Reference
**Local**

* day
* day-name
* month
* month-name
* year
* hours
* minutes
* seconds

**UTC**

* utc-day
* utc-day-name
* utc-month
* utc-month-name
* utc-year
* utc-hours
* utc-minutes
* utc-seconds
