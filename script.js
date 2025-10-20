document.addEventListener("DOMContentLoaded", () => {
  // --- CORE AUDIO & STATE VARIABLES ---
  let audioContext;
  let masterGain, analyser;
  let customWaves = {};
  let noiseBuffer;
  const mixerGains = {};
  const activeSources = {};
  const waveforms = ["sine", "square", "sawtooth", "triangle", "noise"];

  const notesData = [
    { name: "Dó", freqs: [32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01, 8372.02] },
    { name: "Ré", freqs: [36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.63, 9397.27] },
    { name: "Mi", freqs: [41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02, 5274.04, 10548.08] },
    { name: "Fá", freqs: [43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65, 11175.3] },
    { name: "Sol", freqs: [49.0, 98.0, 196.0, 392.0, 783.99, 1567.98, 3135.96, 6271.93, 12543.85] },
    { name: "Lá", freqs: [55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0, 7040.0, 14080.0] },
    { name: "Si", freqs: [61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13, 15804.27] },
  ];

  // --- INITIALIZATION ---
  function initAudio() {
    if (audioContext) return;
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      masterGain = audioContext.createGain();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      masterGain.connect(analyser);
      analyser.connect(audioContext.destination);

      createCustomAssets();

      waveforms.forEach((wave) => {
        const slider = document.querySelector(`#${wave}-knob input`);
        mixerGains[wave] = audioContext.createGain();
        mixerGains[wave].gain.setValueAtTime(slider ? parseFloat(slider.value) : 0, audioContext.currentTime);
        mixerGains[wave].connect(masterGain);
      });

      const volumeSlider = document.querySelector("#volume-knob input");
      masterGain.gain.setValueAtTime(parseFloat(volumeSlider.value), audioContext.currentTime);

      drawVisualizer();
    } catch (e) {
      alert("Seu navegador não suporta a Web Audio API.");
      console.error(e);
    }
  }

  function createCustomAssets() {
    const noiseSize = 2 * audioContext.sampleRate;
    noiseBuffer = audioContext.createBuffer(1, noiseSize, audioContext.sampleRate);
    const noiseOutput = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseSize; i++) {
      noiseOutput[i] = Math.random() * 2 - 1;
    }
  }

  function createButtons() {
    const notePad = document.getElementById("note-pad");
    const noteClasses = ["note-do", "note-re", "note-mi", "note-fa", "note-sol", "note-la", "note-si"];
    notesData.forEach((noteInfo, i) => {
      noteInfo.freqs.forEach((freq, index) => {
        const noteName = `${noteInfo.name}${index + 1}`;
        const button = document.createElement("button");
        button.className = `note-btn flex flex-col items-center justify-center rounded-md shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 ${noteClasses[i]}`;
        button.dataset.frequency = freq;
        button.dataset.noteName = noteName;
        button.style.cssText = `width: var(--btn-width); height: var(--btn-height);`;
        button.innerHTML = `<span class="note-name">${noteName}</span><span class="note-freq">${Math.round(freq)} Hz</span>`;
        button.addEventListener("click", () => toggleNote(button));
        notePad.appendChild(button);
      });
    });
  }

  function toggleNote(button) {
    initAudio();
    const noteName = button.dataset.noteName;
    const freq = parseFloat(button.dataset.frequency);
    if (activeSources[noteName]) {
      stopNote(noteName, button);
    } else {
      playNote(noteName, freq, button);
    }
  }

  function playNote(noteName, freq, button) {
    if (activeSources[noteName]) return;

    const noteGroup = { sources: [] };

    waveforms.forEach((wave) => {
      const sourceGain = mixerGains[wave];
      if (!sourceGain || sourceGain.gain.value === 0) return;

      let source;
      if (wave === "noise") {
        source = audioContext.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
      } else {
        source = audioContext.createOscillator();
        source.frequency.setValueAtTime(freq, audioContext.currentTime);
        if (customWaves[wave]) source.setPeriodicWave(customWaves[wave]);
        else source.type = wave;
      }
      source.connect(sourceGain);
      source.start();
      noteGroup.sources.push(source);
    });

    activeSources[noteName] = noteGroup;
    if (button) button.classList.add("btn-active");
  }

  function stopNote(noteName, button) {
    const noteGroup = activeSources[noteName];
    if (!noteGroup) return;

    const now = audioContext.currentTime;
    noteGroup.sources.forEach((source) => {
      source.stop(now);
    });

    delete activeSources[noteName];
    if (button) button.classList.remove("btn-active");
  }

  function setupKnob(controlElement) {
    const knob = controlElement.querySelector(".knob");
    const indicator = controlElement.querySelector(".knob-indicator");
    const slider = controlElement.querySelector("input[type=range]");
    const valueSpan = controlElement.querySelector(".value-display");

    let isDragging = false,
      startY = 0,
      startValue = 0;
    const min = parseFloat(slider.min),
      max = parseFloat(slider.max);

    const updateVisuals = (value) => {
      const normalizedValue = (value - min) / (max - min);
      indicator.style.transform = `rotate(${normalizedValue * 270 - 135}deg)`;
      valueSpan.textContent = `${Math.round(value * 100)}%`;
    };

    updateVisuals(parseFloat(slider.value));

    const dragStart = (clientY) => {
      isDragging = true;
      startY = clientY;
      startValue = parseFloat(slider.value);
      document.body.style.cursor = "ns-resize";
    };
    const dragMove = (clientY) => {
      if (!isDragging) return;
      const deltaY = startY - clientY;
      const range = max - min;
      const newValue = Math.max(min, Math.min(max, startValue + (deltaY / 150) * (range / 1)));
      slider.value = newValue;
      updateVisuals(newValue);
      slider.dispatchEvent(new Event("input"));
    };
    const dragEnd = () => {
      isDragging = false;
      document.body.style.cursor = "default";
    };

    knob.addEventListener("mousedown", (e) => dragStart(e.clientY));
    knob.addEventListener("touchstart", (e) => dragStart(e.touches[0].clientY), { passive: true });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) dragMove(e.clientY);
    });
    window.addEventListener("touchmove", (e) => {
      if (isDragging && e.touches[0]) dragMove(e.touches[0].clientY);
    });
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("touchend", dragEnd);
  }

  function setupEventListeners() {
    document.querySelectorAll(".control-knob").forEach(setupKnob);

    document.querySelectorAll('[id$="-knob"] input[type="range"]').forEach((slider) => {
      const knobId = slider.closest(".control-knob").id;
      const wave = knobId.replace("-knob", "");

      slider.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        if (audioContext && mixerGains[wave]) {
          mixerGains[wave].gain.setTargetAtTime(value, audioContext.currentTime, 0.01);
        }
      });
    });

    document
      .getElementById("volume-knob")
      .querySelector("input")
      .addEventListener("input", (e) => {
        if (masterGain) masterGain.gain.setTargetAtTime(parseFloat(e.target.value), audioContext.currentTime, 0.01);
      });
    document.getElementById("stop-all").addEventListener("click", () => {
      Object.keys(activeSources).forEach((noteName) => {
        const btn = document.querySelector(`[data-note-name="${noteName}"]`);
        stopNote(noteName, btn);
      });
    });
  }

  function drawVisualizer() {
    const canvas = document.getElementById("visualizer");
    const canvasCtx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = "rgb(0, 0, 0)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(52, 211, 153)";
      canvasCtx.beginPath();
      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) canvasCtx.moveTo(x, y);
        else canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    draw();
  }

  createButtons();
  setupEventListeners();
});
