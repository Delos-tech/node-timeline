'use strict';

const EventEmitter = require('events');
const Task = require('./task');
const Scheduler = require('./scheduler');

class TimelineEvent extends EventEmitter {

    constructor({ label, startTime, timesScale = 1, func, funcParams }) {
        super();
        this.label = label;
        this.startTime = startTime;
        this.func = func;
        this.funcParams = funcParams;
        this.task = new Task(func);
        this.playing = false;
        this.timeScale = timesScale;
    }

    play() {
        this.scheduler = new Scheduler(this.startTime * this.timeScale);

        const task = this.task;
        this.scheduler.on('scheduled-time-matched', (now) => {
            let result = task.execute(now);
            this.emit('task-done', result);
            this.playing = false;
            this.scheduler.stop();
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

    setTimescale(scale) {
        this.timeScale = scale;
    }
}

module.exports = TimelineEvent;
