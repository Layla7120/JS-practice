// Add dependencies and exports

const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];

// let graph = require("graph");
// let roadgraph = new graph.Graph();

// const buildGraph = function (roads) {
//     for (let r of roads){
//         places = r.split("-");
//         roadgraph.set(places[0], places[1]);
//     }
// };

// buildGraph(roads);
// console.log(roadgraph);

//이렇게 하는게 아니군 
const {buildGraph} = require("./graph");
exports.roadGraph = buildGraph(roads.map(r => r.split("-")));
console.log(this.roadGraph);