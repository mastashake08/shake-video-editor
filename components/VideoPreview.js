import { VideoEditor } from "../classes/VideoEditor"
class VideoPreview extends HTMLCanvasElement {
    static observedAttributes = ["video"];
    #video;
    width; 
    height;
    constructor(videoId='') {
        super()
        this.setVideo(videoId)
        this.getContext("2d")
        
    }
    setVideo(videoId) {
        let video = document.getElementById(videoId);
        const host = document.getElementById('app')
        //const shadow = host.attachShadow({ mode: "open" });
        //shadow.appendChild(this);
        console.log(video)
        video.addEventListener('loadedmetadata', function() {
            this.width = video.videoWidth;
            this.height = video.videoHeight;
          });
          
          video.addEventListener('play', function() {
            var $this = this; //cache
            (function loop() {
              if (!$this.paused && !$this.ended) {
                ctx.drawImage($this, 0, 0);
                setTimeout(loop, 1000 / 30); // drawing at 30fps
              }
            })();
          }, 0);
        this.#video = video
    }
    connectedCallback() {
        console.log("Custom element added to page.");
      }
    
      disconnectedCallback() {
        console.log("Custom element removed from page.");
      }
    
      adoptedCallback() {
        console.log("Custom element moved to new page.");
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        console.log(
            `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
          );
          this.setVideo()
      }
}
customElements.define("video-preview", VideoPreview, { extends: 'canvas'});
export {
    VideoPreview
}