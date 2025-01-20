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
    document.getElementById('detune4-tooltip')
];

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

    // Устанавливаем начальное значение громкости
    synth.volume.value = minDbVolume; // Устанавливаем начальную громкость на 0 дБ
    synths.push(synth);

    // Обработчик изменения формы волны
    waveforms[i].addEventListener('change', () => {
        synth.oscillator.type = waveforms[i].value;
    });

    // Обработчик изменения громкости
    volumes[i].addEventListener('input', () => {
        // Преобразуем значение ползунка в децибелы
        const volumeValue = volumes[i].value; // предполагается, что значение от 0 до 100
        const dbValue = (volumeValue / 100) * 20; // Преобразование в диапазон от 0 до 20 дБ
        synth.volume.value = minDbVolume + dbValue; // Устанавливаем громкость от 0 дБ до 20 дБ

        // Обновляем текст подсказки для громкости
        tooltips[i].textContent = 'vol: ' + volumeValue;
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