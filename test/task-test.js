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
        await task.execute();
        assert.equal(true, finished);
    });


    it('should pass in 3 params to the func', async () => {
        let finished = false;

        let task = new Task((now, p1, p2, p3) => {
            assert.isTrue(now instanceof Date);
            assert.equal(p1, 1);
            assert.isTrue(p2);
            assert.equal(p3, 'yep');
            return 'ok';
        });

        task.on('task-finished', () => finished = true);

        const params = [1, true, 'yep'];
        await task.execute(new Date(), params);

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
