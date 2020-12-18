// default upper bound for time window
const TIME_WINDOW_UPPER_BOUND = 300;

export class EventCounter {
    constructor(name) {
        this.name = name;
        this.timestamps = [];
        this.timeUpperbond = TIME_WINDOW_UPPER_BOUND;
    }

    addCount () {
        this.#cleanTimestamp();
        this.timestamps.push(new Date().getTime());
        return `${this.name} just happened`;
    }

    getCount (timeWindow) {
        if (timeWindow && typeof timeWindow !== "number") {
            throw new TypeError(`getCount only takes number not ${typeof timeWindow}`);
        };

        return this.#getRecentEvents(timeWindow).length;
    }
    
    //private methods
 
    #getRecentEvents (timeWindow = this.timeUpperbond) {
        const currTime = new Date().getTime();
        let strictTimeWindow = timeWindow;
        // incase user enter one more zero
        if (timeWindow > this.timeUpperbond) {
            strictTimeWindow = this.timeUpperbond;
        };
        return this.timestamps.filter( time => currTime - time < strictTimeWindow * 1000);
    }

    #cleanTimestamp () {
        this.timestamps = this.#getRecentEvents();
    }
};