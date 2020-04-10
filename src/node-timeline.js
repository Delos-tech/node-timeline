const TimelineEvent = require('./timeline-event');

class Timeline {

    constructor(name) {
        this.name = name;
        this.startTime = null;
        this.pausedTime = null;
        this.timeScale = 1;
        this.events = [];
        this.totalElapsedPlayingTime = 0;
    }


    addEvent(event, position) {
        this.events.push(event);
        event.setTimescale(this.timeScale);
    }

    removeEvent(label) {
        const deletedEvents = this.events.filter(e => e.label === label);
        deletedEvents.forEach(e => e.stop());
        this.events = this.events.filter(e => e.label !== label);
    }

    play() {
        this.startTime = new Date();
        this.events.forEach(e => e.play());
    }

    pause() {
        this.pausedTime = new Date();
        this.totalElapsedPlayingTime += this.pausedTime.getTime() - this.startTime.getTime();
        this.events.forEach(e => e.pause());
    }

    resume() {
        this.startTime = new Date();
        this.unplayedEvents().forEach(e => e.resume(this.totalElapsedPlayingTime));
    }

    stop() {
        this.events.forEach(e => e.stop());
    }

    setTimeScale(scale) {
        this.timeScale = scale;
        this.events.forEach(e => e.setTimescale(scale));

    }

    kill() {
        this.stop();
    }

    unplayedEvents() {
        const upe =  this.events.filter(e => e.played === false);
        return upe;
    }

}

module.exports = {Timeline, TimelineEvent};

