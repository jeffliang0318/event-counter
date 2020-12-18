# event-counter

To use EventCounter library

## Import

``` javascript
import { EventCounter } from './event-counter';
```

## Usage 
```javascript
const eventCounter = EventCounter();   //
counter.getCount()                     // return 0
eventCounter.incrementCount();         // return "event just happened"
counter.getCount()                     // return 1

// after 1 minute (60 seconds)
// return events happened in 5 minute if not specify the time window
counter.getCount()                     // return 1                     
// get the number of the events happened in 30 seconds
counter.getCount(30)                   // return 0

// after 5 minutes(300 seconds)
counter.getCount()                     // return 0                     

// 
const searchCounter = EventCounter('search request');   //
searchCounter.incrementCount();                         // return "search request just happened"
```