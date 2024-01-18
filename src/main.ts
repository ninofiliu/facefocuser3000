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
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  video.srcObject = stream;
  await video.play();
  const width = video.videoWidth;
  const height = video.videoHeight;
  //   document.body.append(video);

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

  const loop = async () => {
    const faces = await faceDetector.estimateFaces(video);

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
  };
  loop();
})();
