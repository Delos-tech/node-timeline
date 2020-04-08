


class Timeline {

    constructor({name}) {
        this.name = name;
        this.startTime = null;
        this.timeScale = 1;
        this.events = [];
        this.fixedStartTime = false;  // probably don't want this.
    }
}


module.exports=Timeline;
