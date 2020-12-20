import { EventCounter, TIME_WINDOW_UPPER_BOUND } from './event-counter';

// getCount without client-specified time
// --------------------------------------
test('Count should start with 0.', () => {
  const counter = new EventCounter();
  expect(counter.getCount()).toBe(0);
});

test('Count should start with 0.', () => {
  const counter = new EventCounter();
  const spy = jest.spyOn(console, 'log');
  counter.getCount();
  expect(spy.mock.calls[0]).toEqual(['event happened 0 times in 300 seconds']);
});

test('getCount should only filter out the event(s) happened 5 mins before if time is not been specified.', () => {
  const counter = new EventCounter();
  const oneMinuteEvent = new Date().getTime() - 60 * 1000;
  const fiveMinuteEvent = new Date().getTime() - 300 * 1000;
  counter.eventTimestamps = [oneMinuteEvent, fiveMinuteEvent];

  expect(counter.getCount()).toBe(1);
});

// getCount with client-specified time
// -----------------------------------
test('getCount should have option to take client-specified amount of time and return events count in this time period.', () => {
  const counter = new EventCounter();
  const twoSecondEvent = new Date().getTime() - 2 * 1000;
  
  counter.eventTimestamps = [twoSecondEvent];

  expect(counter.getCount(1)).toBe(0);
});

test('getCount should NOT filter out the events when taking client-specified amount of time.', () => {
  const counter = new EventCounter();
  const fourMinuteEvent = new Date().getTime() - 240 * 1000;
  const twoMinuteEvent = new Date().getTime() - 120 * 1000;
  
  counter.eventTimestamps = [fourMinuteEvent, twoMinuteEvent];
  counter.getCount(150);

  expect(counter.getCount()).toBe(2);
});

// Out of range for getCount
// -------------------------
test('getCount should throw an RangeError when timewindow is 0.', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount(0);
  }).toThrow(RangeError);
});

test('getCount should throw an RangeError when timewindow less than 0.', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount(-20);
  }).toThrow(RangeError);
});

test('getCount should throw an RangeError when timewindow greater than TIME_WINDOW_UPPER_BOUND.', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount(TIME_WINDOW_UPPER_BOUND + 1);
  }).toThrow(RangeError);
});

test('getCount should throw an error and let client know the timewindow is out of range', () => {
  const counter = new EventCounter();
  
  expect(() => {
    counter.getCount(-10);
  }).toThrow(new Error(`getCount only takes number greater than 0 and less than ${TIME_WINDOW_UPPER_BOUND} but got -10`));
});

// worng type of arg for getCount
// ------------------------------
test('getCount should throw an TypeError when taking string type arg.', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount("test");
  }).toThrow(TypeError);
});

test('getCount should throw an TypeError when taking NaN type arg.', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount(NaN);
  }).toThrow(TypeError);
});

test('getCount should throw an TypeError when taking null type arg.', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount(null);
  }).toThrow(TypeError);
});

test('getCount should throw an error and let client know the wrong type(string)', () => {
  const counter = new EventCounter();
  const badArg = "test";

  expect(() => {
    counter.getCount(badArg);
  }).toThrow(new Error(`getCount only takes number type but ${typeof badArg}`));
});

test('getCount should throw an error and let client know the wrong type(NaN)', () => {
  const counter = new EventCounter();

  expect(() => {
    counter.getCount(NaN);
  }).toThrow(new Error(`getCount only takes number type but NaN`));
});

// incrementCount
// --------------
test('incrementCount should increment count by 1.', () => {
  const counter = new EventCounter();
  counter.incrementCount();

  expect(counter.getCount()).toBe(1);
});

test('Client should be notified when an event happened.', () => {
  const name = 'hello world';
  const counter = new EventCounter(name);

  expect(counter.incrementCount()).toBe(`${name} just happened`);
});


// create a EventCounter
// ---------------------
test('Client should have option to name the EventCounter.', () => {
  const counter = new EventCounter("click");

  expect(counter.name).toBe('click');
});

test('Client do not have to name the EventCounter.', () => {
  const counter = new EventCounter();

  expect(counter.name).toBe('event');
});

test('Client should get an TypeError when create EventCounter with non-string type name.', () => {
  
  expect(() => {
    const counter = new EventCounter(99);
  }).toThrow(TypeError);
});

test('Client should get an TypeError when create EventCounter with non-string type name.', () => {
  
  expect(() => {
    const counter = new EventCounter(0);
  }).toThrow(new Error("Invalid name, should be string."));
});
