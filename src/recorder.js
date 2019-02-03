import React, {Component} from 'react';

class Recorder extends Component{

  startVid = ()=> {
    const constraints = {
      video: true,
      audio: true
    };

    window.video = document.querySelector('video#record');

    navigator.mediaDevices.getUserMedia(constraints).
      then((stream) => {
        window.video.srcObject = stream;
        window.stream = stream;
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
    window.mediaRecorder.stop();
    let srcVid = new Blob(window.recordedBlobs, {type: 'video/webm'});
    let thumbVid = new Blob(
      [window.recordedBlobs[0],window.recordedBlobs[1]],
      {type: 'video/webm'}
      );
    let src = window.URL.createObjectURL(srcVid);
    let thumbnail = window.URL.createObjectURL(thumbVid);
    this.props.updateList({src, thumbnail});
  }
  componentDidMount() {
    this.startVid();
  }

  render() {
    return(
      <div>
        <button onClick={this.startRecording}>Record</button>
        <button onClick={this.stopRecording}>Stop</button>
        </div>
    )
  }
}

export default Recorder;