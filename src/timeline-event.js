'use strict';

const EventEmitter = require('events');
const Task = require('./task');
const Scheduler = require('./scheduler');

class TimelineEvent extends EventEmitter {

    constructor({ label, delay, timesScale = 1, func, funcParams }) {
        super();
        this.label = label;
        this.startTime = null;
        this.delay = delay;
        this.func = func;
        this.funcParams = funcParams;
        this.task = new Task(func);
        this.playing = false;
        this.played = false;
        this.paused = false;
        this.timeScale = timesScale;
    }

    play(delay) {
        let taskTimeout = delay === undefined ? this.delay : delay;

        taskTimeout *= this.timeScale;

        console.log(`Playing event ${this.label} delay ${taskTimeout}`);

        this.played = false;
        this.paused = false;
        this.startTime = new Date();
        this.scheduler = new Scheduler(taskTimeout);

        const task = this.task;

        this.scheduler.on('scheduled-time-matched', (now) => {
            console.log(`Firing event ${this.label}`);
            let result = task.execute(now, this);
            this.emit('task-done', result);
            this.played = true;
            this.playedTime = new Date();
        });

        this.scheduler.start();
        this.playing = true;
    }

    pause() {
        console.log(`Pausing event ${this.label}`);
        this.scheduler.stop();
        this.playing = false;
        this.paused = true;
    }

    resume(elapsed) {
        console.log(`------Resuming event ${this.label} ${this.delay - elapsed}`);
        this.play(this.delay - elapsed);
    }

    stop() {
        this.scheduler.stop();
        this.scheduler = null; // todo resuse?
        this.playing = false;
        this.played = false;
    }

    setTimescale(scale) {
        this.timeScale = scale;
    }
}

module.exports = TimelineEvent;
