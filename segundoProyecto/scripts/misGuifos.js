function modo() {
    var params = new URLSearchParams(location.search)
    if(params.get('modo') == 'crear'){return true}
    else {return false}
}

function fetchGifs() {
    switch(localStorage.getItem('misGuifos')){
        case null: localStorage.setItem('misGuifos',"");return "";break;
        case "": return ""; break;
        default: var misGuifos = localStorage.getItem('misGuifos').split(';');break;
    }
    misGuifos.splice(sugerencias.length-1,1)
    return misGuifos
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
    var blob = await recorder.getBlob();
    video.src = URL.createObjectURL(blob);
    recorder.stream.getTracks(t => t.stop());

    await recorder.reset();
    await recorder.destroy();

    recorder = null;
}

async function subir() {
    await fetch('https://upload.giphy.com/v1/gifs?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&source_post_url='+video.src)
    .then(function (response) {return response.json()})
    .then(function (json) {
        console.log(json)
        if(json.data.status == 200) {
            localStorage.setItem('misGuifos',json.data.response_id + ',' + misGuifos)
            misGuifos = fetchGifs()
        }
        document.getElementById('descargar').setAttribute('onclick','invokeSaveAsDialog(blob,TuGuifo.gif)');
        document.getElementById('copiar').setAttribute('onclick','copiar()');
    })
}

async function copiar() {
    await fetch('api.giphy.com/v1/gifs/'+ misGuifos.split(',')[0] +'?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp')
    .then(function(response) {response.json()})
    .then(function(json) {
        navigator.clipboard.writeText(json.data.url).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
        document.getElementById("subido").children[0].setAttribute("src",json.data.images.downsized.url)
        document.getElementById("subido").children[0].setAttribute("onclick","location.href='"+json.data.url+"'")
    })
}