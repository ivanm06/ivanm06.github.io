var platos = []

// Recibir los platos disponibles.
fetch("./platos.json").then(response => response.json()).then(data => (platos = data, filtrar(1)))

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
    more = false
    filtrar(e.currentTarget.value)
})

const contenedor = document.getElementById("menu")
const vals = ["Todo", "Desayuno", "Almuerzo", "Cena"]
const max = 3 // Items máximos a mostrar.

var more = false // Mostrar más.
var currentFiltro = 1 // filtro actual "Todo".
const firstTime = true;

// Mostrar/Ocultar items del menú extra.
function toggleMore(){
    more = !more
    filtrar(currentFiltro)
}

// Filtrar platos por tipo (Desayuno, Almuerzo, Cena).
function filtrar(filtro){
    currentFiltro = filtro
    contenedor.innerHTML = ''
    let count = 0

    for (let plato of platos){
        let tipo = vals[filtro-1]
        
        // Si ya se ha llegado al máximo de elementos a mostrar.
        if (count >= max && !more){
            let len = tipo == "Todo" ? platos.length : platos.filter(e => e.tag == tipo).length // Cantidad de platos del tipo.
            // Si hay restantes, mostrar botón de (ver más...).
            if(count < len) contenedor.innerHTML += `<div id="more"><span onclick="toggleMore()">ver ${len-max} más...</span></div>`;
            // Navegar hasta arriba.
            if (firstTime) firstTime = false;
            else document.getElementById("menus").scrollIntoView();

            return
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
        count++
    }

    // Mostrar (ver menos) si se le ha dado a (ver mas...) anteriormente.
    if(more) contenedor.innerHTML += '<div id="more"><span onclick="toggleMore()">ver menos</span></div>';
}


// Hacer el primer filtro.
filtrar(1)

// Svgs (Iconos) en formato html.
const starSvg  = (full) => (`<svg height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" style=" fill: transparent; "><title></title><polygon points="256 48 256 364 118 464 172 304 32 208 204 208 256 48" style=" transform: rotatey(180deg) translate(-99%, 0%); fill: ${full == 0 ? '#ffc000' : '#dddddd'}; "></polygon><polygon points="256 48 256 364 118 464 172 304 32 208 204 208 256 48" style=" fill: ${full == 2 ? '#dddddd':'#FFC106'}; "></polygon></svg>`)
const crossSvg = ('<svg class="close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>');
const plusSVG = ('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>')
const minusSVG = ('<svg id="cesta-btn" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus"><path d="M5 12h14"/></svg>')

// Función para esconder el scrollbar.
function hideOverflow(hide){
    document.body.style.overflow = hide ? 'hidden' : 'auto'
}


const infoplato = document.getElementById('infoplato')

// Función para cerrar el menú "infoplato".
function close(){
    infoplato.classList.add('none') 
    hideOverflow(false)
}

// Función para que cuando se haga click fuera del menú, se cierre este.
infoplato.addEventListener('click', close)

const closeCmd = `onclick="document.getElementById('infoplato').classList.add('none'); document.body.style.overflow = 'auto'"`

// Generador del menú "infoplato".
function tp(code){
    const item = platos[code]
    hideOverflow(true)

    // Conversion de los alergenos a html.
    const alergenos = item.alergenos.map((a, i) => `<li class="${a.includes('opcional') ? 'opcional' : ''}">${a.split('(')[0]}</li>`)

    // Conversion de los ingredientes a html.
    var ingredientes = item.ingredientes.map(i => {return `<li>> ${i}</li>`})

    // Creación de los iconos de la puntuación.
    const mod = Math.floor(item.valoracion_media)
    var puntuacion = starSvg(0).repeat(mod) + starSvg(1).repeat(item.valoracion_media-mod > .7 ? 1 : 0) + starSvg(2).repeat(item.valoracion_media-mod > .7 ? 4-mod : 5-mod)

    // Creacion del elemento HTML.
    infoplato.innerHTML = `<div class="content" onclick="event.stopPropagation()">
                        <span ${closeCmd}>${crossSvg}</span>
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
                        </div>
                        <button onclick="addToCart(${code})">${plusSVG} Añadir a cesta.</button>
                    </div>`

    // Mostrar menu "infoplato".
    infoplato.classList.remove('none')
}


// Shopping
const cart = []
const pop = document.querySelector('#cesta #icon div')
const popup = document.querySelector('#popup')
const popupMsg = document.querySelector('#popup #mensaje')
const cesta = document.querySelector('#cesta .container')
const cestaItems = document.querySelector('#cesta #items')
const precioTotal = document.querySelector('#total #precio')
const cantidadTotal = document.querySelector('#total #cantidad')

// Devuelve true si la cesta está en pantalla.
const isCestaOnView = () => !cesta.classList.contains('none')

// Añade los items a la cesta.
function addToCart(id){
    // Filtra para quedarse con el item con id = id
    const filtered = platos.filter(i => i.id == id);
    cart.push(filtered[0])

    // Actualiza la cesta si está en pantalla, sino, crea un popup.
    if(isCestaOnView()) fillCesta();
    else{
        popupMsg.innerHTML = `${plusSVG}<span style="font-weight: 800;">${filtered[0].nombre}</span><span>añadido a la cesta.</span>`;
        popup.classList.remove('none')
        
        // Elimina el popup después de 2 segundos.
        setTimeout(() => popup.classList.add('none'), 2 * 1000)
    }
    pop.classList.remove('none')
}

// Elimina los items de la cesta.
function removeFromCart(id){
    const index = cart.indexOf(platos.filter(i => i.id == id)[0])
    // Solo lo elimina si existe.
    if (index > -1) cart.splice(index, 1);
    // Si no hay items en la cesta, elimina el punto indicativo rojo del icono de esta.
    if(cart.length <= 0) pop.classList.add('none');
    fillCesta()
}

// Abre/Cierra la cesta.
function toggleCart(){
    if (!isCestaOnView()) fillCesta();
    cesta.classList.toggle('none')
    hideOverflow(isCestaOnView())
}

// Llena la cesta con la información necesaria.
function fillCesta(){
    cestaItems.innerHTML = ''
    const cartCopy = [...cart]
    const filtered = []

    // Filtra por cada elemento, y, si ya había alguno antes, se le añade la cantidad al atributo "cantidad".
    for (let i of cartCopy){
        if (!filtered.includes(i)){
            i.cantidad = 0
            filtered.push(i)
        }
        i.cantidad += 1
    }

    // Se calculan los datos finales.
    cantidadTotal.innerHTML = filtered.length;
    const pt = filtered.length > 0 ? filtered.reduce((a, v) => a + (v.cantidad * v.precio), 0) : 0;
    precioTotal.innerHTML = '$' + (Math.round(pt*100)/100);

    // Crea los elemenos html "cesta-item" por cada item en la cesta.
    for(let item of filtered){
        cestaItems.innerHTML += `<div class="cesta-item">
                    <img src="${item.src}" alt="">
                    <div class="cesta-item-info">
                        <h2>${item.nombre}</h2>
                        <p>${item.ingredientes.join(", ")}</p>
                        <div id="cesta-add">
                            <span id="cesta-btn" onclick="addToCart(${item.id})">${plusSVG}</span>
                            <span>${item.cantidad}</span>
                            <span id="cesta-btn" onclick="removeFromCart(${item.id})">${minusSVG}</span>
                        </div>
                    </div>
                    <span>$${item.precio}</span>
                </div>`
    }

    // Si no hay items en la cesta, devuelve un elemento html distinto.
    if (cart.length <= 0) cestaItems.innerHTML += `<div class="cesta-item" style="place-self: center; margin: 4vh 0;"><span>No hay objetos</span></div>`;
}

// Limpia la cesta.
function clearCart(){
    cart.length = 0
    pop.classList.add('none')
    fillCesta()
}