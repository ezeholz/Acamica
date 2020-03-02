function modo() {
    var params = new URLSearchParams(location.search)
    if(params.get('modo') === 'crear'){return true}
    else {return false}
}

if (!modo()) {
    document.getElementsByClassName('crear')[0].setAttribute('hidden',true);
}

function fetchGifs() {
    let misGuifos
    switch(localStorage.getItem('misGuifos')){
        case null: localStorage.setItem('misGuifos',"");return "";break;
        case "": return ""; break;
        default: misGuifos = localStorage.getItem('misGuifos').split(',');break;
    }
    misGuifos.splice(sugerencias.length-1,1)
    return misGuifos
}

var misGuifos = fetchGifs()

function obtenerGuifos() {
    misGuifos = fetchGifs()
    if(misGuifos === ""){return}
    fetch("https://api.giphy.com/v1/gifs?"+ apikey +"&ids="+misGuifos).then(function (response) {return response.json();})
    .then(function (json) {
        for(let i=0;i<json.data.length;i++){
            console.log(json.data);
            let node = document.createElement("li");
            node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ json.data[i].title.split("GIF")[0] +'</p>';
            node.setAttribute("onclick","location.href='"+json.data[i].url+"'");
            if (json.data[i].title.split("GIF")[0] === "") {
                node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#no-title '+ json.data[i].title +'</p>';
            }
            document.getElementById("misGifos").insertBefore(node,document.getElementById("misGifos").firstElementChild);
        }
    })
}

const video = document.querySelector('video');

var recorder, stream;

function repetir() {
    document.getElementsByClassName('botones')[1].innerHTML = '<button class="claro cancelar repetir" hidden onclick="repetir()">Repetir Captura</button><button class="claro partido subir"><div><img src="./images/camera.svg" alt="camara"></div><div>Capturar</div></button>'
    empezarGuifo()
}

async function empezarGuifo() {
    stream = await navigator.mediaDevices.getUserMedia({video: true});
    video.srcObject = stream;
    //console.log(video.srcObject);
    document.getElementsByClassName('crear')[0].classList.add('hidden');
    document.getElementsByClassName('misGuifos')[0].setAttribute('hidden',true);
    document.getElementsByClassName('captura')[0].removeAttribute('hidden');
    recorder = new MRecordRTC()
    recorder.addStream(stream)
    recorder.mediaType = {audio: false,video: MediaStreamRecorder,gif:true}
    document.getElementsByClassName('subir')[0].setAttribute('onclick','grabar()')
    
}

async function grabar() {
    await recorder.startRecording();
    recorder.stream = stream;
    document.getElementsByClassName('subir')[0].innerHTML = '<div><img src="./images/recording_dark.svg" alt="camara"></div><div>Listo</div>'
    document.getElementsByClassName('subir')[0].classList.add('grabar')
    document.getElementsByClassName('subir')[0].setAttribute('onclick','parar()')
}

function parar() {
    recorder.stopRecording();
    setTimeout(function (){stopRecordingCallback()},100)
    //stopRecordingCallback()
    //console.log(video.src);
    document.getElementsByClassName('repetir')[0].removeAttribute('hidden');
    document.getElementsByClassName('subir')[0].innerHTML = 'Subir Guifo'
    document.getElementsByClassName('subir')[0].classList.remove('grabar','partido')
    document.getElementsByClassName('subir')[0].setAttribute('onclick','subir()')
}

async function stopRecordingCallback() {
    video.srcObject = null;
    //video.srcObject = recorder.getBlob().video
    let blobs = recorder.getBlob();
    //console.log(preview())
    //video.srcObject = await preview()
    video.src = URL.createObjectURL(blobs.video);
    recorder.stream.getTracks()[0].stop();

    //await recorder.reset();
    await recorder.destroy();

    recorder = null;
    stream = blobs;
}

async function subir() {
    document.getElementsByClassName('captura')[0].setAttribute('hidden',true);
    document.getElementsByClassName('textCrear')[0].setAttribute('hidden',true);
    document.getElementsByClassName('crear')[0].classList.remove('hidden');
    document.getElementsByClassName('crear')[0].getElementsByTagName('img')[0].setAttribute('hidden',true);
    document.getElementById('subiendo').classList.remove("hidden");
    document.getElementById('loading').children[0].classList.add('cargando');

    let formData = new FormData();
    formData.append("file",stream.gif,"gif.gif")
    let init = {
        method: "POST",
        body: formData,
    }
    fetch('https://upload.giphy.com/v1/gifs?'+apikey,init)
    .then(function (response) {return response.json()})
    .then(function (json) {
        console.log(json)
        if(json.meta.status === 200) {
            localStorage.setItem('misGuifos',json.data.id + ',' + misGuifos)
            misGuifos = fetchGifs()
        }
        document.getElementById('descargar').setAttribute('onclick','invokeSaveAsDialog(stream.gif,´TuGuifo.gif´)');
        document.getElementById('copiar').setAttribute('onclick','copiar()');
        subido()
    })
    
}

function subido() {
    document.getElementById('loading').children[0].classList.add('cargado');
    
    obtenerGuifos()
    copiar()

    const crear = document.getElementsByClassName('crear')[0]
    const botones = document.getElementsByClassName('botones')[0]
    const comenzar = botones.getElementsByClassName('comenzar')[0]

    document.getElementsByClassName('repetir')[0].setAttribute('hidden',true);

    comenzar.innerHTML = 'Listo'
    comenzar.setAttribute('onclick',"location.href='./misGifos.html")

    crear.children[1].setAttribute('hidden',true);
    crear.children[2].setAttribute('hidden',true);
    crear.removeAttribute('hidden')

    document.getElementById('subido').classList.remove("hidden")

    botones.getElementsByClassName('cancelar')[0].setAttribute('hidden',true)
}

async function copiar() {
    await fetch('https://api.giphy.com/v1/gifs/'+ misGuifos[0] +'?'+apikey)
    .then(function(response) {return response.json()})
    .then(function(json) {
        console.log(json)
        navigator.clipboard.writeText(json.data.url).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
        document.getElementById("subido").children[0].setAttribute("src",json.data.images.downsized.url)
        document.getElementById("subido").children[0].setAttribute("onclick","location.href='"+json.data.url+"'")
    })
}