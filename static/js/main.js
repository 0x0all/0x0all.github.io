var capture_stream = null;
var media_recorder = null;
var chunks = [];
var recording = null;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const start_screen_capture = async () => {
    capture_stream = await navigator.mediaDevices.getDisplayMedia();
    media_recorder = new MediaRecorder(capture_stream, {mimeType: 'video/webm'});
    media_recorder.addEventListener("dataavailable", (event) => {
        if(event.data && event.data.size > 0) {
            chunks.push(event.data);
        }
    });
    let time_to_start = 3;
    let start_record = setInterval(() => {
        document.getElementById("countdown").src = `static/img/${time_to_start}.png`
        if (time_to_start == 0) {
            document.getElementById("countdown").src = `static/img/stop.png`
            media_recorder.start(10);
            clearInterval(start_record);
        }
        time_to_start = time_to_start - 1;
    }, 1000);
}

const stop_screen_capture = () => {
    media_recorder.stop();
    media_recorder = null;
    capture_stream.getTracks().forEach(track => track.stop());
    capture_stream = null;
    recording = window.URL.createObjectURL(new Blob(chunks, {type: 'video/webm'}));
    document.getElementById("video").src = recording;
    document.getElementById("video").style.display = "block";
    document.getElementById("download").src = "static/img/download.png";
    document.getElementById("download").addEventListener("click", () => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = recording;
        a.download = "recording.webm";
        a.click();
    });
}

document.getElementById("countdown").addEventListener("click", () => {
    document.getElementById("countdown").src = "";
    document.getElementById("main_el").style.paddingLeft = "20%";
    document.getElementById("main_el").style.paddingRight = "20%";
    stop_screen_capture();
});

document.addEventListener("DOMContentLoaded", () => {
    start_screen_capture();
});


/*

  async _startCapturing(e) {
    this.chunks = [];
    this.recording = null;
    this.stream = await ScreenSharing._startScreenCapture();
    this.stream.addEventListener('inactive', e => {
      console.log('Capture stream inactive - stop recording!');
      this._stopCapturing(e);
    });
    this.status = '3';
    await sleep(1000);
    this.status = '2';
    await sleep(1000);
    this.status = '1';
    await sleep(1000);
    this.status = 'Active';

    this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
    this.mediaRecorder.addEventListener('dataavailable', event => {
      if (event.data && event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });
    this.mediaRecorder.start(10);
  }

  _stopCapturing(e) {
    console.log('Stop capturing.');
    this.status = 'Complete!';
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = true;

    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.stream.getTracks().forEach(track => track.stop());
    this.stream = null;

    this.recording = window.URL.createObjectURL(new Blob(this.chunks, {type: 'video/webm'}));
  }

  _downloadRecording(e) {
    console.log('Download recording.');
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = false;

    const downloadLink = this.shadowRoot.querySelector('a#downloadLink');
    downloadLink.addEventListener('progress', e => console.log(e));
    downloadLink.href = this.recording;
    downloadLink.download = 'screen-recording.webm';
    downloadLink.click();
  }


*/