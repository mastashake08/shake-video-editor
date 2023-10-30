class RecorderTransformer extends TransformStream {
    encodedChunks = []
    file = null
    constructor({
        transformer = {
            transform(chunk, controller) {
                const buff = new ArrayBuffer(chunk.byteLength)
                chunk.copyTo(buff)
                this.encodedChunks.push(buff)
                controller.enqueue(chunk)
                
            },
            flush(controller) {
                this.file = new
            }
        }, 
        writableStrategy = null, 
        readableStrategy = null,
        fileHandler = null
        }) {
            super(transformer, writableStrategy, readableStrategy)
            this.fileHandler = fileHandler
    }
}

export {
    RecorderTransformer
}