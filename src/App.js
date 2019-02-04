import React, { Component } from 'react';
import './styles/App.css';
import Recorder from './components/Recorder/Recorder'

class App extends Component {
  state = {
    vidList: [],
    currentlyPlaying: ""
  }

  updateList = (media, index)=> {
    let vidList = [...this.state.vidList];
    if(index) {
      vidList.splice(index,1);
    }
    else {
      vidList.push(media);
    }
    this.setState({ vidList });
    window.localStorage.setItem("vidList", JSON.stringify(vidList));
  }

  showVid = (src)=> {
    this.setState({
      currentlyPlaying: src
    });
  }
  
  render() {
    return (
      <div className="App">
      <header>
      Capture & Play
      </header>
        <div className="recorder-wrap">
          <div><p>Live Video</p>
            <video id="record" autoPlay></video>
          </div>
          <div><p>Recorded Video</p>
            <video id="play" src={this.state.currentlyPlaying} autoPlay controls></video>
          </div>
        </div>
        <Recorder updateList={this.updateList} />
        <hr />
        <p>Recorded Video List</p>
        <div className="list-wrap">
        {this.state.vidList && this.state.vidList.map((media, index)=> (
          <div key={media.thumbnail} className="thumbnail">
            <video src={media.thumbnail} onClick={()=>this.showVid(media.src)}></video>
            <button onClick={()=>{this.updateList(media,index)}}>Delete</button>
          </div>
        ))}
        </div>
      </div>
    );
  }
}

export default App;
