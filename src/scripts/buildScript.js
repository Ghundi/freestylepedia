import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';

import fs from 'fs';
import yaml from 'js-yaml';

import {useVideoStore} from "./store.js";

// Function to read YAML file
function readYamlFile(filePath) {
    try {
        // Read the file using fs (synchronously for simplicity)
        const fileContents = fs.readFileSync(filePath, 'utf8');

        // Parse the YAML content
        return yaml.load(fileContents);
    } catch (err) {
        console.error(`Error reading YAML file: ${err.message}`);
    }
}

function writeYamlFile(filePath, data) {
    try {
        // Use custom YAML dump options to reduce size
        const yamlString = yaml.dump(data, {
            noRefs: true,      // Avoid duplicate references
            lineWidth: -1,     // Disable line wrapping for more compact output
            quotingType: '"',  // Use double quotes only when necessary
            noCompatMode: true // Do not escape special characters unnecessarily
        });

        // Write the YAML string to a file
        fs.writeFileSync(filePath, yamlString, 'utf8');
    } catch (err) {
        console.error(`Error writing YAML file: ${err.message}`);
    }
}

async function runBuildScript() {
    // Create a Vue instance for server-side use
    const app = createSSRApp({});

    // Create a Pinia instance and use it with the app
    const pinia = createPinia();
    app.use(pinia);

    const videoStore = useVideoStore();

    // loading yaml
    const tricks = readYamlFile('../DB/freestylepedia.yaml');
    videoStore.videos = videoStore.loadYAML(tricks);
    const trickTree = videoStore.getTrickTreeGraph(videoStore, tricks, 'portrait');

    for (let i = 0; i < trickTree[0].length; i++) {
        if(trickTree[0][i].type == "clickable") {
            delete trickTree[0][i].data.n_children;
        }
    }

    writeYamlFile('../DB/trickTree.yaml', trickTree);
    console.log('TrickTree written to Yaml file');
}

runBuildScript();