import "@mediapipe/face_detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

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
  video.style.transform = "scaleX(-1)";
  document.body.append(video);

  const canvas = document.createElement("canvas");
  canvas.style.transform = "scaleX(-1)";
  document.body.append(canvas);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = x(canvas.getContext("2d"));

  const faceDetector = await faceDetection.createDetector(
    faceDetection.SupportedModels.MediaPipeFaceDetector,
    {
      runtime: "mediapipe",
      solutionPath: "/pkgs/@mediapipe/face_detection",
    }
  );

  const loop = async () => {
    const faces = await faceDetector.estimateFaces(video);
    ctx.drawImage(video, 0, 0);
    for (const face of faces) {
      ctx.strokeStyle = "lime";
      ctx.strokeRect(
        face.box.xMin,
        face.box.yMin,
        face.box.width,
        face.box.height
      );
      ctx.fillStyle = "aqua";
      for (const { x, y } of face.keypoints) {
        ctx.fillRect(x - 2, y - 2, 5, 5);
      }
    }
    requestAnimationFrame(loop);
  };
  loop();
})();
