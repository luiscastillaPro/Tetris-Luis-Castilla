import React from 'react';
import portada from "../../img/portada.png";

const MarcadorPuntaje = ({ filasEliminadas, puntaje }) => {
    return (
        <div className="tablero-puntaje">
            <div className='puntajes'>
                <h2>Puntuacion</h2>
                <p>{puntaje}</p> {/* Mostrar el puntaje */}
            </div>
            <div className='imagen-portada'>
                <img src={portada} alt="Portada" />
            </div>
            <div className='puntajes'>
                <h2>Record</h2>
                <p>{filasEliminadas} {filasEliminadas === 1 ? 'línea' : 'líneas'}</p>
                {/* Condición para singular o plural */}
            </div>
        </div>
    );
};

export default MarcadorPuntaje;
