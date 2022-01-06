var roads = [
"Alice's House-Bob's House",   "Alice's House-Cabin",
"Alice's House-Post Office",   "Bob's House-Town Hall",
"Daria's House-Ernie's House", "Daria's House-Town Hall",
"Ernie's House-Grete's House", "Grete's House-Farm",
"Grete's House-Shop",          "Marketplace-Farm",
"Marketplace-Post Office",     "Marketplace-Shop",
"Marketplace-Town Hall",       "Shop-Town Hall"
];

function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if (graph[from] == null) {
        graph[from] = [to];
        } else {
        graph[from].push(to);
        }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
}

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
        return this;
        } else {
        let parcels = this.parcels.map(p => {
            if (p.place != this.place) return p;
            return {place: destination, address: p.address};
        }).filter(p => p.place != p.address);
        return new VillageState(destination, parcels);
        }
    }
}
 
let first = new VillageState("Post Office", [{ place: "Post Office", address: "ALice's House" }]);
let next = first.move("Alice's House");

// console.log(next.place);
// console.log(next.parcels);
// console.log(first.place);

function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory); //엥?
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

//complete random robot
function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
}

//generates parcels
VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
        place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
};

// runRobot(VillageState.random(), randomRobot);

const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

//makes route according to mailRoute
function routeRobot(state, memory) {
    if (memory.length == 0) {
        memory = mailRoute;
    }
    return {direction: memory[0], memory: memory.slice(1)};
}

// runRobot(VillageState.random(), routeRobot, []);

//find route from every points
function findRoute(graph, from, to) {
    let work = [{at: from, route: []}];
    for (let i = 0; i < work.length; i++) {
        let {at, route} = work[i];
        for (let place of graph[at]) {
            if (place == to) {
                return route.concat(place);
            }
            if (!work.some(w => w.at == place)) { 
                work.push({at: place, route: route.concat(place)});
            }
        }
    }
}

function goalOrientedRobot({place, parcels}, route) {
    if (route.length == 0) {
        let parcel = parcels[0];
        //찾으러 가는 길
        if (parcel.place != place) {
            route = findRoute(roadGraph, place, parcel.place);
        
        }
        //배달하는 길 
        else {
            route = findRoute(roadGraph, place, parcel.address);
        }
    }
    return {direction: route[0], memory: route.slice(1)};
}

//택배 부치는 데 다 돌고 목적지 돌기
// function myBetterRobot({place, parcels}, route) {
//     console.log(parcels.sort());
     
// }



function countTurns(state, robot, memory){
    let turn = 0
    for (turn;; turn++) {
        if (state.parcels.length == 0) {
            break;
        }
        let action = robot(state, memory); 
        state = state.move(action.direction);
        memory = action.memory;
    }
    return turn;
}

function compareRobots(robot1, memory1, robot2, memory2) {
    let sameVillageState = VillageState.random(100);
    let robot1Count = countTurns(sameVillageState, robot1, memory1);
    let robot2Count =countTurns(sameVillageState, robot2, memory2)
    console.log(robot1Count, robot2Count);
}

//7-1
// compareRobots(routeRobot, [], goalOrientedRobot, []);

//7-2 
// compareRobots(routeRobot, [], myBetterRobot, []);
