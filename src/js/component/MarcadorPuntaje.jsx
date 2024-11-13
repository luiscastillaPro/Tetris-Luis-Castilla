import React from 'react';
import portada from "../../img/portada.png";

const MarcadorPuntaje = ({ filasEliminadas  }) => {
    return (
        <div className="tablero-puntaje">
            <div className='puntajes'>
                <h2>Tiempo</h2>
                <p>03:15</p>
            </div>
            <div className='imagen-portada'>
                <img src={portada}></img>
            </div>
            <div className='puntajes'>
                <h2>Record</h2>
                <p>{filasEliminadas} líneas</p>
            </div>
        </div>
    );
};

export default MarcadorPuntaje;
