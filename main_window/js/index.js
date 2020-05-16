// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

//keyConfigはpreload.jsによってconfig.jsonから読み込まれたデータを持つ配列
window.onload = () => {

    keyConfig.forEach((e, i) => {
        document.getElementById(`label${i + 1}`).innerText = e.toUpperCase();
    });

    const audioContext = new AudioContext();
    const piano = new Piano(SoundGenerator, audioContext);
    piano.connect(audioContext.destination);

    window.addEventListener('keydown', ({key}) => {
        const index = keyConfig.findIndex(e => e === key);
        if (index !== -1) piano.input('keydown', index);
    });

    window.addEventListener('keyup', ({key}) => {
        const index = keyConfig.findIndex(e => e === key);
        if (index !== -1) piano.input('keyup', index);
    });

    piano.addEventListener('keydown', index => {
        document.getElementById(`key${index + 1}`).dataset.active = true;
    });

    piano.addEventListener('keyup', index => {
        document.getElementById(`key${index + 1}`).dataset.active = false;
    });

    piano.addEventListener('changeOct', oct => {
        document.getElementById('octave').innerText = oct;
    });
};
