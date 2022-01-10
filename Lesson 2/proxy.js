const validateAge = {
    set: function(object, property, value){
        if(property === 'age'){
            if(value < 18){
                throw new Error('you are too young');
            }
            else{
                object[property] = value;
                return true;
            }
        }
    }
};
const user = new Proxy({}, validateAge);

user.age = 21;
console.log(user.age);