const TimelineEvent = require('./timeline-event');

class Timeline {

    constructor(name) {
        this.name = name;
        this.startTime = null;
        this.timeScale = 1;
        this.events = [];
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
        this.events.forEach(e => e.play());
    }

    pause() {

    }

    resume() {

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

}

module.exports = Timeline;

const tl = new Timeline('t1');


