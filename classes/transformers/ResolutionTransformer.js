class ResolutionTransformer extends TransformStream {
    constructor({transformer, 
        writableStrategy = null, 
        readableStrategy = null,
        config = {}}) {
            super(transformer, writableStrategy, readableStrategy)
        }
}