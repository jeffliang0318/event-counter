# event-counter

A small library which helps to track the number of events that happened during a specified window of time.

## Import

``` javascript
import { EventCounter } from './event-counter';
```

### Syntax
#### EventCounter
```javascript
const eventCounter = new EventCounter(eventName)
```
##### Parameter Value
| Parameter | Description |
| ------------- | ------------- |
| eventName: `String`  | Optional. The name of the event counter. Defaults to `event`. |

#### getCount
```javascript
eventCounter.getCount(timeWindow)
```
##### Parameter and Return value
| Parameter  | Description | Return value |
| ------------- | ------------- | ------- |
| timeWindow: `Number` | Optional. The timespan in seconds. Defaults to `TIME_WINDOW_UPPER_BOUND` | `Number`, the number of events that happened in timeWindow. |


#### incrementCount
```javascript
eventCounter.incrementCount()
```

##### Parameter and Return value
| Parameter  | Description | Return value |
| ------------- | ------------- | ------- |
| None | None | `String`, a message to notify user an event just happened. |

## Usage 
```javascript
// t = 0 (s), events = []
const eventCounter = new EventCounter();    //
eventCounter.getCount()                     // return 0

// t = 0 (s), events = [T0]
eventCounter.incrementCount();              // return "event just happened"
eventCounter.getCount()                     // return 1

// after 1 minute (60 seconds)
// t = 60 (s),  events = [T0, T60]
eventCounter.incrementCount();              // return "event just happened"

// return the number of events that happened in 30 seconds
eventCounter.getCount(30)                   // return 1

// after 5 minutes (300 seconds)
// t = 300 (s), events = [T0, T60]
eventCounter.getCount()                     // return 2                    

// after 5 minutes and 1 second (301 seconds)
// t = 301 (s), events = [T60]
eventCounter.getCount()                     // return 1

// Option to name the eventcounter
const searchCounter = EventCounter('search request');   //
searchCounter.incrementCount();                         // return "search request just happened"
```

## Supported timespan upper bound

`TIME_WINDOW_UPPER_BOUND` can be updated in `event-counter.js`, defaults to 300 (seconds)

```javascript
export const TIME_WINDOW_UPPER_BOUND = 300;
```

## Test
All test cases in `counter.test.js`

To run the test

```
npm test
```

![alt test](test.png)
