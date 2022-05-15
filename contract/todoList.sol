// SPDX-License-Identifier: MIT

/*
*@Title: ethTodoList
*@Author: Lucas Grasso Ramos
Insipirado en @dappuniversity todoList
*/

pragma solidity^0.8.7;

contract todoList{

    mapping(address => uint256) public contTareas;

    constructor(){ 
        owner = msg.sender; 
    }

    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    struct Tarea{
        uint id;
        string content;
        bool completado;
    }

    mapping(address => mapping (uint => Tarea)) public tareas;

    event tareaCreada(
        address indexed addr,
        uint id,
        string content,
        bool completado
    );

    event tareaCompletada(
        address indexed addr,
        uint id,
        bool completado
    );

    event tareaEliminada(
        address indexed addr,
        uint id
    );

    function crearTarea(string memory _contenido) public {
        contTareas[msg.sender]++;
        tareas[msg.sender][contTareas[msg.sender]] = Tarea(contTareas[msg.sender],_contenido,false);
        emit tareaCreada(msg.sender,contTareas[msg.sender], _contenido, false);
    }
    
    function completado(uint _id) public {
        Tarea memory _tarea = tareas[msg.sender][_id];
        _tarea.completado = !_tarea.completado;
        tareas[msg.sender][_id] = _tarea;
        emit tareaCompletada(msg.sender,_id, _tarea.completado);
  }

  function eliminar(uint _id) public {
       Tarea memory _tarea = tareas[msg.sender][_id];
       _tarea.content = "";
       _tarea.completado = false;
       tareas[msg.sender][_id] = _tarea;
       emit tareaEliminada(msg.sender, _id);
  }
}