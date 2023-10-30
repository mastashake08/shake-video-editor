import { ShakeFS } from "@mastashake08/shake-file"
class RecorderTransformer extends TransformStream {
    encodedChunks = []
    fileHandler = null
    writableStream = null
    constructor({
        transformer = this.setTransformer(), 
        writableStrategy = null, 
        readableStrategy = null,
        fileHandler = null
        }) {
            super(transformer, writableStrategy, readableStrategy)
            this.fileHandler = fileHandler === null ? fileHandler : this.setFileHandler()
            this.setWritable()
            
    }


    async setWritable() {
        this.writableStream = await this.fileHandler.createWritable()

    }
    async setFileHandler() {
        const fs = new ShakeFS()
        fs.getFile
    }
    setTransformer() {
        return {
            async transform(chunk, controller) {
                const buff = new ArrayBuffer(chunk.byteLength)
                chunk.copyTo(buff)
                this.encodedChunks.push(chunk)
                this.writableStream.write(buff)
                controller.enqueue(chunk)
                
            },
            async flush(controller) {
            
                await this.writableStream.close();
            }
        }
    }
}

export {
    RecorderTransformer
}