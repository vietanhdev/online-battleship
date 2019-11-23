"use strict";


let tryOnScene;

let count = 0;
let forwardTimes = []
let withBoxes = true


var address = io.connect();

var socket = io.connect(address);

socket.on('connect', function(){
    console.log('connected to server on root');
});

socket.on('disconnect', function(){
    console.log('disconnected to server on root');
});

function onChangeHideBoundingBoxes(e) {
    withBoxes = !$(e.target).prop('checked')
}

//launched by body.onload() :
function main() {
    Resizer.size_canvas({
        canvasId: 'tryon-canvas',
        callback: function (isError, bestVideoSettings) {
            initVideoStream(bestVideoSettings);
        }
    })
} //end main()

async function initVideoStream(videoSettings) {

    const tryOnCanvasEl =  document.getElementById('tryon-canvas');

    // Create video element
    const videoEl = MediaStreamAPIHelper.get_videoElement();
    videoEl.addEventListener("loadedmetadata", () => {
        onPlay(videoEl);
    });

    // Init 3D Scene
    tryOnScene = new TryOnScene(videoEl, tryOnCanvasEl);

} 


// returns a frame encoded in base64
const getFrame = (videoEl) => {

    const canvas =  document.getElementById('stream-canvas');
    
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0);

    let chunks = canvas.toDataURL('image/jpeg').split(',');
    let binaryString;
    if (chunks[0].indexOf('base64') >= 0) {
        binaryString = atob(chunks[1]);
    }
    else {
        binaryString = unescape(chunks[1]);
    }

    let length = binaryString.length;
    var array = new Array(length);
    for(let i = 0; i < length; i++) {
        array[i] = binaryString.charCodeAt(i);
    }

    return array
}

async function onPlay(videoEl) {
    
    if (videoEl.paused || videoEl.ended)
        return setTimeout(() => onPlay(videoEl))

    socket.emit('image', {'data': getFrame(videoEl)});

    setTimeout(() => onPlay(videoEl), 1000/12)
}


socket.on('response', function(response_object){

    let result = response_object;

    if (result["detections"].length == 0) {
        tryOnScene.update(null);
        return
    }

    let face = result["detections"][0]
    let imWidth = result["image_size"]["width"];
    let imHeight = result["image_size"]["height"];
    let tlX = face["x_min"];
    let tlY = face["y_min"];
    let brX = face["x_max"];
    let brY = face["y_max"];
    let faceSize = (brX - tlX) / imWidth * 0.9;
    let xRelative = 2 * ((tlX + (brX - tlX) * 0.5) / imWidth) - 1;
    let yRelative = - 2 * ((tlY + (brY - tlY) * 0.5) / imHeight) + 1 - 0.1;

    let headPose = {
        detected: face["confidence"],
        rx: -face["pitch"] / 180 * Math.PI, 
        ry: -face["yaw"] / 180 * Math.PI,
        rz: -face["roll"] / 180 * Math.PI,
        s: faceSize,
        x: xRelative, // From -1 to 1, from left to right
        y: yRelative, // From -1 to 1, from bottom to top
    }
    tryOnScene.update(headPose);
    console.log(headPose);
        

})