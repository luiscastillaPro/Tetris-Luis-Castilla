import React from 'react';
import "../../styles/pieza.css";

const Pieza = ({ forma, posicion, clase = '', esMiniatura = false, tipoPieza }) => {
  return (
    <div 
      className={`pieza ${clase}`} 
      style={{
        position: esMiniatura ? 'relative' : 'absolute',
        top: esMiniatura ? 'auto' : posicion.y * 30,
        left: esMiniatura ? 'auto' : posicion.x * 30, 
        display: 'inline-block',
      }}
    >
      {forma.map((fila, indiceFila) => (
        <div key={indiceFila} className="fila-pieza">
          {fila.map((celda, indiceCelda) => (
            <div
              key={indiceCelda}
              className={`celda-pieza ${celda ? `celda-activa-${tipoPieza}` : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Pieza;
