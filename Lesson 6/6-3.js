class Group{
    constructor(){
        this.group = [];
    }

    //정적 매소드는 클래스의 생성자에 저장되는 매서드
    static from(iterator){
        let group = new Group();
        for (let value of iterator){
            group.group.push(value);
        }
        return group;
    }

    //해설은 has 사용
    add(value){
        if(!this.group.includes(value)){
            this.group.push(value);
        }
    }
 
    //해설은 filter 사용
    delete(value){
        if(this.group.includes(value)){
            let index = this.group.indexOf(value);
            this.group.splice(index, 1);
        }
    }
   
    has(value){
        return this.group.includes(value)
    }
}

function GroupIterator(group){
    let i = 0;
    return{
        next: function(){
            const done = (i >= group.group.length);
            const value = !done ? group.group[i++] : undefined;
            return{ done: done, value: value};
        }
    };
}

Group.prototype[Symbol.iterator] = function(){
    return new GroupIterator(this);
};

for (let value of Group.from(["a", "b", "c"])) {
    console.log(value);
  }
  // → a
  // → b
  // → c