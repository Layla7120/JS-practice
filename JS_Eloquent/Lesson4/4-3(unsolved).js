//list라는 자료구조 
function Node(data){
    this.data = data;
    this.next = null;
}

function LinkedList() {
    this.size= 0;
    this.head = null;
}
LinkedList.append = function(data){
    let node = new Node(data);
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

    this.size++;
}

const arrayToList = (arr) => {
    let list = new LinkedList();
    for(let i = 0; i < arr._length; i++){
        console.log(arr[i]);
        list.append(arr[i]);
    }
    return list
}

console.log(arrayToList([1, 2, 3]));