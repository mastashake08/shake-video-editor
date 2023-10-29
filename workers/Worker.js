onmessage = (e) => {
    const data = e.data
    const reader = data.readable
    
    const transformer = new window.TransformStream({
       transform(videoFrame, controller) {  
            const newFrame = videoFrame.clone();
            videoFrame.close();
            controller.enqueue(newFrame);
            self.postMessage({'name': 'new-frame', data: newFrame})
        }
    });

    reader.pipeThrough(transformer)
    self.postMessage(transformer, [transformer])
}