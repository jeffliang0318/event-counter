import { EventCounter } from './event-counter';

// getCount without client-specified time
// --------------------------------------
test('Count should start with 0.', () => {
  const counter = new EventCounter()
  expect(counter.getCount()).toBe(0);
});

test('getCount should only filter out the event(s) happened 5 mins before if time is not been specified.', () => {
  const counter = new EventCounter()
  const oneMinuteEvent = new Date().getTime() - 60 * 1000
  const fiveMinuteEvent = new Date().getTime() - 300 * 1000
  counter.timestamps = [oneMinuteEvent, fiveMinuteEvent]

  expect(counter.getCount()).toBe(1);
});

// getCount with client-specified time
// -----------------------------------
test('getCount should have option to take client-specified amount of time and return events count in this time period.', () => {
  const counter = new EventCounter()
  const twoSecondEvent = new Date().getTime() - 2 * 1000
  counter.timestamps = [twoSecondEvent]

  expect(counter.getCount(1)).toBe(0);
});

test('getCount should only return the events count in the supported timespan(300 seconds by default).', () => {
  const counter = new EventCounter()
  const fiveMinuteEvent = new Date().getTime() - 300 * 1000
  counter.timestamps = [fiveMinuteEvent]

  expect(counter.getCount(600)).toBe(0);
});

// Out of range for getCount
// -------------------------
test('getCount should throw an RangeError when timewindow is 0.', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount(0);
  }).toThrow(RangeError);
});

test('getCount should throw an RangeError when timewindow less than 0.', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount(-20);
  }).toThrow(RangeError);
});

test('getCount should throw an error and let client know timewindow should greater than 0', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount(0);
  }).toThrow(new Error('getCount only takes number greater than 0 but 0'));
});

test('getCount should throw an error and let client know timewindow should greater than 0, but -10', () => {
  const counter = new EventCounter()
  
  expect(() => {
    counter.getCount(-10);
  }).toThrow(new Error('getCount only takes number greater than 0 but -10'));
});

// worng type of arg for getCount
// ------------------------------
test('getCount should throw an TypeError when taking string type arg.', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount("test");
  }).toThrow(TypeError);
});

test('getCount should throw an TypeError when taking NaN type arg.', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount(NaN);
  }).toThrow(TypeError);
});

test('getCount should throw an TypeError when taking null type arg.', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount(null);
  }).toThrow(TypeError);
});

test('getCount should throw an error and let client know the wrong type(string)', () => {
  const counter = new EventCounter()
  const badArg = "test"

  expect(() => {
    counter.getCount(badArg);
  }).toThrow(new Error(`getCount only takes number type but ${typeof badArg}`));
});

test('getCount should throw an error and let client know the wrong type(NaN)', () => {
  const counter = new EventCounter()

  expect(() => {
    counter.getCount(NaN);
  }).toThrow(new Error(`getCount only takes number type but NaN`));
});

// incrementCount
// --------------
test('incrementCount should increment count by 1.', () => {
  const counter = new EventCounter()
  counter.incrementCount()

  expect(counter.getCount()).toBe(1);
});

test('Client should be notified when an event happened.', () => {
  const name = 'hello world'
  const counter = new EventCounter(name)

  expect(counter.incrementCount()).toBe(`${name} just happened`);
});


// create a EventCounter
// ---------------------
test('Client should have option to name the event.', () => {
  const counter = new EventCounter("click")

  expect(counter.name).toBe('click');
});

test('Client do not have to name the event.', () => {
  const counter = new EventCounter()

  expect(counter.name).toBe('event');
});
