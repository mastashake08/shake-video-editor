import { MPD } from 'dash-manifest-creator'
class VideoEditor {
    constructor(stream, mediaUrl = '') {
        this._stream = stream;
        this._videoTrackProcessor = new window.MediaStreamTrackProcessor({ track: this._stream.getVideoTracks()[0] });
        this._audioTrackProcessor = new window.MediaStreamTrackProcessor({ track: this._stream.getAudioTracks()[0] });
        this._videoTrackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        this._audioTrackGenerator = new MediaStreamTrackGenerator({ kind: 'audio' });
        this._mediaStream = new MediaStream();
        this._dash_manifest = new MPD();
        this._mediaUrl = mediaUrl;
        this.addMediaTracks();
        this.addTransforms({
            videoTransforms: [this.videoFrameEditsTransform],
            audioTransforms: [this.audioTransform]
        })
        
    }

     videoFrameEditsTransform(edits = {}) {
        const transformer = new window.TransformStream({
            transform(videoFrame, controller) {
                console.log([videoFrame, edits]);
                const newFrame = videoFrame.clone();
                videoFrame.close();
                controller.enqueue(newFrame);
            }
        });
        
    }

    videoDashTransform(videoFrame, controller) {
        this._dash_manifest.createMpd(videoFrame, this._mediaUrl);
        console.log(this._dash_manifest.createMpd().next().value);
    }

    addMediaTracks() {
        this._mediaStream.addTrack(this._videoTrackGenerator);
        this._mediaStream.addTrack(this._audioTrackGenerator);
    }

    addTransforms({videoTransforms = [], audioTransforms = []}) {
        for (const vT in videoTransforms) {
            this._videoTrackProcessor.readable.pipeThrough(vT);
        
        }
        this._videoTrackProcessor.readable.pipeTo(this._videoTrackGenerator.writable);
        for (const aT in audioTransforms) {
            this._audioTrackProcessor.readable.pipeThrough(aT);
        }
        this._audioTrackProcessor.readable.pipeTo(this._audioTrackGenerator.writable);
    }

       
    audioTransform(edits = {}) {
        const transformer = new window.TransformStream({
            transform(audioData, controller) {
                console.log([audioData, edits]);
                const newAuddio = audioData.clone();
                audioData.close();
                controller.enqueue(newAuddio);
            }
        });
        
    }


}

export {
    VideoEditor
}