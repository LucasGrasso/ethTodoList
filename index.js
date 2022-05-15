var todoListABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "completado",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_contenido",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "crearTarea",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "completado",
				"type": "bool"
			}
		],
		"name": "tareaCompletada",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "completado",
				"type": "bool"
			}
		],
		"name": "tareaCreada",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contTareas",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tareas",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "completado",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

if (typeof web3 !== "undefined") {
    web3 = new Web3(ethereum);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545/%22"));
}

var todoListAddress = "0xEa6Dd11D42350a567065d593a16eee1298B1c490";
let todoList = new web3.eth.Contract(todoListABI, todoListAddress);

ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
    document.querySelector(".navbar-brand").innerHTML = accounts[0];
        let options = {
            filter: {
                value: [],
            },
            fromBlock: 0,
        };

        todoList.events
            .allEvents(options)
            .on("data", (event) => console.log("event", event))
            .on("changed", (changed) => console.log("changed", changed))
            .on("error", (err) => console.log("err", err))
            .on("connected", (str) => console.log("connected", str));
    });

function crearTarea(){
    todoList.methods.crearTarea($('#nuevaTarea').val(), ethereum.selectedAddress).send({ from: ethereum.selectedAddress});
	window.location.reload();
}

function completarTarea(_addr,_id){
    todoList.methods.completado(_id,_addr).send({ from: _addr});
}

async function getContTareas(_addr){
    todoList.methods.contTareas(_addr).call()
    .then(function(result) {
        console.log(result);
        return result;
    });
}

async function getTarea(_addr,_id){
    todoList.methods.tareas(_addr,_id).call()
    .then(function(result) {
        console.log(result);
        return result;
    });
}

async function renderTareas(){
	addr = ethereum.selectedAddress
	let contTareas = getContTareas(addr)
    const $taskTemplate = $('.taskTemplate')

    for (var i = 1; i <= contTareas; i++) {
      // Fetch the task data from the blockchain
		const tarea = todoList.methods.tareas(addr,i).call()
		const Id = tarea[1].toNumber()
		const contenido = task[2]
		const status = task[3]

		const $newTaskTemplate = $taskTemplate.clone()
		$newTaskTemplate.find('.content').html(contenido)
		$newTaskTemplate.find('input')
						.prop('name', Id)
						.prop('checked', status)
						.on('click', completarTarea)

      if (status) {
        $('#tareasCompletadas').append($newTaskTemplate)
      } else {
        $('#listaTareas').append($newTaskTemplate)
      }

      $newTaskTemplate.show()
	}
}

renderTareas();
