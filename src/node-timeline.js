const TimelineEvent = require('./timeline-event');

const state = {
    STOPPED: 'stopped',
    RUNNING: 'running',
    PAUSED: 'paused'
};

class Timeline {

    constructor(name) {
        this.name = name;
        this.startTime = null;
        this.pausedTime = null;
        this.timeScale = 1;
        this.events = [];
        this.elapsedTime = 0;
        this.state = state.STOPPED;
    }


    clear() {
        if (this.state === state.RUNNING || this.state === state.PAUSED) {
            this.stop();
        }
        this.events = [];
    }

    add(events) {
        if (Array.isArray(events)) {
            events.forEach(e => this._addEvent(e));
        } else {
            this._addEvent(events);
        }
    }

    _addEvent(event) {
        this.events.push(event);

        if (this.state === state.RUNNING || this.state === state.PAUSED) {
            let playingTime = new Date().getTime() - this.startTime.getTime();
            playingTime += this.elapsedTime;

            const delay = event.delay - playingTime;
            if (delay > 0) {
                event.play(delay);
            }
        }
    }

    removeEvent(label) {
        const deletedEvents = this.events.filter(e => e.label === label);
        deletedEvents.forEach(e => e.stop());
        this.events = this.events.filter(e => e.label !== label);
    }

    play() {
        if (this.state === state.RUNNING || this.state === state.PAUSED) {
            throw new Error(`play failed. Timeline ${this.name} already running in state ${this.state}`);
        }

        this.state = state.RUNNING;
        this.elapsedTime = 0;
        this.startTime = new Date();
        this.events.forEach(e => e.play());
    }

    pause() {
        if (this.state === state.STOPPED) {
            return; // something else stopped it (like last event fired and called timeline.stop()
        }
        if (this.state !== state.RUNNING) {
            throw new Error(`pause failed. Timeline ${this.name} is not running. Current state ${this.state}`);
        }

        this.state = state.PAUSED;
        this.pausedTime = new Date();
        this.elapsedTime += this.pausedTime.getTime() - this.startTime.getTime();
        this.unplayedEvents().forEach(e => e.pause());
    }

    resume() {
        if (this.state !== state.PAUSED) {
            throw new Error(`resume failed. Timeline ${this.name} isn't paused. Current state ${this.state}`);
        }
        this.state = state.RUNNING;
        this.startTime = new Date();
        this.unplayedEvents().forEach(e => e.resume(this.elapsedTime));
    }

    stop() {
        if (this.state !== state.RUNNING && this.state !== state.PAUSED) {
            throw new Error(`stop failed. Timeline ${this.name} is not running. Current state ${this.state}`);
        }
        this.elapsedTime += new Date().getTime() - this.startTime.getTime();
        this.state = state.STOPPED;
        this.events.forEach(e => e.stop());
    }

    setTimeScale(scale) {
        this.timeScale = scale;
    }

    unplayedEvents() {
        return this.events.filter(e => e.played === false);
    }

}

module.exports = { Timeline, TimelineEvent };

