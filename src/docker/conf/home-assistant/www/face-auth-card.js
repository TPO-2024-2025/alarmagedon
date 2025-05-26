import {isFaceAuthenticated, isFaceEnrolled, setFaceAuthenticated, setFaceEnrolled} from './hass_api.js';
await import("https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js");

class FaceAuthGate {
  face_enrolled = false;

  constructor() {
    this.faceExists();

    this.injectOverlay();
    this.loadModels().then(() => this.init());
  }

  async injectOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'face-lock-overlay';
    this.overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85); z-index: 99999;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    `;

    this.overlay.innerHTML = `
      <h1 style="color: white; margin-bottom: 1em;">🔐 Face Authentication Required</h1>
      <div style="position: relative; width: 320px; height: 240px;">
      <video id="face-video" width="320" height="240" autoplay muted style="display: block; border-radius: 8px;"></video>
      <canvas id="face-canvas" width="320" height="240" 
        style="position: absolute; top: 0; left: 0; pointer-events: none;"></canvas>
      </div>
      <div id="enroll-auth-btn-container" style="margin-top: 1em; ${!this.face_enrolled ? '' : 'display:none;'}">
        <button id="enroll-btn">Enroll Face</button>
      </div>
      <p id="face-status" style="margin-top: 1em; font-weight: bold; color: white;">Status: Loading models...</p>
    `;

    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden';
  }

  setStatus(message, color = "white") {
    this.statusEl.innerText = `Status: ${message}`;
    this.statusEl.style.color = color;
  }

  async loadModels() {
    try {
      const MODEL_URL = '/local/faceapi-models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      console.log("Models loaded.");
    } catch (e) {
      this.setStatus("Model loading failed", "red");
      throw e;
    }
  }

  async init() {
    this.video = document.getElementById('face-video');
    this.canvas = document.getElementById('face-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.statusEl = document.getElementById('face-status');

    this.setStatus("Starting camera...");
    await this.startVideo();

    if (this.face_enrolled) {
      this.setStatus("Ready to authenticate");
      this.startAuthenticationLoop();
    } else {
      this.setStatus("No enrolled face found");
      document.getElementById('enroll-btn').addEventListener('click', () => this.enrollFace());
    }

    this.startDrawingLoop();
  }

  async startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = stream;
      await new Promise(resolve => {
        this.video.onloadedmetadata = () => {
          this.video.play();
          resolve();
        };
      });
      this.setStatus("Camera started");
    } catch (err) {
      console.error('Camera error:', err);
      this.setStatus('❌ Cannot access camera', "red");
    }
  }

  async detectFaceDescriptor() {
    try {
      this.setStatus("Detecting face...");
      const canvas = document.createElement('canvas');
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      const img = await faceapi.bufferToImage(blob);
      const result = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!result) this.setStatus("No face detected", "orange");
      return result ? result.descriptor : null;
    } catch (err) {
      this.setStatus("Face detection error", "red");
      console.error('Face detection error:', err);
      return null;
    }
  }

  async faceExists() {
    await isFaceEnrolled().then(enrolled => {
      this.face_enrolled = enrolled;
    });
  }

  async enrollFace() {
    this.setStatus("Enrolling face...");
    const descriptor = await this.detectFaceDescriptor();
    if (descriptor) {
      localStorage.setItem('knownFace', JSON.stringify(Array.from(descriptor)));
      await setFaceEnrolled(true);
      this.setStatus("✅ Face enrolled", "lightgreen");
      this.unlockInterface();
    } else {
      this.setStatus("❌ No face detected during enrollment", "orange");
    }
  }

  async authenticateFace() {
    this.setStatus("Authenticating...");
    const stored = await isFaceEnrolled();
    if (!stored) {
      this.setStatus("⚠️ No enrolled face", "orange");
      return;
    }

    const known = new Float32Array(JSON.parse(stored));
    const descriptor = await this.detectFaceDescriptor();

    if (!descriptor) return;

    const distance = this.euclideanDistance(known, descriptor);
    const match = distance < 0.5;

    this.setStatus(
      match ? `✅ Match (${distance.toFixed(2)})` : `❌ No Match (${distance.toFixed(2)})`,
      match ? "lightgreen" : "red"
    );

    if (match) this.unlockInterface();
  }

  startAuthenticationLoop() {
    this.authLoop = setInterval(async () => {
      if (!this.overlay || !document.body.contains(this.overlay)) {
        clearInterval(this.authLoop); // Stop if UI removed
        return;
      }
      this.statusEl.innerText = '🔍 Looking for face...';
      await this.authenticateFace();
    }, 1500);
  }

  async unlockInterface() {
    this.setStatus("Unlocking...");
    await setFaceAuthenticated(true);
    clearInterval(this.authLoop);
    this.overlay.remove();
    document.body.style.overflow = '';
  }

  euclideanDistance(a, b) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
  }

  drawGuideEllipse() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radiusX = 55;
    const radiusY = 70;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = '#41BDF5';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  startDrawingLoop() {
    const loop = () => {
      if (this.video.readyState === 4) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGuideEllipse();
      }
      requestAnimationFrame(loop);
    };
    loop();
  }
}

(async () => {
  const authed = await isFaceAuthenticated();
  if (authed) {
    console.log("✅ Already authenticated");
  } else {
    setTimeout(() => {
      console.log("Launching face auth...");
      new FaceAuthGate();
    }, 1000);
  }
})();
