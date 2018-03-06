let stream = require('stream')
module.exports = new stream.Transform({
    /*** inside this transform `this` refers to the response stream ***/
    objectMode: true,
    transform: function(chunk, encoding, done){
        if(chunk.constructor == String){
            // send strings as comments, used for heartbeat
            this.push(`:${chunk}\n\n`) 
        } else {
            // send events as key name
            // receiving eventsource will need to attach 
            // event listeners to all possible object keys 
            // in order to react to named events. 
            // stdout/stderr/error/exit-code is a good place to start
            this.push(Object.keys(chunk).map(key =>
                `event:${key}\n`
              + `data:${JSON.stringify(chunk[key])}\n`).join('\n')
              + '\n')
        }
        done()
    }
})
