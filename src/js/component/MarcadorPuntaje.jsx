import React from 'react';
import portada from "../../img/portada.png";
import "../../styles/puntaje.css";

const MarcadorPuntaje = ({ filasEliminadas, puntaje }) => {
    return (
        <div className="tablero-puntaje">
            <div className='puntajes'>
                <h2 className='puntajes-titul'>Puntuacion</h2>
                <p>{puntaje}</p>
            </div>
            <div className='imagen-portada'>
                <img src={portada} alt="Portada" className='portada'/>
            </div>
            <div className='puntajes'>
                <h2 className='puntajes-titul'>Record</h2>
                <p>{filasEliminadas} {filasEliminadas === 1 ? 'línea' : 'líneas'}</p>
            </div>
        </div>
    );
};

export default MarcadorPuntaje;
