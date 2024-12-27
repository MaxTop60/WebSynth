const oscillators = Array(4).fill(null).map(() => ({ oscillator: null, gainNode: null }));

//JOPA

const waveforms = [
    document.getElementById('waveform1'),
    document.getElementById('waveform2'),
    document.getElementById('waveform3'),
    document.getElementById('waveform4')
];

const volumes = [
    document.getElementById('volume1'),
    document.getElementById('volume2'),
    document.getElementById('volume3'),
    document.getElementById('volume4')
];

const noteFrequencies = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88,
    'C2': 523.25,
    'C2#': 277.18,
    'D2': 293.66,
    'D2#': 311.13,
    'E2': 329.63,
    'F2': 349.23,
    'F2#': 369.99,
    'G2': 392.00,
    'G2#': 415.30,
    'A2': 440.00,
    'A2#': 466.16,
    'B2': 493.88,
    'C3': 523.25
};

const keyBindings = {
    'C': 'A',
    'C#': 'W',
    'D': 'S',
    'D#': 'E',
    'E': 'D',
    'F': 'F',
    'F#': 'T',
    'G': 'G',
    'G#': 'Y',
    'A': 'H',
    'A#': 'U',
    'B': 'J',
    'C2': 'K'
};

function createOscillator(index, frequency) {
    const osc = new Tone.Oscillator(frequency, waveforms[index].value).toDestination();
    const gainNode = new Tone.Gain(Math.pow(10, volumes[index].value / 20)).toDestination();
    
    osc.connect(gainNode);
    
    oscillators[index] = { oscillator: osc, gainNode: gainNode };
}

function startOscillator(index, frequency) {
    if (!oscillators[index].oscillator) {
        createOscillator(index, frequency);
    }
    oscillators[index].oscillator.start();
}

function stopOscillator(index) {
    if (oscillators[index].oscillator) {
        oscillators[index].oscillator.stop();
        oscillators[index].oscillator = null;
    }
}

function updateVolume(index) {
    if (oscillators[index].gainNode) {
        oscillators[index].gainNode.gain.setValueAtTime(Math.pow(10, volumes[index].value / 20), Tone.now());
    }
}

waveforms.forEach((waveform, index) => {
    waveform.addEventListener('change', () => {
        if (oscillators[index].oscillator) {
            const frequency = oscillators[index].oscillator.frequency.value;
            stopOscillator(index);
            startOscillator(index, frequency);
        }
    });
});

volumes.forEach((volume, index) => {
    volume.addEventListener('input', () => {
        updateVolume(index);
    });
});

const keys = document.querySelectorAll('.key');

function playSound(note) {
    const frequency = noteFrequencies[note];
    for (let i = 0; i < oscillators.length; i++) {
        startOscillator(i, frequency);
    }
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
    }
}

function stopSound(note) {
    for (let i = 0; i < oscillators.length; i++) {
        stopOscillator(i);
    }
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
}

keys.forEach((key) => {
    key.addEventListener('mousedown', () => {
        const note = key.getAttribute('data-note');
        playSound(note);
    });

    key.addEventListener('mouseup', () => {
        const note = key.getAttribute('data-note');
        stopSound(note);
    });
});

document.addEventListener('keydown', (event) => {
    const note = Object.keys(keyBindings).find((note) => keyBindings[note] === event.key.toUpperCase());
    if (note) {
        playSound(note);
    }
});

document.addEventListener('keyup', (event) => {
    const note = Object.keys(keyBindings).find((note) => keyBindings[note] === event.key.toUpperCase());
    if (note) {
        stopSound(note);
    }
});
