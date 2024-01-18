(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement("video");
  video.autoplay = true;
  video.srcObject = stream;
  document.body.append(video);
})();
