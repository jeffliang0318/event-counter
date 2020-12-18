export class EventCounter {
    constructor(name) {
        this.name = name
        this.timestamps = [];
        this.timeUpperbond = 300;
    }

    addCount () {
        this.cleanTimestamp()
        this.timestamps.push(new Date().getTime())
        return `${this.name} just happened`
    }

    getCount (timeWindow) {
        if (timeWindow && typeof timeWindow !== "number") {
            throw new TypeError(`getCount only takes number not ${typeof timeWindow}`);
        }

        return this.getRecentEvents(timeWindow).length
    }

    getRecentEvents (timeWindow = this.timeUpperbond) {
        const currTime = new Date().getTime();
        let strictTimeWindow = timeWindow
        if (timeWindow > this.timeUpperbond) {
            strictTimeWindow = this.timeUpperbond
        }
        return this.timestamps.filter( time => currTime - time < strictTimeWindow * 1000)
    }

    cleanTimestamp () {
        this.timestamps = this.getRecentEvents()
    }
}