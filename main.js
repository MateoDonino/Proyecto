// DOM
const tienda = document.querySelector("#productos")
const carrito = document.querySelector("#carritoBody")
const comprar = document.querySelector("#comprar")
const borrarCarrito = document.querySelector("#borrar")
const totalCarrito = document.querySelector("#total")

let carritoArray = JSON.parse(localStorage.getItem("carrito")) || []
carritoArray.length > 0 && renderizarCarrito()

// PRODUCTOS
class Producto {
	constructor(id, nombre, precio, alcohol, descripcion, img) {
		this.id = id
		this.nombre = nombre
		this.precio = precio
		this.alcohol = alcohol
		this.descripcion = descripcion
		this.img = img
	}
}

let stock = [
	new Producto(
		1,
		"Fernet",
		900,
		"5%",
		"El fernet es una bebida alcohólica de la familia de los amaros italianos elaborada a partir de la maceración de varios tipos de hierbas ​ en alcohol obtenido de la fermentación de la vid. Dependiendo del productor, la maceración es posteriormente filtrada y reposada en toneles de roble durante un período variable.",
		"https://www.res.com.ar/media/catalog/product/cache/dbcd7fcd96d4e43f69e3e3703d135006/9/2/92_2048x2048.jpg"
	),
	new Producto(
		2,
		"Vodka Absolut",
		1800,
		"7%",
		"El o la vodka es una bebida destilada. Se discute el origen de la misma aunque el nombre actual es ruso. Se produce generalmente a través de la fermentación de granos y otras plantas ricas en almidón, como el centeno, trigo, patata o remolacha.",
		"https://vanniyomwineliquorstore.com/wp-content/uploads/2018/12/ABSOLUTVODKABLUE1LITRE_part1.jpg"
	),
	new Producto(
		3,
		"Whisky White Walker Game Of Thrones",
		6100,
		"12%",
		"White Walker by Johnnie Walker es un blended scotch versátil, amigable, único, con notas de azúcar caramelizada, vainilla y frutos rojos frescos. Se trata de un whisky que se disfruta aún más cuando se lo bebe bien frío (directo del congelador) y por esto también es la opción ideal para cócteles como el Highball.",
		"https://bebidasrd.com/wp-content/uploads/sites/4/2021/07/White-Walker-Johnnie-Walker-Whisky-Limited-Edition.jpg"
	),
	new Producto(
		4,
		"Coca Cola",
		200,
		"0%",
		"Coca-Cola es una bebida azucarada gaseosa vendida a nivel mundial en tiendas, restaurantes y máquinas expendedoras en más de doscientos países o territorios.",
		"https://www.rimoldimayorista.com.ar/datos/uploads/mod_catalogo/31308/coca-cola-3-lts-6061faffaae30.jpg"
	),
	new Producto(
		5,
		"Havana Club",
		1600,
		"15%",
		"El uso de barriles de roble blanco joven seleccionados para el segundo acabado, o doble proceso de añejamiento, crea un perfil de sabor único con notas de vainilla y caramelo, así como un toque de madera que emana de los barriles. El color dorado del Havana Club Añejo Especial anuncia el sabor intenso y redondo del ron. La boscosidad que llega a través de la nariz revela especias, naranja y notas florales.",
		"https://santaritazapatoca.com/wp-content/uploads/2020/12/ron-havana-club-750ml.png"
	),
	new Producto(
		6,
		"Jaggermeister",
		3200,
		"15%",
		"Reconocida bebida espirituosa de culto cuyo nombre significa “maestro de caza”, Es un licor a base de hierbas, realizado con una fórmula secreta que permaneció inalterada desde su creador – Curt Mast – la desarrollo en 1934, en Wolfenbüttel, Alemania. Debido a su exclusivo sabor , fue instalado dentro de la categoría de los bitters, aunque su gusto es inigualable al de otra bebida.",
		"https://media-verticommnetwork1.netdna-ssl.com/wines/jagermeister-1l-435899.jpg"
	),
]

// PROMESAS: Fetch de precio dolar blue
const API = "https://criptoya.com/api/dolar"
let precioDolar = 0
fetch(API)
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		precioDolar = data.blue
	})
	.then(() => {
		let html = ``
		stock.forEach((producto) => {
			let { nombre, img, descripcion, precio, id } = producto
			html += `
				<div class="col-md-4 my-2">
					<div class="card" >
						<img src="${img}" class="card-img-top imgProd" alt="...">
						<div class="card-body">
							<h5 class="card-title titleProd">${nombre}</h5>
							<p class="card-text">${descripcion}</p>
							<p class="card-text priceProd">AR$ ${precio}</p>
							<p class="card-text priceProd">U$D ${(precio / precioDolar).toFixed(2)}</p>
							<button class="btn btn-primary btn-compra" data-id="${id}">Comprar</button>
						</div>
					</div>
				</div>
				`
		})
		tienda.innerHTML = html
	})
	.catch(() => {
		console.error
	})

// EVENTOS: LISTENERS
tienda.addEventListener("click", agregarCarrito)
comprar.addEventListener("click", comprarTodo)
borrarCarrito.addEventListener("click", vaciarCarrito)

// FUNCIONES
function agregarCarrito(e) {
	e.preventDefault()
	if (e.target.classList.contains("btn-compra")) {
		let producto = e.target.parentNode.parentNode
		obtenerDatos(producto)
	}
}

function obtenerDatos(producto) {
	let datosProducto = {
		nombre: producto.querySelector(".titleProd").textContent,
		precio: producto.querySelector(".priceProd").textContent,
		img: producto.querySelector(".imgProd").src,
		id: Number(producto.querySelector("[data-id]").dataset.id),
		cantidad: 1,
	}

	const existe = carritoArray.some(
		(producto) => producto.id == datosProducto.id
	)

	if (existe) {
		const productos = carritoArray.map((producto) => {
			if (producto.id === datosProducto.id) {
				producto.cantidad++
				return producto
			} else {
				return producto
			}
		})

		carritoArray = [...productos]
		guardarCarrito()
	} else {
		//Pushear al carrito
		actualizarCarrito(datosProducto)
	}

// LIBRERIAS + DESTRUCTURING
	let { nombre } = datosProducto
	Toastify({
		text: `${datosProducto.nombre} agregado al carrito`,
		duration: 1000,
		style: {
			background:
				nombre === "Fernet"
					? "linear-gradient(90deg, rgba(0,0,0,1) 5%, rgba(130,85,0,1) 78%, rgba(182,200,204,1) 100%)"
					: nombre.includes("Vodka")
					? "linear-gradient(90deg, rgba(27,160,191,1) 5%, rgba(158,155,150,1) 50%, rgba(20,184,222,1) 92%)"
					: nombre.includes("Whisky")
					? "linear-gradient(90deg, rgba(110,114,116,1) 5%, rgba(32,56,60,1) 50%, rgba(29,102,138,1) 92%)"
					: nombre.includes("Coca")
					? "linear-gradient(90deg, rgba(143,5,5,1) 0%, rgba(1,1,1,1) 49%, rgba(190,7,7,1) 100%)"
					: nombre.includes("Havana")
					? "linear-gradient(90deg, rgba(112,49,4,1) 0%, rgba(135,84,12,1) 49%, rgba(238,232,12,1) 100%)"
					: nombre.includes("Jagger")
					? "linear-gradient(90deg, rgba(15,93,13,1) 0%, rgba(0,0,0,1) 49%, rgba(15,117,5,1) 100%)"
					: null,
		},
	}).showToast()
}

function actualizarCarrito(producto) {
	carritoArray.push(producto)
	guardarCarrito()
}
carrito.addEventListener("click", eliminarProducto)
function eliminarProducto(e) {
	if (e.target.classList.contains("borrar-producto")) {
		e.preventDefault()
		const productoId = e.target.getAttribute("data-id")

		//Filtro los productos del carrito
		carritoArray = carritoArray.filter((producto) => producto.id != productoId)

		renderizarCarrito()
		guardarCarrito()
	}
}

function renderizarCarrito() {
	carrito.innerHTML = ``
	let total = 0
	carritoArray.forEach((producto) => {
		let { nombre, img, precio, cantidad, id } = producto
		const row = document.createElement("tr")
		row.innerHTML = `
		<td>
			<img src="${img}" width=100>
		</td>
		<td>
			${nombre}
		</td>
		<td>
			${cantidad}
		</td>
		<td>
			${precio}
		</td>
		<td class="text-center">
			<a href="#" class="borrar-producto" data-id="${id}"> X </a>
		</td>
	`
		carrito.appendChild(row)
		const precioProducto = Number(precio.replace("AR$ ", ""))
		total = total + precioProducto * cantidad
	})
	totalCarrito.innerHTML = `$${total.toFixed(2)}`
}

function comprarTodo(e) {
	e.preventDefault()
	if (carritoArray.length > 0) {
		Swal.fire({
			title: "Listo!",
			text: "Gracias por su compra!",
			icon: "success",
			confirmButtonText: "Ok",
		})

		carritoArray = []
		total.innerText = 0
		guardarCarrito()
		renderizarCarrito()
	}
}

// LIBRERIAS
function vaciarCarrito() {
	carritoArray = []
	Toastify({
		text: `Carrito vaciado`,
		duration: 3000,
		style: {
			background: "#ff0000",
		},
	}).showToast()
	total.innerText = 0
	guardarCarrito()
}

// FUNCIONES: LOCAL STORAGE
function guardarCarrito() {
	localStorage.setItem("carrito", JSON.stringify(carritoArray))
	renderizarCarrito()
}
