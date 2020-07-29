"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = require("fs");
var dialog = electron_1.remote.dialog, Menu = electron_1.remote.Menu;
var mediaRecoder;
var recordedChunks = [];
var videoElement = document.querySelector('video');
var filePathStore = null;
// Start Button On-Click
var startBtn = document.getElementById('startBtn');
startBtn.onclick = function (e) {
    mediaRecoder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording!';
};
// Stop Button On-Click
var stopBtn = document.getElementById('stopBtn');
stopBtn.onclick = function (e) {
    mediaRecoder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start Recording!';
};
//Getting Screens on click.
var videoSelectBtn = document.getElementById('videoSelectBtn');
function getScreens() {
    return __awaiter(this, void 0, void 0, function () {
        var inputSources, videoOptionsMenu;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.desktopCapturer.getSources({
                        types: ['window', 'screen']
                    })];
                case 1:
                    inputSources = _a.sent();
                    videoOptionsMenu = Menu.buildFromTemplate(inputSources.map(function (source) {
                        return {
                            label: source.name,
                            click: function () { return selectSource(source); }
                        };
                    }));
                    videoOptionsMenu.popup();
                    return [2 /*return*/];
            }
        });
    });
}
videoSelectBtn.onclick = getScreens;
//Push the Video Chunk into an array.
function handleDataAvailable(e) {
    console.log('video data available');
    recordedChunks.push(e.data);
}
// Saves the video file on stop
function handleStop(e) {
    return __awaiter(this, void 0, void 0, function () {
        var blob, buffer, _a, _b, filePath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    blob = new Blob(recordedChunks, {
                        type: 'video/webm; codecs=vp9'
                    });
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, blob.arrayBuffer()];
                case 1:
                    buffer = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, dialog.showSaveDialog({
                            buttonLabel: 'Save video',
                            defaultPath: "vid-" + Date.now() + ".webm"
                        })];
                case 2:
                    filePath = (_c.sent()).filePath;
                    if (filePath) {
                        fs_1.writeFile(filePath, buffer, function () {
                            console.log('video saved successfully!');
                            filePathStore = filePath;
                            alert('File Has been saved!');
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//Select the video sources.
function selectSource(source) {
    return __awaiter(this, void 0, void 0, function () {
        var constraints, stream, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoSelectBtn.innerText = source.name;
                    constraints = {
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id
                            }
                        }
                    };
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                case 1:
                    stream = _a.sent();
                    videoElement.srcObject = stream;
                    videoElement.play();
                    options = { mimeType: 'video/webm; codecs=vp9' };
                    mediaRecoder = new MediaRecorder(stream, options);
                    mediaRecoder.ondataavailable = handleDataAvailable;
                    mediaRecoder.onstop = handleStop;
                    return [2 /*return*/];
            }
        });
    });
}
var upload = document.getElementById('uploadToIPFS');
upload.onclick = function () {
    if (filePathStore != null) {
        electron_1.ipcRenderer.sendSync('upload-to-ipfs', filePathStore);
    }
};
electron_1.ipcRenderer.on('upload-complete', function (event, arg) {
    alert("Upload has been completed: " + arg);
});
//# sourceMappingURL=render.js.map