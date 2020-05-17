class Piano {
    constructor(SoundGenerator, audioContext) {
        this.octave = 0;
        this.baseFrequency = 261.626;
        this.minOctave = -3;
        this.maxOctave = 3;
        this.keyUpEvent = () => {};
        this.keyDownEvent = () => {};
        this.changeOctEvent = () => {};
        this.soundGeneratorArray = [];
        this.gainNode = audioContext.createGain();
        const compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-30, audioContext.currentTime);
        compressor.knee.setValueAtTime(20, audioContext.currentTime);
        compressor.ratio.setValueAtTime(6, audioContext.currentTime);
        compressor.attack.setValueAtTime(0, audioContext.currentTime);
        compressor.release.setValueAtTime(0.25, audioContext.currentTime);
        compressor.connect(this.gainNode);

        const KEY_SIZE = 15;
        for (let i = 0; i < KEY_SIZE; i++) {
            this.soundGeneratorArray[i] = new SoundGenerator(audioContext);
            this.soundGeneratorArray[i].connect(compressor);
        }
    }

    addEventListener(eventName, callback) {
        switch (eventName) {
            case 'keydown':
                this.keyDownEvent = callback;
                break;
            case 'keyup':
                this.keyUpEvent = callback;
                break;
            case 'changeOct':
                this.changeOctEvent = callback;
                break;
            default:
                throw new Error(`unknown event ${eventName}`);
        }
    }

    input(eventName, index) {
        switch (eventName) {
            case 'keydown':
                this.onKeyDown(index);
                break;
            case 'keyup':
                this.onKeyUp(index);
                break;
            default:
                throw new Error(`unknown event ${eventName}`);
        }
    }

    getPitch(index) {
        return this.baseFrequency * 2 ** (this.octave + index / 12);
    }

    onKeyDown(index) {
        if (index === 15) {
            this.changeOct(-1);
            this.keyDownEvent(index);
        } else if (index === 16) {
            this.changeOct(1);
            this.keyDownEvent(index);
        } else {
            if (this.start(index)) this.keyDownEvent(index);
        }
    }

    onKeyUp(index) {
        this.keyUpEvent(index);
        if (index >= 15) return;
        this.stop(index);
    }

    changeOct(diff) {
        const tmpOct = this.octave + diff;
        if (tmpOct > this.maxOctave) return;
        if (tmpOct < this.minOctave) return;
        this.octave = tmpOct;
        this.changeOctEvent(tmpOct);
    }

    start(index) {
        return this.soundGeneratorArray[index].start(this.getPitch(index));
    }

    stop(index) {
        this.soundGeneratorArray[index].stop();
    }

    connect(node) {
        this.gainNode.connect(node);
    }

}
