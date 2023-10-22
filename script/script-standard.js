// @ts-check

// ******************
//
// Standard Function
//
// ******************

/**
 * Checks whether the passed ID exists and returns the element.
 * @param {string} id
 * @returns {HTMLElement | HTMLImageElement | HTMLInputElement }
 */
function getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} not found!`);
    }
    return element;
}

/**
 * Checks whether the passed ID exists and returns the element.
 * @param {string} id
 * @returns {HTMLImageElement}
 */
function getImageElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} not found!`);
    }
    // @ts-expect-error
    return element;
}

/**
 * Checks whether the passed ID exists and returns the element.
 * @param {string} id
 * @returns {HTMLInputElement}
 */
function getInputElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} not found!`);
    }
    // @ts-expect-error
    return element;
}

/**
 * Create an UUID
 * @returns string with UUID
 */
function getNoteByUUID() {
    const webCrypto = globalThis.crypto;
    return webCrypto.randomUUID();
}
