const { assert } = require('chai');
const sinon = require('sinon');
const Task = require('../src/task');

describe('Task', () => {
    beforeEach(() => {
        this.clock = sinon.useFakeTimers(new Date(2018, 0, 1, 0, 0, 0, 0));
    });

    afterEach(() => {
        this.clock.restore();
    });

    it('should emit event on finish a task', async () => {
        let finished = false;
        let task = new Task(() => 'ok');
        task.on('task-finished', () => finished = true);
        await task.execute(new Date(), {startTime: new Date(), delay: 1000, timeScale: 1});
        assert.equal(true, finished);
    });


    it('should pass in 3 params to the func', async () => {
        let finished = false;

        let task = new Task((now, event) => {
            assert.isTrue(now instanceof Date);
            assert.equal(event.funcParams[0], 1);
            assert.isTrue(event.funcParams[1]);
            assert.equal(event.funcParams[2], 'yep');
            return 'ok';
        });

        task.on('task-finished', () => finished = true);


        const params = [1, true, 'yep'];
        await task.execute(new Date(), {funcParams: [...params]});

        assert.equal(true, finished);
    });

    it('should emit event on error a task', async () => {
        let error;
        let task = new Task(() => {
            throw Error('execution error');
        });
        task.on('task-failed', (err) => error = err.message);
        await task.execute();
        assert.equal('execution error', error);
    });

    it('should emit event on finish a promise task', async () => {
        let finished = false;
        const promise = () => new Promise((resolve) => resolve('ok'));
        let task = new Task(promise);
        task.on('task-finished', () => finished = true);
        await task.execute();
        assert.equal(true, finished);
    });

    it('should emit event on error a promise task', async () => {
        let failed = false;
        const promise = () => new Promise((resolve, reject) => reject('errou'));
        const task = new Task(promise);
        task.on('task-failed', (error) => failed = error);
        await task.execute();
        assert.equal('errou', failed);
    });

    it('should reject a non function', () => {
        assert.throws(() => { new Task('I am not a function')}, 'execution must be a function');
    });
});
