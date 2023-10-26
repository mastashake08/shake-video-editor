import { VideoEditor } from "../classes/VideoEditor"
class VideoPreview extends HTMLCanvasElement {
    static observedAttributes = ["video"];
    #video;
    width; 
    height;
    constructor() {
        super()
        this.setVideo()
        this.getContext("2d")
        const host = document.getAttribute('video')
        const shadow = host.attachShadow({ mode: "open" });
        shadow.appendChild(this);
    }
    setVideo() {
        let video = document.getAttribute('video');
        video.addEventListener('loadedmetadata', function() {
            this.width = video.videoWidth;
            this.height = video.videoHeight;
          }).bind(this);
          
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
customElements.define("video-preview", VideoPreview);
export {
    VideoPreview
}