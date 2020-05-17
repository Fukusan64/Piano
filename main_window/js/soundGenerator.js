class SoundGenerator {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.oscillatorArr = [];
        this.gain = this.audioContext.createGain();
        this.playingFlag = false;
    }
    start(hz) {
        if (this.playingFlag) return false;

        if (this.oscillatorArr.length !== 0) this.oscillatorArr.forEach(e => e.disconnect());

        this.oscillatorArr[0] = this.audioContext.createOscillator();
        this.oscillatorArr[1] = this.audioContext.createOscillator();

        this.oscillatorArr.forEach(e => e.connect(this.gain));
        this.oscillatorArr.forEach(e => e.type = 'sine');

        this.oscillatorArr[0].frequency.value = hz / 2;
        this.oscillatorArr[1].frequency.value = hz;

        const currentTime = this.audioContext.currentTime;
        this.gain.gain.cancelScheduledValues(currentTime);
        this.gain.gain.setValueAtTime(0, currentTime);

        this.oscillatorArr.forEach(e => e.start(currentTime));
        this.gain.gain.linearRampToValueAtTime(1, currentTime + 0.01);
        this.gain.gain.linearRampToValueAtTime(0, currentTime + 2);

        this.playingFlag = true;

        return true;
    }
    stop() {
        const currentTime = this.audioContext.currentTime;
        this.gain.gain.cancelScheduledValues(currentTime);
        this.gain.gain.setValueAtTime(this.gain.gain.value, currentTime);
        this.gain.gain.linearRampToValueAtTime(0, currentTime + 0.01);
        this.playingFlag = false;
    }
    connect(node) {
        this.gain.connect(node);
    }
}
