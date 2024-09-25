'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var auth = require('aws-amplify/auth');
var react = require('@xstate/react');
var nanoid = require('nanoid');
var xstate = require('xstate');
var tfjsCore = require('@tensorflow/tfjs-core');
var faceDetection = require('@tensorflow-models/face-detection');
var tfjsBackendWasm = require('@tensorflow/tfjs-backend-wasm');
require('@tensorflow/tfjs-backend-cpu');
var utils = require('@aws-amplify/core/internals/utils');
var clientRekognitionstreaming = require('@aws-sdk/client-rekognitionstreaming');
var utilFormatUrl = require('@aws-sdk/util-format-url');
var eventstreamSerdeBrowser = require('@smithy/eventstream-serde-browser');
var fetchHttpHandler = require('@smithy/fetch-http-handler');
var protocolHttp = require('@smithy/protocol-http');
var signatureV4 = require('@smithy/signature-v4');
var uiReact = require('@aws-amplify/ui-react');
var ui = require('@aws-amplify/ui');
var internal = require('@aws-amplify/ui-react/internal');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

/**
 * The abstract class representing FaceDetection
 * to be implemented for different libraries.
 */
class FaceDetection {
    /**
     * Triggers the `loadModels` method and stores
     * the corresponding promise to be awaited later.
     */
    triggerModelLoading() {
        this.modelLoadingPromise = this.loadModels();
    }
}

/**
 * The illumination states
 */
var IlluminationState;
(function (IlluminationState) {
    IlluminationState["DARK"] = "dark";
    IlluminationState["BRIGHT"] = "bright";
    IlluminationState["NORMAL"] = "normal";
})(IlluminationState || (IlluminationState = {}));
/**
 * The detected face states with respect to the liveness oval
 */
var FaceMatchState;
(function (FaceMatchState) {
    FaceMatchState["MATCHED"] = "MATCHED";
    FaceMatchState["TOO_FAR"] = "TOO FAR";
    FaceMatchState["CANT_IDENTIFY"] = "CANNOT IDENTIFY";
    FaceMatchState["FACE_IDENTIFIED"] = "ONE FACE IDENTIFIED";
    FaceMatchState["TOO_MANY"] = "TOO MANY FACES";
    FaceMatchState["OFF_CENTER"] = "OFF CENTER";
})(FaceMatchState || (FaceMatchState = {}));

/**
 * The liveness error states
 */
const LivenessErrorState = {
    CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',
    TIMEOUT: 'TIMEOUT',
    RUNTIME_ERROR: 'RUNTIME_ERROR',
    FRESHNESS_TIMEOUT: 'FRESHNESS_TIMEOUT',
    SERVER_ERROR: 'SERVER_ERROR',
    CAMERA_FRAMERATE_ERROR: 'CAMERA_FRAMERATE_ERROR',
    CAMERA_ACCESS_ERROR: 'CAMERA_ACCESS_ERROR',
    FACE_DISTANCE_ERROR: 'FACE_DISTANCE_ERROR',
    MOBILE_LANDSCAPE_ERROR: 'MOBILE_LANDSCAPE_ERROR',
    MULTIPLE_FACES_ERROR: 'MULTIPLE_FACES_ERROR',
};

// Face distance is calculated as pupilDistance / ovalWidth.
// The further away you are from the camera the distance between your pupils will decrease, thus lowering the threshold values.
// These FACE_DISTANCE_THRESHOLD values are determined by the science team and should only be changed with their approval.
// We want to ensure at the start of a  check that the user's pupilDistance/ovalWidth is below FACE_DISTANCE_THRESHOLD to ensure that they are starting
//  a certain distance away from the camera.
const FACE_DISTANCE_THRESHOLD = 0.32;
const REDUCED_THRESHOLD = 0.4;
const REDUCED_THRESHOLD_MOBILE = 0.37;
// Constants from science team to determine ocular distance (space between eyes)
const PUPIL_DISTANCE_WEIGHT = 2.0;
const FACE_HEIGHT_WEIGHT = 1.8;
// Constants from science team to find face match percentage
const FACE_MATCH_RANGE_MIN = 0;
const FACE_MATCH_RANGE_MAX = 1;
const FACE_MATCH_WEIGHT_MIN = 0.25;
const FACE_MATCH_WEIGHT_MAX = 0.75;
const WS_CLOSURE_CODE = {
    SUCCESS_CODE: 1000,
    DEFAULT_ERROR_CODE: 4000,
    FACE_FIT_TIMEOUT: 4001,
    USER_CANCEL: 4003,
    RUNTIME_ERROR: 4005,
    USER_ERROR_DURING_CONNECTION: 4007,
};

/**
 * Returns the random number between min and max
 * seeded with the provided random seed.
 */
function getScaledValueFromRandomSeed(randomSeed, min, max) {
    return randomSeed * (max - min) + min;
}
/**
 * Returns the bounding box details from an oval
 */
function getOvalBoundingBox(ovalDetails) {
    const minOvalX = ovalDetails.flippedCenterX - ovalDetails.width / 2;
    const maxOvalX = ovalDetails.flippedCenterX + ovalDetails.width / 2;
    const minOvalY = ovalDetails.centerY - ovalDetails.height / 2;
    const maxOvalY = ovalDetails.centerY + ovalDetails.height / 2;
    const ovalBoundingBox = {
        left: minOvalX,
        top: minOvalY,
        right: maxOvalX,
        bottom: maxOvalY,
    };
    return { ovalBoundingBox, minOvalX, maxOvalX, minOvalY, maxOvalY };
}
/**
 * Returns the ratio of intersection and union of two bounding boxes.
 */
function getIntersectionOverUnion(box1, box2) {
    const xA = Math.max(box1.left, box2.left);
    const yA = Math.max(box1.top, box2.top);
    const xB = Math.min(box1.right, box2.right);
    const yB = Math.min(box1.bottom, box2.bottom);
    const intersectionArea = Math.abs(Math.max(0, xB - xA) * Math.max(0, yB - yA));
    if (intersectionArea === 0) {
        return 0;
    }
    const boxAArea = Math.abs((box1.right - box1.left) * (box1.bottom - box1.top));
    const boxBArea = Math.abs((box2.right - box2.left) * (box2.bottom - box2.top));
    return intersectionArea / (boxAArea + boxBArea - intersectionArea);
}
/**
 * Returns the details of a randomly generated liveness oval
 * from SDK
 */
function getOvalDetailsFromSessionInformation({ sessionInformation, videoWidth, }) {
    const ovalParameters = sessionInformation?.Challenge?.FaceMovementAndLightChallenge
        ?.OvalParameters;
    if (!ovalParameters ||
        !ovalParameters.CenterX ||
        !ovalParameters.CenterY ||
        !ovalParameters.Width ||
        !ovalParameters.Height) {
        throw new Error('Oval parameters not returned from session information.');
    }
    // We need to include a flippedCenterX for visualizing the oval on a flipped camera view
    // The camera view we show the customer is flipped to making moving left and right more obvious
    // The video stream sent to the liveness service is not flipped
    return {
        flippedCenterX: videoWidth - ovalParameters.CenterX,
        centerX: ovalParameters.CenterX,
        centerY: ovalParameters.CenterY,
        width: ovalParameters.Width,
        height: ovalParameters.Height,
    };
}
/**
 * Returns the details of a statically generated liveness oval based on the video dimensions
 */
function getStaticLivenessOvalDetails({ width, height, widthSeed = 1.0, centerXSeed = 0.5, centerYSeed = 0.5, ratioMultiplier = 0.8, }) {
    const videoHeight = height;
    let videoWidth = width;
    const ovalRatio = widthSeed * ratioMultiplier;
    const minOvalCenterX = Math.floor((7 * width) / 16);
    const maxOvalCenterX = Math.floor((9 * width) / 16);
    const minOvalCenterY = Math.floor((7 * height) / 16);
    const maxOvalCenterY = Math.floor((9 * height) / 16);
    const centerX = getScaledValueFromRandomSeed(centerXSeed, minOvalCenterX, maxOvalCenterX);
    const centerY = getScaledValueFromRandomSeed(centerYSeed, minOvalCenterY, maxOvalCenterY);
    if (width >= height) {
        videoWidth = (3 / 4) * videoHeight;
    }
    const ovalWidth = ovalRatio * videoWidth;
    const ovalHeight = 1.618 * ovalWidth;
    return {
        flippedCenterX: Math.floor(videoWidth - centerX),
        centerX: Math.floor(centerX),
        centerY: Math.floor(centerY),
        width: Math.floor(ovalWidth),
        height: Math.floor(ovalHeight),
    };
}
/**
 * Draws the provided liveness oval on the canvas.
 */
function drawLivenessOvalInCanvas({ canvas, oval, scaleFactor, videoEl, isStartScreen, }) {
    const { flippedCenterX, centerY, width, height } = oval;
    const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.restore();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // fill the canvas with a transparent rectangle
        ctx.fillStyle = isStartScreen
            ? getComputedStyle(canvas).getPropertyValue('--amplify-colors-background-primary')
            : '#fff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // On mobile our canvas is the width/height of the full screen.
        // We need to calculate horizontal and vertical translation to reposition
        // our canvas drawing so the oval is still placed relative to the dimensions
        // of the video element.
        const baseDims = { width: videoEl.videoWidth, height: videoEl.videoHeight };
        const translate = {
            x: (canvasWidth - baseDims.width * scaleFactor) / 2,
            y: (canvasHeight - baseDims.height * scaleFactor) / 2,
        };
        // Set the transform to scale
        ctx.setTransform(scaleFactor, 0, 0, scaleFactor, translate.x, translate.y);
        // draw the oval path
        ctx.beginPath();
        ctx.ellipse(flippedCenterX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
        // add stroke to the oval path
        ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--amplify-colors-border-secondary');
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.save();
        ctx.clip();
        // Restore default canvas transform matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // clear the oval content from the rectangle
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
    else {
        throw new Error('Cannot find Canvas.');
    }
}
function drawStaticOval(canvasEl, videoEl, videoMediaStream) {
    const { width, height } = videoMediaStream.getTracks()[0].getSettings();
    // Get width/height of video element so we can compute scaleFactor
    // and set canvas width/height.
    const { width: videoScaledWidth, height: videoScaledHeight } = videoEl.getBoundingClientRect();
    canvasEl.width = Math.ceil(videoScaledWidth);
    canvasEl.height = Math.ceil(videoScaledHeight);
    const ovalDetails = getStaticLivenessOvalDetails({
        width: width,
        height: height,
        ratioMultiplier: 0.5,
    });
    ovalDetails.flippedCenterX = width - ovalDetails.centerX;
    // Compute scaleFactor which is how much our video element is scaled
    // vs the intrinsic video resolution
    const scaleFactor = videoScaledWidth / videoEl.videoWidth;
    // Draw oval in canvas using ovalDetails and scaleFactor
    drawLivenessOvalInCanvas({
        canvas: canvasEl,
        oval: ovalDetails,
        scaleFactor,
        videoEl: videoEl,
        isStartScreen: true,
    });
}
function clearOvalCanvas({ canvas, }) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.restore();
        ctx.clearRect(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    }
    else {
        throw new Error('Cannot find Canvas.');
    }
}
function getPupilDistanceAndFaceHeight(face) {
    const { leftEye, rightEye, mouth } = face;
    const eyeCenter = [];
    eyeCenter[0] = (leftEye[0] + rightEye[0]) / 2;
    eyeCenter[1] = (leftEye[1] + rightEye[1]) / 2;
    const pupilDistance = Math.sqrt((leftEye[0] - rightEye[0]) ** 2 + (leftEye[1] - rightEye[1]) ** 2);
    const faceHeight = Math.sqrt((eyeCenter[0] - mouth[0]) ** 2 + (eyeCenter[1] - mouth[1]) ** 2);
    return { pupilDistance, faceHeight };
}
function generateBboxFromLandmarks(face, oval, frameHeight) {
    const { leftEye, rightEye, nose, leftEar, rightEar } = face;
    const { height: ovalHeight, centerY } = oval;
    const ovalTop = centerY - ovalHeight / 2;
    const eyeCenter = [];
    eyeCenter[0] = (leftEye[0] + rightEye[0]) / 2;
    eyeCenter[1] = (leftEye[1] + rightEye[1]) / 2;
    const { pupilDistance: pd, faceHeight: fh } = getPupilDistanceAndFaceHeight(face);
    const ocularWidth = (PUPIL_DISTANCE_WEIGHT * pd + FACE_HEIGHT_WEIGHT * fh) / 2;
    let centerFaceX, centerFaceY;
    if (eyeCenter[1] <= (ovalTop + ovalHeight) / 2) {
        centerFaceX = (eyeCenter[0] + nose[0]) / 2;
        centerFaceY = (eyeCenter[1] + nose[1]) / 2;
    }
    else {
        // when face tilts down
        centerFaceX = eyeCenter[0];
        centerFaceY = eyeCenter[1];
    }
    const faceWidth = ocularWidth;
    const faceHeight = 1.68 * faceWidth;
    const top = Math.max(centerFaceY - faceHeight / 2, 0);
    const bottom = Math.min(centerFaceY + faceHeight / 2, frameHeight);
    const left = Math.min(centerFaceX - ocularWidth / 2, rightEar[0]);
    const right = Math.max(centerFaceX + ocularWidth / 2, leftEar[0]);
    return { bottom, left, right, top };
}
/**
 * Returns the illumination state in the provided video frame.
 */
function estimateIllumination(videoEl) {
    const canvasEl = document.createElement('canvas');
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    const ctx = canvasEl.getContext('2d');
    if (ctx) {
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
        // histogram
        const MAX_SCALE = 8;
        const hist = new Array(MAX_SCALE).fill(0);
        for (let i = 0; i < frame.length; i++) {
            const luma = Math.round(frame[i++] * 0.2126 + frame[i++] * 0.7152 + frame[i++] * 0.0722);
            hist[luma % 32]++;
        }
        let ind = -1, maxCount = 0;
        for (let i = 0; i < MAX_SCALE; i++) {
            if (hist[i] > maxCount) {
                maxCount = hist[i];
                ind = i;
            }
        }
        canvasEl.remove();
        if (ind === 0)
            return IlluminationState.DARK;
        if (ind === MAX_SCALE)
            return IlluminationState.BRIGHT;
        return IlluminationState.NORMAL;
    }
    else {
        throw new Error('Cannot find Video Element.');
    }
}
/**
 * Checks if the provided media device is a virtual camera.
 * @param device
 */
function isCameraDeviceVirtual(device) {
    return device.label.toLowerCase().includes('virtual');
}
const INITIAL_ALPHA = 0.9;
const SECONDARY_ALPHA = 0.75;
function fillFractionalContext({ ctx, prevColor, nextColor, fraction, }) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.fillStyle = nextColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight * fraction);
    if (fraction !== 1) {
        ctx.fillStyle = prevColor;
        ctx.fillRect(0, canvasHeight * fraction, canvasWidth, canvasHeight * (1 - fraction));
    }
}
function fillOverlayCanvasFractional({ overlayCanvas, prevColor, nextColor, videoEl, ovalDetails, heightFraction, scaleFactor, }) {
    const { x: videoX, y: videoY } = videoEl.getBoundingClientRect();
    const { flippedCenterX, centerY, width, height } = ovalDetails;
    const updatedCenterX = flippedCenterX * scaleFactor + videoX;
    const updatedCenterY = centerY * scaleFactor + videoY;
    const canvasWidth = overlayCanvas.width;
    const canvasHeight = overlayCanvas.height;
    const ctx = overlayCanvas.getContext('2d');
    if (ctx) {
        // Because the canvas is set to to 100% we need to manually set the height for the canvas to use pixel values
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // fill the complete canvas
        fillFractionalContext({
            ctx,
            prevColor,
            nextColor,
            fraction: heightFraction,
        });
        // save the current state
        ctx.save();
        // draw the rectangle path and fill it
        ctx.beginPath();
        ctx.rect(0, 0, canvasWidth, canvasHeight);
        ctx.clip();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = INITIAL_ALPHA;
        fillFractionalContext({
            ctx,
            prevColor,
            nextColor,
            fraction: heightFraction,
        });
        // draw the oval path and fill it
        ctx.beginPath();
        ctx.ellipse(updatedCenterX, updatedCenterY, (width * scaleFactor) / 2, (height * scaleFactor) / 2, 0, 0, 2 * Math.PI);
        // add stroke to the oval path
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.clip();
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = SECONDARY_ALPHA;
        fillFractionalContext({
            ctx,
            prevColor,
            nextColor,
            fraction: heightFraction,
        });
        // restore the state
        ctx.restore();
    }
    else {
        throw new Error('Cannot find Overlay Canvas.');
    }
}
const isClientFreshnessColorSequence = (obj) => !!obj;
function getColorsSequencesFromSessionInformation(sessionInformation) {
    const colorSequenceFromSessionInfo = sessionInformation.Challenge.FaceMovementAndLightChallenge
        .ColorSequences ?? [];
    const colorSequences = colorSequenceFromSessionInfo.map(({ FreshnessColor, DownscrollDuration: downscrollDuration, FlatDisplayDuration: flatDisplayDuration, }) => {
        const colorArray = FreshnessColor.RGB;
        const color = `rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`;
        return typeof color !== 'undefined' &&
            typeof downscrollDuration !== 'undefined' &&
            typeof flatDisplayDuration !== 'undefined'
            ? {
                color,
                downscrollDuration,
                flatDisplayDuration,
            }
            : undefined;
    });
    return colorSequences.filter(isClientFreshnessColorSequence);
}
function getRGBArrayFromColorString(colorStr) {
    return colorStr
        .slice(colorStr.indexOf('(') + 1, colorStr.indexOf(')'))
        .split(',')
        .map((str) => parseInt(str));
}
async function getFaceMatchState(faceDetector, videoEl) {
    const detectedFaces = await faceDetector.detectFaces(videoEl);
    let faceMatchState;
    switch (detectedFaces.length) {
        case 0: {
            //no face detected;
            faceMatchState = FaceMatchState.CANT_IDENTIFY;
            break;
        }
        case 1: {
            //exactly one face detected, match face with oval;
            faceMatchState = FaceMatchState.FACE_IDENTIFIED;
            break;
        }
        default: {
            //more than one face detected ;
            faceMatchState = FaceMatchState.TOO_MANY;
            break;
        }
    }
    return faceMatchState;
}
async function isFaceDistanceBelowThreshold({ faceDetector, videoEl, ovalDetails, reduceThreshold = false, isMobile = false, }) {
    const detectedFaces = await faceDetector.detectFaces(videoEl);
    let detectedFace;
    let isDistanceBelowThreshold = false;
    let error;
    switch (detectedFaces.length) {
        case 0: {
            //no face detected;
            error = LivenessErrorState.FACE_DISTANCE_ERROR;
            break;
        }
        case 1: {
            //exactly one face detected, match face with oval;
            detectedFace = detectedFaces[0];
            const { width } = ovalDetails;
            const { pupilDistance, faceHeight } = getPupilDistanceAndFaceHeight(detectedFace);
            const calibratedPupilDistance = (PUPIL_DISTANCE_WEIGHT * pupilDistance +
                FACE_HEIGHT_WEIGHT * faceHeight) /
                2 /
                PUPIL_DISTANCE_WEIGHT;
            if (width) {
                isDistanceBelowThreshold =
                    calibratedPupilDistance / width <
                        (!reduceThreshold
                            ? FACE_DISTANCE_THRESHOLD
                            : isMobile
                                ? REDUCED_THRESHOLD_MOBILE
                                : REDUCED_THRESHOLD);
                if (!isDistanceBelowThreshold) {
                    error = LivenessErrorState.FACE_DISTANCE_ERROR;
                }
            }
            break;
        }
        default: {
            //more than one face detected
            error = LivenessErrorState.MULTIPLE_FACES_ERROR;
            break;
        }
    }
    return { isDistanceBelowThreshold, error };
}
function getBoundingBox({ deviceHeight, deviceWidth, height, width, top, left, }) {
    return {
        Height: height / deviceHeight,
        Width: width / deviceWidth,
        Top: top / deviceHeight,
        Left: left / deviceWidth,
    };
}

/**
 * Checks whether WebAssembly is supported in the current environment.
 */
function isWebAssemblySupported() {
    try {
        return (!!window.WebAssembly &&
            (!!window.WebAssembly.compile || !!window.WebAssembly.compileStreaming));
    }
    catch (e) {
        return false;
    }
}

const BLAZEFACE_VERSION = '1.0.2';
/**
 *   WARNING: When updating these links,
 *   also make sure to update documentation and the link in the canary/e2e test "canary/e2e/features/liveness/face-detect.feature"
 */
const DEFAULT_BLAZEFACE_URL = `https://cdn.liveness.rekognition.amazonaws.com/face-detection/tensorflow-models/blazeface/${BLAZEFACE_VERSION}/model/model.json`;
const DEFAULT_TFJS_WASM_URL = `https://cdn.liveness.rekognition.amazonaws.com/face-detection/tensorflow/tfjs-backend-wasm/${tfjsBackendWasm.version_wasm}/`;
/**
 * The BlazeFace implementation of the FaceDetection interface.
 */
class BlazeFaceFaceDetection extends FaceDetection {
    constructor(binaryPath, faceModelUrl) {
        super();
        this.faceModelUrl = faceModelUrl ?? DEFAULT_BLAZEFACE_URL;
        this.binaryPath = binaryPath ?? DEFAULT_TFJS_WASM_URL;
    }
    async loadModels() {
        if (isWebAssemblySupported()) {
            await this._loadWebAssemblyBackend();
        }
        else {
            await this._loadCPUBackend();
        }
        try {
            await tfjsCore.ready();
            this._model = await faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector, {
                runtime: 'tfjs',
                detectorModelUrl: this.faceModelUrl,
            });
        }
        catch (e) {
            throw new Error('There was an error loading the blazeface model. If you are using a custom blazeface model url ensure that it is a fully qualified url that returns a json file.');
        }
    }
    async detectFaces(videoEl) {
        const flipHorizontal = true;
        const predictions = await this._model.estimateFaces(videoEl, {
            flipHorizontal,
        });
        const timestampMs = Date.now();
        const faces = predictions.map((prediction) => {
            const { box, keypoints } = prediction;
            const { xMin: left, yMin: top, width, height } = box;
            const rightEye = this._getCoordinate(keypoints, 'rightEye');
            const leftEye = this._getCoordinate(keypoints, 'leftEye');
            const nose = this._getCoordinate(keypoints, 'noseTip');
            const mouth = this._getCoordinate(keypoints, 'mouthCenter');
            const rightEar = this._getCoordinate(keypoints, 'rightEarTragion');
            const leftEar = this._getCoordinate(keypoints, 'leftEarTragion');
            const probability = [90];
            return {
                top,
                left,
                width,
                height,
                timestampMs,
                probability: probability[0],
                rightEye,
                leftEye,
                mouth,
                nose,
                rightEar,
                leftEar,
            };
        });
        return faces;
    }
    _getCoordinate(keypoints, name) {
        const keypoint = keypoints.find((k) => k.name === name);
        return [keypoint.x, keypoint.y];
    }
    async _loadWebAssemblyBackend() {
        try {
            tfjsBackendWasm.setWasmPaths(this.binaryPath);
            await utils.jitteredExponentialRetry(async () => {
                const success = await tfjsCore.setBackend('wasm');
                if (!success) {
                    throw new Error(`Initialization of backend wasm failed`);
                }
            }, []);
            this.modelBackend = 'wasm';
        }
        catch (e) {
            throw new Error('There was an error loading the TFJS WASM backend. If you are using a custom WASM path ensure that it ends with "/" and that it is not the full URL as @tensorflow/tfjs-backend-wasm will append the wasm binary file name. Read more: https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/src/backend_wasm.ts#L475.');
        }
    }
    async _loadCPUBackend() {
        await tfjsCore.setBackend('cpu');
        this.modelBackend = 'cpu';
    }
}

function isNewerIpad() {
    // iPads on iOS13+ return as if a desktop Mac
    // so check for maxTouchPoints also.
    return (/Macintosh/i.test(navigator.userAgent) &&
        !!navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 1);
}
function isMobileScreen() {
    const isMobileDevice = 
    // Test Android/iPhone/iPad
    /Android|iPhone|iPad/i.test(navigator.userAgent) || isNewerIpad();
    return isMobileDevice;
}
/**
 * Use window.matchMedia to direct landscape orientation
 * screen.orientation is not supported in Safari so we will use
 * media query detection to listen for changes instead.
 * @returns MediaQueryList object
 */
function getLandscapeMediaQuery() {
    return window.matchMedia('(orientation: landscape)');
}
// minor version 146+ is confirmed to have the fix https://issues.chromium.org/issues/343199623#comment34
function isAndroidChromeWithBrokenH264() {
    const groups = /Chrome\/125\.[0-9]+\.[0-9]+\.([0-9]+)/i.exec(navigator.userAgent);
    if (!groups) {
        return false;
    }
    const minorVersion = groups[1];
    return (/Android/i.test(navigator.userAgent) &&
        /Chrome\/125/i.test(navigator.userAgent) &&
        parseInt(minorVersion) < 146);
}

// Only to be used with Chrome for the Android Chrome H264 Bug - https://issues.chromium.org/issues/343199623
const ALTERNATE_CHROME_MIME_TYPE = 'video/x-matroska;codecs=vp8';
/**
 * Helper wrapper class over the native MediaRecorder.
 */
class VideoRecorder {
    constructor(stream) {
        if (typeof MediaRecorder === 'undefined') {
            throw Error('MediaRecorder is not supported by this browser');
        }
        this._stream = stream;
        this._chunks = [];
        this._recorder = new MediaRecorder(stream, {
            bitsPerSecond: 1000000,
            mimeType: isAndroidChromeWithBrokenH264()
                ? ALTERNATE_CHROME_MIME_TYPE
                : undefined,
        });
        this._setupCallbacks();
    }
    getState() {
        return this._recorder.state;
    }
    start(timeSlice) {
        this.clearRecordedData();
        this.recordingStartApiTimestamp = Date.now();
        this._recorder.start(timeSlice);
    }
    async stop() {
        if (this.getState() === 'recording') {
            this._recorder.stop();
        }
        return this._recorderStopped;
    }
    pause() {
        this._recorder.pause();
    }
    clearRecordedData() {
        this._chunks = [];
    }
    dispatch(event) {
        this._recorder.dispatchEvent(event);
    }
    getVideoChunkSize() {
        return this._chunks.length;
    }
    _setupCallbacks() {
        // Creates a Readablestream of video chunks. Waits to receive a clientSessionInfo event before pushing
        //  a livenessActionDocument to the ReadableStream and finally closing the ReadableStream
        this.videoStream = new ReadableStream({
            start: (controller) => {
                if (!this._recorder) {
                    return;
                }
                this._recorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        if (this._chunks.length === 0) {
                            this.firstChunkTimestamp = Date.now();
                        }
                        this._chunks.push(e.data);
                        controller.enqueue(e.data);
                    }
                };
                this._recorder.addEventListener('clientSesssionInfo', (e) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    controller.enqueue(e.data.clientInfo);
                });
                this._recorder.addEventListener('stopVideo', () => {
                    controller.enqueue('stopVideo');
                });
                this._recorder.addEventListener('endStream', () => {
                    controller.close();
                });
                this._recorder.addEventListener('endStreamWithCode', (e) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                    controller.enqueue({
                        type: 'endStreamWithCode',
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        code: e.data.code,
                    });
                });
            },
        });
        this.recorderStarted = new Promise((resolve) => {
            this._recorder.onstart = () => {
                this.recorderStartTimestamp = Date.now();
                resolve();
            };
        });
        this._recorderStopped = new Promise((resolve) => {
            this._recorder.onstop = () => {
                this.recorderEndTimestamp = Date.now();
                resolve();
            };
        });
        this._recorder.onerror = () => {
            if (this.getState() !== 'stopped') {
                this.stop();
            }
        };
    }
}

/**
 * Returns the state of the provided face with respect to the provided liveness oval.
 */
function getFaceMatchStateInLivenessOval({ face, ovalDetails, initialFaceIntersection, sessionInformation, frameHeight, }) {
    let faceMatchState;
    const challengeConfig = sessionInformation?.Challenge?.FaceMovementAndLightChallenge
        ?.ChallengeConfig;
    if (!challengeConfig ||
        !challengeConfig.OvalIouThreshold ||
        !challengeConfig.OvalIouHeightThreshold ||
        !challengeConfig.OvalIouWidthThreshold ||
        !challengeConfig.FaceIouHeightThreshold ||
        !challengeConfig.FaceIouWidthThreshold) {
        throw new Error('Challenge information not returned from session information.');
    }
    const { OvalIouThreshold, FaceIouHeightThreshold, FaceIouWidthThreshold } = challengeConfig;
    const faceBoundingBox = generateBboxFromLandmarks(face, ovalDetails, frameHeight);
    const minFaceX = faceBoundingBox.left;
    const maxFaceX = faceBoundingBox.right;
    const minFaceY = faceBoundingBox.top;
    const maxFaceY = faceBoundingBox.bottom;
    const { ovalBoundingBox, minOvalX, minOvalY, maxOvalX, maxOvalY } = getOvalBoundingBox(ovalDetails);
    const intersection = getIntersectionOverUnion(faceBoundingBox, ovalBoundingBox);
    const intersectionThreshold = OvalIouThreshold;
    const faceDetectionWidthThreshold = ovalDetails.width * FaceIouWidthThreshold;
    const faceDetectionHeightThreshold = ovalDetails.height * FaceIouHeightThreshold;
    /** From Science
     * p=max(min(1,0.75∗(si−s0)/(st−s0)+0.25)),0)
     */
    const faceMatchPercentage = Math.max(Math.min(FACE_MATCH_RANGE_MAX, (FACE_MATCH_WEIGHT_MAX * (intersection - initialFaceIntersection)) /
        (intersectionThreshold - initialFaceIntersection) +
        FACE_MATCH_WEIGHT_MIN), FACE_MATCH_RANGE_MIN) * 100;
    const isFaceOutsideOvalToTheLeft = minOvalX > minFaceX && maxOvalX > maxFaceX;
    const isFaceOutsideOvalToTheRight = minFaceX > minOvalX && maxFaceX > maxOvalX;
    const isFaceMatched = intersection > intersectionThreshold;
    const isFaceMatchedClosely = minOvalY - minFaceY > faceDetectionHeightThreshold ||
        maxFaceY - maxOvalY > faceDetectionHeightThreshold ||
        (minOvalX - minFaceX > faceDetectionWidthThreshold &&
            maxFaceX - maxOvalX > faceDetectionWidthThreshold);
    if (isFaceMatched) {
        faceMatchState = FaceMatchState.MATCHED;
    }
    else if (isFaceOutsideOvalToTheLeft || isFaceOutsideOvalToTheRight) {
        faceMatchState = FaceMatchState.OFF_CENTER;
    }
    else if (isFaceMatchedClosely) {
        faceMatchState = FaceMatchState.MATCHED;
    }
    else {
        faceMatchState = FaceMatchState.TOO_FAR;
    }
    return { faceMatchState, faceMatchPercentage };
}

const VERSION = '3.1.10';

const BASE_USER_AGENT = `ui-react-liveness/${VERSION}`;
const getLivenessUserAgent = () => {
    return BASE_USER_AGENT;
};

/**
 * Note: This file was copied from https://github.com/aws/aws-sdk-js-v3/blob/main/packages/middleware-websocket/src/websocket-fetch-handler.ts#L176
 * Because of this the file is not fully typed at this time but we should eventually work on fully typing this file.
 */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const DEFAULT_WS_CONNECTION_TIMEOUT_MS = 2000;
const WEBSOCKET_CONNECTION_TIMEOUT_MESSAGE = 'Websocket connection timeout';
const isWebSocketRequest = (request) => request.protocol === 'ws:' || request.protocol === 'wss:';
const isReadableStream = (payload) => typeof ReadableStream === 'function' && payload instanceof ReadableStream;
/**
 * Transfer payload data to an AsyncIterable.
 * When the ReadableStream API is available in the runtime(e.g. browser), and
 * the request body is ReadableStream, so we need to transfer it to AsyncIterable
 * to make the stream consumable by WebSocket.
 */
const getIterator = (stream) => {
    // Noop if stream is already an async iterable
    if (stream[Symbol.asyncIterator]) {
        return stream;
    }
    if (isReadableStream(stream)) {
        // If stream is a ReadableStream, transfer the ReadableStream to async iterable.
        return eventstreamSerdeBrowser.readableStreamtoIterable(stream);
    }
    // For other types, just wrap them with an async iterable.
    return {
        [Symbol.asyncIterator]: async function* () {
            yield stream;
        },
    };
};
/**
 * Convert async iterable to a ReadableStream when ReadableStream API
 * is available(browsers). Otherwise, leave as it is(ReactNative).
 */
const toReadableStream = (asyncIterable) => typeof ReadableStream === 'function'
    ? eventstreamSerdeBrowser.iterableToReadableStream(asyncIterable)
    : asyncIterable;
/**
 * Base handler for websocket requests and HTTP request. By default, the request input and output
 * body will be in a ReadableStream, because of interface consistency among middleware.
 * If ReadableStream is not available, like in React-Native, the response body
 * will be an async iterable.
 */
class CustomWebSocketFetchHandler {
    constructor(options, httpHandler = new fetchHttpHandler.FetchHttpHandler()) {
        this.metadata = {
            handlerProtocol: 'websocket/h1.1',
        };
        this.sockets = {};
        this.utf8decoder = new TextDecoder(); // default 'utf-8' or 'utf8'
        this.httpHandler = httpHandler;
        if (typeof options === 'function') {
            this.config = {};
            this.configPromise = options().then((opts) => (this.config = opts ?? {}));
        }
        else {
            this.config = options ?? {};
            this.configPromise = Promise.resolve(this.config);
        }
    }
    /**
     * Destroys the WebSocketHandler.
     * Closes all sockets from the socket pool.
     */
    destroy() {
        for (const [key, sockets] of Object.entries(this.sockets)) {
            for (const socket of sockets) {
                socket.close(1000, `Socket closed through destroy() call`);
            }
            delete this.sockets[key];
        }
    }
    async handle(request) {
        if (!isWebSocketRequest(request)) {
            return this.httpHandler.handle(request);
        }
        const url = utilFormatUrl.formatUrl(request);
        const socket = new WebSocket(url);
        // Add socket to sockets pool
        if (!this.sockets[url]) {
            this.sockets[url] = [];
        }
        this.sockets[url].push(socket);
        socket.binaryType = 'arraybuffer';
        const { connectionTimeout = DEFAULT_WS_CONNECTION_TIMEOUT_MS } = await this.configPromise;
        await this.waitForReady(socket, connectionTimeout);
        const { body } = request;
        const bodyStream = getIterator(body);
        const asyncIterable = this.connect(socket, bodyStream);
        const outputPayload = toReadableStream(asyncIterable);
        return {
            response: new protocolHttp.HttpResponse({
                statusCode: 200,
                body: outputPayload,
            }),
        };
    }
    updateHttpClientConfig(key, value) {
        this.configPromise = this.configPromise.then((config) => {
            return {
                ...config,
                [key]: value,
            };
        });
    }
    httpHandlerConfigs() {
        return this.config ?? {};
    }
    /**
     * Removes all closing/closed sockets from the socket pool for URL.
     */
    removeNotUsableSockets(url) {
        this.sockets[url] = (this.sockets[url] ?? []).filter((socket) => !(socket.readyState === WebSocket.CLOSING ||
            socket.readyState === WebSocket.CLOSED));
    }
    waitForReady(socket, connectionTimeout) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                this.removeNotUsableSockets(socket.url);
                reject(new Error(WEBSOCKET_CONNECTION_TIMEOUT_MESSAGE));
            }, connectionTimeout);
            socket.onopen = () => {
                clearTimeout(timeout);
                resolve();
            };
        });
    }
    connect(socket, data) {
        // To notify output stream any error thrown after response
        // is returned while data keeps streaming.
        let streamError = undefined;
        // To notify onclose event that error has occurred.
        let socketErrorOccurred = false;
        // initialize as no-op.
        let reject = () => { };
        let resolve = () => { };
        socket.onmessage = (event) => {
            resolve({
                done: false,
                value: new Uint8Array(event.data),
            });
        };
        socket.onerror = (error) => {
            socketErrorOccurred = true;
            socket.close();
            reject(error);
        };
        socket.onclose = () => {
            this.removeNotUsableSockets(socket.url);
            if (socketErrorOccurred)
                return;
            if (streamError) {
                reject(streamError);
            }
            else {
                resolve({
                    done: true,
                    value: undefined,
                });
            }
        };
        const outputStream = {
            [Symbol.asyncIterator]: () => ({
                next: () => {
                    return new Promise((_resolve, _reject) => {
                        resolve = _resolve;
                        reject = _reject;
                    });
                },
            }),
        };
        const send = async () => {
            try {
                for await (const inputChunk of data) {
                    const decodedString = this.utf8decoder.decode(inputChunk);
                    if (decodedString.includes('closeCode')) {
                        const match = decodedString.match(/"closeCode":([0-9]*)/);
                        if (match) {
                            const closeCode = match[1];
                            socket.close(parseInt(closeCode));
                        }
                        continue;
                    }
                    socket.send(inputChunk);
                }
            }
            catch (err) {
                // We don't throw the error here because the send()'s returned
                // would already be settled by the time sending chunk throws error.
                // Instead, the notify the output stream to throw if there's
                // exceptions
                if (err instanceof Error) {
                    streamError = err;
                }
            }
            finally {
                // WS status code: https://tools.ietf.org/html/rfc6455#section-7.4
                socket.close(WS_CLOSURE_CODE.SUCCESS_CODE);
            }
        };
        send();
        return outputStream;
    }
}

const isCredentialsProvider = (credentialsProvider) => typeof credentialsProvider === 'function';
// the return interface of `fetchAuthSession` includes `credentials` as
// optional, but `credentials` is always returned. If `fetchAuthSession`
// is called for an unauthenticated end user, values of `accessKeyId`
// and `secretAccessKey` are `undefined`
const isCredentials = (credentials) => !!(credentials?.accessKeyId && credentials?.secretAccessKey);
/**
 * Resolves the `credentials` param to be passed to `RekognitionStreamingClient` which accepts either:
 * - a `credentials` object
 * - a `credentialsProvider` callback
 *
 * @param credentialsProvider optional `credentialsProvider` callback
 * @returns {Promise<AwsCredentials | AwsCredentialProvider>} `credentials` object or valid `credentialsProvider` callback
 */
async function resolveCredentials(credentialsProvider) {
    const hasCredentialsProvider = isCredentialsProvider(credentialsProvider);
    if (hasCredentialsProvider) {
        return credentialsProvider;
    }
    if (credentialsProvider && !hasCredentialsProvider) {
        throw new Error('Invalid credentialsProvider');
    }
    try {
        const result = (await auth.fetchAuthSession()).credentials;
        if (isCredentials(result)) {
            return result;
        }
        throw new Error('Missing credentials');
    }
    catch (e) {
        const { message } = e;
        throw new Error(`Invalid credentials: ${message}`);
    }
}

// override aws sdk default value of 60
const REQUEST_EXPIRY = 299;
class Signer extends signatureV4.SignatureV4 {
    presign(request, options) {
        return super.presign(request, {
            ...options,
            expiresIn: REQUEST_EXPIRY,
            // `headers` that should not be signed. Liveness WebSocket
            // request omits `headers` except for required `host` header. Signature
            // could be a mismatch if other `headers` are signed
            unsignableHeaders: new Set(Object.keys(request.headers).filter((header) => header !== 'host')),
        });
    }
}

const CONNECTION_TIMEOUT = 10000;
const CUSTOM_USER_AGENT = `${utils.getAmplifyUserAgent()} ${getLivenessUserAgent()}`;
async function createStreamingClient({ credentialsProvider, endpointOverride, region, systemClockOffset, }) {
    const credentials = await resolveCredentials(credentialsProvider);
    const clientconfig = {
        credentials,
        customUserAgent: CUSTOM_USER_AGENT,
        region,
        requestHandler: new CustomWebSocketFetchHandler({
            connectionTimeout: CONNECTION_TIMEOUT,
        }),
        signerConstructor: Signer,
        systemClockOffset,
    };
    if (endpointOverride) {
        clientconfig.endpointProvider = () => ({ url: new URL(endpointOverride) });
    }
    return new clientRekognitionstreaming.RekognitionStreamingClient(clientconfig);
}

const TIME_SLICE = 1000;
function isBlob(obj) {
    return obj.arrayBuffer !== undefined;
}
function isClientSessionInformationEvent(obj) {
    return obj.Challenge !== undefined;
}
function isEndStreamWithCodeEvent(obj) {
    return obj.code !== undefined;
}
class LivenessStreamProvider {
    constructor({ sessionId, region, stream, videoEl, credentialProvider, endpointOverride, systemClockOffset, }) {
        this.sessionId = sessionId;
        this.region = region;
        this.stream = stream;
        this.videoEl = videoEl;
        this.videoRecorder = new VideoRecorder(stream);
        this.credentialProvider = credentialProvider;
        this.endpointOverride = endpointOverride;
        this.systemClockOffset = systemClockOffset;
        this.initPromise = this.init();
    }
    async getResponseStream() {
        await this.initPromise;
        return this.responseStream;
    }
    startRecordingLivenessVideo() {
        this.videoRecorder.start(TIME_SLICE);
    }
    sendClientInfo(clientInfo) {
        this.videoRecorder.dispatch(new MessageEvent('clientSesssionInfo', { data: { clientInfo } }));
    }
    async stopVideo() {
        await this.videoRecorder.stop();
    }
    dispatchStopVideoEvent() {
        this.videoRecorder.dispatch(new Event('stopVideo'));
    }
    async endStreamWithCode(code) {
        if (this.videoRecorder.getState() === 'recording') {
            await this.stopVideo();
        }
        this.videoRecorder.dispatch(new MessageEvent('endStreamWithCode', { data: { code } }));
        return;
    }
    async init() {
        this._client = await createStreamingClient({
            credentialsProvider: this.credentialProvider,
            endpointOverride: this.endpointOverride,
            region: this.region,
            systemClockOffset: this.systemClockOffset,
        });
        this.responseStream = await this.startLivenessVideoConnection();
    }
    // Creates a generator from a stream of video chunks and livenessActionDocuments and yields VideoEvent and ClientEvents
    getAsyncGeneratorFromReadableStream(stream) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const current = this;
        this._reader = stream.getReader();
        return async function* () {
            while (true) {
                const { done, value } = (await current._reader.read());
                if (done) {
                    return;
                }
                // Video chunks blobs should be sent as video events
                if (value === 'stopVideo') {
                    // sending an empty video chunk signals that we have ended sending video
                    yield {
                        VideoEvent: {
                            VideoChunk: new Uint8Array([]),
                            TimestampMillis: Date.now(),
                        },
                    };
                }
                else if (isBlob(value)) {
                    const buffer = await value.arrayBuffer();
                    const chunk = new Uint8Array(buffer);
                    if (chunk.length > 0) {
                        yield {
                            VideoEvent: {
                                VideoChunk: chunk,
                                TimestampMillis: Date.now(),
                            },
                        };
                    }
                }
                else if (isClientSessionInformationEvent(value)) {
                    yield {
                        ClientSessionInformationEvent: {
                            Challenge: value.Challenge,
                        },
                    };
                }
                else if (isEndStreamWithCodeEvent(value)) {
                    yield {
                        VideoEvent: {
                            VideoChunk: new Uint8Array([]),
                            // this is a custom type that does not match LivenessRequestStream.
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            TimestampMillis: { closeCode: value.code },
                        },
                    };
                }
            }
        };
    }
    async startLivenessVideoConnection() {
        const livenessRequestGenerator = this.getAsyncGeneratorFromReadableStream(this.videoRecorder.videoStream)();
        const mediaSettings = this.stream.getTracks()[0].getSettings();
        const response = await this._client.send(new clientRekognitionstreaming.StartFaceLivenessSessionCommand({
            ChallengeVersions: 'FaceMovementAndLightChallenge_1.0.0',
            SessionId: this.sessionId,
            LivenessRequestStream: livenessRequestGenerator,
            VideoWidth: (mediaSettings.width ?? this.videoEl.width).toString(),
            VideoHeight: (mediaSettings.height ?? this.videoEl.height).toString(),
        }));
        return response.LivenessResponseStream;
    }
}

const TICK_RATE = 10; // ms -- the rate at which we will render/check colors
var COLOR_STAGE;
(function (COLOR_STAGE) {
    COLOR_STAGE["SCROLLING"] = "SCROLLING";
    COLOR_STAGE["FLAT"] = "FLAT";
})(COLOR_STAGE || (COLOR_STAGE = {}));
class FreshnessColorDisplay {
    constructor(context, freshnessColorsSequence) {
        this.context = context;
        this.freshnessColorsSequence = freshnessColorsSequence;
        this.isFirstTick = true;
    }
    async displayColorTick() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.displayNextColorTick(resolve, reject);
            }, Math.min(TICK_RATE));
        });
    }
    init() {
        this.stageIndex = 0;
        this.currColorIndex = 0;
        this.currColorSequence = this.freshnessColorsSequence[0];
        this.prevColorSequence = this.freshnessColorsSequence[0];
        this.stage = COLOR_STAGE.FLAT;
        this.timeLastFlatOrScrollChange = Date.now();
        this.timeLastFaceMatchChecked = Date.now();
    }
    displayNextColorTick(resolve, _) {
        const { freshnessColorEl } = this.context.freshnessColorAssociatedParams;
        const { ovalDetails, scaleFactor } = this.context.ovalAssociatedParams;
        const { videoEl } = this.context.videoAssociatedParams;
        const tickStartTime = Date.now();
        // Send a colorStart time only for the first tick of the first color
        if (this.isFirstTick) {
            this.init();
            this.isFirstTick = false;
            this.sendColorStartTime({
                tickStartTime: tickStartTime,
                currColor: this.currColorSequence.color,
                prevColor: this.currColorSequence.color,
                currColorIndex: this.stageIndex,
            });
        }
        let timeSinceLastColorChange = tickStartTime - this.timeLastFlatOrScrollChange;
        freshnessColorEl.style.display = 'block';
        // Every 10 ms tick we will check if the threshold for flat or scrolling, if so we will try to go to the next stage
        if ((this.stage === COLOR_STAGE.FLAT &&
            timeSinceLastColorChange >=
                this.currColorSequence.flatDisplayDuration) ||
            (this.stage === COLOR_STAGE.SCROLLING &&
                timeSinceLastColorChange >= this.currColorSequence.downscrollDuration)) {
            this.incrementStageIndex(tickStartTime);
            timeSinceLastColorChange = 0;
        }
        // Every 10 ms tick we will update the colors displayed
        if (this.currColorIndex < this.freshnessColorsSequence.length) {
            const heightFraction = timeSinceLastColorChange /
                (this.stage === COLOR_STAGE.SCROLLING
                    ? this.currColorSequence.downscrollDuration
                    : this.currColorSequence.flatDisplayDuration);
            fillOverlayCanvasFractional({
                overlayCanvas: freshnessColorEl,
                prevColor: this.prevColorSequence.color,
                nextColor: this.currColorSequence.color,
                videoEl: videoEl,
                ovalDetails: ovalDetails,
                heightFraction,
                scaleFactor: scaleFactor,
            });
            resolve(false);
        }
        else {
            freshnessColorEl.style.display = 'none';
            resolve(true);
        }
    }
    // FLAT - prev = 0, curr = 0
    // SCROLL - prev = 0, curr = 1
    // FLAT - prev = 1, curr = 1
    // SCROLL - prev = 1, curr = 2
    // SCROLL - prev = 2, curr = 3
    incrementStageIndex(tickStartTime) {
        this.stageIndex += 1;
        this.prevColorSequence = this.freshnessColorsSequence[this.currColorIndex];
        if (this.stage === COLOR_STAGE.FLAT) {
            this.currColorIndex += 1;
            this.stage = COLOR_STAGE.SCROLLING;
        }
        else if (this.stage === COLOR_STAGE.SCROLLING) {
            const nextFlatColor = this.freshnessColorsSequence[this.currColorIndex];
            if (nextFlatColor.flatDisplayDuration > 0) {
                this.stage = COLOR_STAGE.FLAT;
            }
            else {
                this.stage = COLOR_STAGE.SCROLLING;
                this.currColorIndex += 1;
            }
        }
        this.currColorSequence = this.freshnessColorsSequence[this.currColorIndex];
        this.timeLastFlatOrScrollChange = Date.now();
        if (this.currColorSequence) {
            this.sendColorStartTime({
                tickStartTime: tickStartTime,
                currColor: this.currColorSequence.color,
                prevColor: this.prevColorSequence.color,
                currColorIndex: this.stageIndex,
            });
        }
    }
    sendColorStartTime({ tickStartTime, currColor, prevColor, currColorIndex, }) {
        const { livenessStreamProvider, challengeId } = this.context;
        livenessStreamProvider.sendClientInfo({
            Challenge: {
                FaceMovementAndLightChallenge: {
                    ChallengeId: challengeId,
                    ColorDisplayed: {
                        CurrentColor: { RGB: getRGBArrayFromColorString(currColor) },
                        PreviousColor: { RGB: getRGBArrayFromColorString(prevColor) },
                        SequenceNumber: currColorIndex,
                        CurrentColorStartTimestamp: tickStartTime,
                    },
                },
            },
        });
    }
}

const isServerSesssionInformationEvent = (value) => {
    return !!value
        ?.ServerSessionInformationEvent;
};
const isConnectionTimeoutError = (error) => {
    const { message } = error;
    return message.includes(WEBSOCKET_CONNECTION_TIMEOUT_MESSAGE);
};
const isDisconnectionEvent = (value) => {
    return !!value
        ?.DisconnectionEvent;
};
const isValidationExceptionEvent = (value) => {
    return !!value
        ?.ValidationException;
};
const isInternalServerExceptionEvent = (value) => {
    return !!value
        ?.InternalServerException;
};
const isThrottlingExceptionEvent = (value) => {
    return !!value
        ?.ThrottlingException;
};
const isServiceQuotaExceededExceptionEvent = (value) => {
    return !!value
        ?.ServiceQuotaExceededException;
};
const isInvalidSignatureRegionException = (error) => {
    const { message, name } = error;
    return (name === 'InvalidSignatureException' && message.includes('valid region'));
};

const STATIC_VIDEO_CONSTRAINTS = {
    width: {
        min: 320,
        ideal: 640,
    },
    height: {
        min: 240,
        ideal: 480,
    },
    frameRate: { min: 15, ideal: 30, max: 30 },
    facingMode: 'user',
};

const CAMERA_ID_KEY = 'AmplifyLivenessCameraId';
const DEFAULT_FACE_FIT_TIMEOUT = 7000;
let responseStream;
const responseStreamActor = async (callback) => {
    try {
        const stream = await responseStream;
        for await (const event of stream) {
            if (isServerSesssionInformationEvent(event)) {
                callback({
                    type: 'SET_SESSION_INFO',
                    data: {
                        sessionInfo: event.ServerSessionInformationEvent.SessionInformation,
                    },
                });
            }
            else if (isDisconnectionEvent(event)) {
                callback({ type: 'DISCONNECT_EVENT' });
            }
            else if (isValidationExceptionEvent(event)) {
                callback({
                    type: 'SERVER_ERROR',
                    data: { error: { ...event.ValidationException } },
                });
            }
            else if (isInternalServerExceptionEvent(event)) {
                callback({
                    type: 'SERVER_ERROR',
                    data: { error: { ...event.InternalServerException } },
                });
            }
            else if (isThrottlingExceptionEvent(event)) {
                callback({
                    type: 'SERVER_ERROR',
                    data: { error: { ...event.ThrottlingException } },
                });
            }
            else if (isServiceQuotaExceededExceptionEvent(event)) {
                callback({
                    type: 'SERVER_ERROR',
                    data: { error: { ...event.ServiceQuotaExceededException } },
                });
            }
        }
    }
    catch (error) {
        if (isInvalidSignatureRegionException(error)) {
            callback({
                type: 'SERVER_ERROR',
                data: {
                    error: new Error('Invalid region in FaceLivenessDetector or credentials are scoped to the wrong region.'),
                },
            });
        }
        else if (error instanceof Error) {
            callback({
                type: isConnectionTimeoutError(error)
                    ? 'CONNECTION_TIMEOUT'
                    : 'SERVER_ERROR',
                data: { error },
            });
        }
    }
};
function getLastSelectedCameraId() {
    return localStorage.getItem(CAMERA_ID_KEY);
}
function setLastSelectedCameraId(deviceId) {
    localStorage.setItem(CAMERA_ID_KEY, deviceId);
}
const livenessMachine = xstate.createMachine({
    id: 'livenessMachine',
    initial: 'cameraCheck',
    predictableActionArguments: true,
    context: {
        challengeId: nanoid.nanoid(),
        maxFailedAttempts: 0,
        failedAttempts: 0,
        componentProps: undefined,
        serverSessionInformation: undefined,
        videoAssociatedParams: {
            videoConstraints: STATIC_VIDEO_CONSTRAINTS,
            selectableDevices: [],
        },
        ovalAssociatedParams: undefined,
        faceMatchAssociatedParams: {
            illuminationState: undefined,
            faceMatchState: undefined,
            /**
             * faceMatchPercentage is a starting point we set as a baseline
             * for what we want our progress bar to visually start at. This correlates
             * to the formula we use to calculate the faceMatchPercentage
             * in getFaceMatchStateInLivenessOval
             */
            faceMatchPercentage: 25,
            currentDetectedFace: undefined,
            startFace: undefined,
            endFace: undefined,
        },
        freshnessColorAssociatedParams: {
            freshnessColorEl: undefined,
            freshnessColors: [],
            freshnessColorsComplete: false,
            freshnessColorDisplay: undefined,
        },
        errorState: undefined,
        livenessStreamProvider: undefined,
        responseStreamActorRef: undefined,
        shouldDisconnect: false,
        faceMatchStateBeforeStart: undefined,
        isFaceFarEnoughBeforeRecording: undefined,
        isRecordingStopped: false,
    },
    on: {
        CANCEL: 'userCancel',
        TIMEOUT: {
            target: 'retryableTimeout',
            actions: 'updateErrorStateForTimeout',
        },
        SET_SESSION_INFO: {
            internal: true,
            actions: 'updateSessionInfo',
        },
        DISCONNECT_EVENT: {
            internal: true,
            actions: 'updateShouldDisconnect',
        },
        SET_DOM_AND_CAMERA_DETAILS: {
            actions: 'setDOMAndCameraDetails',
        },
        UPDATE_DEVICE_AND_STREAM: {
            actions: 'updateDeviceAndStream',
        },
        SERVER_ERROR: {
            target: 'error',
            actions: 'updateErrorStateForServer',
        },
        CONNECTION_TIMEOUT: {
            target: 'error',
            actions: 'updateErrorStateForConnectionTimeout',
        },
        RUNTIME_ERROR: {
            target: 'error',
            actions: 'updateErrorStateForRuntime',
        },
        MOBILE_LANDSCAPE_WARNING: {
            target: 'mobileLandscapeWarning',
            actions: 'updateErrorStateForServer',
        },
    },
    states: {
        cameraCheck: {
            entry: 'resetErrorState',
            invoke: {
                src: 'checkVirtualCameraAndGetStream',
                onDone: {
                    target: 'waitForDOMAndCameraDetails',
                    actions: 'updateVideoMediaStream',
                },
                onError: {
                    target: 'permissionDenied',
                },
            },
        },
        waitForDOMAndCameraDetails: {
            after: {
                0: {
                    target: 'start',
                    cond: 'hasDOMAndCameraDetails',
                },
                10: { target: 'waitForDOMAndCameraDetails' },
            },
        },
        start: {
            entry: ['drawStaticOval', 'initializeFaceDetector'],
            always: [
                {
                    target: 'detectFaceBeforeStart',
                    cond: 'shouldSkipStartScreen',
                },
            ],
            on: {
                BEGIN: 'detectFaceBeforeStart',
            },
        },
        detectFaceBeforeStart: {
            invoke: {
                src: 'detectFace',
                onDone: {
                    target: 'checkFaceDetectedBeforeStart',
                    actions: 'updateFaceMatchBeforeStartDetails',
                },
            },
        },
        checkFaceDetectedBeforeStart: {
            after: {
                0: {
                    target: 'detectFaceDistanceBeforeRecording',
                    cond: 'hasSingleFaceBeforeStart',
                },
                100: { target: 'detectFaceBeforeStart' },
            },
        },
        detectFaceDistanceBeforeRecording: {
            invoke: {
                src: 'detectFaceDistance',
                onDone: {
                    target: 'checkFaceDistanceBeforeRecording',
                    actions: 'updateFaceDistanceBeforeRecording',
                },
            },
        },
        checkFaceDistanceBeforeRecording: {
            after: {
                0: {
                    target: 'initializeLivenessStream',
                    cond: 'hasEnoughFaceDistanceBeforeRecording',
                },
                100: { target: 'detectFaceDistanceBeforeRecording' },
            },
        },
        initializeLivenessStream: {
            invoke: {
                src: 'openLivenessStreamConnection',
                onDone: {
                    target: 'notRecording',
                    actions: [
                        'updateLivenessStreamProvider',
                        'spawnResponseStreamActor',
                    ],
                },
            },
        },
        notRecording: {
            initial: 'waitForSessionInfo',
            states: {
                waitForSessionInfo: {
                    after: {
                        0: {
                            target: '#livenessMachine.recording',
                            cond: 'hasServerSessionInfo',
                        },
                        100: { target: 'waitForSessionInfo' },
                    },
                },
            },
        },
        recording: {
            entry: [
                'clearErrorState',
                'startRecording',
                'sendTimeoutAfterOvalDrawingDelay',
            ],
            initial: 'ovalDrawing',
            states: {
                ovalDrawing: {
                    invoke: {
                        src: 'detectInitialFaceAndDrawOval',
                        onDone: {
                            target: 'checkFaceDetected',
                            actions: [
                                'updateOvalAndFaceDetailsPostDraw',
                                'sendTimeoutAfterOvalMatchDelay',
                            ],
                        },
                        onError: {
                            target: '#livenessMachine.error',
                            actions: 'updateErrorStateForRuntime',
                        },
                    },
                },
                checkFaceDetected: {
                    after: {
                        0: {
                            target: 'cancelOvalDrawingTimeout',
                            cond: 'hasSingleFace',
                        },
                        100: { target: 'ovalDrawing' },
                    },
                },
                cancelOvalDrawingTimeout: {
                    entry: [
                        'cancelOvalDrawingTimeout',
                        'sendTimeoutAfterRecordingDelay',
                    ],
                    after: {
                        0: {
                            target: 'checkRecordingStarted',
                        },
                    },
                },
                checkRecordingStarted: {
                    after: {
                        0: {
                            target: 'ovalMatching',
                            cond: 'hasRecordingStarted',
                            actions: 'updateRecordingStartTimestampMs',
                        },
                        100: { target: 'checkRecordingStarted' },
                    },
                },
                // Evaluates face match and moves to checkMatch
                // which continually checks for match until either timeout or face match
                ovalMatching: {
                    entry: 'cancelRecordingTimeout',
                    invoke: {
                        src: 'detectFaceAndMatchOval',
                        onDone: {
                            target: 'checkMatch',
                            actions: 'updateFaceDetailsPostMatch',
                        },
                    },
                },
                // If `hasFaceMatchedInOval` is true, then move to `delayBeforeFlash`, which pauses
                // for one second to show "Hold still" text before moving to `flashFreshnessColors`.
                // If not, move back to ovalMatching and re-evaluate match state
                checkMatch: {
                    after: {
                        0: {
                            target: 'delayBeforeFlash',
                            cond: 'hasFaceMatchedInOval',
                            actions: [
                                'setFaceMatchTimeAndStartFace',
                                'updateEndFaceMatch',
                                'setupFlashFreshnessColors',
                                'cancelOvalMatchTimeout',
                                'cancelOvalDrawingTimeout',
                            ],
                        },
                        1: {
                            target: 'ovalMatching',
                        },
                    },
                },
                delayBeforeFlash: {
                    after: {
                        1000: 'flashFreshnessColors',
                    },
                },
                flashFreshnessColors: {
                    invoke: {
                        src: 'flashColors',
                        onDone: [
                            {
                                target: 'success',
                                cond: 'hasFreshnessColorShown',
                            },
                            {
                                target: 'flashFreshnessColors',
                                actions: 'updateFreshnessDetails',
                            },
                        ],
                    },
                },
                success: {
                    entry: 'stopRecording',
                    type: 'final',
                },
            },
            onDone: 'uploading',
        },
        uploading: {
            initial: 'pending',
            states: {
                pending: {
                    entry: ['pauseVideoStream'],
                    invoke: {
                        src: 'stopVideo',
                        onDone: 'waitForDisconnectEvent',
                        onError: {
                            target: '#livenessMachine.error',
                            actions: 'updateErrorStateForRuntime',
                        },
                    },
                },
                waitForDisconnectEvent: {
                    after: {
                        0: {
                            target: 'getLivenessResult',
                            cond: 'getShouldDisconnect',
                        },
                        100: { target: 'waitForDisconnectEvent' },
                    },
                },
                getLivenessResult: {
                    entry: ['freezeStream'],
                    invoke: {
                        src: 'getLiveness',
                        onError: {
                            target: '#livenessMachine.error',
                            actions: 'updateErrorStateForServer',
                        },
                    },
                },
            },
        },
        retryableTimeout: {
            entry: 'updateFailedAttempts',
            always: [
                {
                    target: 'timeout',
                    cond: 'shouldTimeoutOnFailedAttempts',
                },
                { target: 'notRecording' },
            ],
        },
        permissionDenied: {
            entry: 'callUserPermissionDeniedCallback',
            on: { RETRY_CAMERA_CHECK: 'cameraCheck' },
        },
        mobileLandscapeWarning: {
            entry: 'callMobileLandscapeWarningCallback',
            always: { target: 'error' },
        },
        timeout: {
            entry: ['cleanUpResources', 'callUserTimeoutCallback', 'freezeStream'],
        },
        error: {
            entry: [
                'cleanUpResources',
                'callErrorCallback',
                'cancelOvalDrawingTimeout',
                'cancelOvalMatchTimeout',
                'cancelRecordingTimeout',
                'freezeStream',
            ],
        },
        userCancel: {
            entry: ['cleanUpResources', 'callUserCancelCallback', 'resetContext'],
            always: { target: 'cameraCheck' },
        },
    },
}, {
    actions: {
        spawnResponseStreamActor: xstate.assign({
            responseStreamActorRef: () => xstate.spawn(responseStreamActor),
        }),
        updateFailedAttempts: xstate.assign({
            failedAttempts: (context) => context.failedAttempts + 1,
        }),
        updateVideoMediaStream: xstate.assign({
            videoAssociatedParams: (context, event) => ({
                ...context.videoAssociatedParams,
                videoMediaStream: event.data
                    ?.stream,
                selectedDeviceId: event.data
                    ?.selectedDeviceId,
                selectableDevices: event.data
                    ?.selectableDevices,
            }),
        }),
        initializeFaceDetector: xstate.assign({
            ovalAssociatedParams: (context) => {
                const { componentProps } = context;
                const { faceModelUrl, binaryPath } = componentProps.config;
                const faceDetector = new BlazeFaceFaceDetection(binaryPath, faceModelUrl);
                faceDetector.triggerModelLoading();
                return { ...context.ovalAssociatedParams, faceDetector };
            },
        }),
        updateLivenessStreamProvider: xstate.assign({
            livenessStreamProvider: (context, event) => event.data?.livenessStreamProvider,
        }),
        setDOMAndCameraDetails: xstate.assign({
            videoAssociatedParams: (context, event) => ({
                ...context.videoAssociatedParams,
                videoEl: event.data?.videoEl,
                canvasEl: event.data?.canvasEl,
                isMobile: event.data?.isMobile,
            }),
            freshnessColorAssociatedParams: (context, event) => ({
                ...context.freshnessColorAssociatedParams,
                freshnessColorEl: event.data
                    ?.freshnessColorEl,
            }),
        }),
        updateDeviceAndStream: xstate.assign({
            videoAssociatedParams: (context, event) => {
                setLastSelectedCameraId(event.data?.newDeviceId);
                return {
                    ...context.videoAssociatedParams,
                    selectedDeviceId: event.data
                        ?.newDeviceId,
                    videoMediaStream: event.data
                        ?.newStream,
                };
            },
        }),
        drawStaticOval: (context) => {
            const { canvasEl, videoEl, videoMediaStream } = context.videoAssociatedParams;
            drawStaticOval(canvasEl, videoEl, videoMediaStream);
        },
        updateRecordingStartTimestampMs: xstate.assign({
            videoAssociatedParams: (context) => {
                const { challengeId, videoAssociatedParams, ovalAssociatedParams, livenessStreamProvider, } = context;
                const { recordingStartApiTimestamp, recorderStartTimestamp } = livenessStreamProvider.videoRecorder;
                const { videoMediaStream } = videoAssociatedParams;
                const { initialFace } = ovalAssociatedParams;
                /**
                 * This calculation is provided by Science team after doing analysis
                 * of unreliable .onstart() (recorderStartTimestamp) timestamp that is
                 * returned from mediaRecorder.
                 */
                const timestamp = Math.round(0.73 * (recorderStartTimestamp - recordingStartApiTimestamp) +
                    recordingStartApiTimestamp);
                // Send client info for initial face position
                const { width, height } = videoMediaStream
                    .getTracks()[0]
                    .getSettings();
                const flippedInitialFaceLeft = width - initialFace.left - initialFace.width;
                context.livenessStreamProvider.sendClientInfo({
                    Challenge: {
                        FaceMovementAndLightChallenge: {
                            ChallengeId: challengeId,
                            VideoStartTimestamp: timestamp,
                            InitialFace: {
                                InitialFaceDetectedTimestamp: initialFace.timestampMs,
                                BoundingBox: getBoundingBox({
                                    deviceHeight: height,
                                    deviceWidth: width,
                                    height: initialFace.height,
                                    width: initialFace.width,
                                    top: initialFace.top,
                                    left: flippedInitialFaceLeft,
                                }),
                            },
                        },
                    },
                });
                return {
                    ...context.videoAssociatedParams,
                    recordingStartTimestampMs: timestamp,
                };
            },
        }),
        startRecording: xstate.assign({
            videoAssociatedParams: (context) => {
                if (!context.serverSessionInformation) {
                    throw new Error('Session information was not received from response stream');
                }
                if (context.livenessStreamProvider.videoRecorder &&
                    context.livenessStreamProvider.videoRecorder.getState() !==
                        'recording') {
                    context.livenessStreamProvider.startRecordingLivenessVideo();
                }
                return { ...context.videoAssociatedParams };
            },
        }),
        stopRecording: () => { },
        updateFaceMatchBeforeStartDetails: xstate.assign({
            faceMatchStateBeforeStart: (_, event) => event.data.faceMatchState,
        }),
        updateFaceDistanceBeforeRecording: xstate.assign({
            isFaceFarEnoughBeforeRecording: (_, event) => !!event.data.isFaceFarEnoughBeforeRecording,
        }),
        updateFaceDistanceWhileLoading: xstate.assign({
            isFaceFarEnoughBeforeRecording: (_, event) => !!event.data.isFaceFarEnoughBeforeRecording,
            errorState: (_, event) => event.data?.error,
        }),
        updateOvalAndFaceDetailsPostDraw: xstate.assign({
            ovalAssociatedParams: (context, event) => ({
                ...context.ovalAssociatedParams,
                initialFace: event.data
                    .initialFace,
                ovalDetails: event.data
                    .ovalDetails,
                scaleFactor: event.data
                    .scaleFactor,
            }),
            faceMatchAssociatedParams: (context, event) => ({
                ...context.faceMatchAssociatedParams,
                faceMatchState: event.data
                    .faceMatchState,
                illuminationState: event.data
                    .illuminationState,
            }),
        }),
        updateFaceDetailsPostMatch: xstate.assign({
            faceMatchAssociatedParams: (context, event) => ({
                ...context.faceMatchAssociatedParams,
                faceMatchState: event.data
                    .faceMatchState,
                faceMatchPercentage: event.data
                    .faceMatchPercentage,
                illuminationState: event.data
                    .illuminationState,
                currentDetectedFace: event.data
                    .detectedFace,
            }),
        }),
        updateEndFaceMatch: xstate.assign({
            faceMatchAssociatedParams: (context) => ({
                ...context.faceMatchAssociatedParams,
                endFace: context.faceMatchAssociatedParams.currentDetectedFace,
            }),
        }),
        setFaceMatchTimeAndStartFace: xstate.assign({
            faceMatchAssociatedParams: (context) => {
                return {
                    ...context.faceMatchAssociatedParams,
                    startFace: context.faceMatchAssociatedParams.startFace === undefined
                        ? context.faceMatchAssociatedParams.currentDetectedFace
                        : context.faceMatchAssociatedParams.startFace,
                };
            },
        }),
        resetErrorState: xstate.assign({ errorState: (_) => undefined }),
        updateErrorStateForConnectionTimeout: xstate.assign({
            errorState: (_) => LivenessErrorState.CONNECTION_TIMEOUT,
        }),
        updateErrorStateForTimeout: xstate.assign({
            errorState: (_, event) => event.data?.errorState || LivenessErrorState.TIMEOUT,
            errorMessage: (_, event) => event.data?.message,
        }),
        updateErrorStateForRuntime: xstate.assign({
            errorState: (_, event) => event.data?.errorState ||
                LivenessErrorState.RUNTIME_ERROR,
        }),
        updateErrorStateForServer: xstate.assign({
            errorState: (_) => LivenessErrorState.SERVER_ERROR,
        }),
        clearErrorState: xstate.assign({ errorState: (_) => undefined }),
        updateSessionInfo: xstate.assign({
            serverSessionInformation: (_, event) => {
                return event.data.sessionInfo;
            },
        }),
        updateShouldDisconnect: xstate.assign({ shouldDisconnect: () => true }),
        updateFreshnessDetails: xstate.assign({
            freshnessColorAssociatedParams: (context, event) => {
                return {
                    ...context.freshnessColorAssociatedParams,
                    freshnessColorsComplete: event.data
                        .freshnessColorsComplete,
                };
            },
        }),
        setupFlashFreshnessColors: xstate.assign({
            freshnessColorAssociatedParams: (context) => {
                const { serverSessionInformation } = context;
                const freshnessColors = getColorsSequencesFromSessionInformation(serverSessionInformation);
                const freshnessColorDisplay = new FreshnessColorDisplay(context, freshnessColors);
                return {
                    ...context.freshnessColorAssociatedParams,
                    freshnessColorDisplay,
                };
            },
        }),
        // timeouts
        sendTimeoutAfterOvalDrawingDelay: xstate.actions.send({
            type: 'RUNTIME_ERROR',
            data: {
                message: 'Client failed to draw oval.',
            },
        }, {
            delay: 5000,
            id: 'ovalDrawingTimeout',
        }),
        cancelOvalDrawingTimeout: xstate.actions.cancel('ovalDrawingTimeout'),
        sendTimeoutAfterRecordingDelay: xstate.actions.send({
            type: 'RUNTIME_ERROR',
            data: {
                message: 'Client failed to start recording.',
            },
        }, {
            delay: 5000,
            id: 'recordingTimeout',
        }),
        cancelRecordingTimeout: xstate.actions.cancel('recordingTimeout'),
        sendTimeoutAfterOvalMatchDelay: xstate.actions.send({
            type: 'TIMEOUT',
            data: {
                message: 'Client timed out waiting for face to match oval.',
            },
        }, {
            delay: (context) => {
                return (context.serverSessionInformation?.Challenge
                    ?.FaceMovementAndLightChallenge?.ChallengeConfig
                    ?.OvalFitTimeout ?? DEFAULT_FACE_FIT_TIMEOUT);
            },
            id: 'ovalMatchTimeout',
        }),
        cancelOvalMatchTimeout: xstate.actions.cancel('ovalMatchTimeout'),
        // callbacks
        callUserPermissionDeniedCallback: xstate.assign({
            errorState: (context, event) => {
                let errorState;
                if (event.data.message.includes('15 fps')) {
                    errorState = LivenessErrorState.CAMERA_FRAMERATE_ERROR;
                }
                else {
                    errorState = LivenessErrorState.CAMERA_ACCESS_ERROR;
                }
                const errorMessage = event.data.message || event.data.Message;
                const error = new Error(errorMessage);
                const livenessError = {
                    state: errorState,
                    error: error,
                };
                context.componentProps.onError?.(livenessError);
                return errorState;
            },
        }),
        callMobileLandscapeWarningCallback: xstate.assign({
            errorState: () => LivenessErrorState.MOBILE_LANDSCAPE_ERROR,
        }),
        callUserCancelCallback: (context) => {
            context.componentProps.onUserCancel?.();
        },
        callUserTimeoutCallback: (context) => {
            const error = new Error(context.errorMessage ?? 'Client Timeout');
            error.name = context.errorState;
            const livenessError = {
                state: context.errorState,
                error: error,
            };
            context.componentProps.onError?.(livenessError);
        },
        callErrorCallback: (context, event) => {
            const livenessError = {
                state: context.errorState,
                error: event.data?.error || event.data,
            };
            context.componentProps.onError?.(livenessError);
        },
        cleanUpResources: (context) => {
            const { freshnessColorEl } = context.freshnessColorAssociatedParams;
            if (freshnessColorEl) {
                freshnessColorEl.style.display = 'none';
            }
            let closureCode = WS_CLOSURE_CODE.DEFAULT_ERROR_CODE;
            if (context.errorState === LivenessErrorState.TIMEOUT) {
                closureCode = WS_CLOSURE_CODE.FACE_FIT_TIMEOUT;
            }
            else if (context.errorState === LivenessErrorState.RUNTIME_ERROR) {
                closureCode = WS_CLOSURE_CODE.RUNTIME_ERROR;
            }
            else if (context.errorState === LivenessErrorState.FACE_DISTANCE_ERROR ||
                context.errorState === LivenessErrorState.MULTIPLE_FACES_ERROR) {
                closureCode = WS_CLOSURE_CODE.USER_ERROR_DURING_CONNECTION;
            }
            else if (context.errorState === undefined) {
                closureCode = WS_CLOSURE_CODE.USER_CANCEL;
            }
            context.livenessStreamProvider?.endStreamWithCode(closureCode);
        },
        freezeStream: (context) => {
            const { videoMediaStream, videoEl } = context.videoAssociatedParams;
            context.isRecordingStopped = true;
            videoEl?.pause();
            videoMediaStream?.getTracks().forEach(function (track) {
                track.stop();
            });
        },
        pauseVideoStream: (context) => {
            const { videoEl } = context.videoAssociatedParams;
            context.isRecordingStopped = true;
            videoEl.pause();
        },
        resetContext: xstate.assign({
            challengeId: nanoid.nanoid(),
            maxFailedAttempts: 0,
            failedAttempts: 0,
            componentProps: (context) => context.componentProps,
            serverSessionInformation: (_) => undefined,
            videoAssociatedParams: (_) => {
                return {
                    videoConstraints: STATIC_VIDEO_CONSTRAINTS,
                };
            },
            ovalAssociatedParams: (_) => undefined,
            errorState: (_) => undefined,
            livenessStreamProvider: (_) => undefined,
            responseStreamActorRef: (_) => undefined,
            shouldDisconnect: false,
            faceMatchStateBeforeStart: (_) => undefined,
            isFaceFarEnoughBeforeRecording: (_) => undefined,
            isRecordingStopped: false,
        }),
    },
    guards: {
        shouldTimeoutOnFailedAttempts: (context) => context.failedAttempts >= context.maxFailedAttempts,
        hasFaceMatchedInOval: (context) => {
            return (context.faceMatchAssociatedParams.faceMatchState ===
                FaceMatchState.MATCHED);
        },
        hasSingleFace: (context) => {
            return (context.faceMatchAssociatedParams.faceMatchState ===
                FaceMatchState.FACE_IDENTIFIED);
        },
        hasSingleFaceBeforeStart: (context) => {
            return (context.faceMatchStateBeforeStart === FaceMatchState.FACE_IDENTIFIED);
        },
        hasEnoughFaceDistanceBeforeRecording: (context) => {
            return context.isFaceFarEnoughBeforeRecording;
        },
        hasNotEnoughFaceDistanceBeforeRecording: (context) => {
            return !context.isFaceFarEnoughBeforeRecording;
        },
        hasFreshnessColorShown: (context) => context.freshnessColorAssociatedParams.freshnessColorsComplete,
        hasServerSessionInfo: (context) => {
            return context.serverSessionInformation !== undefined;
        },
        hasDOMAndCameraDetails: (context) => {
            return (context.videoAssociatedParams.videoEl !== undefined &&
                context.videoAssociatedParams.canvasEl !== undefined &&
                context.freshnessColorAssociatedParams.freshnessColorEl !== undefined);
        },
        getShouldDisconnect: (context) => {
            return !!context.shouldDisconnect;
        },
        hasRecordingStarted: (context) => {
            return (context.livenessStreamProvider.videoRecorder.firstChunkTimestamp !==
                undefined);
        },
        shouldSkipStartScreen: (context) => {
            return !!context.componentProps?.disableStartScreen;
        },
    },
    services: {
        async checkVirtualCameraAndGetStream(context) {
            const { videoConstraints } = context.videoAssociatedParams;
            // Get initial stream to enumerate devices with non-empty labels
            const existingDeviceId = getLastSelectedCameraId();
            const initialStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    ...videoConstraints,
                    ...(existingDeviceId ? { deviceId: existingDeviceId } : {}),
                },
                audio: false,
            });
            const devices = await navigator.mediaDevices.enumerateDevices();
            const realVideoDevices = devices
                .filter((device) => device.kind === 'videoinput')
                .filter((device) => !isCameraDeviceVirtual(device));
            if (!realVideoDevices.length) {
                throw new Error('No real video devices found');
            }
            // Ensure that at least one of the cameras is capable of at least 15 fps
            const tracksWithMoreThan15Fps = initialStream
                .getTracks()
                .filter((track) => {
                const settings = track.getSettings();
                return settings.frameRate >= 15;
            });
            if (tracksWithMoreThan15Fps.length < 1) {
                throw new Error('No camera found with more than 15 fps');
            }
            // If the initial stream is of real camera, use it otherwise use the first real camera
            const initialStreamDeviceId = tracksWithMoreThan15Fps[0].getSettings().deviceId;
            const isInitialStreamFromRealDevice = realVideoDevices.some((device) => device.deviceId === initialStreamDeviceId);
            const deviceId = isInitialStreamFromRealDevice
                ? initialStreamDeviceId
                : realVideoDevices[0].deviceId;
            let realVideoDeviceStream = initialStream;
            if (!isInitialStreamFromRealDevice) {
                realVideoDeviceStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        ...videoConstraints,
                        deviceId: { exact: deviceId },
                    },
                    audio: false,
                });
            }
            setLastSelectedCameraId(deviceId);
            return {
                stream: realVideoDeviceStream,
                selectedDeviceId: initialStreamDeviceId,
                selectableDevices: realVideoDevices,
            };
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        async openLivenessStreamConnection(context) {
            const { config } = context.componentProps;
            const { credentialProvider, endpointOverride, systemClockOffset } = config;
            const livenessStreamProvider = new LivenessStreamProvider({
                sessionId: context.componentProps.sessionId,
                region: context.componentProps.region,
                systemClockOffset,
                stream: context.videoAssociatedParams.videoMediaStream,
                videoEl: context.videoAssociatedParams.videoEl,
                credentialProvider,
                endpointOverride,
            });
            responseStream = livenessStreamProvider.getResponseStream();
            return { livenessStreamProvider };
        },
        async detectFace(context) {
            const { videoEl } = context.videoAssociatedParams;
            const { faceDetector } = context.ovalAssociatedParams;
            // initialize models
            try {
                await faceDetector.modelLoadingPromise;
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.log({ err });
            }
            // detect face
            const faceMatchState = await getFaceMatchState(faceDetector, videoEl);
            return { faceMatchState };
        },
        async detectFaceDistance(context) {
            const { isFaceFarEnoughBeforeRecording: faceDistanceCheckBeforeRecording, } = context;
            const { videoEl, videoMediaStream, isMobile } = context.videoAssociatedParams;
            const { faceDetector } = context.ovalAssociatedParams;
            const { width, height } = videoMediaStream
                .getTracks()[0]
                .getSettings();
            const ovalDetails = getStaticLivenessOvalDetails({
                width: width,
                height: height,
            });
            const { isDistanceBelowThreshold: isFaceFarEnoughBeforeRecording } = await isFaceDistanceBelowThreshold({
                faceDetector: faceDetector,
                videoEl: videoEl,
                ovalDetails,
                reduceThreshold: faceDistanceCheckBeforeRecording,
                isMobile,
            });
            return { isFaceFarEnoughBeforeRecording };
        },
        async detectFaceDistanceWhileLoading(context) {
            const { isFaceFarEnoughBeforeRecording: faceDistanceCheckBeforeRecording, } = context;
            const { videoEl, videoMediaStream, isMobile } = context.videoAssociatedParams;
            const { faceDetector } = context.ovalAssociatedParams;
            const { width, height } = videoMediaStream
                .getTracks()[0]
                .getSettings();
            const ovalDetails = getStaticLivenessOvalDetails({
                width: width,
                height: height,
            });
            const { isDistanceBelowThreshold: isFaceFarEnoughBeforeRecording, error, } = await isFaceDistanceBelowThreshold({
                faceDetector: faceDetector,
                isMobile,
                ovalDetails,
                videoEl: videoEl,
                // if this is the second face distance check reduce the threshold
                reduceThreshold: faceDistanceCheckBeforeRecording,
            });
            return { isFaceFarEnoughBeforeRecording, error };
        },
        async detectInitialFaceAndDrawOval(context) {
            const { serverSessionInformation, livenessStreamProvider } = context;
            const { videoEl, canvasEl, isMobile } = context.videoAssociatedParams;
            const { faceDetector } = context.ovalAssociatedParams;
            // initialize models
            try {
                await faceDetector.modelLoadingPromise;
                await livenessStreamProvider.videoRecorder.recorderStarted;
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.log({ err });
            }
            // detect face
            const detectedFaces = await faceDetector.detectFaces(videoEl);
            let initialFace;
            let faceMatchState;
            let illuminationState;
            switch (detectedFaces.length) {
                case 0: {
                    // no face detected;
                    faceMatchState = FaceMatchState.CANT_IDENTIFY;
                    illuminationState = estimateIllumination(videoEl);
                    break;
                }
                case 1: {
                    //exactly one face detected;
                    faceMatchState = FaceMatchState.FACE_IDENTIFIED;
                    initialFace = detectedFaces[0];
                    break;
                }
                default: {
                    //more than one face detected ;
                    faceMatchState = FaceMatchState.TOO_MANY;
                    break;
                }
            }
            if (!initialFace) {
                return { faceMatchState, illuminationState };
            }
            // Get width/height of video element so we can compute scaleFactor
            // and set canvas width/height.
            const { width: videoScaledWidth, height: videoScaledHeight } = videoEl.getBoundingClientRect();
            if (isMobile) {
                canvasEl.width = window.innerWidth;
                canvasEl.height = window.innerHeight;
            }
            else {
                canvasEl.width = videoScaledWidth;
                canvasEl.height = videoScaledHeight;
            }
            // Compute scaleFactor which is how much our video element is scaled
            // vs the intrinsic video resolution
            const scaleFactor = videoScaledWidth / videoEl.videoWidth;
            // generate oval details from initialFace and video dimensions
            const ovalDetails = getOvalDetailsFromSessionInformation({
                sessionInformation: serverSessionInformation,
                videoWidth: videoEl.width,
            });
            // renormalize initial face
            const renormalizedFace = generateBboxFromLandmarks(initialFace, ovalDetails, videoEl.videoHeight);
            initialFace.top = renormalizedFace.top;
            initialFace.left = renormalizedFace.left;
            initialFace.height = renormalizedFace.bottom - renormalizedFace.top;
            initialFace.width = renormalizedFace.right - renormalizedFace.left;
            // Draw oval in canvas using ovalDetails and scaleFactor
            drawLivenessOvalInCanvas({
                canvas: canvasEl,
                oval: ovalDetails,
                scaleFactor,
                videoEl: videoEl,
            });
            return {
                faceMatchState,
                ovalDetails,
                scaleFactor,
                initialFace,
            };
        },
        async detectFaceAndMatchOval(context) {
            const { serverSessionInformation } = context;
            const { videoEl } = context.videoAssociatedParams;
            const { faceDetector, ovalDetails, initialFace } = context.ovalAssociatedParams;
            // detect face
            const detectedFaces = await faceDetector.detectFaces(videoEl);
            let faceMatchState;
            let faceMatchPercentage = 0;
            let detectedFace;
            let illuminationState;
            const initialFaceBoundingBox = generateBboxFromLandmarks(initialFace, ovalDetails, videoEl.videoHeight);
            const { ovalBoundingBox } = getOvalBoundingBox(ovalDetails);
            const initialFaceIntersection = getIntersectionOverUnion(initialFaceBoundingBox, ovalBoundingBox);
            switch (detectedFaces.length) {
                case 0: {
                    //no face detected;
                    faceMatchState = FaceMatchState.CANT_IDENTIFY;
                    illuminationState = estimateIllumination(videoEl);
                    break;
                }
                case 1: {
                    //exactly one face detected, match face with oval;
                    detectedFace = detectedFaces[0];
                    const { faceMatchState: faceMatchStateInLivenessOval, faceMatchPercentage: faceMatchPercentageInLivenessOval, } = getFaceMatchStateInLivenessOval({
                        face: detectedFace,
                        ovalDetails: ovalDetails,
                        initialFaceIntersection,
                        sessionInformation: serverSessionInformation,
                        frameHeight: videoEl.videoHeight,
                    });
                    faceMatchState = faceMatchStateInLivenessOval;
                    faceMatchPercentage = faceMatchPercentageInLivenessOval;
                    break;
                }
                default: {
                    //more than one face detected ;
                    faceMatchState = FaceMatchState.TOO_MANY;
                    break;
                }
            }
            return {
                faceMatchState,
                faceMatchPercentage,
                illuminationState,
                detectedFace,
            };
        },
        async flashColors(context) {
            const { freshnessColorsComplete, freshnessColorDisplay } = context.freshnessColorAssociatedParams;
            if (freshnessColorsComplete) {
                return;
            }
            const completed = await freshnessColorDisplay.displayColorTick();
            return { freshnessColorsComplete: completed };
        },
        async stopVideo(context) {
            const { challengeId, livenessStreamProvider } = context;
            const { videoMediaStream } = context.videoAssociatedParams;
            const { initialFace, ovalDetails } = context.ovalAssociatedParams;
            const { startFace, endFace } = context.faceMatchAssociatedParams;
            const { width, height } = videoMediaStream
                .getTracks()[0]
                .getSettings();
            const flippedInitialFaceLeft = width - initialFace.left - initialFace.width;
            await livenessStreamProvider.stopVideo();
            const livenessActionDocument = {
                Challenge: {
                    FaceMovementAndLightChallenge: {
                        ChallengeId: challengeId,
                        InitialFace: {
                            InitialFaceDetectedTimestamp: initialFace.timestampMs,
                            BoundingBox: getBoundingBox({
                                deviceHeight: height,
                                deviceWidth: width,
                                height: initialFace.height,
                                width: initialFace.width,
                                top: initialFace.top,
                                left: flippedInitialFaceLeft,
                            }),
                        },
                        TargetFace: {
                            FaceDetectedInTargetPositionStartTimestamp: startFace.timestampMs,
                            FaceDetectedInTargetPositionEndTimestamp: endFace.timestampMs,
                            BoundingBox: getBoundingBox({
                                deviceHeight: height,
                                deviceWidth: width,
                                height: ovalDetails.height,
                                width: ovalDetails.width,
                                top: ovalDetails.centerY - ovalDetails.height / 2,
                                left: ovalDetails.centerX - ovalDetails.width / 2,
                            }),
                        },
                        VideoEndTimestamp: livenessStreamProvider.videoRecorder.recorderEndTimestamp,
                    },
                },
            };
            if (livenessStreamProvider.videoRecorder.getVideoChunkSize() === 0) {
                throw new Error('Video chunks not recorded successfully.');
            }
            livenessStreamProvider.sendClientInfo(livenessActionDocument);
            livenessStreamProvider.dispatchStopVideoEvent();
        },
        async getLiveness(context) {
            const { onAnalysisComplete } = context.componentProps;
            // Get liveness result
            await onAnalysisComplete();
        },
    },
});

const FaceLivenessDetectorContext = React__namespace["default"].createContext(null);
function FaceLivenessDetectorProvider({ children, ...props }) {
    return (React__namespace["default"].createElement(FaceLivenessDetectorContext.Provider, { value: props }, children));
}
function useFaceLivenessDetector() {
    const props = React__namespace["default"].useContext(FaceLivenessDetectorContext);
    if (props === null) {
        throw new Error('useFaceLivenessDetector must be used within a FaceLivenessDetectorProvider');
    }
    return props;
}

// TODO: Add type annotations. Currently typing the actors returned from Xstate is difficult
// because the interpreter and state can not be used to form a type.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function useLivenessActor() {
    const { service } = useFaceLivenessDetector();
    const actor = react.useActor(service);
    return actor;
}

function createLivenessSelector(selector) {
    return selector;
}
function useLivenessSelector(selector) {
    const { service } = useFaceLivenessDetector();
    return react.useSelector(service, selector);
}

function useMediaStreamInVideo(stream) {
    const height = STATIC_VIDEO_CONSTRAINTS.height.ideal;
    const width = STATIC_VIDEO_CONSTRAINTS.width.ideal;
    const videoRef = React.useRef(null);
    const [videoHeight, setVideoHeight] = React.useState(height);
    const [videoWidth, setVideoWidth] = React.useState(width);
    React.useEffect(() => {
        if (stream) {
            if (ui.isObject(videoRef.current)) {
                videoRef.current.srcObject = stream;
            }
            const { height: streamHeight, width: streamWidth } = stream
                .getTracks()[0]
                .getSettings();
            setVideoHeight(streamHeight);
            setVideoWidth(streamWidth);
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => {
                    stream.removeTrack(track);
                    track.stop();
                });
            }
        };
    }, [stream]);
    return {
        videoRef,
        videoHeight,
        videoWidth,
    };
}

var LivenessClassNames;
(function (LivenessClassNames) {
    LivenessClassNames["CameraModule"] = "amplify-liveness-camera-module";
    LivenessClassNames["CancelContainer"] = "amplify-liveness-cancel-container";
    LivenessClassNames["CancelButton"] = "amplify-liveness-cancel-button";
    LivenessClassNames["CountdownContainer"] = "amplify-liveness-countdown-container";
    LivenessClassNames["DescriptionBullet"] = "amplify-liveness-description-bullet";
    LivenessClassNames["DescriptionBulletIndex"] = "amplify-liveness-description-bullet__index";
    LivenessClassNames["DescriptionBulletIndexText"] = "amplify-liveness-description-bullet__index__text";
    LivenessClassNames["DescriptionBulletMessage"] = "amplify-liveness-description-bullet__message";
    LivenessClassNames["ErrorModal"] = "amplify-liveness-error-modal";
    LivenessClassNames["ErrorModalHeading"] = "amplify-liveness-error-modal__heading";
    LivenessClassNames["FadeOut"] = "amplify-liveness-fade-out";
    LivenessClassNames["FreshnessCanvas"] = "amplify-liveness-freshness-canvas";
    LivenessClassNames["InstructionList"] = "amplify-liveness-instruction-list";
    LivenessClassNames["InstructionOverlay"] = "amplify-liveness-instruction-overlay";
    LivenessClassNames["Hint"] = "amplify-liveness-hint";
    LivenessClassNames["HintText"] = "amplify-liveness-hint__text";
    LivenessClassNames["LandscapeErrorModal"] = "amplify-liveness-landscape-error-modal";
    LivenessClassNames["LandscapeErrorModalButton"] = "amplify-liveness-landscape-error-modal__button";
    LivenessClassNames["LandscapeErrorModalHeader"] = "amplify-liveness-landscape-error-modal__header";
    LivenessClassNames["Loader"] = "amplify-liveness-loader";
    LivenessClassNames["MatchIndicator"] = "amplify-liveness-match-indicator";
    LivenessClassNames["OvalCanvas"] = "amplify-liveness-oval-canvas";
    LivenessClassNames["OpaqueOverlay"] = "amplify-liveness-overlay-opaque";
    LivenessClassNames["Overlay"] = "amplify-liveness-overlay";
    LivenessClassNames["Popover"] = "amplify-liveness-popover";
    LivenessClassNames["PopoverContainer"] = "amplify-liveness-popover__container";
    LivenessClassNames["PopoverAnchor"] = "amplify-liveness-popover__anchor";
    LivenessClassNames["PopoverAnchorSecondary"] = "amplify-liveness-popover__anchor-secondary";
    LivenessClassNames["RecordingIconContainer"] = "amplify-liveness-recording-icon-container";
    LivenessClassNames["RecordingIcon"] = "amplify-liveness-recording-icon";
    LivenessClassNames["StartScreenCameraSelect"] = "amplify-liveness-start-screen-camera-select";
    LivenessClassNames["StartScreenCameraSelectContainer"] = "amplify-liveness-start-screen-camera-select__container";
    LivenessClassNames["StartScreenCameraWaiting"] = "amplify-liveness-start-screen-camera-waiting";
    LivenessClassNames["StartScreenHeader"] = "amplify-liveness-start-screen-header";
    LivenessClassNames["StartScreenHeaderBody"] = "amplify-liveness-start-screen-header__body";
    LivenessClassNames["StartScreenHeaderHeading"] = "amplify-liveness-start-screen-header__heading";
    LivenessClassNames["StartScreenWarning"] = "amplify-liveness-start-screen-warning";
    LivenessClassNames["StartScreenInstructions"] = "amplify-liveness-start-screen-instructions";
    LivenessClassNames["StartScreenInstructionsHeading"] = "amplify-liveness-start-screen-instructions__heading";
    LivenessClassNames["Toast"] = "amplify-liveness-toast";
    LivenessClassNames["ToastContainer"] = "amplify-liveness-toast__container";
    LivenessClassNames["ToastMessage"] = "amplify-liveness-toast__message";
    LivenessClassNames["Video"] = "amplify-liveness-video";
    LivenessClassNames["VideoAnchor"] = "amplify-liveness-video-anchor";
})(LivenessClassNames || (LivenessClassNames = {}));

const CancelButton = ({ ariaLabel }) => {
    const [state, send] = useLivenessActor();
    const isFinalState = state.done;
    const handleClick = () => {
        send({
            type: 'CANCEL',
        });
    };
    if (isFinalState)
        return null;
    return (React__namespace["default"].createElement(uiReact.Button, { autoFocus: true, variation: "link", onClick: handleClick, size: "large", className: LivenessClassNames.CancelButton, "aria-label": ariaLabel },
        React__namespace["default"].createElement(internal.IconClose, { "aria-hidden": "true", "data-testid": "close-icon" })));
};

const Toast = ({ variation = 'default', size = 'medium', children, isInitial = false, ...rest }) => {
    const { tokens } = uiReact.useTheme();
    return (React__namespace.createElement(uiReact.View, { className: `${LivenessClassNames.Toast} ${LivenessClassNames.Toast}--${variation} ${LivenessClassNames.Toast}--${size}`, ...(isInitial && { backgroundColor: tokens.colors.background.primary }), ...rest },
        React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.ToastContainer },
            React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.ToastMessage, ...(isInitial ? { color: tokens.colors.font.primary } : {}) }, children))));
};

const ToastWithLoader = ({ displayText, }) => {
    return (React__namespace.createElement(Toast, { "aria-live": "polite" },
        React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.HintText },
            React__namespace.createElement(uiReact.Loader, null),
            React__namespace.createElement(uiReact.View, null, displayText))));
};

const selectErrorState = createLivenessSelector((state) => state.context.errorState);
const selectFaceMatchState$1 = createLivenessSelector((state) => state.context.faceMatchAssociatedParams.faceMatchState);
const selectIlluminationState = createLivenessSelector((state) => state.context.faceMatchAssociatedParams.illuminationState);
const selectIsFaceFarEnoughBeforeRecording = createLivenessSelector((state) => state.context.isFaceFarEnoughBeforeRecording);
const selectFaceMatchStateBeforeStart = createLivenessSelector((state) => state.context.faceMatchStateBeforeStart);
const selectFaceMatchPercentage$1 = createLivenessSelector((state) => state.context.faceMatchAssociatedParams?.faceMatchPercentage);
const DefaultToast = ({ text, isInitial = false, }) => {
    return (React__namespace.createElement(Toast, { size: "large", variation: "primary", isInitial: isInitial },
        React__namespace.createElement(uiReact.View, { "aria-live": "assertive" }, text)));
};
const Hint = ({ hintDisplayText }) => {
    const [state] = useLivenessActor();
    // NOTE: Do not change order of these selectors as the unit tests depend on this order
    const errorState = useLivenessSelector(selectErrorState);
    const faceMatchState = useLivenessSelector(selectFaceMatchState$1);
    const illuminationState = useLivenessSelector(selectIlluminationState);
    const faceMatchStateBeforeStart = useLivenessSelector(selectFaceMatchStateBeforeStart);
    const isFaceFarEnoughBeforeRecordingState = useLivenessSelector(selectIsFaceFarEnoughBeforeRecording);
    const faceMatchPercentage = useLivenessSelector(selectFaceMatchPercentage$1);
    const isCheckFaceDetectedBeforeStart = state.matches('checkFaceDetectedBeforeStart') ||
        state.matches('detectFaceBeforeStart');
    const isCheckFaceDistanceBeforeRecording = state.matches('checkFaceDistanceBeforeRecording') ||
        state.matches('detectFaceDistanceBeforeRecording');
    const isStartView = state.matches('start') || state.matches('userCancel');
    const isRecording = state.matches('recording');
    const isNotRecording = state.matches('notRecording');
    const isUploading = state.matches('uploading');
    const isCheckSuccessful = state.matches('checkSucceeded');
    const isCheckFailed = state.matches('checkFailed');
    const isFlashingFreshness = state.matches({
        recording: 'flashFreshnessColors',
    });
    const FaceMatchStateStringMap = {
        [FaceMatchState.CANT_IDENTIFY]: hintDisplayText.hintCanNotIdentifyText,
        [FaceMatchState.FACE_IDENTIFIED]: hintDisplayText.hintTooFarText,
        [FaceMatchState.TOO_MANY]: hintDisplayText.hintTooManyFacesText,
        [FaceMatchState.TOO_FAR]: hintDisplayText.hintTooFarText,
        [FaceMatchState.MATCHED]: hintDisplayText.hintHoldFaceForFreshnessText,
        [FaceMatchState.OFF_CENTER]: hintDisplayText.hintFaceOffCenterText,
    };
    const IlluminationStateStringMap = {
        [IlluminationState.BRIGHT]: hintDisplayText.hintIlluminationTooBrightText,
        [IlluminationState.DARK]: hintDisplayText.hintIlluminationTooDarkText,
        [IlluminationState.NORMAL]: hintDisplayText.hintIlluminationNormalText,
    };
    if (isStartView) {
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(uiReact.VisuallyHidden, { role: "alert" }, hintDisplayText.hintCenterFaceInstructionText),
            React__namespace.createElement(DefaultToast, { text: hintDisplayText.hintCenterFaceText, isInitial: true })));
    }
    if (errorState ?? (isCheckFailed || isCheckSuccessful)) {
        return null;
    }
    if (!isRecording) {
        if (isCheckFaceDetectedBeforeStart) {
            if (faceMatchStateBeforeStart === FaceMatchState.TOO_MANY) {
                return React__namespace.createElement(DefaultToast, { text: hintDisplayText.hintTooManyFacesText });
            }
            return (React__namespace.createElement(DefaultToast, { text: hintDisplayText.hintMoveFaceFrontOfCameraText }));
        }
        // Specifically checking for false here because initially the value is undefined and we do not want to show the instruction
        if (isCheckFaceDistanceBeforeRecording &&
            isFaceFarEnoughBeforeRecordingState === false) {
            return React__namespace.createElement(DefaultToast, { text: hintDisplayText.hintTooCloseText });
        }
        if (isNotRecording) {
            return (React__namespace.createElement(ToastWithLoader, { displayText: hintDisplayText.hintConnectingText }));
        }
        if (isUploading) {
            return (React__namespace.createElement(React__namespace.Fragment, null,
                React__namespace.createElement(uiReact.VisuallyHidden, { "aria-live": "assertive" }, hintDisplayText.hintCheckCompleteText),
                React__namespace.createElement(ToastWithLoader, { displayText: hintDisplayText.hintVerifyingText })));
        }
        if (illuminationState && illuminationState !== IlluminationState.NORMAL) {
            return (React__namespace.createElement(DefaultToast, { text: IlluminationStateStringMap[illuminationState] }));
        }
    }
    if (isFlashingFreshness) {
        return React__namespace.createElement(DefaultToast, { text: hintDisplayText.hintHoldFaceForFreshnessText });
    }
    if (isRecording && !isFlashingFreshness) {
        // During face matching, we want to only show the
        // TOO_FAR texts. For FACE_IDENTIFIED, CANT_IDENTIFY, TOO_MANY
        // we are defaulting to the TOO_FAR text (for now).
        let resultHintString = FaceMatchStateStringMap[FaceMatchState.TOO_FAR];
        if (faceMatchState === FaceMatchState.MATCHED) {
            resultHintString = FaceMatchStateStringMap[faceMatchState];
        }
        // If the face is outside the oval set the aria-label to a string about centering face in oval
        let a11yHintString = resultHintString;
        if (faceMatchState === FaceMatchState.OFF_CENTER) {
            a11yHintString = FaceMatchStateStringMap[faceMatchState];
        }
        else if (
        // If the face match percentage reaches 50% append it to the a11y label
        faceMatchState === FaceMatchState.TOO_FAR &&
            faceMatchPercentage > 50) {
            a11yHintString = hintDisplayText.hintMatchIndicatorText;
        }
        return (React__namespace.createElement(Toast, { size: "large", variation: 'primary' },
            React__namespace.createElement(uiReact.VisuallyHidden, { "aria-live": "assertive" }, a11yHintString),
            React__namespace.createElement(uiReact.View, { "aria-label": a11yHintString }, resultHintString)));
    }
    return null;
};

const MatchIndicator = ({ percentage, initialPercentage = 25, testId, }) => {
    const [matchPercentage, setMatchPercentage] = React__namespace["default"].useState(initialPercentage);
    React__namespace["default"].useEffect(() => {
        if (percentage < 0) {
            setMatchPercentage(0);
        }
        else if (percentage > 100) {
            setMatchPercentage(100);
        }
        else {
            setMatchPercentage(percentage);
        }
    }, [percentage]);
    const percentageStyles = {
        '--percentage': `${matchPercentage}%`,
    };
    return (React__namespace["default"].createElement("div", { className: LivenessClassNames.MatchIndicator, "data-testid": testId },
        React__namespace["default"].createElement("div", { className: `${LivenessClassNames.MatchIndicator}__bar`, style: percentageStyles, role: "progressbar", "aria-label": "MatchIndicator", "aria-valuenow": percentage, "aria-valuetext": `${percentage}% face fit` })));
};

const Overlay = ({ children, horizontal = 'center', vertical = 'center', className, ...rest }) => {
    return (React__namespace.createElement(uiReact.Flex, { className: `${LivenessClassNames.Overlay} ${className}`, alignItems: horizontal, justifyContent: vertical, ...rest }, children));
};

const RecordingIcon = ({ children }) => {
    return (React__namespace["default"].createElement(uiReact.Flex, { className: LivenessClassNames.RecordingIcon },
        React__namespace["default"].createElement(uiReact.Flex, { "data-testid": "rec-icon", justifyContent: "center" },
            React__namespace["default"].createElement(uiReact.Icon, { viewBox: { width: 20, height: 20 }, width: "20", height: "20" },
                React__namespace["default"].createElement("circle", { cx: "10", cy: "10", r: "8", fill: "red" }))),
        React__namespace["default"].createElement(uiReact.Text, { as: "span", fontWeight: "bold" }, children)));
};

const defaultErrorDisplayText = {
    errorLabelText: 'Error',
    connectionTimeoutHeaderText: 'Connection time out',
    connectionTimeoutMessageText: 'Connection has timed out.',
    timeoutHeaderText: 'Time out',
    timeoutMessageText: "Face didn't fit inside oval in time limit. Try again and completely fill the oval with face in it.",
    faceDistanceHeaderText: 'Forward movement detected',
    faceDistanceMessageText: 'Avoid moving closer when connecting.',
    multipleFacesHeaderText: 'Multiple faces detected',
    multipleFacesMessageText: 'Ensure only one face is present in front of the camera when connecting.',
    clientHeaderText: 'Client error',
    clientMessageText: 'Check failed due to client issue',
    serverHeaderText: 'Server issue',
    serverMessageText: 'Cannot complete check due to server issue',
    landscapeHeaderText: 'Landscape orientation not supported',
    landscapeMessageText: 'Rotate your device to portrait (vertical) orientation.',
    portraitMessageText: 'Ensure your device remains in portrait (vertical) orientation for the check’s duration.',
    tryAgainText: 'Try again',
};
const defaultLivenessDisplayText = {
    cameraMinSpecificationsHeadingText: 'Camera does not meet minimum specifications',
    cameraMinSpecificationsMessageText: 'Camera must support at least 320*240 resolution and 15 frames per second.',
    cameraNotFoundHeadingText: 'Camera is not accessible.',
    cameraNotFoundMessageText: 'Check that a camera is connected and there is not another application using the camera. You may have to go into settings to grant camera permissions and close out all instances of your browser and retry.',
    a11yVideoLabelText: 'Webcam for liveness check',
    cancelLivenessCheckText: 'Cancel Liveness check',
    goodFitCaptionText: 'Good fit',
    goodFitAltText: "Ilustration of a person's face, perfectly fitting inside of an oval.",
    hintCenterFaceText: 'Center your face',
    hintCenterFaceInstructionText: 'Instruction: Before starting the check, make sure your camera is at the center top of your screen and center your face to the camera. When the check starts an oval will show up in the center. You will be prompted to move forward into the oval and then prompted to hold still. After holding still for a few seconds, you should hear check complete.',
    hintFaceOffCenterText: 'Face is not in the oval, center your face to the camera.',
    hintMoveFaceFrontOfCameraText: 'Move face in front of camera',
    hintTooManyFacesText: 'Ensure only one face is in front of camera',
    hintFaceDetectedText: 'Face detected',
    hintCanNotIdentifyText: 'Move face in front of camera',
    hintTooCloseText: 'Move back',
    hintTooFarText: 'Move closer',
    hintConnectingText: 'Connecting...',
    hintVerifyingText: 'Verifying...',
    hintCheckCompleteText: 'Check complete',
    hintIlluminationTooBrightText: 'Move to dimmer area',
    hintIlluminationTooDarkText: 'Move to brighter area',
    hintIlluminationNormalText: 'Lighting conditions normal',
    hintHoldFaceForFreshnessText: 'Hold still',
    hintMatchIndicatorText: '50% completed. Keep moving closer.',
    photosensitivityWarningBodyText: 'This check flashes different colors. Use caution if you are photosensitive.',
    photosensitivityWarningHeadingText: 'Photosensitivity warning',
    photosensitivityWarningInfoText: 'Some people may experience epileptic seizures when exposed to colored lights. Use caution if you, or anyone in your family, have an epileptic condition.',
    photosensitivityWarningLabelText: 'More information about photosensitivity',
    photosensitivyWarningBodyText: 'This check flashes different colors. Use caution if you are photosensitive.',
    photosensitivyWarningHeadingText: 'Photosensitivity warning',
    photosensitivyWarningInfoText: 'Some people may experience epileptic seizures when exposed to colored lights. Use caution if you, or anyone in your family, have an epileptic condition.',
    photosensitivyWarningLabelText: 'More information about photosensitivity',
    retryCameraPermissionsText: 'Retry',
    recordingIndicatorText: 'Rec',
    startScreenBeginCheckText: 'Start video check',
    tooFarCaptionText: 'Too far',
    tooFarAltText: "Illustration of a person's face inside of an oval; there is a gap between the perimeter of the face and the boundaries of the oval.",
    waitingCameraPermissionText: 'Waiting for you to allow camera permission.',
    ...defaultErrorDisplayText,
};

const renderToastErrorModal = (props) => {
    const { error: errorState, displayText } = props;
    const { connectionTimeoutHeaderText, connectionTimeoutMessageText, errorLabelText, timeoutHeaderText, timeoutMessageText, faceDistanceHeaderText, faceDistanceMessageText, multipleFacesHeaderText, multipleFacesMessageText, clientHeaderText, clientMessageText, serverHeaderText, serverMessageText, } = displayText;
    let heading;
    let message;
    switch (errorState) {
        case LivenessErrorState.CONNECTION_TIMEOUT:
            heading = connectionTimeoutHeaderText;
            message = connectionTimeoutMessageText;
            break;
        case LivenessErrorState.TIMEOUT:
            heading = timeoutHeaderText;
            message = timeoutMessageText;
            break;
        case LivenessErrorState.FACE_DISTANCE_ERROR:
            heading = faceDistanceHeaderText;
            message = faceDistanceMessageText;
            break;
        case LivenessErrorState.MULTIPLE_FACES_ERROR:
            heading = multipleFacesHeaderText;
            message = multipleFacesMessageText;
            break;
        case LivenessErrorState.RUNTIME_ERROR:
            heading = clientHeaderText;
            message = clientMessageText;
            break;
        case LivenessErrorState.SERVER_ERROR:
        default:
            heading = serverHeaderText;
            message = serverMessageText;
    }
    return (React__namespace["default"].createElement(React__namespace["default"].Fragment, null,
        React__namespace["default"].createElement(uiReact.Flex, { className: LivenessClassNames.ErrorModal },
            React__namespace["default"].createElement(internal.AlertIcon, { ariaLabel: errorLabelText, role: "img", variation: "error" }),
            React__namespace["default"].createElement(uiReact.Text, { className: LivenessClassNames.ErrorModalHeading, id: "amplify-liveness-error-heading" }, heading)),
        React__namespace["default"].createElement(uiReact.Text, { id: "amplify-liveness-error-message" }, message)));
};
const renderErrorModal = ({ errorState, overrideErrorDisplayText, }) => {
    const displayText = {
        ...defaultErrorDisplayText,
        ...overrideErrorDisplayText,
    };
    if (errorState === LivenessErrorState.CAMERA_ACCESS_ERROR ||
        errorState === LivenessErrorState.CAMERA_FRAMERATE_ERROR ||
        errorState === LivenessErrorState.MOBILE_LANDSCAPE_ERROR) {
        return null;
    }
    else {
        return renderToastErrorModal({
            error: errorState,
            displayText,
        });
    }
};
const FaceLivenessErrorModal = (props) => {
    const { children, onRetry, displayText: overrideErrorDisplayText } = props;
    const displayText = {
        ...defaultErrorDisplayText,
        ...overrideErrorDisplayText,
    };
    const { tryAgainText } = displayText;
    return (React__namespace["default"].createElement(Overlay, { className: LivenessClassNames.OpaqueOverlay },
        React__namespace["default"].createElement(Toast, { "aria-labelledby": "amplify-liveness-error-heading", "aria-describedby": "amplify-liveness-error-message", role: "alertdialog" },
            children,
            React__namespace["default"].createElement(uiReact.Flex, { justifyContent: "center" },
                React__namespace["default"].createElement(uiReact.Button, { variation: "primary", type: "button", onClick: onRetry }, tryAgainText)))));
};

/**
 * Copied from src/primitives/Alert/AlertIcon.tsx because we want to re-use the icon but it is not currently expored by AlertIcon.
 * We currently don't want to make a change to the AlertIcon primitive itself and may expose the icon in the future but for now so as not to introduce cross component dependencies we have duplicated it.
 */
const LivenessIconWithPopover = ({ children, headingText, labelText }) => {
    const breakpoint = internal.useThemeBreakpoint();
    const [shouldShowPopover, setShouldShowPopover] = React__namespace.useState(false);
    const wrapperRef = React__namespace.useRef(null);
    const isMobileScreen = breakpoint === 'base';
    React__namespace.useEffect(() => {
        function handleClickOutside(event) {
            if (shouldShowPopover &&
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)) {
                setShouldShowPopover(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, shouldShowPopover]);
    return (React__namespace.createElement("div", { className: LivenessClassNames.Popover, ref: wrapperRef },
        React__namespace.createElement(uiReact.Button, { "aria-controls": "photosensitivity-description", "aria-expanded": shouldShowPopover, role: "alertdialog", "aria-label": labelText, "aria-describedby": "photosensitivity-description", colorTheme: "info", id: "popover-button", onClick: () => setShouldShowPopover(!shouldShowPopover), testId: "popover-icon" },
            React__namespace.createElement(internal.AlertIcon, { ariaHidden: true, variation: "info" })),
        shouldShowPopover && (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.PopoverAnchor }),
            React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.PopoverAnchorSecondary }),
            React__namespace.createElement(uiReact.Flex, { "aria-hidden": !shouldShowPopover, "aria-label": headingText, className: LivenessClassNames.PopoverContainer, "data-testid": "popover-text", id: "photosensitivity-description", left: isMobileScreen ? -190 : -108, role: "alertdialog" }, children)))));
};
LivenessIconWithPopover.displayName = 'LivenessIconWithPopover';

const DefaultPhotosensitiveWarning = ({ bodyText, headingText, infoText, labelText, }) => {
    return (React__namespace["default"].createElement(uiReact.Flex, { className: `${ui.ComponentClassName.Alert} ${LivenessClassNames.StartScreenWarning}`, style: { zIndex: '3' } },
        React__namespace["default"].createElement(uiReact.View, { flex: "1" },
            React__namespace["default"].createElement(uiReact.View, { className: ui.ComponentClassName.AlertHeading }, headingText),
            React__namespace["default"].createElement(uiReact.View, { className: ui.ComponentClassName.AlertBody }, bodyText)),
        React__namespace["default"].createElement(LivenessIconWithPopover, { labelText: labelText, headingText: headingText }, infoText)));
};
const DefaultRecordingIcon = ({ recordingIndicatorText, }) => {
    return (React__namespace["default"].createElement(uiReact.View, { className: LivenessClassNames.RecordingIconContainer },
        React__namespace["default"].createElement(RecordingIcon, null, recordingIndicatorText)));
};
const DefaultCancelButton = ({ cancelLivenessCheckText, }) => {
    return (React__namespace["default"].createElement(uiReact.View, { className: LivenessClassNames.CancelContainer },
        React__namespace["default"].createElement(CancelButton, { ariaLabel: cancelLivenessCheckText })));
};

const selectVideoConstraints = createLivenessSelector((state) => state.context.videoAssociatedParams?.videoConstraints);
const selectVideoStream = createLivenessSelector((state) => state.context.videoAssociatedParams?.videoMediaStream);
const selectFaceMatchPercentage = createLivenessSelector((state) => state.context.faceMatchAssociatedParams?.faceMatchPercentage);
const selectFaceMatchState = createLivenessSelector((state) => state.context.faceMatchAssociatedParams?.faceMatchState);
const selectSelectedDeviceId = createLivenessSelector((state) => state.context.videoAssociatedParams?.selectedDeviceId);
const selectSelectableDevices = createLivenessSelector((state) => state.context.videoAssociatedParams?.selectableDevices);
const centeredLoader = (React__namespace["default"].createElement(uiReact.Loader, { size: "large", className: LivenessClassNames.Loader, "data-testid": "centered-loader" }));
const showMatchIndicatorStates = [
    FaceMatchState.TOO_FAR,
    FaceMatchState.CANT_IDENTIFY,
    FaceMatchState.FACE_IDENTIFIED,
    FaceMatchState.OFF_CENTER,
];
/**
 * For now we want to memoize the HOC for MatchIndicator because to optimize renders
 * The LivenessCameraModule still needs to be optimized for re-renders and at that time
 * we should be able to remove this memoization
 */
const MemoizedMatchIndicator = React__namespace["default"].memo(MatchIndicator);
const LivenessCameraModule = (props) => {
    const { isMobileScreen, isRecordingStopped, instructionDisplayText, streamDisplayText, hintDisplayText, errorDisplayText, cameraDisplayText, components: customComponents, testId, } = props;
    const { cancelLivenessCheckText, recordingIndicatorText } = streamDisplayText;
    const { ErrorView = FaceLivenessErrorModal, PhotosensitiveWarning = DefaultPhotosensitiveWarning, } = customComponents ?? {};
    const [state, send] = useLivenessActor();
    const videoStream = useLivenessSelector(selectVideoStream);
    const videoConstraints = useLivenessSelector(selectVideoConstraints);
    const selectedDeviceId = useLivenessSelector(selectSelectedDeviceId);
    const selectableDevices = useLivenessSelector(selectSelectableDevices);
    const faceMatchPercentage = useLivenessSelector(selectFaceMatchPercentage);
    const faceMatchState = useLivenessSelector(selectFaceMatchState);
    const errorState = useLivenessSelector(selectErrorState);
    const colorMode = internal.useColorMode();
    const { videoRef, videoWidth, videoHeight } = useMediaStreamInVideo(videoStream);
    const canvasRef = React.useRef(null);
    const freshnessColorRef = React.useRef(null);
    const [isCameraReady, setIsCameraReady] = React.useState(false);
    const isCheckingCamera = state.matches('cameraCheck');
    const isWaitingForCamera = state.matches('waitForDOMAndCameraDetails');
    const isStartView = state.matches('start') || state.matches('userCancel');
    const isDetectFaceBeforeStart = state.matches('detectFaceBeforeStart');
    const isRecording = state.matches('recording');
    const isCheckSucceeded = state.matches('checkSucceeded');
    const isFlashingFreshness = state.matches({
        recording: 'flashFreshnessColors',
    });
    // Android/Firefox and iOS flip the values of width/height returned from
    // getUserMedia, so we'll reset these in useLayoutEffect with the videoRef
    // element's intrinsic videoWidth and videoHeight attributes
    const [mediaWidth, setMediaWidth] = React.useState(videoWidth);
    const [mediaHeight, setMediaHeight] = React.useState(videoHeight);
    const [aspectRatio, setAspectRatio] = React.useState(() => videoWidth && videoHeight ? videoWidth / videoHeight : 0);
    React__namespace["default"].useEffect(() => {
        if (canvasRef?.current && videoRef?.current && videoStream && isStartView) {
            drawStaticOval(canvasRef.current, videoRef.current, videoStream);
        }
    }, [canvasRef, videoRef, videoStream, colorMode, isStartView]);
    React__namespace["default"].useEffect(() => {
        const updateColorModeHandler = (e) => {
            if (e.matches &&
                canvasRef?.current &&
                videoRef?.current &&
                videoStream &&
                isStartView) {
                drawStaticOval(canvasRef.current, videoRef.current, videoStream);
            }
        };
        const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModePreference = window.matchMedia('(prefers-color-scheme: light)');
        darkModePreference.addEventListener('change', updateColorModeHandler);
        lightModePreference.addEventListener('change', updateColorModeHandler);
        return () => {
            darkModePreference.removeEventListener('change', updateColorModeHandler);
            lightModePreference.addEventListener('change', updateColorModeHandler);
        };
    }, [canvasRef, videoRef, videoStream, isStartView]);
    React__namespace["default"].useLayoutEffect(() => {
        if (isCameraReady) {
            send({
                type: 'SET_DOM_AND_CAMERA_DETAILS',
                data: {
                    videoEl: videoRef.current,
                    canvasEl: canvasRef.current,
                    freshnessColorEl: freshnessColorRef.current,
                    isMobile: isMobileScreen,
                },
            });
        }
        if (videoRef.current) {
            setMediaWidth(videoRef.current.videoWidth);
            setMediaHeight(videoRef.current.videoHeight);
            setAspectRatio(videoRef.current.videoWidth / videoRef.current.videoHeight);
        }
    }, [send, videoRef, isCameraReady, isMobileScreen]);
    React__namespace["default"].useEffect(() => {
        if (isDetectFaceBeforeStart) {
            clearOvalCanvas({ canvas: canvasRef.current });
        }
    }, [isDetectFaceBeforeStart]);
    const photoSensitivityWarning = React__namespace["default"].useMemo(() => {
        return (React__namespace["default"].createElement(uiReact.View, { style: { visibility: isStartView ? 'visible' : 'hidden' } },
            React__namespace["default"].createElement(PhotosensitiveWarning, { bodyText: instructionDisplayText.photosensitivityWarningBodyText, headingText: instructionDisplayText.photosensitivityWarningHeadingText, infoText: instructionDisplayText.photosensitivityWarningInfoText, labelText: instructionDisplayText.photosensitivityWarningLabelText })));
    }, [PhotosensitiveWarning, instructionDisplayText, isStartView]);
    const handleMediaPlay = () => {
        setIsCameraReady(true);
    };
    const beginLivenessCheck = React__namespace["default"].useCallback(() => {
        send({
            type: 'BEGIN',
        });
    }, [send]);
    const onCameraChange = React__namespace["default"].useCallback((e) => {
        const newDeviceId = e.target.value;
        const changeCamera = async () => {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    ...videoConstraints,
                    deviceId: { exact: newDeviceId },
                },
                audio: false,
            });
            send({
                type: 'UPDATE_DEVICE_AND_STREAM',
                data: { newDeviceId, newStream },
            });
        };
        changeCamera();
    }, [videoConstraints, send]);
    if (isCheckingCamera) {
        return (React__namespace["default"].createElement(uiReact.Flex, { justifyContent: 'center', className: LivenessClassNames.StartScreenCameraWaiting },
            React__namespace["default"].createElement(uiReact.Loader, { size: "large", className: LivenessClassNames.Loader, "data-testid": "centered-loader", position: "unset" }),
            React__namespace["default"].createElement(uiReact.Text, { fontSize: "large", fontWeight: "bold", "data-testid": "waiting-camera-permission", className: `${LivenessClassNames.StartScreenCameraWaiting}__text` }, cameraDisplayText.waitingCameraPermissionText)));
    }
    // We don't show full screen camera on the pre check screen (isStartView/isWaitingForCamera)
    const shouldShowFullScreenCamera = isMobileScreen && !isStartView && !isWaitingForCamera;
    return (React__namespace["default"].createElement(React__namespace["default"].Fragment, null,
        photoSensitivityWarning,
        React__namespace["default"].createElement(uiReact.Flex, { className: ui.classNames(LivenessClassNames.CameraModule, shouldShowFullScreenCamera &&
                `${LivenessClassNames.CameraModule}--mobile`), "data-testid": testId, gap: "zero" },
            !isCameraReady && centeredLoader,
            React__namespace["default"].createElement(Overlay, { horizontal: "center", vertical: isRecording && !isFlashingFreshness ? 'start' : 'space-between', className: LivenessClassNames.InstructionOverlay },
                isRecording && (React__namespace["default"].createElement(DefaultRecordingIcon, { recordingIndicatorText: recordingIndicatorText })),
                !isStartView && !isWaitingForCamera && !isCheckSucceeded && (React__namespace["default"].createElement(DefaultCancelButton, { cancelLivenessCheckText: cancelLivenessCheckText })),
                React__namespace["default"].createElement(uiReact.Flex, { className: ui.classNames(LivenessClassNames.Hint, shouldShowFullScreenCamera && `${LivenessClassNames.Hint}--mobile`) },
                    React__namespace["default"].createElement(Hint, { hintDisplayText: hintDisplayText })),
                errorState && (React__namespace["default"].createElement(ErrorView, { onRetry: () => {
                        send({ type: 'CANCEL' });
                    }, displayText: errorDisplayText }, renderErrorModal({
                    errorState,
                    overrideErrorDisplayText: errorDisplayText,
                }))),
                isRecording &&
                    !isFlashingFreshness &&
                    showMatchIndicatorStates.includes(faceMatchState) ? (React__namespace["default"].createElement(MemoizedMatchIndicator, { percentage: Math.ceil(faceMatchPercentage) })) : null),
            React__namespace["default"].createElement(uiReact.View, { as: "canvas", ref: freshnessColorRef, className: LivenessClassNames.FreshnessCanvas, hidden: true }),
            React__namespace["default"].createElement(uiReact.View, { className: LivenessClassNames.VideoAnchor, style: {
                    aspectRatio: `${aspectRatio}`,
                } },
                React__namespace["default"].createElement("video", { ref: videoRef, muted: true, autoPlay: true, playsInline: true, width: mediaWidth, height: mediaHeight, onCanPlay: handleMediaPlay, "data-testid": "video", className: ui.classNames(LivenessClassNames.Video, isRecordingStopped && LivenessClassNames.FadeOut), "aria-label": cameraDisplayText.a11yVideoLabelText }),
                React__namespace["default"].createElement(uiReact.Flex, { className: ui.classNames(LivenessClassNames.OvalCanvas, shouldShowFullScreenCamera &&
                        `${LivenessClassNames.OvalCanvas}--mobile`, isRecordingStopped && LivenessClassNames.FadeOut) },
                    React__namespace["default"].createElement(uiReact.View, { as: "canvas", ref: canvasRef })),
                isStartView &&
                    !isMobileScreen &&
                    selectableDevices &&
                    selectableDevices.length > 1 && (React__namespace["default"].createElement(uiReact.Flex, { className: LivenessClassNames.StartScreenCameraSelect },
                    React__namespace["default"].createElement(uiReact.View, { className: LivenessClassNames.StartScreenCameraSelectContainer },
                        React__namespace["default"].createElement(uiReact.Label, { htmlFor: "amplify-liveness-camera-select", className: `${LivenessClassNames.StartScreenCameraSelect}__label` }, "Camera:"),
                        React__namespace["default"].createElement(uiReact.SelectField, { id: "amplify-liveness-camera-select", label: "Camera", labelHidden: true, value: selectedDeviceId, onChange: onCameraChange }, selectableDevices?.map((device) => (React__namespace["default"].createElement("option", { value: device.deviceId, key: device.deviceId }, device.label))))))))),
        isStartView && (React__namespace["default"].createElement(uiReact.Flex, { justifyContent: "center" },
            React__namespace["default"].createElement(uiReact.Button, { variation: "primary", type: "button", onClick: beginLivenessCheck }, instructionDisplayText.startScreenBeginCheckText)))));
};

const LandscapeErrorModal = (props) => {
    const { onRetry, header, portraitMessage, landscapeMessage, tryAgainText } = props;
    const [isLandscape, setIsLandscape] = React__namespace.useState(true);
    React__namespace.useLayoutEffect(() => {
        // Get orientation: landscape media query
        const landscapeMediaQuery = getLandscapeMediaQuery();
        // Set ui state for initial orientation
        setIsLandscape(landscapeMediaQuery.matches);
        // Listen for future orientation changes
        landscapeMediaQuery.addEventListener('change', (e) => {
            setIsLandscape(e.matches);
        });
        // Remove matchMedia event listener
        return () => {
            landscapeMediaQuery.removeEventListener('change', (e) => setIsLandscape(e.matches));
        };
    }, []);
    return (React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.LandscapeErrorModal, height: isLandscape ? 'auto' : 480 },
        React__namespace.createElement(uiReact.Text, { className: LivenessClassNames.LandscapeErrorModalHeader }, header),
        React__namespace.createElement(uiReact.Text, null, isLandscape ? landscapeMessage : portraitMessage),
        !isLandscape ? (React__namespace.createElement(uiReact.Flex, { className: LivenessClassNames.LandscapeErrorModalButton },
            React__namespace.createElement(uiReact.Button, { variation: "primary", type: "button", onClick: onRetry }, tryAgainText))) : null));
};

const CHECK_CLASS_NAME = 'liveness-detector-check';
const CAMERA_ERROR_TEXT_WIDTH = 420;
const selectIsRecordingStopped = createLivenessSelector((state) => state.context.isRecordingStopped);
const LivenessCheck = ({ instructionDisplayText, hintDisplayText, cameraDisplayText, streamDisplayText, errorDisplayText, components, }) => {
    const [state, send] = useLivenessActor();
    const errorState = useLivenessSelector(selectErrorState);
    const isRecordingStopped = useLivenessSelector(selectIsRecordingStopped);
    const isPermissionDenied = state.matches('permissionDenied');
    const isMobile = isMobileScreen();
    const recheckCameraPermissions = () => {
        send({ type: 'RETRY_CAMERA_CHECK' });
    };
    const { cameraMinSpecificationsHeadingText, cameraMinSpecificationsMessageText, cameraNotFoundHeadingText, cameraNotFoundMessageText, retryCameraPermissionsText, } = cameraDisplayText;
    const { cancelLivenessCheckText } = streamDisplayText;
    React__namespace.useLayoutEffect(() => {
        if (isMobile) {
            const sendLandscapeWarning = (isLandscapeMatched) => {
                if (isLandscapeMatched) {
                    send({ type: 'MOBILE_LANDSCAPE_WARNING' });
                }
            };
            // Get orientation: landscape media query
            const landscapeMediaQuery = getLandscapeMediaQuery();
            // Send warning based on initial orientation
            sendLandscapeWarning(landscapeMediaQuery.matches);
            // Listen for future orientation changes and send warning
            landscapeMediaQuery.addEventListener('change', (e) => {
                sendLandscapeWarning(e.matches);
            });
            // Remove matchMedia event listener
            return () => {
                landscapeMediaQuery.removeEventListener('change', (e) => sendLandscapeWarning(e.matches));
            };
        }
    }, [isMobile, send]);
    const renderCheck = () => {
        if (errorState === LivenessErrorState.MOBILE_LANDSCAPE_ERROR) {
            const displayText = {
                ...defaultErrorDisplayText,
                ...errorDisplayText,
            };
            const { landscapeHeaderText, portraitMessageText, landscapeMessageText, tryAgainText, } = displayText;
            return (React__namespace.createElement(uiReact.Flex, { backgroundColor: "background.primary", direction: "column", textAlign: "center", alignItems: "center", justifyContent: "center", position: "absolute", width: "100%" },
                React__namespace.createElement(LandscapeErrorModal, { header: landscapeHeaderText, portraitMessage: portraitMessageText, landscapeMessage: landscapeMessageText, tryAgainText: tryAgainText, onRetry: () => {
                        send({
                            type: 'CANCEL',
                        });
                    } })));
        }
        else if (isPermissionDenied) {
            return (React__namespace.createElement(uiReact.Flex, { backgroundColor: "background.primary", direction: "column", textAlign: "center", alignItems: "center", justifyContent: "center", width: "100%", height: 480 },
                React__namespace.createElement(uiReact.Text, { fontSize: "large", fontWeight: "bold" }, errorState === LivenessErrorState.CAMERA_FRAMERATE_ERROR
                    ? cameraMinSpecificationsHeadingText
                    : cameraNotFoundHeadingText),
                React__namespace.createElement(uiReact.Text, { maxWidth: CAMERA_ERROR_TEXT_WIDTH }, errorState === LivenessErrorState.CAMERA_FRAMERATE_ERROR
                    ? cameraMinSpecificationsMessageText
                    : cameraNotFoundMessageText),
                React__namespace.createElement(uiReact.Button, { variation: "primary", type: "button", onClick: recheckCameraPermissions }, retryCameraPermissionsText),
                React__namespace.createElement(uiReact.View, { position: "absolute", top: "medium", right: "medium" },
                    React__namespace.createElement(CancelButton, { ariaLabel: cancelLivenessCheckText }))));
        }
        else {
            return (React__namespace.createElement(LivenessCameraModule, { isMobileScreen: isMobile, isRecordingStopped: isRecordingStopped, instructionDisplayText: instructionDisplayText, streamDisplayText: streamDisplayText, hintDisplayText: hintDisplayText, errorDisplayText: errorDisplayText, cameraDisplayText: cameraDisplayText, components: components }));
        }
    };
    return (React__namespace.createElement(uiReact.Flex, { direction: "column", position: "relative", testId: CHECK_CLASS_NAME, className: CHECK_CLASS_NAME, gap: "xl" }, renderCheck()));
};

function getMergedDisplayText(overrideDisplayText) {
    const mergeField = (correctKey, deprecatedKey) => {
        if (overrideDisplayText[correctKey] &&
            overrideDisplayText[correctKey] !== defaultLivenessDisplayText[correctKey]) {
            return overrideDisplayText[correctKey];
        }
        else if (overrideDisplayText[deprecatedKey] &&
            overrideDisplayText[deprecatedKey] !==
                defaultLivenessDisplayText[correctKey]) {
            return overrideDisplayText[deprecatedKey];
        }
        else {
            return defaultLivenessDisplayText[correctKey];
        }
    };
    return {
        photosensitivityWarningBodyText: mergeField('photosensitivityWarningBodyText', 'photosensitivyWarningBodyText'),
        photosensitivityWarningHeadingText: mergeField('photosensitivityWarningHeadingText', 'photosensitivyWarningHeadingText'),
        photosensitivityWarningInfoText: mergeField('photosensitivityWarningInfoText', 'photosensitivyWarningInfoText'),
        photosensitivityWarningLabelText: mergeField('photosensitivityWarningLabelText', 'photosensitivyWarningLabelText'),
    };
}
/**
 * Merges optional displayText prop with
 * defaultLivenessDisplayText and returns more bite size portions to pass
 * down to child components of FaceLivenessDetector.
 * @param overrideDisplayText
 * @returns hintDisplayText, cameraDisplayText, instructionDisplayText, cancelLivenessCheckText
 */
function getDisplayText(overrideDisplayText) {
    const mergedDisplayText = getMergedDisplayText(overrideDisplayText ?? {});
    const displayText = {
        ...defaultLivenessDisplayText,
        ...overrideDisplayText,
        ...mergedDisplayText,
    };
    const { a11yVideoLabelText, cameraMinSpecificationsHeadingText, cameraMinSpecificationsMessageText, cameraNotFoundHeadingText, cameraNotFoundMessageText, cancelLivenessCheckText, connectionTimeoutHeaderText, connectionTimeoutMessageText, clientHeaderText, clientMessageText, errorLabelText, hintCanNotIdentifyText, hintCenterFaceText, hintCenterFaceInstructionText, hintFaceOffCenterText, hintConnectingText, hintFaceDetectedText, hintHoldFaceForFreshnessText, hintIlluminationNormalText, hintIlluminationTooBrightText, hintIlluminationTooDarkText, hintMoveFaceFrontOfCameraText, hintTooManyFacesText, hintTooCloseText, hintTooFarText, hintVerifyingText, hintCheckCompleteText, hintMatchIndicatorText, faceDistanceHeaderText, faceDistanceMessageText, goodFitCaptionText, goodFitAltText, landscapeHeaderText, landscapeMessageText, multipleFacesHeaderText, multipleFacesMessageText, photosensitivityWarningBodyText, photosensitivityWarningHeadingText, photosensitivityWarningInfoText, photosensitivityWarningLabelText, photosensitivyWarningBodyText, photosensitivyWarningHeadingText, photosensitivyWarningInfoText, photosensitivyWarningLabelText, portraitMessageText, retryCameraPermissionsText, recordingIndicatorText, serverHeaderText, serverMessageText, startScreenBeginCheckText, timeoutHeaderText, timeoutMessageText, tooFarCaptionText, tooFarAltText, tryAgainText, waitingCameraPermissionText, } = displayText;
    const hintDisplayText = {
        hintMoveFaceFrontOfCameraText,
        hintTooManyFacesText,
        hintFaceDetectedText,
        hintCanNotIdentifyText,
        hintTooCloseText,
        hintTooFarText,
        hintConnectingText,
        hintVerifyingText,
        hintCheckCompleteText,
        hintIlluminationTooBrightText,
        hintIlluminationTooDarkText,
        hintIlluminationNormalText,
        hintHoldFaceForFreshnessText,
        hintCenterFaceText,
        hintCenterFaceInstructionText,
        hintFaceOffCenterText,
        hintMatchIndicatorText,
    };
    const cameraDisplayText = {
        cameraMinSpecificationsHeadingText,
        cameraMinSpecificationsMessageText,
        cameraNotFoundHeadingText,
        cameraNotFoundMessageText,
        retryCameraPermissionsText,
        waitingCameraPermissionText,
        a11yVideoLabelText,
    };
    const instructionDisplayText = {
        photosensitivityWarningBodyText,
        photosensitivityWarningHeadingText,
        photosensitivityWarningInfoText,
        photosensitivityWarningLabelText,
        photosensitivyWarningBodyText,
        photosensitivyWarningHeadingText,
        photosensitivyWarningInfoText,
        photosensitivyWarningLabelText,
        goodFitCaptionText,
        goodFitAltText,
        tooFarCaptionText,
        tooFarAltText,
        startScreenBeginCheckText,
    };
    const streamDisplayText = {
        cancelLivenessCheckText,
        recordingIndicatorText,
    };
    const errorDisplayText = {
        connectionTimeoutHeaderText,
        connectionTimeoutMessageText,
        errorLabelText,
        timeoutHeaderText,
        timeoutMessageText,
        faceDistanceHeaderText,
        faceDistanceMessageText,
        multipleFacesHeaderText,
        multipleFacesMessageText,
        clientHeaderText,
        clientMessageText,
        serverHeaderText,
        serverMessageText,
        landscapeHeaderText,
        landscapeMessageText,
        portraitMessageText,
        tryAgainText,
    };
    return {
        hintDisplayText,
        cameraDisplayText,
        instructionDisplayText,
        streamDisplayText,
        errorDisplayText,
    };
}

const DETECTOR_CLASS_NAME = 'liveness-detector';
function FaceLivenessDetectorCore(props) {
    const { components, config, displayText } = props;
    const currElementRef = React__namespace.useRef(null);
    const { hintDisplayText, cameraDisplayText, instructionDisplayText, streamDisplayText, errorDisplayText, } = getDisplayText(displayText);
    const service = react.useInterpret(livenessMachine, {
        devTools: process.env.NODE_ENV === 'development',
        context: {
            componentProps: {
                ...props,
                config: config ?? {},
            },
        },
    });
    return (React__namespace.createElement(uiReact.View, { className: DETECTOR_CLASS_NAME, testId: DETECTOR_CLASS_NAME },
        React__namespace.createElement(FaceLivenessDetectorProvider, { componentProps: props, service: service },
            React__namespace.createElement(uiReact.Flex, { direction: "column", ref: currElementRef },
                React__namespace.createElement(LivenessCheck, { instructionDisplayText: instructionDisplayText, hintDisplayText: hintDisplayText, cameraDisplayText: cameraDisplayText, streamDisplayText: streamDisplayText, errorDisplayText: errorDisplayText, components: components })))));
}

const credentialProvider = async () => {
    const { credentials } = await auth.fetchAuthSession();
    if (!credentials) {
        throw new Error('No credentials provided');
    }
    return credentials;
};
function FaceLivenessDetector(props) {
    const { config, ...rest } = props;
    return (React__namespace.createElement(FaceLivenessDetectorCore, { ...rest, config: { credentialProvider, ...config } }));
}

exports.FaceLivenessDetector = FaceLivenessDetector;
exports.FaceLivenessDetectorCore = FaceLivenessDetectorCore;
