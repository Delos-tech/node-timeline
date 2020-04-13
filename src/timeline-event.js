'use strict';

const EventEmitter = require('events');
const Task = require('./task');
const Scheduler = require('./scheduler');

class TimelineEvent extends EventEmitter {

    constructor({ label, delay, timeline, func, funcParams }) {
        super();
        this.label = label;
        this.timeline = timeline;
        this.delay = delay;
        this.func = func;
        this.funcParams = funcParams;
        this.task = new Task(func);
        this.playing = false;
        this.played = false;
        this.paused = false;
    }

    play(delay) {
        let taskTimeout = delay === undefined ? this.delay : delay;

        taskTimeout *= this.timeline.timeScale;

        this.played = false;
        this.paused = false;
        this.startTime = new Date();
        this.scheduler = new Scheduler(taskTimeout);

        const task = this.task;

        this.scheduler.on('scheduled-time-matched', (now) => {
            let result = task.execute(now, this);
            this.emit('task-done', result);
            this.played = true;
            this.playedTime = new Date();
            if (this.timeline.unplayedEvents().length === 0) {
                this.timeline.stop();
            }
        });

        this.scheduler.start();
        this.playing = true;
    }

    pause() {
        this.scheduler.stop();
        this.playing = false;
        this.paused = true;
    }

    resume(elapsed) {
        this.play(this.delay - elapsed);
    }

    stop() {
        this.scheduler.stop();
        this.playing = false;
        this.played = false;
    }

}

module.exports = TimelineEvent;
