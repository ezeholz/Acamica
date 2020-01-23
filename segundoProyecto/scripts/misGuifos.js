function modo() {
    var params = new URLSearchParams(location.search)
    if(params.get('modo') == 'crear'){return true}
    else {return false}
}

var misGuifos = fetchGifs()
const video = document.querySelector('video');

async function empezarGuifo() {
    //var stream = await navigator.mediaDevices.getUserMedia({video: true});
    //video.srcObject = stream;
    document.getElementsByClassName('crear')[0].setAttribute('hidden',true);
    document.getElementsByClassName('misGuifos')[0].setAttribute('hidden',true);
    document.getElementsByClassName('captura')[0].removeAttribute('hidden');
    // var recorder = new RecordRTCPromisesHandler(stream, {
    //     type: 'video'
    // });
    document.getElementsByClassName('subir')[0].setAttribute('onclick','grabar()')
    
}

async function grabar() {
    //await recorder.startRecording();
    //recorder.stream = stream;
    document.getElementsByClassName('subir')[0].innerHTML = '<div><img src="./images/recording_dark.svg" alt="camara"></div><div>Listo</div>'
    document.getElementsByClassName('subir')[0].classList.add('grabar')
    document.getElementsByClassName('subir')[0].setAttribute('onclick','parar()')
}

async function parar() {
    //await recorder.stopRecording();
    //stopRecordingCallback();
    //console.log(video.src);
    document.getElementsByClassName('repetir')[0].removeAttribute('hidden');
    document.getElementsByClassName('subir')[0].innerHTML = 'Subir Guifo'
    document.getElementsByClassName('subir')[0].classList.remove('grabar','partido')
    document.getElementsByClassName('subir')[0].setAttribute('onclick','subir()')
}

async function stopRecordingCallback() {
    video.srcObject = null;
    let blob = await recorder.getBlob();
    video.src = URL.createObjectURL(blob);
    recorder.stream.getTracks(t => t.stop());

    await recorder.reset();
    await recorder.destroy();

    recorder = null;
}

