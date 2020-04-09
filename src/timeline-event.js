'use strict';

const EventEmitter = require('events');
const Task = require('./task');
const Scheduler = require('./scheduler');

class TimelineEvent extends EventEmitter {

    constructor({ label, startTime, func, funcParams }) {
        super();
        this.label = label;
        this.startTime = startTime;
        this.func = func;
        this.funcParams = funcParams;
        this.task = new Task(func);
        this.playing = false;
    }

    play() {
        this.scheduler = new Scheduler(this.startTime);

        const task = this.task;
        this.scheduler.on('scheduled-time-matched', (now) => {
            let result = task.execute(now);
            this.emit('task-done', result);
        });

        this.scheduler.start();
        this.playing = true;
    }

    stop() {
        this.scheduler.stop();
        this.playing = false;
    }

    start() {
        if (this.playing) {
            this.scheduler.start();
        }
    }
}

module.exports = TimelineEvent;
