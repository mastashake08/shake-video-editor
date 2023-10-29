
function getVideoFrames ({writable, readable}) {
    const vidTransformer = new window.TransformStream({
        transform(videoFrame, controller) {  
             const newFrame = videoFrame.clone();
             videoFrame.close();
             controller.enqueue(newFrame);
             self.postMessage({'name': 'new-video-frame', data: newFrame})
         },
         close() {
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

     return vidTransformer
}

function getAudioFrames ({writable, readable}) {
 
   
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
        const mediaStream = data.mediaStream    
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
                        const vidTransformer = getVideoFrames(transformConfig)
                        readable.pipeThrough(vidTransformer)               
                }
                readable.pipeTo(writable)
            case 'export-video':
                

    
        }
    } catch (error) {
        console.log(error)
    }
    
}
