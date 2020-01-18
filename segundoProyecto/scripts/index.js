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
    //ratio = Math.ceil(Math.ceil(json.data[i].images.downsized_medium.width / json.data[i].images.downsized_medium.height)-Math.ceil(json.data[i].images.downsized_medium.height / json.data[i].images.downsized_medium.width));
    return Math.ceil(Math.ceil(w / h)-Math.ceil(h / w))
}

var sugerencias = [
    "gato","perro","animales","programming","white guy blinking",/*"john travolta",*/"garfield","rick and morty","los simpsons","internet",
]

while(sugerencias.length!=4) {
    number = Math.floor(Math.random() * sugerencias.length);
    sugerencias.splice(number, 1);
}

async function l1() {
    for(i=1;i<=4;i++) {
        //console.log(i);
        document.getElementById("sug" + i).innerText = sugerencias[i - 1];
        await fetch("https://api.giphy.com/v1/gifs/search?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&limit=25&q="+sugerencias[i - 1])
            .then(response => {return response.json();})
            .then(json => {
                //console.log(json);
                for(x=0;x<json.data.length;x++){
                    if(ratio(json.data[x].images.downsized_medium.width,json.data[x].images.downsized_medium.height) == 0){
                        //document.getElementById("sugImg" + i).getAttribute("src") = json.data.images.downsized_medium.url;
                        document.getElementById("sugImg" + i).setAttribute("src",json.data[x].images.downsized_medium.url)
                        document.getElementById("sugBtn" + i).setAttribute("onclick","location.href='"+json.data[x].url+"'")
                        //console.log(document.getElementById("sugImg" + i));
                        break;
                    }
                }
            })
    }

    // Tendencias

    fetch("https://api.giphy.com/v1/gifs/trending?api_key=HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp&limit=50").then(response => {return response.json();})
    .then(json => {
        var grandes = 4; // Con respecto a las chicas
        var chicas = 0;
        for(i=0;i<json.data.length;i++){
            //console.log(json.data);
            var node = document.createElement("li")
            node.innerHTML = '<img src="'+ json.data[i].images.downsized_medium.url +'" alt="gif"><p>#'+ json.data[i].title +'</p>';
            //node.innerHTML = '<img src="'+ json.data[i].images.downsized_medium.url +'" alt="gif"><p>#'+ ratio +'</p>';
            var imgRatio = ratio(json.data[i].images.downsized_medium.width,json.data[i].images.downsized_medium.height);
            if(imgRatio == 0) {
                node.setAttribute("class","chica")
                document.getElementById("tendencias").appendChild(node);
                chicas++;
            } else if (imgRatio == 1 && chicas >= grandes) {
                node.setAttribute("class","grande")
                document.getElementById("tendencias").appendChild(node);
                chicas=0;
            } else {continue;}
            //node.setAttribute("class","chica")
            //document.getElementById("tendencias").appendChild(node);
            //console.log(Math.min(320 / json.data[i].images.downsized_medium.width, 200 / json.data[i].images.downsized_medium.height));
        }
    })

}

l1();

// api_key="HAH9qg4gGd6m3JwsSJUWkAL6mvkcEVBp"