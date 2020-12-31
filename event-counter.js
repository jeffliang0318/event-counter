// default supported timespan upper bound to 5 minutes(300 seconds)
export const TIME_WINDOW_UPPER_BOUND = 300;

export class EventCounter {
  constructor(name = "event") {
    if (typeof name !== "string") {
      throw new TypeError("Invalid name, should be string.");
    }
    this.name = name;
    // this.eventTypes = new set ()
    // a object with key: timestamp in seconds new Date().getTime() / 1000
    // value: an object with event type as key and count as value
    // { curr : { 1609351117: { event1: 500, event2: 700, total: 1200 }, 1609390118: { event1: 500, event2: 700 }, ...., 1609391118: { event1: 500, event2: 700 }, total: 0 }
    //   1: {} // 3600 * 24 * 7, a week
    //   ~~~
    //   51: {}
    // }
    // {1609351117: {event1: 500, event2: 700, total: 1200}, 1609390118: {event1: 500, event2: 700}, ...., 1609391118: {event1: 500, event2: 700}}
    this.eventsCounts = {}
    // timeStamps of the events, keys of the events
    this.eventTimestamps = [];
    this.timeUpperbond = TIME_WINDOW_UPPER_BOUND;
  }

  /**
   * Add an event timestamp to this.eventTimestamps and notify client
   * @returns {String} notify client an event just happened.
   */
  incrementCount(eventType) {
    // We can save some memory by clean the outdated event(s) in eventTimestamps array
    // everytime we increment the count
    this.cleanExpiredTimestamps();
    const now = new Date().getTime() / 1000 // in seconds
    if (!this.eventsCounts[now]) {
      this.eventTimestamps.push(now)     //track event timestamp
      this.eventsCounts[now] = { total = 0 } // set default counts and total with timestamp as key
    }
    if (!this.eventsCounts[now][eventType]) {
      this.eventsCounts[now][eventType] = 0
    }

    this.eventsCounts[now][eventType]++
    this.eventsCounts[now].total++

    return `${eventType} just increment by 1`;
  }

  /**
   * Return number of events happened in a timewindow
   * @param {Number} timeWindow - client specified amount of time, defaults to TIME_WINDOW_UPPER_BOUND
   * @returns {Number} the length of a new filterd timestamp array
   */
  getCount(timeWindow = this.timeUpperbond) {
    this.isTimeWindowValid(timeWindow);
    const count = this.getRecentEvents(timeWindow).length;
    console.log(
      `${this.name} happened ${count} times in ${timeWindow} seconds`
    );
    return count;
  }

  //private methods
  // --------------
  /**
   * Return number of events happened in timewindow but NOT mutate the timestamp array
   * @param {Number} timeWindow - client specified amount of time, default to TIME_WINDOW_UPPER_BOUND
   * @returns {Number[]} the filtered timestamp array
   */
  getRecentEvents(timeWindow = this.timeUpperbond) {
    const currTime = new Date().getTime();
    // return a new array but not mutate the eventTimestamps
    // return this.eventTimestamps.filter(
    //   (time) => currTime - time <= timeWindow * 1000
    // );

    // {1: {event1: 500, event2: 700}, 2: 500, ...., 300: 20}
    // 15
    // {245:20,..., 300: 20}
    const now = Date.now() * 1000;
    let totalCount = 0;
    for (let index = now - timeWindow; index < now; index++) {
      if (this.eventTimestamps[index]) {
        totalCount += this.eventTimestamps[index];
      }
    }
    return totalCount;
  }

  /**
   * Update this.eventTimestamps by romeve the event timestamp(s) happened 300 seconds ago
   */
  cleanExpiredTimestamps() {
    this.eventTimestamps = this.getRecentEvents();
  }

  /**
   * Throw an error if timeWindow
   * 1. not a number
   * 2. isNaN
   * 3. less or equal than 0
   * 4. greater than TIME_WINDOW_UPPER_BOUND
   */
  isTimeWindowValid(timeWindow) {
    if (typeof timeWindow !== "number" || isNaN(timeWindow)) {
      const wrongType =
        typeof timeWindow === "number" ? "NaN" : typeof timeWindow;

      throw new TypeError(`getCount only takes number type but ${wrongType}`);
    }
    if (timeWindow <= 0 || timeWindow > TIME_WINDOW_UPPER_BOUND) {
      throw new RangeError(
        `getCount only takes number greater than 0 and less than ${TIME_WINDOW_UPPER_BOUND} but got ${timeWindow}`
      );
    }
  }
}
