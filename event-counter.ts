// default supported timespan upper bound to 5 minutes(300 seconds)
export const TIME_WINDOW_UPPER_BOUND = 300;

export class EventCounter {
  name: string;
  eventTimestamps: number[];
  timeUpperbond: number;

  constructor(name = "event") {
    if (typeof name !== "string") {
      throw new TypeError("Invalid name, should be string.");
    }
    this.name = name;
    this.eventTimestamps = [];
    this.timeUpperbond = TIME_WINDOW_UPPER_BOUND;
  }

  /**
   * Add an event timestamp to this.eventTimestamps and notify client
   * @returns {string} notify client an event just happened.
   */
  incrementCount(): string {
    // We can save some memory by clean the outdated event(s) in eventTimestamps array
    // everytime we increment the count
    this.cleanExpiredTimestamps();
    this.eventTimestamps.push(new Date().getTime());
    return `${this.name} just happened`;
  }

  /**
   * Return number of events happened in a timewindow
   * @param {number} timeWindow - client specified amount of time, defaults to TIME_WINDOW_UPPER_BOUND
   * @returns {number} the length of a new filterd timestamp array
   */
  getCount(timeWindow: number = this.timeUpperbond): number {
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
   * @param {number} timeWindow - client specified amount of time, default to TIME_WINDOW_UPPER_BOUND
   * @returns {number[]} the length of the filterd timestamp array
   */
  getRecentEvents(timeWindow: number = this.timeUpperbond): number[] {
    const currTime = new Date().getTime();
    // return a new array but not mutate the eventTimestamps
    return this.eventTimestamps.filter(
      (time) => currTime - time <=timeWindow * 1000
    );
  }

  /**
   * Update this.eventTimestamps by romeve the event timestamp(s) happened 300 seconds ago
   */
  cleanExpiredTimestamps(): void {
    this.eventTimestamps = this.getRecentEvents();
  }

  /**
   * Throw an error if timeWindow
   * 1. not a number
   * 2. isNaN
   * 3. less or equal than 0
   * 4. greater than TIME_WINDOW_UPPER_BOUND
   */
  isTimeWindowValid(timeWindow: number): void {
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
};