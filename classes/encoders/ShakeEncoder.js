class ShakeEncoder extends VideoEncoder{
    stream;
    videoTracks;
    mainVideoTrack;
    audioTracks;
    mainVideoTrack;
    videoFrames;
    audioFrames;
    frameWorker;

    /**
     * 
     * @param {*} param0 
     */
    constructor({init = {
        output: (chunk) => {
            console.log(chunk)
        },
        error: (e) => {
          console.log(e.message);
        },
      }, config = {
        codec: "vp9",
        width: 640,
        height: 480,
        bitrate: 2_000_000, // 2 Mbps
        framerate: 30,
      }, stream}) {
        super(init)
        this.videoFrames = []
        this.configure(config)
        this.stream = stream.clone()
        this.videoTracks = this.stream.getVideoTracks()
        this.mainVideoTrack = this.videoTracks[0]
        this.videoTracks = stream.getAudioTracks()
        this.mainVideoTrack = this.audioTracks[0]
        this._videoTrackProcessor = new window.MediaStreamTrackProcessor({ track: this.mainVideoTrack });
        this._audioTrackProcessor = new window.MediaStreamTrackProcessor({ track: this.mainAudioTrack});
        this._videoTrackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        this._audioTrackGenerator = new MediaStreamTrackGenerator({ kind: 'audio' });
        
        this.stream.getTracks().forEach((track) => {
          const worker =  new Worker('../workers/Worker.js') 
          worker.onmessage(ev => {
            const name = ev.data.name
            const data = ev.data.data
            switch(name) {
                case 'new-frame':
                this.videoFrames.push(data)
            }
        })
        
        // const data = {
        //     processor: trackProcessor,
        //     generator: trackGenerator
        // }
        worker.postMessage(
            {
            name: 'get-frames', 
            data: track
            }, [ track ])
    
        })
        this.frameWorker = new Worker('../workers/Worker.js', {type: 'module'})
        this.frameWorker.onmessage(ev => {
            const name = ev.data.name
            const data = ev.data.data
            switch(name) {
                case 'new-frame':
                this.videoFrames.push(data)
            }
        })

    encodeVideo () {
        const data = {
            video
        }
        this.frameWorker.postMessage({
            name: 'encode-video',
            videoTracks: this.videoTracks,
            audioTracks: this.audioTracks
        })
    }
}