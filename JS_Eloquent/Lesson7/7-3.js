class PGroup{
    constructor(values){
        this.group = values;
    }

    add(value){
        if(this.has(value)) return this;
        return new PGroup(this.group.concat([value]));
    }

    delete(value){
        if(!this.has(value)) return this;
        return new PGroup(this.group.filter(g => g !== value));
    }

    has(value){
        return this.group.includes(value)
    }
}

 //해설봄
 PGroup.empty = new PGroup([]);

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(a, ab, b);
console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false