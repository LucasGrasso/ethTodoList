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

    modifier onlyOwner() {
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

    function crearTarea(string memory _contenido, address _addr) public {
        contTareas[_addr]++;
        tareas[_addr][contTareas[_addr]] = Tarea(contTareas[_addr],_contenido,false);
        emit tareaCreada(_addr,contTareas[_addr], _contenido, false);
    }
    
    function completado(uint _id, address _addr) public {
        Tarea memory _tarea = tareas[_addr][_id];
        _tarea.completado = true;
        tareas[_addr][_id] = _tarea;
        emit tareaCompletada(_addr,_id, true);
  }
}