// Temas

window.onclick = function(event) {
    if (!event.target.matches('.drop')) {
        if (document.getElementById("menuTemas").classList.contains("mostrar")) {
            this.abrirTemas();
        }
    }
}

function abrirTemas() {
    document.getElementById("menuTemas").classList.toggle("mostrar");
}

function cambiarTema() {
    var lista = document.getElementsByClassName("claro");
    for(i=0 ; i<lista.length ; i++) {
        lista[i].classList.toggle("oscuro");
    }
    document.getElementById("menuTemas").getElementsByTagName("button")[0].toggleAttribute("disabled");
    document.getElementById("menuTemas").getElementsByTagName("button")[1].toggleAttribute("disabled");
}

// Sugerencias

function ratio(w,h) {
    //ratio = Math.ceil(Math.ceil(json.data[i].images.downsized.width / json.data[i].images.downsized.height)-Math.ceil(json.data[i].images.downsized.height / json.data[i].images.downsized.width));
    return Math.ceil(Math.ceil(w / h)-Math.ceil(h / w))
}

var sugerencias = [
    "gato","perro","animales","programming","white guy blinking",/*"john travolta",*/"garfield","rick and morty","los simpsons","internet","html","css","beproud","lgbtq+",
]

while(sugerencias.length!=4) {
    number = Math.floor(Math.random() * sugerencias.length);
    sugerencias.splice(number, 1);
}



fetch("https://worried-passive.glitch.me/counter")
    .then(response => {return response.json()})
    .then(json => {
        var texto = "¡Bienvenidos/as a Guifos.com! ——————Donde los gifs están.////// Número de visitas: " + json.visit
        document.getElementsByClassName("barraSuperior")[0].childNodes[1].innerText = texto
    })

async function index() {

    for(i=1;i<=4;i++) {
        //console.log(i);
        document.getElementById("sug" + i).innerText = sugerencias[i - 1];
        await fetch("https://api.giphy.com/v1/gifs/search?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&limit=25&q="+sugerencias[i - 1])
            .then(response => {return response.json();})
            .then(json => {
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

    total = Math.round(((window.screen.height*1.2)/330)*3);

    for(x=0,c=0;c<total;x++) {
        await fetch("https://api.giphy.com/v1/gifs/trending?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&offset=" + x * 26).then(response => {return response.json();})
        .then(json => {
            var grandes = 4; // Con respecto a las chicas
            var chicas = 0;
            for(i=0;i<json.data.length;i++){
                //console.log(json.data);
                var node = document.createElement("li")
                node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ json.data[i].title.split("GIF")[0] +'</p>';
                if (json.data[i].title.split("GIF")[0] == "") {
                    node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#no-title '+ json.data[i].title +'</p>';
                }
                //node.innerHTML = '<img src="'+ json.data[i].images.downsized.url +'" alt="gif"><p>#'+ ratio +'</p>';
                var imgRatio = ratio(json.data[i].images.downsized.width,json.data[i].images.downsized.height);
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


// api_key="HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp"