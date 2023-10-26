import { MPD } from '@mastashake08/dash-manifest-creator'
class VideoEditor {
    constructor(stream, mediaUrl = '') {
        this._videoFrames = []
        this._stream = new MediaStream(stream);
        this._videoTrackProcessor = null
        this._audioTrackProcessor = null
        this._videoTrackGenerator = null
        this._audioTrackGenerator = null
        this._dash_manifest = new MPD(null, document);
        console.log(this._dash_manifest)
        const videoTransforms = [this.getVideoFramesTransform]
        const audioTransforms = this.audioTransform
        this._mediaUrl = mediaUrl;
        this.addTransforms({
            videoTransforms: videoTransforms, 
            audioTransforms: audioTransforms
        })
    }

     getVideoFramesTransform() {
        const transformer = new window.TransformStream({
            transform(videoFrame, controller) {
                const newFrame = videoFrame.clone();
                // 
                this._videoFrames.push(newFrame);
                controller.enqueue(newFrame);
                videoFrame.close();
            }
        });
        return transformer;
    }

    videoDashTransform(videoFrame, controller) {
        console.log(this._dash_manifest)
        this._dash_manifest.createMpd(videoFrame, this._mediaUrl);
        console.log(this._dash_manifest.createMpd().next().value);
    }

    addMediaTracks() {
        new MediaStream([this._videoTrackGenerator, this._audioTrackGenerator]);
    }

     addTransforms({videoTransforms = [], audioTransforms = []}) {
        console.log(videoTransforms)
        const vids =  this._stream.getVideoTracks();
        const auds =  this._stream.getAudioTracks();
        this._videoTrackProcessor = new window.MediaStreamTrackProcessor({ track: vids[0] });
        this._audioTrackProcessor = new window.MediaStreamTrackProcessor({ track: auds[0] });
        this._videoTrackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        this._audioTrackGenerator = new MediaStreamTrackGenerator({ kind: 'audio' });
        for(let i = 0; i < videoTransforms.length; ++i) {
            console.log(videoTransforms[i])
            this._videoTrackProcessor.readable.pipeThrough(videoTransforms[i]()).pipeTo(this._videoTrackGenerator.writable);
            console.log(this._videoTrackProcessor)
        }
        for(let i = 0; i < audioTransforms.length; ++i) {
            console.log(audioTransforms[i])
            this._audioTrackProcessor.readable.pipeThrough(audioTransforms[i]()).pipeTo(this._audioTrackGenerator.writable);
            console.log(this._videoTrackProcessor)
        }

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