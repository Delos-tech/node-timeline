# Node Timeline

The node-timeline module is tiny timeline event scheduler in pure JavaScript for node.js inspired by [node-cron](http://github.com/node-cron/node-cron). This module allows you to schedule timeline events in node.js.


---
## Todo
1. Support event insertion into random places in the timeline. ie After the event labeled 'sunset'
---
## Getting Started

Install node-timeline using npm:

```console
$ npm install --save delos/node-timeline#master
```

Import node-timeline and schedule a task:

```javascript
const Timeline = require('node-timeline');


```

## Timeline Syntax

This is a quick reference to timeline event syntax and also shows the options supported by node-timeline.

### Start Time options

|     type     |        value        | Description |
|--------------|---------------------|--------------
|    number    |   posiive number    | Absolute time from timeline starting time.
|    string    |       '+[number]'   | Relative time from previous event firing time.


## Timeline methods

### setTimescale

Timelines can be run at 'real' time or at a different time scale. Default value is 1. Setting the timescale to 2 would run the timeline twice as fast. 0.5 twice as slow. 4 would run at 4x.

Arguments:

- **number** `number`: Timescale

 **Example**:

 ```js
  const {Timeline, TimelineEvent} = require('node-timeline');
  
  const name = 'Timescale test';

  const timeline = new Timeline({name});

  function hello() {console.log("Hi!")}

  const event = new TimelineEvent({label: 'e1', startTime: 10, func: hello})

  timeline.add(event);
  
  timeline.play(); // displays Hi! after 10 seconds
  timeline.setTimescale(2);
  timeline.play(); // displays Hi! after 5 seconds
  
 ```

## TimelineEvent methods

### S foo

```javascript
// example
```


## Issues

Feel free to submit issues and enhancement requests [here](https://github.com/delos/node-timeline/issues).

## Contributing

In general, we follow the "fork-and-pull" Git workflow.

 - Fork the repo on GitHub;
 - Commit changes to a branch in your fork;
 - Pull request "upstream" with your changes;

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

Please do not contribute code you did not write yourself, unless you are certain you have the legal ability to do so. Also ensure all contributed code can be distributed under the ISC License.

## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/delos/node-timeline/graphs/contributors"><img src="https://opencollective.com/node-timeline/contributors.svg?width=890&button=false" /></a>






## License

node-cron is under [ISC License](https://github.com/merencia/node-cron/blob/master/LICENSE.md).
