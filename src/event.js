


class TimelineEvent {

    constructor({label, startTime, func, funcParams}) {
        this.label = label;
        this.startTime = startTime;
        this.func = func;
        this.funcParams = funcParams;
    }

}


module.exports=TimelineEvent;
