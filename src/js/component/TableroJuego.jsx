import React, { useEffect, useState } from 'react';
import Pieza from './Pieza';
import "../../styles/tablero.css";

const TableroJuego = ({ pieza, tablero, piezaGuardada, siguientePieza, nivel }) => {
  const [animacionActivada, setAnimacionActivada] = useState(false);
  const [shakeActivado, setShakeActivado] = useState(false);

  // Función para activar el temblor
  const activarShake = () => {
    setShakeActivado(true);
    setTimeout(() => setShakeActivado(false), 500); // Duración de la animación
  };

  useEffect(() => {
    if (nivel > 1) {
      setAnimacionActivada(true);
      setTimeout(() => setAnimacionActivada(false), 1000);
      activarShake(); // Activa el temblor cuando cambia el nivel
    }
  }, [nivel]);
  
  useEffect(() => {
    if (siguientePieza) {
      activarShake(); // Activa el temblor cada vez que cambia la pieza siguiente
    }
  }, [siguientePieza]);

  return (
    <div className='tablero-container'>
      <div className='tabler-punticos'>
        <div className="ficha-guardada">
          <h2 className='reservi-titul'>Reserva</h2>
          {piezaGuardada ? (
            <div className="miniatura-pieza2">
              <Pieza forma={piezaGuardada.forma} posicion={{ x: 0, y: 0 }} esMiniatura={true} tipoPieza={piezaGuardada.tipo} />
            </div>
          ) : (
            <p className='sin-reserva'>No hay pieza guardada</p>
          )}
        </div>

        <div className='tabler-control'>
          <h2 className='titul-control'>Controles</h2>
          <div className='lista-control'>
            <li>S = Reservar</li>
            <li>D = Deslizar</li>
            <li>Espacio = Girar</li>
          </div>
        </div>
      </div>

      <div className="tablero-juego">
        {tablero.map((fila, indiceFila) => (
          <div key={indiceFila} className={`fila ${fila.every(celda => celda === 1) ? 'fila-para-eliminar' : ''}`}>
            {fila.map((celda, indiceCelda) => {
              let claseCelda = 'celda';
              const yPos = indiceFila - pieza.posicion.y;
              const xPos = indiceCelda - pieza.posicion.x;

              if (pieza.forma[yPos] && pieza.forma[yPos][xPos] === 1) {
                claseCelda += ` celda-activa-${pieza.tipo}`;
              } else if (celda === 1) {
                claseCelda += ' celda-ocupada';
              }

              return <div key={indiceCelda} className={claseCelda}></div>;
            })}
          </div>
        ))}
        <Pieza forma={pieza.forma} posicion={pieza.posicion} tipoPieza={pieza.tipo} />
      </div>

      <div className="tabler-punticos">
        <div className={`ficha-siguiente ${shakeActivado ? 'shake-effect' : ''}`}>
          <h2 className='titul-siguiente'>Siguiente</h2>
          <div className="miniatura-pieza">
            <Pieza forma={siguientePieza.forma} posicion={{ x: 0, y: 0 }} esMiniatura={true} tipoPieza={siguientePieza.tipo} />
          </div>
        </div>
        <div className={`tablero-nivel ${animacionActivada ? 'animacion-activa' : ''}`}>
          <h2 className='titulo-nivel'>Nivel</h2>
          <p className='nivel-maximo'>{nivel}</p>
        </div>
      </div>
    </div>
  );
};

export default TableroJuego;

