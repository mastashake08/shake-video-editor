import * from '../classes/transformers'
const mediaSource = new MediaSource()

function getVideoFrames ({readable, writable}) {
    const getFramesTransformer = new window.TransformStream({
        transform(videoFrame, controller) {  
             const newFrame = videoFrame.clone();
             videoFrame.close();
             controller.enqueue(newFrame);
             self.postMessage({'name': 'new-video-frame', data: newFrame})
         },
         flush() {
            self.postMessage({
                name: 'video-frames-available', data: {readable, writable}
            }, [
                {
                    readable, 
                    writable
                }
            ])
         }
     });
    return getFramesTransformer
}

function encodeVideoFrames ({readable, writable, encoder, decoder}) {
    const encodeFrameTransformer = new TransformStream({
        start(controller) {

        },
        transform(videoFrame, controller) {
            const newFrame = videoFrame.clone();
            const encodedChunks = encoder.encode(newFrame)
            const decodedFrame = decoder.decoder(encodedChunks)

            videoFrame.close();
            const tees = controller.readable.tee()
            controller.enqueue()
            
        },
        flush() {}
    })
}
function getAudioFrames ({readable, writable}) {
    const audioTransformer = new window.TransformStream({
        transform(audioFrame, controller) {  
             const newFrame = audioFrame.clone();
             audioFrame.close();
             controller.enqueue(newFrame);
             self.postMessage({'name': 'new-audio-frame', data: newFrame})
         },
         close() {
            self.postMessage({
                name: 'audio-frames-available', data: {readable, writable}
            }, [
                {
                    readable, 
                    writable
                }
            ])
         }
     });

     return audioTransformer
}

onmessage = (e) => {
    try {
        const name = e.data.name
        const data = e.data.data
          
        switch(name) {
            case 'get-frames':
                const track = data.track
                
                const trackData = { kind: track.kind }
                const { readable } = new MediaStreamTrackProcessor({track: track});
                const { writable } = new MediaStreamTrackGenerator(trackData)
                const transformConfig = {
                    readable, 
                    writable
                }
                switch(trackData.kind) {
                    case 'audio':
                        const audioTransformer = getAudioFrames(transformConfig)
                        readable.pipeThrough(audioTransformer)
                    case 'video':
                        const getFramesTransformer = getVideoFrames(transformConfig)
                        readable.pipeThrough(getFramesTransformer)               
                }
                readable.pipeTo(writable)
            case 'export-video':
                mediaSource.
    
        }
    } catch (error) {
        console.log(error)
    }
    
}
