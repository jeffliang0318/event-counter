// default supported timespan upper bound to 5 minutes(300 seconds)
const TIME_WINDOW_UPPER_BOUND = 300;

export class EventCounter {
    constructor(name = 'event') {
        if (typeof name !== "string") {
            throw new TypeError("Invalid name, should be string.")
        }
        this.name = name;
        this.eventTimestamps = [];
        this.timeUpperbond = TIME_WINDOW_UPPER_BOUND;
    }

    /**
     * Add an event timestamp and notify client
     * @returns {String} notify client an event just happened.
    */
    incrementCount () {
        // We can save some memory by clean the outdated event(s) in eventTimestamps array
        // everytime we increment the count
        this.cleanExpiredTimestamps();
        this.eventTimestamps.push(new Date().getTime());
        return `${this.name} just happened`;
    }

    /**
     * Return number of events happened in timewindow
     * @param {Number} timeWindow - client specified amount of time default to TIME_WINDOW_UPPER_BOUND
     * @returns {Number} the length of the filterd timestamp array 
    */
    getCount (timeWindow = this.timeUpperbond) {
        this.isTimeWindowValid(timeWindow)
        const strictTimeWindow = timeWindow > this.timeUpperbond ? this.timeUpperbond : timeWindow;
        const count = this.getRecentEvents(strictTimeWindow).length;
        console.log(`${this.name} happened ${count} times in ${strictTimeWindow} seconds`);
        return count
    }
    
    //private methods
    // --------------
    /**
     * Return number of events happened in timewindow but NOT mutate the timestamp array
     * @param {Number} timeWindow - client specified amount of time, default to TIME_WINDOW_UPPER_BOUND
     * @returns {Number} the length of the filterd timestamp array
    */
    getRecentEvents (timeWindow = this.timeUpperbond) {
        const currTime = new Date().getTime();
        // return a new array but not mutate the eventTimestamps
        return this.eventTimestamps.filter( time => currTime - time < timeWindow * 1000);
    }

    /**
     * Update eventTimestamps by romeve the event timestamp(s) happened 300 seconds ago and 
     */
    cleanExpiredTimestamps () {
        this.eventTimestamps = this.getRecentEvents();
    }

    /**
     * Throw an error if timeWindow is not a number greater than 0
     */
    isTimeWindowValid (timeWindow) {
        if (typeof timeWindow !== "number" || isNaN(timeWindow)) {
            const wrongType = typeof timeWindow === "number" ? "NaN" : typeof timeWindow

            throw new TypeError(`getCount only takes number type but ${wrongType}`);
        };
        if (timeWindow <= 0) {
            throw new RangeError(`getCount only takes number greater than 0 but ${timeWindow}`);
        }
    }
};