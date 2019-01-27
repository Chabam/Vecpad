import RendererHelper from './RendererHelper';
import CameraHelper from './CameraHelper';
import SceneHelper from './SceneHelper';

export default class THREEWrapper {
    constructor() {
        this.rendererHelper = new RendererHelper();
        this.cameraHelper = new CameraHelper();
        this.sceneHelper = new SceneHelper();
        this.toolbarElement = null;
        this.sidebarElement = null;
        this.height = 0;
        this.width = 0;
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

    addObjectToScene(object) {
        this.sceneHelper.addObject(object);
    }
}