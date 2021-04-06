'use strict';

const EventEmitter = require('events');
const Task = require('./task');
const Scheduler = require('./scheduler');

function formattedTime(date) {
    return `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}:${pad(date.getMilliseconds(), 3)}`;
}

function pad(num, size) {
    return (`000000000${num}`).substr(-size);
}


class TimelineEvent extends EventEmitter {

    constructor({
                    label,
                    fireTime,
                    timeline,
                    func,
                    funcParams,
                    repeatFrequency = 0,
                    repeatCount = -1,
                    end = -1
                }) {
        super();
        this.label = label;
        this.timeline = timeline;
        this.fireTime = fireTime;
        this.func = func;
        this.funcParams = funcParams;

        this.repeatFrequency = repeatFrequency;
        this.repeatCount = repeatCount;
        this.end = end;
        this.repeats = 0;

        this.task = new Task(func);
        this.playing = false;
        this.played = false;
        this.paused = false;
        console.log(`${JSON.stringify(this.toJson(),null,2)}`);
    }

    toJson() {
        const {label, fireTime, repeatFrequency, repeatCount, end} = this;

        return {label, fireTime, repeatFrequency, repeatCount, end};
    }

    play(fireTime) {
        let taskTimeout = fireTime === undefined ? this.fireTime : fireTime;
        console.log(`${JSON.stringify(this.toJson(),null,2)}`);

        console.log(`play ${formattedTime(new Date())} ${this.label} fire: ${taskTimeout} repets ${this.repeatCount}`);

        taskTimeout *= this.timeline.timeScale;

        this.played = false;
        this.paused = false;
        this.startTime = new Date();
        this.scheduler = new Scheduler(taskTimeout);

        const task = this.task;

        this.scheduler.on('scheduled-time-matched', (now) => {
            this.timeline.scheduleNextEvent();
            this.timeline.elapsedTime += this.fireTime;
            let result = task.execute(now, this);
            this.emit('task-done', result);
            this.played = true;
            this.playedTime = new Date();
            if (this.timeline.unplayedEvents().length === 0 && this.frequency === 0) {
                this.timeline.stop();
            } else {
                if (this.repeatFrequency > 0
                    && (this.repeatCount === -1 || (this.repeatCount > this.repeats))) {
                    this.play(this.repeatFrequency);
                    console.log(`${formattedTime(new Date())} cheduling --- ${this.label} Repeats ${this.repeats} count ${this.repeatCount}`);
                    this.repeats++;
                }
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
        this.play(this.fireTime - elapsed);
    }

    stop() {
        if (this.scheduler) {
            this.scheduler.stop();
        }
        this.playing = false;
        this.played = false;
    }

}

module.exports = TimelineEvent;
