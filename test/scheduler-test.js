const { assert } = require('chai');
const sinon = require('sinon');
const Scheduler = require('../src/scheduler');


describe('Scheduler', () => {
    beforeEach(() => {
        this.clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        this.clock.restore();
    });

    it('should emit an event on matched time', (done) => {

        let scheduler = new Scheduler( 100 );

        scheduler.on('scheduled-time-matched', (date) => {
            assert.isNotNull(date);
            assert.instanceOf(date, Date);
            scheduler.stop();
            done();
        });

        scheduler.start();
        this.clock.tick(1000);
    });

    it('should emit two events', (done) => {
        let scheduler = new Scheduler( 100 );
        let scheduler2 = new Scheduler(400);
        let count = 0;

        scheduler.on('scheduled-time-matched', (date) => {
            assert.isNotNull(date);
            assert.instanceOf(date, Date);
            scheduler.stop();
            count++;
            // done();
        });

        scheduler2.on('scheduled-time-matched', (date) => {
            assert.isNotNull(date);
            assert.instanceOf(date, Date);
            scheduler.stop();
            count++;
            assert.equal(count, 2);
            done();
        });

        scheduler.start();
        scheduler2.start();
        this.clock.tick(1000);
    });

    it('should emit two events when three are created but one is then stopped before it fires', () => {
        let scheduler = new Scheduler( 100 );
        let scheduler2 = new Scheduler(400);
        let scheduler3 = new Scheduler(600);
        let count = 0;

        scheduler.on('scheduled-time-matched', (date) => {
            assert.isNotNull(date);
            assert.instanceOf(date, Date);
            scheduler.stop();
            count++;
            // done();
        });

        scheduler2.on('scheduled-time-matched', (date) => {
            assert.isNotNull(date);
            assert.instanceOf(date, Date);
            scheduler.stop();
            count++;
            assert(false);
        });

        scheduler2.on('scheduled-time-matched', (date) => {
            assert.isNotNull(date);
            assert.instanceOf(date, Date);
            scheduler.stop();
            count++;
            assert.equal(count, 3);
            done();
        });
        scheduler.start();
        scheduler2.start();
        scheduler3.start();
        this.clock.tick(300);
        scheduler2.stop();
        this.clock.tick(1000);
    });

});
