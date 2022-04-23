//This is the class that deals with session "UserId" 

const UserId = new class userId {
    constructor(){
        this.userID = undefined;
    }

    get = async () => {
        if (this.userID === undefined) {
            try {                
                const response = await fetch('http://localhost:3000/session', {
                    method: 'get',
                    headers: {'Content-Type': 'application/json'},               
                    });
                const data = await response.json();
                if (data.id) {
                    this.set(data.id);
                    return(data.id);
                }
            } catch (err) {
                console.log('Error:',err);
            }
        }
        return Promise.resolve(this.userID);  
    }
    
    set = (userID) => {
        this.userID = userID;
        return this.userID;
    }

    del = async () => {
        if (this.userID !== undefined) {            
            try {
                const response = await fetch('http://localhost:3000/signout', {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                this.userID = undefined;
                return (data);
            } catch (err) {
                console.log('Error:', err);
            }            
        } else {
            return(Promise.resolve(this.userID));
        }        
    }
};

export default UserId;