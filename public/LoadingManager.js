import * as THREE from "./vendor/three/build/three.module.js";

export const LoadingManager = (() => {
    let loading_manager;
    let callback = null;

    const loading_screen = document.getElementById('loading-screen');
    const loading_bar = document.getElementById('loading-bar');
    const progress_value = document.getElementById('progress-value');
    const progress_message = document.getElementById('progress-message');

    function create() {
        loading_manager = new THREE.LoadingManager();
        loading_manager.onStart = (path, items_loaded, items_total) => {
            progress_message.textContent = "Loading file: " + path;
            // console.log("Started loading file: " + path + ".\nLoaded " + items_loaded + " of " + items_total + " files.");
        };
        loading_manager.onProgress = (path, items_loaded, items_total) => {
            const progress = (items_loaded / items_total * 100).toFixed(0);
            progress_value.textContent = progress + "%"
            loading_bar.style.setProperty('--loading-bar-value', 45 + (progress * 1.8) + "deg");
            if (path.length < 100)
                progress_message.textContent = "Loading file: " + path;
            // console.log("Loading file: " + path.length);// + ".\nLoaded " + items_loaded + " of " + items_total + " files.");
        };
        loading_manager.onLoad = () => {
            // console.log("Loading complete!");
            progress_message.textContent = "Loading complete!";
            loading_screen.classList.add('hidden');
            if (callback instanceof Function)
                callback();
        };
        loading_manager.onError = (path) => {
            // console.log("There was an error loading " + path);
        };
    }

    return {
        init: function(_callback) {
            callback = _callback;
        },
        instance: function() {
            if (loading_manager == null)
                create();
            Object.freeze(loading_manager);
            return loading_manager;
        }
    };
})();