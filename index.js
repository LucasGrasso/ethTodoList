if (typeof web3 !== "undefined") {
	web3 = new Web3(ethereum);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545/%22"));
}

var todoListAddress = "0x9f976e4cbC777B124609d72786B6dAAE01F42a22";
let todoList = new web3.eth.Contract(todoListABI, todoListAddress);
let list = [];
ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
	let a = ""
	for (let i = 0; i < 6; i++) {
		a += `#${accounts[0].slice(2 + (6 * i), 8 + (6 * i))},`;
		list.push(`#${accounts[0].slice(2 + (6 * i), 8 + (6 * i))}`)
	}
	document.body.style.setProperty("--color", `linear-gradient(90deg, ${a.slice(0, -1)})`);
	document.body.style.setProperty("--color-simple", list[0]);
	document.querySelector(".navbar-brand").innerHTML = accounts[0];
	let options = {
		filter: {
			value: [],
		},
		fromBlock: "latest",
	};

	todoList.events
		.allEvents(options)
		.on("data", (event) => {
			stopLoading();
			renderTareas();
		})
		.on("changed", (changed) => console.log("changed", changed))
		.on("error", (err) => console.log("err", err))
		.on("connected", (str) => console.log("connected", str));
});

async function crearTarea() {
	todoList.methods.crearTarea($('#nuevaTarea').val()).send({ from: ethereum.selectedAddress });
	startLoading();
	document.querySelector(".form-container").reset();
}

async function eliminarTarea(_addr, _id) {
	todoList.methods.eliminar(_id).send({ from: _addr });
	startLoading();
}

async function completarTarea(_addr, _id) {
	todoList.methods.completado(parseInt(_id)).send({ from: _addr });
	startLoading();
}

async function getContTareas(_addr) {
	const result = await todoList.methods.contTareas(_addr).call()
	return result;
}

const startLoading = () => {
	document.getElementById("loading").style.display = "";
	rings = document.getElementsByClassName("loading")[0];
	rings.style.setProperty("--color-simple", list[0]);
}
const stopLoading = () => {
	document.getElementById("loading").style.display = "none";
}

const template = `<div class="taskTemplate" class="checkbox" style="display: none">
<input type="checkbox" />
<span class="content">Contenido va aca</span>
<button class="btn btn-danger" onclick="eliminarTarea(ethereum.selectedAddress, this.name)">Eliminar</button>
</div>`

let templateEl = document.createElement("div");
templateEl.innerHTML = template;
templateEl = templateEl.firstChild;

async function renderTareas() {
	document.querySelector(".form-container").reset();
	document.querySelector("#listaTareas").innerHTML = "";
	document.querySelector("#tareasCompletadas").innerHTML = "";
	let contTareas = await getContTareas(ethereum.selectedAddress)
	//const color = list[Math.floor(Math.random() * 6)]
	const color = list[0];
	for (var i = 1; i <= contTareas; i++) {
		const tarea = await todoList.methods.tareas(ethereum.selectedAddress, i).call()
		const Id = tarea.id
		const contenido = tarea.content
		const status = tarea.completado
		if (contenido === "") continue;
		$newTaskTemplate = $(".taskTemplate").first().clone();
		//console.log($newTaskTemplate.find("input")[0])
		const brightness = tinycolor(color).getBrightness()
		$newTaskTemplate.find("input")[0].style.setProperty("--color-simple", color);
		$newTaskTemplate.find("input")[0].style.setProperty("--text-color", brightness > 128 ? "black" : "white");
		$newTaskTemplate.find('.content').html(contenido)
		$newTaskTemplate.find('input')
			.prop('name', Id)
			.prop('checked', status)
			.on('click', () => completarTarea(ethereum.selectedAddress, Id))
		$newTaskTemplate.find('button')
			.on('click', () => eliminarTarea(ethereum.selectedAddress, Id))

		if (status) {
			$('#tareasCompletadas').append($newTaskTemplate)
		} else {
			$('#listaTareas').append($newTaskTemplate)
		}

		$newTaskTemplate.show()

	}
}

address = null

setInterval(() => {
	if (ethereum.selectedAddress !== address) {
		address = ethereum.selectedAddress
		renderTareas();
	}
}, 1000);

