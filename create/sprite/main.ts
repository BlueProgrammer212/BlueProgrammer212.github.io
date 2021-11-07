importScripts("./js/Math.ts");
const token_id : string = '730868686856-lkanp3tois4cj938t2g794cebadtqkoo.apps.googleusercontent.com';

async function loadJSON(path : string): Promise<JSON> {
    return fetch(path).then(a => a.json());
}


