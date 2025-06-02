const video = document.getElementById('video');


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    });
}

let expressionData = {};

// Check every 2 seconds
setInterval(async () => {
  const detections = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions()
    .withFaceLandmarks();

  if (detections) {
    const expressions = detections.expressions;

    expressionData = {
      neutral: expressions.neutral,
      happy: expressions.happy,
      sad: expressions.sad,
      angry: expressions.angry,
      fearful: expressions.fearful,
      surprised: expressions.surprised,
      disgusted: expressions.disgusted
    };
  }
}, 2000);
