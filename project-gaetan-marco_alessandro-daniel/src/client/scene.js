import * as THREE from 'three';
import Camera from "./camera.js";

export default class Scene extends THREE.Scene {
    constructor() {
        super();

        // Adds the light to the scene
        {
            const color1 = 0xFFFFFF;
            const intensity1 = 2;
            const light1 = new THREE.DirectionalLight(color1, intensity1);
            light1.position.set(-5, 5, -3);
            this.add(light1);

            const color2 = 0x4477FF;
            const intensity2 = 0.7;
            const light2 = new THREE.DirectionalLight(color2, intensity2);
            light2.position.set(5, -5, 3);
            this.add(light2);
        }

        // Loads the skybox
        {
            const loader = new THREE.CubeTextureLoader();
            this.background = loader.load([
                './resources/images/cubemaps/bkg1_right.png',
                './resources/images/cubemaps/bkg1_left.png',
                './resources/images/cubemaps/bkg1_top.png',
                './resources/images/cubemaps/bkg1_bot.png',
                './resources/images/cubemaps/bkg1_front.png',
                './resources/images/cubemaps/bkg1_back.png',
            ]);
        }

        // DEBUG axes helper
        this.gridHelper = new THREE.GridHelper( 5000, 100 );
        this.axesHelper = new THREE.AxesHelper(1000)
    }

    setDebug(enabled) {
        if (enabled) {
            this.add(this.gridHelper);
            this.add(this.axesHelper);
        } else {
            this.remove(this.gridHelper);
            this.remove(this.axesHelper);
        }
    }
}
