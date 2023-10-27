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
    makeMpd(url, dash, chunks, encoder, startNumber) {
        if(dash == null) {
            dash = new MPD(document.implementation.createDocument(null, "mpd"));
        }
        console.log(url)
        const file = dash.getBlob()
        console.log(file)
        const mpd = dash.createMpd(file, url, startNumber);
        mpd.next()
        this.chunks = []
        encoder.flush()
    }
    videoDashTransform(ve) {
        const url = ve._mediaUrl
        let dash = ve._dash_manifest
        const chunks = ve._encodedChunks
        const encoder = ve._videoEncoder
        const transformer = new window.TransformStream({
            start: () => {
                let vidNum = 1
                let startNumber = 1
                setInterval(() => {
                    ve.makeMpd(url, dash, chunks, encoder, startNumber)
                    vidNum = 1
                    startNumber++
                }, 60000)
                setInterval(() => {
                    
                    const pad = vidNum.toString().padStart(3, '0')
                    const file = new File([chunks], `media${pad}.webm`)
                    vidNum++
                    console.log(file)
                    this.chunks = []
                    encoder.flush()

                }, 3000)
                ve.makeMpd(url, dash, chunks, encoder, startNumber)
                startNumber++
            },
            transform(videoFrame, controller) {
                
                    
                const newFrame = videoFrame.clone();
                videoFrame.close();
                controller.enqueue(encoder.encode(newFrame));
            }
        });
        return transformer;
    }

    addMediaTracks() {
        new MediaStream([this._videoTrackGenerator, this._audioTrackGenerator]);
    }

     addTransforms({videoTransforms = [], audioTransforms = []}) {
        console.log([videoTransforms, audioTransforms])
        const vids =  this._stream.getVideoTracks();
        const auds =  this._stream.getAudioTracks();
        this._videoTrackProcessor = new window.MediaStreamTrackProcessor({ track: vids[0] });
        this._audioTrackProcessor = new window.MediaStreamTrackProcessor({ track: auds[0] });
        this._videoTrackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        this._audioTrackGenerator = new MediaStreamTrackGenerator({ kind: 'audio' });
        this._videoTrackProcessor.readable.pipeThrough(videoTransforms[0](this)).pipeTo(this._videoTrackGenerator.writable);
            
        for(let i = 0; i < audioTransforms.length; ++i) {
            this._audioTrackProcessor.readable.pipeThrough(audioTransforms[i]()).pipeTo(this._audioTrackGenerator.writable);
            console.log(this._audioTrackProcessor)
        }

    }

       
    audioTransform(edits = {}) {
        const transformer = new window.TransformStream({
            transform(audioData, controller) {
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