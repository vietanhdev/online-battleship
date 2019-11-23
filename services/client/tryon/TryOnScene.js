class TryOnScene {

    SETTINGS = {
        cameraFOV: 40 // in degrees, 3D camera FOV
    };

    
    // Three.js Scene
    THREECAMERA;
    GLASSESOBJ3D = new THREE.Object3D();
    frameMesh;
    lensesMesh;
    branchesMesh;
    decoMesh;

    // Video and canvas elements
    videoEl;
    tryOnCanvasEl;
    GL;
    videoTexture;


    // Headpose resultt
    lastHeadPose = null;

    constructor(videoEl, tryOnCanvasEl) {

        // Save DOM elements
        this.videoEl = videoEl;
        this.tryOnCanvasEl = tryOnCanvasEl;

        MediaStreamAPIHelper.get(videoEl, (videoEl) => {
    
            // Resize canvas to video size
            tryOnCanvasEl.setAttribute("width", videoEl.videoWidth);
            tryOnCanvasEl.setAttribute("height", videoEl.videoHeight);
    
            // Init three.js scene
            this.GL = this.tryOnCanvasEl.getContext('webgl2');
            this.videoTexture = this.makeTextureFrom(this.GL, this.videoEl);
            let spec = {
                canvasElement: tryOnCanvasEl,
                GL: this.GL,
                videoTexture: this.videoTexture,
                maxFacesDetected: 1,
            }
            this.initThreeScene(spec);
            
        }, () => {
            alert('Cannot get video bro :(');
        }, {
            video: {
                width: 600,
                height: 600
            }, // mediaConstraints
            audio: false
        });
    }

    // callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
    detect_callback(isDetected) {
        if (isDetected) {
            console.log('INFO in detect_callback() : DETECTED');
        } else {
            console.log('INFO in detect_callback() : LOST');
        }
    }

    // build the 3D. called once when  Face Filter is OK
    initThreeScene(spec) {
        const threeStuffs = THREE.Helper.init(spec, this.detect_callback);

        const loadingManager = new THREE.LoadingManager();

        // CREATE OUR FRAME
        const loaderFrame = new THREE.BufferGeometryLoader(loadingManager);

        loaderFrame.load(
            './3d_models/glasses/frame.json',
            (geometry) => {
                const mat = new THREE.MeshPhongMaterial({
                    color: 0x000000,
                    shininess: 6,
                    specular: 0xffffff,
                    transparent: true
                });

                this.frameMesh = new THREE.Mesh(geometry, mat);
                this.frameMesh.scale.multiplyScalar(0.0067);
                this.frameMesh.frustumCulled = false;
                this.frameMesh.renderOrder = 10000;
            }
        );

        // CREATE OUR LENSES
        const loaderLenses = new THREE.BufferGeometryLoader(loadingManager);

        loaderLenses.load(
            './3d_models/glasses/lenses.json',
            (geometry) => {
                const mat = new THREE.MeshBasicMaterial({
                    //map: new THREE.TextureLoader().load('./3d_models/glasses/texture_mp.jpg'),
                    opacity: 0.7,
                    color: 0x2233aa,
                    transparent: true
                });

                this.lensesMesh = new THREE.Mesh(geometry, mat);
                this.lensesMesh.scale.multiplyScalar(0.0067);
                this.lensesMesh.frustumCulled = false;
                this.lensesMesh.renderOrder = 10000;
            }
        );
        // CREATE OUR BRANCHES
        const loaderBranches = new THREE.BufferGeometryLoader(loadingManager);

        loaderBranches.load(
            './3d_models/glasses/branches.json',
            (geometry) => {
                const mat = new THREE.MeshBasicMaterial({
                    alphaMap: new THREE.TextureLoader().load('./3d_models/glasses/alpha_branches.jpg'),
                    map: new THREE.TextureLoader().load('./3d_models/glasses/textureBlack.jpg'),
                    transparent: true
                });

                this.branchesMesh = new THREE.Mesh(geometry, mat);
                this.branchesMesh.scale.multiplyScalar(0.0067);
                this.branchesMesh.frustumCulled = false;
                this.branchesMesh.renderOrder = 10000;
            }
        );

        // CREATE OUR DECO
        const loaderDeco = new THREE.BufferGeometryLoader(loadingManager);

        loaderDeco.load(
            './3d_models/glasses/deco.json',
            (geometry) => {
                const mat = new THREE.MeshBasicMaterial({
                    color: 0xffffff
                });

                this.decoMesh = new THREE.Mesh(geometry, mat);
                this.decoMesh.scale.multiplyScalar(0.0067);

                this.decoMesh.frustumCulled = false;
                this.decoMesh.renderOrder = 10000;
            }
        );

        loadingManager.onLoad = () => {
            this.GLASSESOBJ3D.add(this.branchesMesh, this.frameMesh, this.lensesMesh, this.decoMesh);
            this.GLASSESOBJ3D.scale.multiplyScalar(1.1);
            this.GLASSESOBJ3D.position.setY(0.05); //move glasses a bit up
            this.GLASSESOBJ3D.position.setZ(0.25); //move glasses a bit forward
            window.zou = this.GLASSESOBJ3D;

            addDragEventListener(this.GLASSESOBJ3D);

            threeStuffs.faceObject.add(this.GLASSESOBJ3D);
        };


        // CREATE THE VIDEO BACKGROUND
        function create_mat2d(threeTexture, isTransparent) { //MT216 : we put the creation of the video material in a func because we will also use it for the frame
            return new THREE.RawShaderMaterial({
                depthWrite: false,
                depthTest: false,
                transparent: isTransparent,
                vertexShader: "attribute vec2 position;\n\
                varying vec2 vUV;\n\
                void main(void){\n\
                    gl_Position=vec4(position, 0., 1.);\n\
                    vUV=0.5+0.5*position;\n\
                }",
                fragmentShader: "precision lowp float;\n\
                uniform sampler2D samplerVideo;\n\
                varying vec2 vUV;\n\
                void main(void){\n\
                    gl_FragColor=texture2D(samplerVideo, vUV);\n\
                }",
                uniforms: {
                    samplerVideo: {
                        value: threeTexture
                    }
                }
            });
        }

        //MT216 : create the frame. We reuse the geometry of the video
        const calqueMesh = new THREE.Mesh(threeStuffs.videoMesh.geometry, create_mat2d(new THREE.TextureLoader().load('./images/frame.png'), true))
        calqueMesh.renderOrder = 999; // render last
        calqueMesh.frustumCulled = false;
        threeStuffs.scene.add(calqueMesh);

        // CREATE THE CAMERA
        const aspecRatio = spec.canvasElement.width / spec.canvasElement.height;
        this.THREECAMERA = new THREE.PerspectiveCamera(this.SETTINGS.cameraFOV, aspecRatio, 0.1, 100);

        // CREATE A LIGHT
        const ambient = new THREE.AmbientLight(0xffffff, 1);
        threeStuffs.scene.add(ambient)

        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(100, 1000, 100);

        threeStuffs.scene.add(dirLight)
    } // end initThreeScene()



    makeTextureFrom(gl, videoElement) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);
        // Turn off mips and set  wrapping to clamp to edge so it
        // will work regardless of the dimensions of the video.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        // tidy up
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    
    
    
    updateTexture(gl, texture, videoElement) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoElement);
    }



    update(headPose) {

        if (!this.GL || !this.videoTexture || !this.videoEl) return;

        if (headPose) {
            this.updateTexture(this.GL, this.videoTexture, this.videoEl);
            THREE.Helper.render(headPose, this.THREECAMERA);
            this.lastHeadPose = headPose;
        } else if (this.lastHeadPose) {
            this.updateTexture(this.GL, this.videoTexture, this.videoEl);
            THREE.Helper.render(this.lastHeadPose, this.THREECAMERA);
        }

    }
    


}