const { assert } = require('chai');
const sinon = require('sinon');
const TimelineEvent = require('../src/timeline-event');

class Timeline {
    constructor(name) {
        this.name = name;
        this.timeScale = 1;
    }
    stop() {};
    unplayedEvents() {
        return 0;}
}

describe('TimelineEvent', () => {
    let timeline;
    beforeEach(() => {
        timeline = new Timeline('Timeline Event')
        this.clock = sinon.useFakeTimers(new Date(2018, 0, 1, 0, 0, 0, 0));
    });

    afterEach(() => {
        this.clock.restore();
    });

    it('should start an event by default', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 100,
            timeline,
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
            delay: 100,
            timeline,
            func: () => {
                executed += 1;
            }
        });

        let scheduledEvent2 = new TimelineEvent({
            label: 'e1',
            delay: 200,
            timeline,
            func: () => {
                executed += 1;
                assert.exports(executed,2);
            }
        });
        let scheduledEvent3 = new TimelineEvent({
            label: 'e1',
            delay: 300,
            timeline,
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
            delay: 100,
            timeline,
            func: () => {
                executed += 1;
                assert.exports(executed,1);
            }
        });

        let scheduledEvent2 = new TimelineEvent({
            label: 'e1',
            delay: 200,
            timeline,
            func: () => {
                executed += 1;
                assert.exports(executed,2);
            }
        });
        let scheduledEvent3 = new TimelineEvent({
            label: 'e1',
            delay: 300,
            timeline,
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

    it('should run at the default timeScale', () => {

        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 100,
            timeline,
            func: () => {
                executed += 1;
                assert.exports(executed,1);
            }
        });
        // default is one

        scheduledEvent.play();

        this.clock.tick(100);

        assert.equal(executed, 1);
    });

    it('should run at the specified timeScale', () => {

        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 100,
            timeline,
            func: () => {
                executed += 1;
                assert.exports(executed,1);
            }
        });

        scheduledEvent.play();

        this.clock.tick(50);
        assert.equal(executed, 0);

        this.clock.tick(100);
        assert.equal(executed, 1);
    });

    it('should run at the specified timeScale when set post creation', () => {

        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 100,
            timeline,
            func: () => {
                executed += 1;
                assert.exports(executed,1);
            }
        });

        scheduledEvent.play();

        this.clock.tick(100);
        assert.equal(executed, 1);

        executed = 0;

        timeline.timeScale =2;

        scheduledEvent.play();

        this.clock.tick(100);
        assert.equal(executed, 0);

        this.clock.tick(200);
        assert.equal(executed, 1);

    });

    it('should report as played when fired', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 100,
            timeline,
            func: () => {
                executed += 1;
            }
        });
        scheduledEvent.play();
        this.clock.tick(3000);
        assert.equal(executed, 1);
        assert.equal(scheduledEvent.played, true);
        scheduledEvent.stop();
    });

    it('should not fire if paused before start', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 1000,
            timeline,
            func: () => {
                executed += 1;
            }
        });
        scheduledEvent.play();
        this.clock.tick(500);
        scheduledEvent.pause();
        this.clock.tick(4000);
        assert.equal(executed, 0);
        scheduledEvent.stop();
    });

    it('should not fire if paused before start but fire after resume', () => {
        let executed = 0;
        let scheduledEvent = new TimelineEvent({
            label: 'e1',
            delay: 1000,
            timeline,
            func: () => {
                executed += 1;
            }
        });
        scheduledEvent.play();
        this.clock.tick(500);
        assert.equal(executed, 0);

        scheduledEvent.pause();
        this.clock.tick(3000);
        assert.equal(executed, 0);

        scheduledEvent.resume(500);
        this.clock.tick(400);
        assert.equal(executed, 0);

        scheduledEvent.pause();
        this.clock.tick(2000);

        scheduledEvent.resume(900);
        this.clock.tick(100);
        assert.equal(executed, 1);
        scheduledEvent.stop();
    });

});

