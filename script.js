// Получаем ссылки на элементы
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
const minDbVolume = 0; // Установите минимальную громкость на 0 дБ

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
        const detuneValue = detunes[i].value; // предполагается, что значение от -1200 до 1200
        synth.oscillator.detune.value = detuneValue; // Устанавливаем detune

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
        'a': 'C4',
        's': 'C#4',
        'd': 'D4',
        'f': 'D#4',
        'g': 'E4',
        'h': 'F4',
        'j': 'F#4',
        'k': 'G4',
        'l': 'G#4',
        ';': 'A4',
        'z': 'A#4',
        'x': 'B4',
        'c': 'C5',
    };

    const note = noteMapping[event.key];
    if (note) {
        playNoteForAllSynths(note);
    }
});

// Обработчик отпускания клавиш
document.addEventListener('keyup', (event) => {
    const noteMapping = {
        'a': true,
        's': true,
        'd': true,
        'f': true,
        'g': true,
        'h': true,
        'j': true,
        'k': true,
        'l': true,
        ';': true,
        'z': true,
        'x': true,
        'c': true,
    };

    if (noteMapping[event.key]) {
        stopNoteForAllSynths();
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