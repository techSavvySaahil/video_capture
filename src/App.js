import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Recorder from './recorder'

class App extends Component {
  state = {
    vidList: [],
    currentlyPlaying: ""
  }
  updateList = (media)=> {
    this.setState((prevState)=> ({
      vidList: [...prevState.vidList, media]
    }))
  }
  showVid = (src)=> {
    this.setState({
      currentlyPlaying: src
    });
  }
  
  render() {
    return (
      <div className="App">
        <div style={{display:"flex"}}>
          <video id="record" autoPlay></video>
          <video id="play" src={this.state.currentlyPlaying} autoPlay controls></video>
        </div>
        <Recorder updateList={this.updateList} />
        <div style={{display:"flex", flexWrap:"wrap"}}>
        {this.state.vidList && this.state.vidList.map(media=> (
            <video style={{width:"100px", height:"100px"}} key={media.thumbnail} src={media.thumbnail} onClick={()=>this.showVid(media.src)}></video>
        ))}
        </div>
      </div>
    );
  }
}

export default App;
