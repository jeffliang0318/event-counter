import { EventCounter } from "./event-counter";

const PageCounter = new EventCounter();
// station1 served 120,300 times in one second
PageCounter.incrementCount("station1");
// ~ 120,300 times

// station2 served 523,318 times in one second
PageCounter.incrementCount("station2");
// ~ 523,318 times

// curr = Math.floor(Date.now() / 1000)
// 120,300 times from curr to curr + 1
// .
// getCount with station1 in one second
// getCount in one second
PageCounter.getCount(1); // return 120,300 + 523,318 = 643,618
// getCount with station1 in one second
PageCounter.getCount(1, "station1"); // return 120,300
PageCounter.getCount(1, "station2"); // return 523,318

// stage 1
// compress data count, timestamps as key and value: { eventName: # of count, total: total count for this second }
// with the "total" key, we dont need to iterate to get the total count
// eventCounts = {
//    1609351117: { station1: 57300, station2: 39800, total: 93500 },
//    1609402415: { station1: 75220, station2: 11803, total: 87023 }
// }
//
// eventTimestamps = [1609351117, 1609402415], so we can do binary search for events in time window
class EventCounter1 {
  constructor() {
    this.eventCounts = {};
    this.eventTimestamps = []; // timestamps for binary search
  }

  incrementCount(eventName) {
    const now = Math.floor(new Date().getTime() / 1000); // in seconds, so we can store event happend in one second
    if (!this.eventsCounts[now]) {
      this.eventTimestamps.push(now); // only push the same timestamp once
      this.eventsCounts[now] = { total: 0 }; // set default counts and total with timestamp as key
    }
    if (!this.eventsCounts[now][eventName]) {
      this.eventsCounts[now][eventName] = 0;
    }

    // everytime event increment by 1, total also increment by 1 so we don't need to iterate this map to sum the count. O(1)
    this.eventsCounts[now][eventName] = this.eventsCounts[now][eventName] + 1;
    this.eventsCounts[now].total = this.eventsCounts[now].total + 1;

    return `${eventName} just increment by 1`;
  }

  getCount(timeWindow, eventName) {
    const now = Math.floor(new Date().getTime() / 1000);
    const validTimestamp = now - timeWindow;
    // use binary search to get the index of first valid timestamp, O(logn)
    const validTimestampIndex = this.getValidTimestampIndex(
      this.eventTimestamps,
      validTimestamp
    );
    let totalCount = 0;
    if (validTimestampIndex == -1) {
      return 0;
    }
    // iterate the eventTimestamps array from the validTimestampIndex
    // so we can get valid value from the this.eventCounts map
    for (
      let index = validTimestampIndex;
      index < this.eventTimestamps.length;
      index++
    ) {
      const timestampKey = this.eventTimestamps[index];
      if (eventName) {
        totalCount += this.eventCounts[timestampKey][eventName];
      } else {
        totalCount += this.eventCounts.total;
      }
    }
    return totalCount;
  }

  getValidTimestampIndex(array, target) {
    // timestamps array: [oldest, older, ..., newer, newest] => [543, 743, ..., 900, 1200]
    let olderIndex = 0;
    let newerIndex = array.length - 1;

    while (olderIndex + 1 < newerIndex) {
      // prevent infinite loop
      let mid = Math.floor((olderIndex + newerIndex) / 2);

      if (array[mid] >= target) {
        // array[mid] is too new
        newerIndex = mid;
      } else {
        olderIndex = mid;
      }
    }

    if (array[olderIndex] >= target) {
      // if the timestamp is in the range
      return olderIndex;
    }

    if (array[newIndex] >= target) {
      return newerIndex;
    }

    return -1; // if no timestamps in the range
  }
}

// stage 2 handle the year long data
// idea, track the events happend in current week in this.currentWeek
// store the event happened more than a week in a map, use sunday timestamp as key, and the value is the weekly events data
// this.currentWeek use the same logic as stage 1
// this.currentWeek = { eventCounts: {...}, eventTimestamps: [...] }
// this.eventCounts store data by week
// this.eventCounts =
// {
//   sunday1_Timestamp: {eventCounts: {...}, eventTimestamps: [...], total: 223,672,424,767}
//   sunday2_Timestamp: {eventCounts: {...}, eventTimestamps: [...], total:   3,672,424,767}
//   ...
//   sunday52_Timestamp: {eventCounts: {...}, eventTimestamps: [...], total: 723,672,424,767}
// }
class EventCounter2 {
  constructor() {
    this.currentWeek = { eventCounts: {}, eventTimestamps: [] };
    this.weeksEventCounts = {};
    this.sundayTimestamps = [];
  }

  incrementCount(eventName) {
    this.updateEvents();
    // update current week total
    // others use the same logic in stage 1 to update this.currentWeek.evenCount and eventTimestamps
    this.currentWeek.total = this.currentWeek.total + 1;
  }

  // the getCount has 3 scenario,
  // 1. when targetTimestamp is in current,    Sunday, ...targetTimestamp, ..., now
  // 2. when targetTimestamp cross the Sunday, Sunday, ...targetTimestamp, ..., Sunday, ..., now
  // 3. when targetTimestamp cross week(s),    Sunday, ...targetTimestamp, ...week(s), now
  getCount(timeWindow) {
    const now = Math.floor(new Date().getTime() / 1000);
    const targetTimestamp = now - timeWindow;
    let total = 0;

    // scenario 1
    // use same getCount logic as stage 1 if the target timestamp is in current week
    if (this.inCurrentWeek(targetTimestamp)) {
      // ...
      getWeekTotal(targetTimestamp);
      return total;
    }

    // scenario 2
    // the totalCount should be this.currentWeek.total plus counts from previous imcompleted week
    // use similiar binary search logic find the Sunday timestamp
    const targetWeekIndex = getValidTimestampIndex(
      this.sundayTimestamps,
      targetTimestamp
    );
    const targetWeek = this.sundayTimestamps[targetWeekIndex];
    const prevWeekTotal = getWeekTotal(targetWeek);
    total = this.currentWeek.total + prevWeekTotal;

    // scenario 3
    // the totalCount should be this.currentWeek.total add counts from previous weeks
    // if the target week isn't last one in this.sundayTimestamps, which means the timestamp cross a whole week
    // then we iterate through this.sundayTimestamps from targetWeekIndex to add week total
    if (
      this.sundayTimestamps.indexOf(targetWeek) <
      this.sundayTimestamps.length - 1
    ) {
      for (
        let index = targetWeekIndex + 1;
        index < this.sundayTimestamps.length;
        index++
      ) {
        const sundayTimestamp = this.sundayTimestamps[index];
        total += this.eventCounts[sundayTimestamp].total;
      }
    }

    return total;
  }

  updateEvents() {
    const prevEventTime = this.currentWeek.eventTimestamps[-1];
    // if the previous event is not in current week
    // assume we have a help to check if the previous event timestamp is in current week
    if (!this.inCurrentWeek(prevEventTime)) {
      const sundayTimestamp = eventSundayTimestamp(prevEventTime); // get the Sunday timestamp of the week of the previous event
      const data = {
        eventCounts: this.currentWeek.eventCounts,
        eventTimestamps: this.currentWeek.eventCounts,
        total: this.currentWeek.total,
      };
      this.weeksEventCounts[sundayTimestamp] = data;
      this.sundayTimestamps.push(sundayTimestamp);
      // assume we have a help function to remove the oldest week events if there are any week over limit
      // basically iterate through the this.weeksEventCounts.keys, if key(the sunday timestamp) > limit
      // remove the key value pair from this.weeksEventCounts
      this.removeOverLimitEvents();

      this.currentWeek = { eventCounts: {}, eventTimestamps: [] };
    }
  }
}
