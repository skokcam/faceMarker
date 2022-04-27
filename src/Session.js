//This is the class that deals with session "UserId" 
import Conf from "./Conf";

//When backend and frontend are hosted on different server cookies dont work
//So we are using browser's 'sessionStorage' which lasts till browser is closed
//We can also use browser's 'localStorage' which lasts indefinetely till erased
const Session = new class session {
  
  constructor() {
    this.storageKey = 'fr_app_userid';
    this.userID = null;    
  }

  get = () => {
    if (!this.userID) {
      this.userID = sessionStorage.getItem(this.storageKey);
    }
    //returning promise in order to stay compliant with previous session management
    return Promise.resolve(this.userID);
  }

  set = (userID) => {
    const oldID = this.userID;
    this.userID = userID;
    sessionStorage.setItem(this.storageKey, userID);
    return Promise.resolve(oldID);
  }

  del = () => {
    const oldID = this.userID;
    sessionStorage.removeItem(this.storageKey);
    this.userID = null;
    //returning promise in order to stay compliant with previous session management
    return Promise.resolve(oldID);
  }
}
/*
const Session = new class session {
    constructor(){
        this.userID = undefined;
    }

    get = async () => {
        if (this.userID === undefined) {
            try {                
                const response = await fetch(`${Conf.server}/session`, {
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
                const response = await fetch(`${Conf.server}/signout`, {
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
*/
export default Session;