const bigOak = require("./crow-tech").bigOak;
 
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

import { defineRequestType } from "./crow-tech";


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

const everywhere = require("./crow-tech").everywhere;

everywhere(nest => {
    nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null){
    nest.state.gossip.push(message);
    for (let neighbors of nest.neighbors){
        if(neighbor == exceptFor) continue;
        request(nest, neighbors, "gossip", message);
    }
}

// requestType("gossip", (nest, message, source) => {
//     if(nest.state.gossip.includes(message)) return;
//     console.log(`${nest.name} received gossip '${message}' from ${source}`);
//     sendGossip(nest, message, source);
// });
