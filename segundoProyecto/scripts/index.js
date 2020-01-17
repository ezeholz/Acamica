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



fetch("http://api.giphy.com/v1/gifs/trending?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp").then(response => {return response.json();}).then(json => {console.log(json)})

// api_key="HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp"