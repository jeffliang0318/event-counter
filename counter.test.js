import { EventCounter } from './event-counter';

test('Get event count should be 0 before add new event.', () => {
  const counter = new EventCounter("click")
  expect(counter.getCount()).toBe(0);
});

test('Get event count should filter event(s) older than 5 mins(300,000 millisecond).', () => {
  const counter = new EventCounter("page load")
  // 
  counter.timestamps = [new Date().getTime() - 300 * 1000]
  expect(counter.getCount()).toBe(0);
});

test('Get event count should NOT filter event happened in 5 mins(300,000 millisecond) if not specified.', () => {
  const counter = new EventCounter("page load")
  counter.timestamps = [new Date().getTime() - 100 * 1000]
  expect(counter.getCount()).toBe(1);
});

test('Get event count should take user-specified amount of time.', () => {
  const counter = new EventCounter("page load")
  counter.timestamps = [new Date().getTime() - 2 * 1000]
  expect(counter.getCount(1)).toBe(0);
});

test('The time period will be upper bond if user-specified amount greater than upper bound.', () => {
  const counter = new EventCounter("page load")
  counter.timestamps = [new Date().getTime() - 300 * 1000]
  expect(counter.getCount(1000)).toBe(0);
});

test('getCount should throw an error if not take number type argument', () => {
  const counter = new EventCounter("page load")
  expect(() => {
    counter.getCount("test");
    }).toThrow(TypeError);
});

test('throw error and tell you whats   wrong', () => {
  const counter = new EventCounter("page load")
  counter.timestamps = [new Date().getTime() - 100 * 1000]
  expect(() => {
    counter.getCount("test");
    }).toThrow(new Error('getCount only takes number not string'));
});

test('event count should increment by 1 when addcount.', () => {
  const counter = new EventCounter("click")
  counter.addCount()
  expect(counter.getCount()).toBe(1);
});

test('Client should be notified when event count inc', () => {
  const counter = new EventCounter('click')
  expect(counter.addCount()).toBe('click just happened');
});
