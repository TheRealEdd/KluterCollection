const noteFrequencies = {
    "A1": 55.00,
    "A#1": 58.27, "Bb1": 58.27,
    "B1": 61.74,
    "C2": 65.41,
    "C#2": 69.30, "Db2": 69.30,
    "D2": 73.42,
    "D#2": 77.78, "Eb2": 77.78,
    "E2": 82.41,
    "F2": 87.31,
    "F#2": 92.50, "Gb2": 92.50,
    "G2": 98.00,
    "G#2": 103.83, "Ab2": 103.83,
    "A2": 110.00,
    "A#2": 116.54, "Bb2": 116.54,
    "B2": 123.47,
    "C3": 130.81,
    "C#3": 138.59, "Db3": 138.59,
    "D3": 146.83,
    "D#3": 155.56, "Eb3": 155.56,
    "E3": 164.81,
    "F3": 174.61,
    "F#3": 185.00, "Gb3": 185.00,
    "G3": 196.00,
    "G#3": 207.65, "Ab3": 207.65,
    "A3": 220.00,
    "A#3": 233.08, "Bb3": 233.08,
    "B3": 246.94,
    "C4": 261.63,
    "C#4": 277.18, "Db4": 277.18,
    "D4": 293.66,
    "D#4": 311.13, "Eb4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "F#4": 369.99, "Gb4": 369.99,
    "G4": 392.00,
    "G#4": 415.30, "Ab4": 415.30,
    "A4": 440.00,
    "A#4": 466.16, "Bb4": 466.16,
    "B4": 493.88,
    "C5": 523.25,
    "C#5": 554.37, "Db5": 554.37,
    "D5": 587.33,
    "D#5": 622.25, "Eb5": 622.25,
    "E5": 659.25,
    "F5": 698.46,
    "F#5": 739.99, "Gb5": 739.99,
    "G5": 783.99,
    "G#5": 830.61, "Ab5": 830.61,
    "A5": 880.00,
    "A#5": 932.33, "Bb5": 932.33,
    "B5": 987.77,
    "C6": 1046.50,
    "C#6": 1108.73, "Db6": 1108.73,
    "D6": 1174.66,
    "D#6": 1244.51, "Eb6": 1244.51,
    "E6": 1318.51,
    "F6": 1396.91,
    "F#6": 1479.98, "Gb6": 1479.98,
    "G6": 1567.98,
    "G#6": 1661.22, "Ab6": 1661.22,
    "A6": 1760.00,
    "A#6": 1864.66, "Bb6": 1864.66,
    "B6": 1975.53,
    "C7": 2093.00,
    "C#7": 2217.46, "Db7": 2217.46,
    "D7": 2349.32,
    "D#7": 2489.02, "Eb7": 2489.02,
    "E7": 2637.02,
    "F7": 2793.83,
    "F#7": 2959.96, "Gb7": 2959.96,
    "G7": 3135.96,
    "G#7": 3322.44, "Ab7": 3322.44,
    "A7": 3520.00,
    "A#7": 3729.31, "Bb7": 3729.31,
    "B7": 3951.07,
    "C8": 4186.01,
    "C#8": 4434.92, "Db8": 4434.92,
    "D8": 4698.63,
    "D#8": 4978.03, "Eb8": 4978.03,
    "E8": 5274.04,
    "F8": 5587.65,
    "F#8": 5919.91, "Gb8": 5919.91,
    "G8": 6271.93,
    "G#8": 6644.88, "Ab8": 6644.88,
    "A8": 7040.00,
    "A#8": 7458.62, "Bb8": 7458.62,
    "B8": 7902.13
};

let firstButton = document.querySelector("#noteSelector .noteButton") || document.querySelector("#noteSelectorXL .noteButtonXL");let currentNote = firstButton ? firstButton.getAttribute("data-note") : "C4"; // Fallback to "C4" if the button isn't found

let audioContext;
let analyser;
let microphone;
let scriptProcessor;
let isTunerActive = false;

// Note button selection
const noteButtons = document.querySelectorAll('.noteButton, .noteButtonXL');
noteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        currentNote = e.target.getAttribute('data-note');
        updateSelectedButton(e.target);
    });
});

function updateSelectedButton(selectedButton) {
    // Remove 'active' class from all buttons
    noteButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the selected button
    selectedButton.classList.add('active');
}

// Initial UI setup to highlight the default note
document.querySelector(`button[data-note="${currentNote}"]`).classList.add('active');

// Setup Canvas for Waveform
const canvas = document.getElementById('waveform');
const canvasCtx = canvas.getContext('2d');

// Sensitivity parameters
let sensitivity = 1; // Initial sensitivity
const minSensitivity = 0.999995;
const maxSensitivity = 1.000005;


function startTuner() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }


    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);

        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        // Setup for waveform visualization
        const drawWaveform = () => {
            animationFrameId = requestAnimationFrame(drawWaveform);

            analyser.getFloatTimeDomainData(dataArray);

            canvasCtx.fillStyle = '#EE7F00';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = '#FFFFFF';

            canvasCtx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for(let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] * 0.5 + 0.5;
                const y = v * canvas.height;

                if(i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        drawWaveform();

        // Pitch Detection
        scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        scriptProcessor.onaudioprocess = function () {
            analyser.getFloatTimeDomainData(dataArray);
            const frequency = autoCorrelate(dataArray, audioContext.sampleRate);
            const rms = calculateRMS(dataArray);

            // Adjust sensitivity based on RMS
            if (rms > 0.1) { // Threshold for high volume
                sensitivity = Math.max(minSensitivity, sensitivity - 0.1);
            } else if (rms < 0.05) { // Threshold for low volume
                sensitivity = Math.min(maxSensitivity, sensitivity + 0.1);
            }

            if (frequency !== -1) {
                const targetFrequency = noteFrequencies[currentNote];
                const difference = frequency - targetFrequency;

                visualize(difference, sensitivity);
            }
        };
    }).catch(err => {
        console.error('Error accessing microphone:', err);
    });
}

// Function to stop the tuner
function stopTuner() {
    if (microphone) {
        microphone.disconnect();
        microphone = null; // Clear the reference
        console.log("mic disconnected");
    }
    if (analyser) {
        analyser.disconnect();
        analyser = null; // Clear the reference
        console.log("analyser disconnected");
    }
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null; // Clear the reference
        console.log("scriptProcessor disconnected");
    }
    if (audioContext) {
        audioContext.close().then(() => {
            audioContext = null;
            console.log("audioContext closed");
        });
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // Stop the animation
        animationFrameId = null;
        console.log("animationFrame stopped");
    }
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Clear the waveform
    isTunerActive = false;
    console.log("canvas cleared");
}

document.getElementById('toggleTuner').addEventListener('change', function() {
    if (this.checked) {
        isTunerActive = true;
        startTuner();
    } else {
        stopTuner();
    }
});

// Calculate RMS to adjust sensitivity
function calculateRMS(buffer) {
    let sum = 0;
    for(let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
}

// Auto-correlation algorithm for pitch detection
function autoCorrelate(buffer, sampleRate) {
    // Basic auto-correlation algorithm to determine the frequency of the input
    let size = buffer.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
        rms += buffer[i] * buffer[i];
    }

    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // Too quiet

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) {
        if (Math.abs(buffer[i]) < thres) {
            r1 = i;
            break;
        }
    }
    for (let i = 1; i < size / 2; i++) {
        if (Math.abs(buffer[size - i]) < thres) {
            r2 = size - i;
            break;
        }
    }

    buffer = buffer.slice(r1, r2);
    size = buffer.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - i; j++) {
            c[i] += buffer[j] * buffer[j + i];
        }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;

    for (let i = d; i < size; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }

    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;

    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
}

function visualize(difference, sensitivity) {
    const visualizer = document.getElementById('visualizer');
    const pitchStatus = document.getElementById('pitchStatus');
    const marker = document.getElementById('marker');

    const normalizedDifference = difference / sensitivity; // Normalize based on sensitivity
    const percentage = normalizedDifference / 10; // Assuming max difference is +/-10Hz for display

    // Clamp percentage between -1 and 1
    const clampedPercentage = Math.max(-1, Math.min(1, percentage));

    // Calculate offset in pixels (assuming visualizer width is 100%)
    const visualizerWidth = visualizer.clientWidth;
    const offset = clampedPercentage * (visualizerWidth / 2 - 1); // -1 for marker width

    // Update marker position
    marker.style.left = `calc(50% + ${offset}px)`;

    // Update pitch status
    if (difference > sensitivity) {
        pitchStatus.textContent = "Too High";
        pitchStatus.style.color = "#EE7F00";
    } else if (difference < -sensitivity) {
        pitchStatus.textContent = "Too Low";
        pitchStatus.style.color = "#EE7F00";
    } else {
        pitchStatus.textContent = "In Tune";
        pitchStatus.style.color = "green";
    }
}
