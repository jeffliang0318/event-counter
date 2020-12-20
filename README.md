# event-counter

To use EventCounter library

## Import

``` javascript
import { EventCounter } from './event-counter';
```

### EventCounter
#### Syntax
```
const eventCounter = new EventCounter(eventName)
```
#### Parameter Value
| Parameter |Description |
| ------------- | ------------- |
| eventName: String  | Optional. The name of the event counter. Defaults to `event` |

### getCount
#### Syntax
```
eventCounter.getCount(timeWindow)
```
#### Parameter Value
| Parameter  | Description |
| ------------- | ------------- |
| timeWindow: Number | Optional. The amount of time until current time in seconds. Defaults to `300`|

### incrementCount
#### Syntax
```
eventCounter.incrementCount()
```
#### Parameter Value
None

## Usage 
```javascript
const eventCounter = new EventCounter();    //
eventCounter.getCount()                     // return 0
eventCounter.incrementCount();              // return "event just happened"
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