const TimelineEvent = require('./timeline-event');

const state = {
    STOPPED: 'stopped',
    RUNNING: 'running',
    PAUSED: 'paused',
    FINISHED: 'finished'
};

class Timeline {

    constructor(name) {
        this.name = name;
        this.startTime = null;
        this.pausedTime = null;
        this.timeScale = 1;
        this.events = [];
        this.totalElapsedPlayingTime = 0;
        this.state = state.STOPPED;
    }


    addEvent(event) {
        this.events.push(event);
    }

    removeEvent(label) {
        const deletedEvents = this.events.filter(e => e.label === label);
        deletedEvents.forEach(e => e.stop());
        this.events = this.events.filter(e => e.label !== label);
    }

    play() {
        if (this.state  === state.RUNNING || this.state === state.PAUSED) {
            throw new Error(`Timeline ${this.name} already running in state ${this.state}`);
        }
        this.state = state.RUNNING;
        this.startTime = new Date();
        this.events.forEach(e => e.play());
    }

    pause() {
        if (this.state !== state.RUNNING) {
            throw new Error(`Timeline ${this.name} is not running. Current state ${this.state}`);
        }
        this.state = state.PAUSED;
        this.pausedTime = new Date();
        this.totalElapsedPlayingTime += this.pausedTime.getTime() - this.startTime.getTime();
        this.unplayedEvents().forEach(e =>  e.pause());
    }

    resume() {
        if (this.state !== state.PAUSED) {
            throw new Error(`Timeline ${this.name} isn't paused. Current state ${this.state}`);
        }
        this.state = state.RUNNING;
        this.startTime = new Date();
        this.unplayedEvents().forEach(e => e.resume(this.totalElapsedPlayingTime));
    }

    stop() {
        if (this.state !== state.RUNNING && this.state !== state.paused) {
            throw new Error(`Timeline ${this.name} is not running. Current state ${this.state}`);
        }
        this.state = state.STOPPED;
        this.events.forEach(e => e.stop());
    }

    setTimeScale(scale) {
        this.timeScale = scale;
    }

    kill() {
        this.stop();
    }

    unplayedEvents() {
        return this.events.filter(e => e.played === false);
    }

}

module.exports = {Timeline, TimelineEvent};

