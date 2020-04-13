const EventEmitter = require('events');

class Scheduler extends EventEmitter {
    constructor(  startTime ) {
        super();
        this.startTime = startTime;
    }

    start() {
        this.stop();

        var fireEvent = () => {
            var date = new Date();
            this.emit('scheduled-time-matched', date);
        };
        this.timeout = setTimeout(fireEvent, this.startTime);
    }

    stop() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = null;
    }
}


module.exports = Scheduler;
