import ShakeEncoder from './ShakeEncoder'
class WebMEncoder extends  ShakeEncoder {
    constructor({
        transformer = {
            start(controller) {
                this.fileHandler = fileHandler
            },
            transform(chunk, controller) {
                const buff = new ArrayBuffer(chunk.byteLength)
                chunk.copyTo(buff)
                this.encodedChunks.push(buff)
                controller.enqueue(chunk)
                
            },
            flush(controller) {
                
            }
        }, 
        writableStrategy = null, 
        readableStrategy = null,
        fileHandler = null
        }) {
        super(transformer)
    }
}

export {
    WebMEncoder
}