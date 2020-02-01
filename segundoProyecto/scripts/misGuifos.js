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

function obtenerGuifos() {
    misGuifos = fetchGifs()
    fetch("https://api.giphy.com/v1/gifs?"+ apikey +"&ids="+misGuifos).then(function (response) {return response.json();})
    .then(function (json) {
        for(let i=0;i<json.data.length;i++){
            console.log(json.data);
            let node = document.createElement("li");
            node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ json.data[i].title.split("GIF")[0] +'</p>';
            node.setAttribute("onclick","location.href='"+json.data[i].url+"'");
            if (json.data[i].title.split("GIF")[0] == "") {
                node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#no-title '+ json.data[i].title +'</p>';
            }
            document.getElementById("tendencias").insertBefore(node,document.getElementById("buscadas").firstElementChild);
        }
    })
}

const video = document.querySelector('video');

var recorder, stream;

function repetir() {
    document.getElementsByClassName('botones')[0].innerHTML = '<button class="claro cancelar repetir" hidden onclick="repetir()">Repetir Captura</button><button class="claro partido subir"><div><img src="./images/camera.svg" alt="camara"></div><div>Capturar</div></button>'
    empezarGuifo()
}

async function empezarGuifo() {
    stream = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = stream;
    //console.log(video.srcObject);
    document.getElementsByClassName('crear')[0].setAttribute('hidden',true);
    document.getElementsByClassName('misGuifos')[0].setAttribute('hidden',true);
    document.getElementsByClassName('captura')[0].removeAttribute('hidden');
    recorder = new RecordRTCPromisesHandler(stream, {
        type: 'gif'
    });
    document.getElementsByClassName('subir')[0].setAttribute('onclick','grabar()')
    
}

async function grabar() {
    await recorder.startRecording();
    recorder.stream = stream;
    document.getElementsByClassName('subir')[0].innerHTML = '<div><img src="./images/recording_dark.svg" alt="camara"></div><div>Listo</div>'
    document.getElementsByClassName('subir')[0].classList.add('grabar')
    document.getElementsByClassName('subir')[0].setAttribute('onclick','parar()')
}

async function parar() {
    await recorder.stopRecording();
    stopRecordingCallback();
    //console.log(video.src);
    document.getElementsByClassName('repetir')[0].removeAttribute('hidden');
    document.getElementsByClassName('subir')[0].innerHTML = 'Subir Guifo'
    document.getElementsByClassName('subir')[0].classList.remove('grabar','partido')
    document.getElementsByClassName('subir')[0].setAttribute('onclick','subir()')
}

async function stopRecordingCallback() {
    video.srcObject = null;
    stream = await recorder.getBlob();
    let blob = stream.slice(0, stream.size, "video/webm")
    video.src = URL.createObjectURL(blob);
    recorder.stream.getTracks()[0].stop();

    await recorder.reset();
    await recorder.destroy();

    recorder = null;
}

async function subir() {
    let formData = new FormData();
    formData.append("file",stream,"gif.gif")
    let init = {
        method: "POST",
        body: formData,
    }
    fetch('https://upload.giphy.com/v1/gifs?'+apikey,init)
    .then(function (response) {return response.json()})
    .then(function (json) {
        console.log(json)
        if(json.meta.status == 200) {
            localStorage.setItem('misGuifos',json.data.id + ',' + misGuifos)
            misGuifos = fetchGifs()
        }
        document.getElementById('descargar').setAttribute('onclick','invokeSaveAsDialog(stream,TuGuifo.gif)');
        document.getElementById('copiar').setAttribute('onclick','copiar()');
        subido()
    })
    
}

function subido() {
    copiar()
    document.getElementsByClassName('repetir')[0].setAttribute('hidden',true);
    document.getElementsByClassName('subir')[0].innerHTML = 'Listo'
    document.getElementsByClassName('crear')[0].children[1].setAttribute('hidden',true);
    document.getElementsByClassName('crear')[0].children[2].setAttribute('hidden',true);
    document.getElementById('subido').removeAttribute('hidden')
    obtenerGuifos()
}

async function copiar() {
    await fetch('api.giphy.com/v1/gifs/'+ misGuifos.split(',')[0] +'?'+apikey)
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