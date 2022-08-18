var capture_stream = null;
var media_recorder = null;
var chunks = [];
var recording = null;

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

document.getElementById("begin").onclick = async () => {
  const displayMediaOptions = {
    video: {
      cursor: "never",
    },
    audio: true,
  };

  try {
    capture_stream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error("Error: " + err);
  }

  media_recorder = new MediaRecorder(capture_stream, {
    mimeType: "video/webm;codecs=vp9",
  });
  media_recorder.addEventListener("dataavailable", (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  });
  let time_to_start = 3;
  let start_record = setInterval(() => {
    document.getElementById(
      "countdown"
    ).src = `static/img/${time_to_start}.png`;
    if (time_to_start == 0) {
      document.getElementById("countdown").src = `static/img/stop.png`;
      media_recorder.start(10);
      clearInterval(start_record);
    }
    time_to_start = time_to_start - 1;
  }, 1000);
};

const stop_screen_capture = () => {
  media_recorder.stop();
  media_recorder = null;
  capture_stream.getTracks().forEach((track) => track.stop());
  capture_stream = null;
  recording = window.URL.createObjectURL(
    new Blob(chunks, { type: "video/webm" })
  );
  document.getElementById("video").src = recording;
  document.getElementById("video").style.display = "block";
  document.getElementById("download").style.visibility = "visible";
  document.getElementById("download").addEventListener("click", () => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = recording;
    a.download = "recording.webm";
    a.click();
  });
};

document.getElementById("countdown").addEventListener("click", () => {
  document.getElementById("countdown").src = "";
  stop_screen_capture();
});
