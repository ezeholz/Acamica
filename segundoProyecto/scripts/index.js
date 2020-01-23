// Temas

window.onclick = function(event) {
    if (!event.target.matches('.drop')) {
        if (document.getElementById("menuTemas").classList.contains("mostrar")) {
            this.abrirMenu("menuTemas");
        }
    }
}

window.onkeypress = function(event) {
    if(event.keyCode == 13 && event.target.matches('#barBuscar')) {
        this.search(document.getElementById("barBuscar").value)
    }
}

if(localStorage.getItem('tema')=="oscuro"){cambiarTema()}

function abrirMenu(id,force) {
    document.getElementById(id).classList.toggle("mostrar",force);
}

function cambiarTema() {
    let lista = document.getElementsByClassName("claro");
    for(let i=0 ; i<lista.length ; i++) {
        lista[i].classList.toggle("oscuro");
    }
    document.getElementById("menuTemas").getElementsByTagName("button")[0].toggleAttribute("disabled");
    document.getElementById("menuTemas").getElementsByTagName("button")[1].toggleAttribute("disabled");
    if(lista[0].classList.value.includes('oscuro')){localStorage.setItem('tema','oscuro')}
    else{localStorage.setItem('tema','claro')}
}

function ratio(w,h) {
    //ratio = Math.ceil(Math.ceil(json.data[i].images.downsized.width / json.data[i].images.downsized.height)-Math.ceil(json.data[i].images.downsized.height / json.data[i].images.downsized.width));
    return Math.ceil(Math.ceil(w / h)-Math.ceil(h / w))
}

// borrar ultimos li para que quede parejo al final

// Sugerencias



function fetchSug() {
    if(localStorage.getItem('lastSearchs') == null) {localStorage.setItem('lastSearchs',
        "gato;perro;animales;programming;white guy blinking;"/*"john travolta";*/+"billie eilish;rick and morty;los simpsons;internet;html;css;beproud;lgbtq+;"
    )}
    let sugerencias = localStorage.getItem('lastSearchs').split(';')
    sugerencias.splice(sugerencias.length-1,1)
    return sugerencias
}

var sugerencias = fetchSug()

if(sugerencias.length < 4) {localStorage.setItem('lastSearchs',
    sugerencias+"gato;perro;animales;programming;white guy blinking;"/*"john travolta";*/+"garfield;rick and morty;los simpsons;internet;html;css;beproud;lgbtq+;"
);sugerencias=fetchSug()}

async function sugeridos() {
    let sugerAux = sugerencias
    sugerAux.splice(sugerAux.length-1,1)
    for(let i=sugerAux.length;i!=4;i=sugerAux.length) {
        number = Math.floor(Math.random() * i);
        sugerAux.splice(number, 1);
    }
    index(sugerAux)
}

fetch("https://worried-passive.glitch.me/counter")
    .then(function (response) {return response.json()})
    .then(function (json) {
        let texto = "¡Bienvenidos/as a Guifos.com! ——————Donde los gifs están.////// Número de visitas: " + json.visit
        document.getElementsByClassName("barraSuperior")[0].childNodes[1].innerText = texto
    })

async function index(sugerAux) {

    for(let i=1;i<=4;i++) {
        //console.log(i);
        document.getElementById("sug" + i).innerHTML = sugerAux[i - 1] + '<img src="./images/button%20close.svg" alt="button close">';
        document.getElementById("sug" + i).addEventListener("click", function (event) {if(event.target.alt == "button close"){
            let a1 = localStorage.getItem('lastSearchs')
            let a2 = a1.split(document.getElementById(this.id).innerText+';')[0]+a1.split(document.getElementById(this.id).innerText+';')[1]
            //console.log(a1)
            //console.log(a2)
            localStorage.setItem('lastSearchs',a2)
            //console.log(localStorage.getItem('lastSearchs'))
            location.reload()
        }})
        await fetch("https://api.giphy.com/v1/gifs/search?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&limit=25&q="+sugerAux[i - 1])
            .then(function (response) {return response.json();})
            .then(function (json) {
                //console.log(json);
                for(x=0;x<json.data.length;x++){
                    if(ratio(json.data[x].images.downsized.width,json.data[x].images.downsized.height) == 0){
                        //document.getElementById("sugImg" + i).getAttribute("src") = json.data.images.downsized.url;
                        document.getElementById("sugImg" + i).setAttribute("src",json.data[x].images.downsized.url)
                        document.getElementById("sugBtn" + i).setAttribute("onclick","location.href='"+json.data[x].url+"'")
                        //console.log(document.getElementById("sugImg" + i));
                        break;
                    }
                }
            })
        if (i==4) {trend()}
    }
    
}

// Tendencias

async function trend() {

    const total = Math.round(((window.screen.height*1.2)/330)*4);

    for(x=0,c=0;c<total;x++) {
        await fetch("https://api.giphy.com/v1/gifs/trending?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&offset=" + x * 26).then(function (response) {return response.json();})
        .then(function (json) {
            const grandes = 4; // Con respecto a las chicas
            let chicas = 0;
            for(let i=0;i<json.data.length;i++){
                //console.log(json.data);
                let node = document.createElement("li");
                node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ json.data[i].title.split("GIF")[0] +'</p>';
                node.setAttribute("onclick","location.href='"+json.data[i].url+"'");
                if (json.data[i].title.split("GIF")[0] == "") {
                    node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#no-title '+ json.data[i].title +'</p>';
                }
                //node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ ratio +'</p>';
                let imgRatio = ratio(json.data[i].images.downsized.width,json.data[i].images.downsized.height);
                if(imgRatio == 0) {
                    document.getElementById("tendencias").appendChild(node);
                    chicas++;
                    c++;
                } else if (imgRatio == 1 && chicas >= grandes) {
                    document.getElementById("tendencias").appendChild(node);
                    chicas=0;
                    c++;
                } else {continue;}
                //node.setAttribute("class","chica")
                //document.getElementById("tendencias").appendChild(node);
                //console.log(Math.min(320 / json.data[i].images.downsized.width, 200 / json.data[i].images.downsized.height));
            }
        })
    }
}

// Search

if(!document.location.pathname.includes('misGifos.html')){
    document.getElementById("barBuscar").addEventListener("input", function() {
        let termino = document.getElementById("barBuscar").value;
        //console.log(termino)
        //console.log(document.getElementsByClassName("autofill")[0].children)
        let array = localStorage.getItem('lastSearchs').split(';');
        for(let i=array.length-1;i>=0;i--){
            if (array[i].includes(termino) == false){
                array.splice(i, 1);
            }
        }
        //console.log(array)

        array.forEach(function (valor,i) {if(i<3){
            document.getElementsByClassName("autofill")[0].children[i].innerText = valor
            document.getElementsByClassName("autofill")[0].children[i].setAttribute("onclick","search('"+valor+"')")
        }});
        
        if(array.length<3){
            sugerencias.forEach(function (valor,i) {
                if(i+array.length<3){
                    document.getElementsByClassName("autofill")[0].children[i+array.length].innerText = valor
                    document.getElementsByClassName("autofill")[0].children[i+array.length].setAttribute("onclick","search('"+valor+"')")
                }
            });
        }
        if(termino.length >= 3) {abrirMenu('autofill',true)}
        else {abrirMenu('autofill',false);}
    })
}
function search(texto) {
    if(texto.length >= 1) {
        //if(localStorage.getItem('lastSearchs') == null) {localStorage.setItem('lastSearchs','')}
        // temp = localStorage.getItem('lastSearch')
        
        if(!fetchSug().includes(texto)){
            localStorage.setItem('lastSearchs', texto + ';' + localStorage.getItem('lastSearchs'))
        }

        fetch("https://api.giphy.com/v1/gifs/search?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&limit=50&q="+ texto)
            .then(function (response) {return response.json();})
            .then(function (json) {
                for(let i=0;i<json.data.length;i++) {
                    var node = document.createElement("li");
                    node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ json.data[i].title.split("GIF")[0] +'</p>';
                    node.setAttribute("onclick","location.href='"+json.data[i].url+"'");
                    document.getElementById("buscadas").insertBefore(node,document.getElementById("buscadas").firstElementChild);
                }
                return document.getElementsByClassName('busqueda')[2].hasAttribute('hidden');
            })
            .then(function (buscar){
                if(buscar) {
                    document.getElementsByClassName('busqueda')[0].setAttribute('hidden',true);
                    document.getElementsByClassName('busqueda')[1].setAttribute('hidden',true);
                    abrirMenu('autofill',false);
                    document.getElementsByClassName('busqueda')[2].removeAttribute('hidden');
                    document.getElementById('autofill').classList.add('ultimas');
                }
            })
    } else {
        if(!document.getElementsByClassName('busqueda')[2].hasAttribute('hidden')) {
            document.getElementsByClassName('busqueda')[0].removeAttribute('hidden');
            document.getElementsByClassName('busqueda')[1].removeAttribute('hidden');
            document.getElementsByClassName('busqueda')[2].setAttribute('hidden',true);
            document.getElementById('autofill').classList.remove('ultimas');
        }
    }
}

// api_key="HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp"

// misGifos

// mala librerias, el link está en slack, hay que buscar los ejemplos
// https://github.com/muaz-khan/RecordRTC/blob/master/simple-demos/RecordRTCPromisesHandler.html
