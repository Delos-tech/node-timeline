const { assert } = require('chai');
const sinon = require('sinon');
const TimelineEvent = require('../src/timeline-event');

describe('TimelineEvent', () => {
    beforeEach(() => {
        this.clock = sinon.useFakeTimers(new Date(2018, 0, 1, 0, 0, 0, 0));
    });

    afterEach(() => {
        this.clock.restore();
    });

    it('should start an event by default', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            startTime: 100,
            func: () => {
                executed += 1;
            }
        });
        scheduledEvent.play();
        this.clock.tick(3000);
        assert.equal(executed, 1);
        scheduledEvent.stop();
    });

    it('should run 3 events in order', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            startTime: 100,
            func: () => {
                executed += 1;
            }
        });

        let scheduledEvent2 = new TimelineEvent({
            label: 'e1',
            startTime: 200,
            func: () => {
                executed += 1;
                assert.exports(executed,2);
            }
        });
        let scheduledEvent3 = new TimelineEvent({
            label: 'e1',
            startTime: 300,
            func: () => {
                executed += 1;
                assert.equal(executed,3);
            }
        });

        scheduledEvent.play();
        scheduledEvent2.play();
        scheduledEvent3.play();

        this.clock.tick(100);
        this.clock.tick(100);
        this.clock.tick(100);

        assert.equal(executed, 3);
        scheduledEvent.stop();
        scheduledEvent2.stop();
        scheduledEvent3.stop();
    });

    it('should run 2 of 3 events in order when one is removed before it fires', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            startTime: 100,
            func: () => {
                executed += 1;
                assert.exports(executed,1);
            }
        });

        let scheduledEvent2 = new TimelineEvent({
            label: 'e1',
            startTime: 200,
            func: () => {
                executed += 1;
                assert.exports(executed,2);
            }
        });
        let scheduledEvent3 = new TimelineEvent({
            label: 'e1',
            startTime: 300,
            func: () => {
                executed += 1;
                assert.exports(executed,3);
            }
        });

        scheduledEvent.play();
        scheduledEvent2.play();
        scheduledEvent3.play();

        this.clock.tick(100);
        scheduledEvent2.stop();
        this.clock.tick(100);
        this.clock.tick(100);

        assert.equal(executed, 2);
        scheduledEvent.stop();
        scheduledEvent3.stop();
    });
});
