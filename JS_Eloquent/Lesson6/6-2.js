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

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false