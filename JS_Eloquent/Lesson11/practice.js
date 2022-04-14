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

function storage(nest, name){
    return new Promise(resolve => {
        nest.readStorage(name, result => resolve(result));
    });
}

// storage(bigOak, "enemies")
//     .then(value => console.log("Got", value));

const Timeout = class Timeout extends Error {}

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
    defineRequestType(name, (nest, content, source, callback) => {
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

  function availableNeighbors(nest) {
    let requests = nest.neighbors.map(neighbor => {
      return request(nest, neighbor, "ping")
        .then(() => true, () => false);
    });
    return Promise.all(requests).then(result => {
      return nest.neighbors.filter((_, i) => result[i]);
    });
  }
  availableNeighbors(bigOak);

  bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM", () => console.log("Note delivered"));
  console.log(request("Cow Pasture", "Church Tower-Big Maple", "ping", "Let's caw loudly at 7PM"));

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
    broadcastConnections(nest, name, source);b 
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

  findInStorage(bigOak, "events on 2017-12-21")
  .then(console.log);