import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Session from './Session';
import Conf from './Conf';
import './App.css';


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;  
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (regions) => {    
    const clarifaiFace = regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    let boundingBoxes = [];
    if (regions.length)
    {
      regions.forEach(region => {
        const clarifaiBox = region.region_info.bounding_box;
        const boundingBox = {
          leftCol: clarifaiBox.left_col * width,
          topRow: clarifaiBox.top_row * height,
          rightCol: width - (clarifaiBox.right_col * width),
          bottomRow: height - (clarifaiBox.bottom_row * height)
        }
        boundingBoxes.push(boundingBox);
      })
    }
    return boundingBoxes;
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    fetch(`${Conf.server}/image`, {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id,
        url: this.state.input
      })
    })
    .then(response => response.json())
    .then(data => {
        this.setState(Object.assign(this.state.user, { entries: data.entries}))
        this.displayFaceBoxes(this.calculateFaceLocation(data.regions))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {      
      this.setState(initialState);
      route = 'signin';		
      Session.del().then(console.log);
    } else if (route === 'home') {
      Session.set(this.state.user.id); //set current id to session
      this.setState({isSignedIn: true})
    } 
    this.setState({route: route});
  }

componentDidMount() {
  //Check if we are already logged (session)
  Session.get().then(userID => {
    if (userID) {
      fetch(`${Conf.server}/profile/${userID}`)
      .then(response => response.json())
      .then(userData => {
        if (userData.id){
          this.loadUser(userData);
          this.setState({isSignedIn: true});
          this.setState({ route: 'home' });
          console.log('Session data:',userData)
        } else {
          console.log('Session data/fault:',userData)
        }       
      })
      .catch(err => {
        console.log('Session error:',err);
      });
    } else {
      console.log('Session user id:', Session.userID);
    }
  });
}

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
