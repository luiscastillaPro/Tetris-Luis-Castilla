import React from 'react';

const Pieza = ({ forma, posicion }) => {
  return (
    <div
      style={{
        position: 'absolute', // Posiciona la pieza con respecto a su contenedor
        top: posicion.y * 30,  // Desplazamiento vertical (según filas)
        left: posicion.x * 30, // Desplazamiento horizontal (según columnas)
      }}
    >
      {forma.map((fila, indiceFila) => (
        <div key={indiceFila} className="fila-pieza">
          {fila.map((celda, indiceCelda) => (
            <div
              key={indiceCelda}
              className={`celda-pieza ${celda ? 'celda-activa' : ''}`}
              style={{
                width: 30,   // Tamaño de cada celda de la pieza
                height: 30,  // Tamaño de cada celda de la pieza
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Pieza;
