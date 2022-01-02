//list라는 자료구조 
function Node(data){
    this.data = data;
    this.next = null;
}

const LinkedList = function(){
    let _length = 0;
    let _head = null;
}

LinkedList.appendNode = function(data){
    const node = new Node(data);
    if(this._head == null){
        this._head = node;
    }
    else{
        let curr = this._head;

        while(curr.next){
            curr = curr.next;
        }

        curr.next = node;
    }

    this._length++;
}

const arrayToList = (arr) => {
    const list = new LinkedList();
    for(let i = 0; i <  arr._length; i++){
        list.appendNode(arr[i]);
    }
    return list
}

console.log(arrayToList([1, 2, 3])._length)