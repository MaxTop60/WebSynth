const volumes = [
    document.getElementById('volume1'),
    document.getElementById('volume2'),
    document.getElementById('volume3'),
    document.getElementById('volume4')
];

const detunes = [
    document.getElementById('detune1'),
    document.getElementById('detune2'),
    document.getElementById('detune3'),
    document.getElementById('detune4')
];

const waveforms = [
    document.getElementById('waveform1'),
    document.getElementById('waveform2'),
    document.getElementById('waveform3'),
    document.getElementById('waveform4')
];

const tooltips = [
    document.getElementById('volume1-tooltip'),
    document.getElementById('volume2-tooltip'),
    document.getElementById('volume3-tooltip'),
    document.getElementById('volume4-tooltip'),
    document.getElementById('detune1-tooltip'),
    document.getElementById('detune2-tooltip'),
    document.getElementById('detune3-tooltip'),
    document.getElementById('detune4-tooltip'),
    document.getElementById('attack-tooltip'),
    document.getElementById('release-tooltip')
];

const envelopeAttack = document.getElementById('attack');
const envelopeRelease = document.getElementById('release');

const keys = document.querySelectorAll('.key');
const synths = [];

// Задаем минимальное значение громкости в децибелах
const minDbVolume = 0;

// Создаем синтезаторы для каждого модуля
for (let i = 0; i < 4; i++) {
    const synth = new Tone.Synth({
        oscillator: {
            type: waveforms[i].value,
        },
        envelope: {
            attack: 0,
            decay: 0.1,
            sustain: 0.5,
            release: 1,
        }
    }).toDestination();

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
    'C#2': 277.18*2,
    'D2': 293.66*2,
    'D#2': 311.13*2,
    'E2': 329.63*2,
    'F2': 349.23*2,
    'F#2': 369.99*2,
    'G2': 392.00*2,
    'G#2': 415.30*2,
    'A2': 440.00*2,
    'A#2': 466.16*2,
    'B2': 493.88*2,
    'C3': 261.63*4,
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

    // Устанавливаем начальное значение громкости
    synth.volume.value = minDbVolume; // Устанавливаем начальную громкость на 0 дБ
    synths.push(synth);

    // Обработчики изменения динамики (envelope)
    envelopeAttack.addEventListener('input', () => {
        const attackValue = envelopeAttack.value / 100; // Преобразуем значение
        synths.forEach(synth => {
            synth.envelope.attack = attackValue;
            tooltips[8].textContent = 'attack: ' + envelopeAttack.value; // Обновляем подсказку
        });
    });

    envelopeRelease.addEventListener('input', () => {
        const releaseValue = envelopeRelease.value / 100; // Преобразуем значение
        synths.forEach(synth => {
            synth.envelope.release = releaseValue;
            tooltips[9].textContent = 'release: ' + envelopeRelease.value; // Обновляем подсказку
        });
    });

    // Обработчик изменения формы волны
    waveforms[i].addEventListener('change', () => {
        synth.oscillator.type = waveforms[i].value;
    });

    // Обработчик изменения громкости
    volumes[i].addEventListener('input', () => {
        // Преобразуем значение ползунка в децибелы
        const volumeValue = volumes[i].value;
        synth.volume.value = volumeValue; 

        // Обновляем текст подсказки для громкости
        tooltips[i].textContent = 'vol: ' + volumeValue + 'db';
    });

    // Обработчик изменения detune
    detunes[i].addEventListener('input', () => {
        const detuneValue = detunes[i].value;
        synth.oscillator.detune.value = detuneValue;

        // Обновляем текст подсказки для детюна
        tooltips[i + 4].textContent = 'detune: ' + detuneValue;
    });
}

// Функция воспроизведения ноты для всех синтезаторов
function playNoteForAllSynths(note) {
    synths.forEach(synth => {
        synth.triggerAttack(note);
    });
}

// Функция остановки ноты для всех синтезаторов
function stopNoteForAllSynths() {
    synths.forEach(synth => {
        synth.triggerRelease();
    });
}

// Обработчик нажатия клавиш на клавиатуре
document.addEventListener('keydown', (event) => {
    const noteMapping = {
        'q': 'C4',   // До
        '2': 'C#4',  // До диез
        'w': 'D4',   // Ре
        '3': 'D#4',  // Ре диез
        'e': 'E4',   // Ми
        'r': 'F4',   // Фа
        '5': 'F#4',  // Фа диез
        't': 'G4',   // Соль
        '6': 'G#4',  // Соль диез
        'y': 'A4',   // Ля
        '7': 'A#4',  // Ля диез
        'u': 'B4',   // Си
        'i': 'C5',   // До
        '9': 'C#5',  // До диез
        'o': 'D5',   // Ре
        '0': 'D#5',  // Ре диез
        'p': 'E5',   // Ми
        '[': 'F5',   // Фа
        '=': 'F#5',  // Фа диез
        ']': 'G5',   // Соль
        '\\': 'G#5', // Соль диез
    };


    const note = noteMapping[event.key];
    if (note) {
        playNoteForAllSynths(note);
        
        const key = Array.from(keys).find(k => k.getAttribute('data-note') === note);
        if (key) {
            key.classList.add('active');
        }
    }
    
});

// Обработчик отпускания клавиш
document.addEventListener('keyup', (event) => {
    const noteMapping = {
        'q': 'C4',
        '2': 'C#4',
        'w': 'D4',
        '3': 'D#4',
        'e': 'E4',
        'r': 'F4',
        '5': 'F#4',
        't': 'G4',
        '6': 'G#4',
        'y': 'A4',
        '7': 'A#4',
        'u': 'B4',
        'i': 'C5',
        '9': 'C#5',
        'o': 'D5',
        '0': 'D#5',
        'p': 'E5',
        '[': 'F5',
        '=': 'F#5',
        ']': 'G5',
        '\\': 'G#5',
    };

    const note = noteMapping[event.key];
    if (note) {
        stopNoteForAllSynths();

        const key = Array.from(keys).find(k => k.getAttribute('data-note') === note);
        if (key) {
            key.classList.remove('active');
        }
    }
});


// Обработчик нажатия на клавиши мышью
keys.forEach(key => {
    key.addEventListener('mousedown', () => {
        const note = key.getAttribute('data-note');
        playNoteForAllSynths(note);
    });

    key.addEventListener('mouseup', () => {
        stopNoteForAllSynths();
    });

    key.addEventListener('mouseover', (event) => {
        if (event.buttons === 1) { // Проверяем, зажата ли левая кнопка мыши
            const note = key.getAttribute('data-note');
            playNoteForAllSynths(note);
        }
    });
});