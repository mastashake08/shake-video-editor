import { RecorderTransformer } from '../classes/transformers/RecorderTransformer'
const mediaSource = new MediaSource()
function getAllFrames(data) {
    const track = data.track 
    const trackData = { kind: track.kind }
    let transformer = null
    switch(trackData.kind) {
        case 'audio':
            transformer = getAudioFrames()
            
        case 'video':
            transformer = getVideoFrames()  
    }
    return transformer
}

function getVideoFrames () {
    const getFramesTransformer = new TransformStream({
        transform(videoFrame, controller) {  
             const newFrame = videoFrame.clone();
             videoFrame.close();
             controller.enqueue(newFrame);
             self.postMessage({'name': 'new-video-frame', data: newFrame})
         },
         flush() {
            
         }
     });
    return getFramesTransformer
}

function encodeVideoFrames ({encoder}) {
    const encodeFrameTransformer = new TransformStream({
        start(controller) {

        },
        transform(videoFrame, controller) {
            const newFrame = videoFrame.clone();
            const encodedChunk = encoder.encode(newFrame)
            
            videoFrame.close();
            controller.enqueue(encodedChunk)
            
        },
        flush() {}
    })
    return encodeFrameTransformer
}

function decodeVideoFrames ({decoder}) {
    const decodeFrameTransformer = new TransformStream({
        start(controller) {

        },
        transform(encodedChunk, controller) {
            const newFrame = encodedChunk.clone();
            encodedChunk.close()
            const decodedFrame = decoder.decoder(newFrame)

            controller.enqueue(decodedFrame)
            
        },
        flush() {}
    })
    return decodeFrameTransformer
}

function getAudioFrames () {
    const audioTransformer = new TransformStream({
        transform(audioFrame, controller) {  
             const newFrame = audioFrame.clone();
             audioFrame.close();
             controller.enqueue(newFrame);
             self.postMessage({'name': 'new-audio-frame', data: newFrame})
         },
         close() {
            
         }
     });

     return audioTransformer
}

onmessage = (e) => {
    try {
        const name = e.data.name
        const data = e.data.data
        const { readable, writable } = data
        switch(name) {
            case 'get-frames':
                
                // const { readable } = new MediaStreamTrackProcessor({track: track});
                // const { writable } = new MediaStreamTrackGenerator(trackData)
                readable.pipeThrough(getAllFrames(data)).pipeTo(writable)
            case 'export-video':
                const {encoder, decoder} = data
                // const { readable } = new MediaStreamTrackProcessor({track: track});
                // const { writable } = new MediaStreamTrackGenerator(trackData)
                readable.pipeThrough(getAllFrames(data)).pipeThrough(encodeVideoFrames(encoder)).pipeThrough(decodeVideoFrames(decoder)).pipeTo(writable)
    
        }
    } catch (error) {
        console.log(error)
    }
    
}
