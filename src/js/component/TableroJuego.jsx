import React from 'react';
import Pieza from './Pieza';

const TableroJuego = ({ pieza, tablero }) => {
  return (
    <div className="tablero-juego">
      {/* Renderiza el tablero */}
      {tablero.map((fila, indiceFila) => (
        <div key={indiceFila} className="fila">
          {fila.map((celda, indiceCelda) => (
            <div
              key={indiceCelda}
              className={`celda ${celda === 1 ? 'celda-activa' : ''}`}
            ></div>
          ))}
        </div>
      ))}
      {/* Renderiza la pieza activa */}
      <Pieza forma={pieza.forma} posicion={pieza.posicion} />
    </div>
  );
};

export default TableroJuego;
