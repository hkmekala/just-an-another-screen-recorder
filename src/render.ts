import { desktopCapturer, remote } from 'electron';
import { writeFile } from 'fs';

const { dialog, Menu } = remote;

let mediaRecoder: any;
const recordedChunks: any = [];
const videoElement = document.querySelector('video');

// Start Button On-Click
const startBtn = document.getElementById('startBtn');
startBtn.onclick = (e: any) => {
    mediaRecoder.start();
    startBtn.classList.add('is-danger');
    startBtn.innerText = 'Recording!';
};


// Stop Button On-Click
const stopBtn = document.getElementById('stopBtn');
stopBtn.onclick = (e: any) => {
    mediaRecoder.stop();
    startBtn.classList.remove('is-danger');
    startBtn.innerText = 'Start Recording!';
};

//Getting Screens on click.
const videoSelectBtn = document.getElementById('videoSelectBtn')
async function getScreens() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            }
        })
    );

    videoOptionsMenu.popup();
}
videoSelectBtn.onclick = getScreens;

//Push the Video Chunk into an array.
function handleDataAvailable(e: any) {
    console.log('video data available');
    recordedChunks.push(e.data);
}

// Saves the video file on stop
async function handleStop(e: any) {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `vid-${Date.now()}.webm`
    });

    if (filePath) {
        writeFile(filePath, buffer, () => {
            console.log('video saved successfully!');
            alert('File Has been saved!');
        });
        
    }
}

//Select the video sources.
async function selectSource(source: any) {
    videoSelectBtn.innerText = source.name;

    const constraints: any = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    videoElement.srcObject = stream;
    videoElement.play();

    const options = { mimeType: 'video/webm; codecs=vp9' };
    mediaRecoder = new MediaRecorder(stream, options)

    mediaRecoder.ondataavailable = handleDataAvailable;
    mediaRecoder.onstop = handleStop;
}