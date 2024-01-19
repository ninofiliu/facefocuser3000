import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "./main.css";

import * as faceDetection from "@tensorflow-models/face-detection";

const x = <T>(value: T | null | undefined): T => {
  if (value == null) throw new Error("should not be nullish");
  return value;
};

// 0 rightEye
// 1 leftEye
// 2 noseTip
// 3 mouthCenter
// 4 rightEarTragion
// 5 leftEarTragion

(async () => {
  const videos = Array(2)
    .fill(null)
    .map(() => document.createElement("video"));

  videos[0].src = "/vids/bowie.webm";
  videos[0].autoplay = true;
  videos[0].loop = true;
  videos[0].muted = true;

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videos[1].srcObject = stream;
  videos[1].muted = true;
  await videos[1].play();
  const width = videos[1].videoWidth;
  const height = videos[1].videoHeight;

  const debugCanvas = document.createElement("canvas");
  debugCanvas.style.transform = "scaleX(-1)";
  document.body.append(debugCanvas);
  debugCanvas.width = width;
  debugCanvas.height = height;
  const debug = x(debugCanvas.getContext("2d"));

  const outCanvas = document.createElement("canvas");
  document.body.append(outCanvas);
  outCanvas.width = width;
  outCanvas.height = height;
  const out = x(outCanvas.getContext("2d"));

  const faceDetector = await faceDetection.createDetector(
    faceDetection.SupportedModels.MediaPipeFaceDetector,
    {
      runtime: "mediapipe",
      solutionPath: "/pkgs/@mediapipe/face_detection",
    }
  );

  let f = 0;
  const loop = async () => {
    // const video = videos[Math.floor(f / 60) % 2];
    let video = videos[1];
    let faces = await faceDetector.estimateFaces(video);
    if (!faces.length) {
      video = videos[0];
      faces = await faceDetector.estimateFaces(video);
    }

    debug.drawImage(video, 0, 0);
    for (const face of faces) {
      debug.strokeStyle = "lime";
      debug.strokeRect(
        face.box.xMin,
        face.box.yMin,
        face.box.width,
        face.box.height
      );
      debug.fillStyle = "aqua";
      for (const { x, y } of face.keypoints) {
        debug.fillRect(x - 2, y - 2, 5, 5);
      }
    }

    const [face] = faces;
    if (face) {
      out.drawImage(
        video,
        face.box.xMin,
        face.box.yMin,
        face.box.width,
        face.box.height,
        0,
        0,
        out.canvas.width,
        out.canvas.height
      );
    }

    requestAnimationFrame(loop);
    f++;
  };
  loop();
})();
