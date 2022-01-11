const bigOak = require("./crow-tech").bigOak;
const defineRequestType = require("./crow-tech").defineRequestType;

defineRequestType("note", (nest, content, source, done) => {
    console.log(`${nest.name} received note: ${content}`);
    done();
  });

// bigOak.readStorage("food caches", caches => {
//     let firstCache = caches[0];
//     bigOak.readStorage(firstCache, info => {
//         console.log(info);
//     })
// })

// function storage(nest, name){
//     return new Promise(resolve => {
//         nest.readStorage(name, result => resolve(result));
//     });
// }

// storage(bigOak, "enemies")
//     .then(value => console.log("Got", value));

class Timeout extends Error {}

bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM", () => console.log("Note delivered"));

function request(nest, target, type, content){
    return new Promise((resolve, reject) => {
        let done = false;
        function attempt(n){
            nest.send(target, type, content, (failed, value)=> {
                done = true;
                if (failed) reject(failed);
                else resolve(value);
            });
        setTimeout(() => {
            if(done) return;
            else if( n < 3 ) attempt(n + 1);
            else reject(new Timeout("Timed out"));
        }, 250);
    }
    attempt(1);
    })
}
  function requestType(name, handler) {
    defineRequestType(name, (nest, content, source,callback) => {
      try {
        Promise.resolve(handler(nest, content, source))
          .then(response => callback(null, response),
                failure => callback(failure));
      } catch (exception) {
        callback(exception);
      }
    });
  }

  requestType("ping", () => "pong");

  const everywhere = require("./crow-tech").everywhere;

  everywhere(nest => { nest.state.gossip = []; });
  
  function sendGossip(nest, message, exceptFor = null) {
    nest.state.gossip.push(message);
    for (let neighbor of nest.neighbors) {
      if (neighbor == exceptFor) continue;
      request(nest, neighbor, "gossip", message);
    }
  }
  
  requestType("gossip", (nest, message, source) => {
    if (nest.state.gossip.includes(message)) return;
    console.log(`${nest.name} received gossip '${message}' from ${source}`);
    sendGossip(nest, message, source);
  });
  
  requestType("connections", (nest, {name, neighbors}, source) => {
    let connections = nest.state.connections;
    if (JSON.stringify(connections.get(name)) ==
        JSON.stringify(neighbors)) return;
    connections.set(name, neighbors);
    broadcastConnections(nest, name, source);
  });
  
  function broadcastConnections(nest, name, exceptFor = null) {
    for (let neighbor of nest.neighbors) {
      if (neighbor == exceptFor) continue;
      request(nest, neighbor, "connections", {
        name,
        neighbors: nest.state.connections.get(name)
      });
    }
  }
  
  everywhere(nest => {
    nest.state.connections = new Map();
    nest.state.connections.set(nest.name, nest.neighbors);
    broadcastConnections(nest, nest.name);
  });
