const EventEmitter = require('events');

class Scheduler extends EventEmitter {
    constructor(  startTime ) {
        super();
        this.startTime = startTime;
    }

    start() {
        this.stop();

        let lastCheck = process.hrtime();
        let lastExecution = new Date();

        var fireEvent = () => {
            // const delay = this.resolution;
            // const elapsedTime = process.hrtime(lastCheck);
            // const elapsedMs = (elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e6;

            var date = new Date();
            // var date = new Date(new Date().getTime() - i * 1000);
            this.emit('scheduled-time-matched', date);
            // adjust date to resolution
            lastExecution = new Date();

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
