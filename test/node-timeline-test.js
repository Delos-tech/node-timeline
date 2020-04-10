const { assert } = require('chai');
const sinon = require('sinon');
const Timeline = require('../src/node-timeline');
const TimelineEvent = require('../src/timeline-event');

describe('node-timeline', () => {

    beforeEach(() => {
        this.clock = sinon.useFakeTimers(new Date(2018, 0, 1, 0, 0, 0, 0));
    });

    afterEach(() => {
        this.clock.restore();
    });

    it('should run a single task', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
            }
        });

        timeline.addEvent(event);

        timeline.play();

        this.clock.tick(100);
        assert.equal(executed,1);
    });

    it('should run 3 events in order', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
                assert.equal(executed, 1);
            }
        });

        const event2 = new TimelineEvent({
            label: 'e2',
            delay: 200,
            func: () => {
                executed += 1;
                assert.equal(executed, 2);
            }
        });

        const event3 = new TimelineEvent({
            label: 'e3',
            delay: 300,
            func: () => {
                executed += 1;
                assert.equal(executed, 3);
            }
        });

        timeline.addEvent(event);
        timeline.addEvent(event2);
        timeline.addEvent(event3);

        timeline.play();
        this.clock.tick(400);
        assert.equal(executed, 3);
    });

    it('should fire 2 events when there are 3 and the timeline is stopped before the 3rd', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
                assert.equal(executed, 1);
            }
        });

        const event2 = new TimelineEvent({
            label: 'e2',
            delay: 200,
            func: () => {
                executed += 1;
                assert.equal(executed, 2);
            }
        });

        const event3 = new TimelineEvent({
            label: 'e3',
            delay: 300,
            func: () => {
                executed += 1;
            }
        });

        timeline.addEvent(event);
        timeline.addEvent(event2);
        timeline.addEvent(event3);

        timeline.play();
        this.clock.tick(200);
        timeline.stop();
        this.clock.tick(200);
        assert.equal(executed, 2);
    });

    it('should fire 2 events when there are 3 and an event is deleted before it fires ', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
                assert.equal(executed, 1);
            }
        });

        const event2 = new TimelineEvent({
            label: 'e2',
            delay: 200,
            func: () => {
                executed += 1;
            }
        });

        const event3 = new TimelineEvent({
            label: 'e3',
            delay: 300,
            func: () => {
                executed += 1;
                assert.equal(executed, 3);
            }
        });

        timeline.addEvent(event);
        timeline.addEvent(event2);
        timeline.addEvent(event3);

        timeline.play();
        this.clock.tick(100);
        timeline.removeEvent('e2');
        this.clock.tick(200);
        assert.equal(executed, 2);
    });

    it('should fire the event based on the delay and timeScale', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        timeline.setTimeScale(2);

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
                assert.equal(executed, 1);
            }
        });

        timeline.addEvent(event);

        timeline.play();
        this.clock.tick(100);
        assert.equal(executed, 0);
        this.clock.tick(200);
        assert.equal(executed, 1);
    });

    it('should fire the event based running time and ignore time during pause', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
                assert.equal(executed, 1);
            }
        });

        timeline.addEvent(event);

        timeline.play();

        this.clock.tick(50);
        assert.equal(executed, 0);

        timeline.pause();
        this.clock.tick(2000);
        assert.equal(executed, 0);

        timeline.resume();

        this.clock.tick(45);
        assert.equal(executed, 0);

        this.clock.tick(500);
        assert.equal(executed, 1);
    });

    it('should fire 2 of the 3 events and not the deleted 1', () => {
        let executed = 0;
        const timeline = new Timeline('t1');

        const event = new TimelineEvent({
            label: 'e1',
            delay: 100,
            func: () => {
                executed += 1;
                assert.equal(executed, 1);
            }
        });

        const event2 = new TimelineEvent({
            label: 'e2',
            delay: 200,
            func: () => {
                executed += 1;
                assert.equal(executed, 99999);
            }
        });

        const event3 = new TimelineEvent({
            label: 'e3',
            delay: 300,
            func: () => {
                executed += 1;
                assert.equal(executed, 2);
            }
        });

        timeline.addEvent(event);
        timeline.addEvent(event2);
        timeline.addEvent(event3);

        timeline.play();

        this.clock.tick(100);
        assert.equal(executed, 1);

        timeline.pause();
        timeline.removeEvent('e2');
        this.clock.tick(2000);
        assert.equal(executed, 1);

        timeline.resume();

        this.clock.tick(100);
        assert.equal(executed, 1);

        this.clock.tick(100);
        assert.equal(executed, 2);
    });
});
