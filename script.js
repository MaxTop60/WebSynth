// Я СЛУЧАЙНО СОЗДАЛ СИНТЕЗАТОР ЗВУКОВ ИЗ АДА

// Инициализация Tone.js
const synths = Array.from({ length: 4 }, () => new Tone.PolySynth().toDestination());
const volumes = [
    document.getElementById('volume1'),
    document.getElementById('volume2'),
    document.getElementById('volume3'),
    document.getElementById('volume4')
];

const waveforms = [
    document.getElementById('waveform1'),
    document.getElementById('waveform2'),
    document.getElementById('waveform3'),
    document.getElementById('waveform4')
];

// Частоты нот
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
    'C#2': 554.37,
    'D2': 587.33,
    'D#2': 622.25,
    'E2': 659.25,
    'F2': 698.46,
    'F#2': 739.99,
    'G2': 783.99,
    'G#2': 830.61,
    'A2': 880.00,
    'A#2': 932.33,
    'B2': 987.77,
    'C3': 1046.50
};

// Функция для создания осцилляторов
function createSynth(index) {
    synths[index].set({
        oscillator: {
            type: waveforms[index].value
        },
        volume: Math.pow(10, volumes[index].value / 20) // Преобразуем в линейное значение
    });
}

// Обновление настроек синтезаторов при изменении формы волны или громкости
function updateSynthSettings() {
    for (let i = 0; i < synths.length; i++) {
        createSynth(i);
    }
}

// Обработчик изменения формы волны
waveforms.forEach((waveform, index) => {
    waveform.addEventListener('change', () => {
        createSynth(index);
    });
});

// Обработчик изменения громкости
volumes.forEach((volume, index) => {
    volume.addEventListener('input', () => {
        synths[index].set({
            volume: Math.pow(10, volume.value / 20)
        });
    });
});

// Обработчик нажатия на клавиши
const keys = document.querySelectorAll('.key');

keys.forEach((key) => {
    key.addEventListener('mousedown', () => {
        const note = key.getAttribute('data-note');
        playSound(note);
        key.classList.add('active'); // Добавляем активный класс
    });

    key.addEventListener('mouseup', () => {
        const note = key.getAttribute('data-note');
        stopSound(note);
        key.classList.remove('active'); // Убираем активный класс
    });

    key.addEventListener('mouseleave', () => {
        const note = key.getAttribute('data-note');
        stopSound(note);
        key.classList.remove('active'); // Убираем активный класс при выходе мыши
    });
});

// Воспроизвести звук
function playSound(note) {
    const frequency = noteFrequencies[note];
    synths.forEach(synth => {
        synth.triggerAttack(frequency);
    });
}

// Остановить звук
function stopSound(note) {
    const frequency = noteFrequencies[note];
    synths.forEach(synth => {
        synth.triggerRelease();
    });
}

// Запуск Tone.js
Tone.start().then(() => {
    console.log('Audio context started');
    updateSynthSettings(); // Инициализация синтезаторов
});
