import React, {Component} from 'react';
import './Record.css';
class Recorder extends Component{
  state = {
    recording: false
  }

  startVid = ()=> {
    const constraints = {
      video: true,
      audio: true
    };

    window.video = document.querySelector('video#record');

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        window.video.srcObject = stream;
        window.stream = stream;
      })
      .catch(err=>{
        switch(err.code) {
          case 0:
            alert("We need your camera and microphone permissions");
            break;
          case 8:
            alert("You don't have a camera/microphone attached to your system");
            break;
          default:
            alert("Couldn't get your media devices");
        }
        console.log(err);
      });
  }
  stopVid = ()=> {
    if (window.stream) {
      window.stream.getTracks().forEach(track=> {
        track.stop();
      });
    }
  }
  handleDataAvailable = (event)=> {
    if (event.data && event.data.size > 0) {
      window.recordedBlobs.push(event.data);
    }
  }
  startRecording=()=> {
    this.setState({ recording: true });
    var options = {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000};
    window.recordedBlobs = [];
    try {
      window.mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e0) {
      console.log('Unable to create MediaRecorder with options Object: ', options, e0);
      try {
        options = {mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000};
        window.mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e1) {
        console.log('Unable to create MediaRecorder with options Object: ', options, e1);
        try {
          options = 'video/mp4';
          window.mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e2) {
          this.setState({ recording: false });
          alert('Not supported by this browser.');
          console.error('Exception while creating MediaRecorder:', e2);
          return;
        }
      }
    }
    window.mediaRecorder.ondataavailable = this.handleDataAvailable;
    window.mediaRecorder.start(10); // collect 10ms of data
  }

  stopRecording=()=> {
    this.setState({ recording: false });
    window.mediaRecorder.stop();
    let srcVid = new Blob(window.recordedBlobs, {type: 'video/webm'});
    let thumbVid = new Blob(
      [window.recordedBlobs[0],window.recordedBlobs[1]],
      {type: 'video/webm'}
      );
    srcVid = new File([srcVid], Date.now(), {type: 'video/webm', lastModified: Date.now()});
    thumbVid = new File([thumbVid], Date.now(), {type: 'video/webm', lastModified: Date.now()});
    let src = window.URL.createObjectURL(srcVid);
    let thumbnail = window.URL.createObjectURL(thumbVid);
    this.props.updateList({src, thumbnail});
  }
  componentDidMount() {
    this.startVid();
  }

  render() {
    return(
      <div className="record-btn-wrap">
        <button onClick={this.startRecording} disabled={this.state.recording}>Record</button>
        <button onClick={this.stopRecording} disabled={!this.state.recording}>Stop</button>
      </div>
    )
  }
}

export default Recorder;