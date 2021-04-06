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
        this.nextEvent = 0;
    }

    clear() {
        if (this.state === state.RUNNING || this.state === state.PAUSED) {
            this.stop();
        }
        this.elapsedTime = 0;
        this.nextEvent = 0;
        this.events = [];
    }

    add(events) {
        // todo support for adding while running?
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

            const fireTime = event.fireTime - playingTime;
            if (fireTime > 0) {
                event.play(fireTime);
            }
        }
    }

    removeEvent({label, time}) {
        if (label) {
            const deletedEvents = this.events.filter(e => e.label === label);
            deletedEvents.forEach(e => e.stop());
            this.events = this.events.filter(e => e.label !== label);
        }
        if (time) {
            const deletedEvents = this.events.filter(e => e.time === time);
            deletedEvents.forEach(e => e.stop());
            this.events = this.events.filter(e => e.time !== time);
        }
    }

    // TODO think about the semantics here. Play always is from the start?
    play() {
        if (this.state === state.RUNNING || this.state === state.PAUSED) {
            throw new Error(`play failed. Timeline ${this.name} already running in state ${this.state}`);
        }

        this.nextEvent = 0;
        this.state = state.RUNNING;
        this.elapsedTime = 0;
        this.startTime = new Date();
        this.events[this.nextEvent].play();
    }

    pause() {
        if (this.state === state.STOPPED) {
            return; // something else stopped it (like last event fired and called timeline.stop()
        }
        if (this.state !== state.RUNNING) {
            throw new Error(`pause failed. Timeline ${this.name} is not running. Current state ${this.state}`);
        }

        this.state = state.PAUSED;
        this.pausedTime = new Date().getTime() - this.startTime.getTime();
        this.events[this.nextEvent].pause();
    }

    resume() {
        if (this.state !== state.PAUSED) {
            throw new Error(`resume failed. Timeline ${this.name} isn't paused. Current state ${this.state}`);
        }
        this.state = state.RUNNING;
        this.startTime = new Date();
        this.unplayedEvents().forEach(e => e.resume(this.pausedTime));
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

    scheduleNextEvent() {
        if (this.nextEvent >= this.events.length-1 ) {
            // done
            // console.log(`done`);
        } else {
            this.elapsedTime += this.events[this.nextEvent].fireTime;
            this.nextEvent++;
            const event = this.events[this.nextEvent];
            const relativeFiretime = event.fireTime - this.events[this.nextEvent-1].fireTime;
            this.events[this.nextEvent].play(relativeFiretime);
        }

    }

}

module.exports = { Timeline, TimelineEvent };

