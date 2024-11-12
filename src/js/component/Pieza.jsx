import React from 'react';

const Pieza = ({ forma, posicion }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: posicion.y * 30,  
        left: posicion.x * 30, 
      }}
    >
      {forma.map((fila, indiceFila) => (
        <div key={indiceFila} className="fila-pieza">
          {fila.map((celda, indiceCelda) => (
            <div
              key={indiceCelda}
              className={`celda-pieza ${celda ? 'celda-activa' : ''}`}
              style={{
                width: 30,  
                height: 30, 
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Pieza;
