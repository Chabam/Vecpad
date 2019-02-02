import RendererHelper from './RendererHelper';
import CameraHelper from './CameraHelper';
import SceneHelper from './SceneHelper';
import ObjectHelper from './ObjectHelper';

export default class THREEHelper {
    constructor() {
        this.rendererHelper = new RendererHelper();
        this.cameraHelper = new CameraHelper();
        this.sceneHelper = new SceneHelper();
        this.objectHelper = new ObjectHelper();
        this.toolbarElement = null;
        this.sidebarElement = null;
        this.height = 0;
        this.width = 0;
        this.groundSize = 2;
        this.ground = this.objectHelper.createGround(this.groundSize);
        this.sceneHelper.addObject(this.ground);
    }

    init() {
        this.toolbarElement = document.getElementById('toolbar');
        this.sidebarElement = document.getElementById('sidebar');
        this.setDimensions();

        let rendererDomElem = this.rendererHelper.init(this.width, this.height);
        this.cameraHelper.init(this.width / this.height, rendererDomElem);

        document.getElementById('visualizer').appendChild(rendererDomElem);
        window.addEventListener('resize', () => this.setDimensions(true));

        this.renderLoop();
    }

    setDimensions(update=false) {
        let sidebarWidth = this.sidebarElement.offsetWidth;
        let toolbarHeight = this.toolbarElement.offsetHeight;
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let width = windowWidth - sidebarWidth;
        let height = windowHeight - toolbarHeight;
        if (this.width !== width || this.height !== height) {
            this.height = height;
            this.width = width;
            if (update) {
                this.cameraHelper.setAspectRatio(this.width / this.height);
                this.rendererHelper.setSize(this.width, this.height);
            }
        }
    }

    renderLoop() {
        let loop = () => {
            requestAnimationFrame(loop);
            this.rendererHelper.render(this.sceneHelper.THREEScene, this.cameraHelper.THREECamera);
        }
        loop();
    }

    addTriangle(sideWidth, color, outlineColor) {
        let triangle = this.objectHelper.createTriangle(sideWidth, color, outlineColor);
        this.sceneHelper.addObject(triangle);
    }

    addQuad(width, height, color, outlineColor) {
        let quad = this.objectHelper.createQuad(width, height, color, outlineColor);
        this.sceneHelper.addObject(quad);
    }

    addCube(width, height, depth, color, outlineColor) {
        let cube = this.objectHelper.createCube(width, height, depth, color, outlineColor);
        this.sceneHelper.addObject(cube);
    }

    setDisplayMode(mode) {
        this.sceneHelper.applyDisplayMode(mode, this.ground);
    }
}