var platos = [];

// Recibir los platos disponibles.
fetch("./platos.json").then(response => response.json()).then(data => (platos = data, filtrar(1)));

// Abre/cierra el desplegable y enseña/oculta los iconos de este.
function toggleMenu(){
    document.querySelector('.desplegable').classList.toggle('none')
    document.getElementById('menu1').classList.toggle('none')
    document.getElementById('menu2').classList.toggle('none')
}

document.querySelectorAll('a').forEach(el => {
    el.addEventListener("click", e => {
        // Cierra el menú al hacer click a un item de este.
        document.querySelector('.desplegable').classList.add('none')
        document.getElementById('menu1').classList.remove('none')
        document.getElementById('menu2').classList.add('none')
    })
})

// Filtrar el menú al cambiar el filtro.
document.getElementById('filtro').addEventListener("change", e=>{
    more = false;
    filtrar(e.currentTarget.value)
})

const contenedor = document.getElementById("menu");
const vals = ["Todo", "Desayuno", "Almuerzo", "Cena"];
const max = 3; // Items máximos a mostrar.

var more = false; // Mostrar más.
var currentFiltro = 1; // filtro actual "Todo".

// Mostrar/Ocultar items del menú extra.
function toggleMore(){
    more = !more;
    filtrar(currentFiltro)
}

// Filtrar platos por tipo (Desayuno, Almuerzo, Cena).
function filtrar(filtro){
    currentFiltro = filtro;
    contenedor.innerHTML = '';
    let count = 0;

    for (let plato of platos){
        let tipo = vals[filtro-1];
        
        // Si ya se ha llegado al máximo de elementos a mostrar.
        if (count >= max && !more){
            let len = tipo == "Todo" ? platos.length : platos.filter(e => e.tag == tipo).length; // Cantidad de platos del tipo.
            // Si hay restantes, mostrar botón de (ver más...).
            if(count < len) contenedor.innerHTML += `<div id="more"><span onclick="toggleMore()">ver ${len-max} más...</span></div>`;
            // Navegar hasta arriba.
            document.getElementById("menus").scrollIntoView();
            return;
        }
        // Si el tipo no es el indicado, volver atrás y seguir buscando
        if (tipo != "Todo" && tipo != plato.tag) continue;

        // Crear elemento html y añadirlo al contenedor.
        contenedor.innerHTML += '<div class="plato">' +
                `<span class="tag">${plato.tag}</span>`+
                `<h1>${plato.nombre}</h1>`+
                `<p>${plato.descripcion}</p>`+
                `<div class="img" onclick="tp('${platos.indexOf(plato)}')"><img src="${plato.src}" alt="GreenBite"></div>`+
                `<span>$<span>${plato.precio}</span></span>`+
            '</div>'
        count++;
    }

    // Mostrar (ver menos) si se le ha dado a (ver mas...) anteriormente.
    if(more) contenedor.innerHTML += '<div id="more"><span onclick="toggleMore()">ver menos</span></div>';
}

// Hacer el primer filtro.
filtrar(1)

// Svgs (Iconos) en formato html.
const starSvg  = (full) => (`<svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" style=" fill: transparent; "><title></title><polygon points="256 48 256 364 118 464 172 304 32 208 204 208 256 48" style=" transform: rotatey(180deg) translate(-99%, 0%); fill: ${full == 0 ? '#ffc000' : '#dddddd'}; "></polygon><polygon points="256 48 256 364 118 464 172 304 32 208 204 208 256 48" style=" fill: ${full == 2 ? '#dddddd':'#FFC106'}; "></polygon></svg>`)
const crossSvg = ('<svg class="close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');

// Función para cerrar el menú "infoplato".
function close(){
    document.getElementById('infoplato').classList.add('none'); 
    document.body.style.overflow = 'auto'
}

const infoplato = document.getElementById('infoplato');

// Función para que cuando se haga click fuera del menú, se cierre este.
infoplato.addEventListener('click', ()=>{
    infoplato.classList.add('none'); 
    document.body.style.overflow = 'auto'
})

// Generador del menú "infoplato".
function tp(code){
    const item = platos[code];
    document.body.style.overflow = 'hidden'

    // Conversion de los alergenos a html.
    const alergenos = item.alergenos.map(i => `<li class="${a.includes('opcional') ? 'opcional' : ''}">${a.split('(')[0]}</li>`)

    // Conversion de los ingredientes a html.
    var ingredientes = item.ingredientes.map(i => {return `<li>> ${i}</li>`})

    // Creación de los iconos de la puntuación.
    const mod = Math.floor(item.valoracion_media);
    var puntuacion = starSvg(0).repeat(mod) + starSvg(1).repeat(item.valoracion_media-mod > .7 ? 1 : 0) + starSvg(2).repeat(item.valoracion_media-mod > .7 ? 4-mod : 5-mod)

    // Creacion del elemento HTML.
    infoplato.innerHTML = `<div class="content" onclick="event.stopPropagation()">
                        <span onclick="document.getElementById('infoplato').classList.add('none'); document.body.style.overflow = 'auto'">${crossSvg}</span>
                        <h2>${item.nombre}</h2>
                        <img src="${item.src}" alt="GreenBite">
                        <h3>${item.descripcion}</h3>
                        <div class="under">
                            <p>${puntuacion}</p>
                            <p class="tag">${item.tag}</p>
                        </div>
                        <p class="price">$${item.precio}</p>
                        <div class="menualergeno">
                            <h4>Alérgenos:</h4>
                            <ul class="alergenos">${alergenos.join('')}</ul>
                        </div>
                        <h4>Ingredientes:</h4>
                        <ul>${ingredientes.join('')}</ul>
                        <div class="menualergeno" style="justify-content: right;">
                            <span>Requerido</span>
                            <span class="opcional">Opcional</span>
                        </di>
                    </div>`

    // Mostrar menu "infoplato".
    infoplato.classList.remove('none');
}