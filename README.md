# event-counter

To use EventCounter library

## Import

``` javascript
import { EventCounter } from './event-counter';
```

## Usage 
```javascript
const eventCounter = EventCounter();   //
eventCounter.getCount()                     // return 0
eventCounter.incrementCount();         // return "event just happened"
eventCounter.getCount()                     // return 1

// after 1 minute (60 seconds)
// return events happened in 5 minute if not specify the time window
eventCounter.getCount()                     // return 1                     
// get the number of the events happened in 30 seconds
eventCounter.getCount(30)                   // return 0

// after 5 minutes(300 seconds)
eventCounter.getCount()                     // return 0                     

// Option to name the eventcounter
const searchCounter = EventCounter('search request');   //
searchCounter.incrementCount();                         // return "search request just happened"
```