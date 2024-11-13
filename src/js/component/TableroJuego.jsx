import React from 'react';
import Pieza from './Pieza';

const TableroJuego = ({ pieza, tablero, piezaGuardada }) => {
    return (
        <div className='tablero-container'>
            <div className="ficha-guardada">
                <h2>Reserva</h2>
                {piezaGuardada ? (
                    <div className="miniatura-pieza" key={`${piezaGuardada.tipo}-${piezaGuardada.posicion.x}-${piezaGuardada.posicion.y}`}>
                        <Pieza forma={piezaGuardada.forma} posicion={{ x: 0, y: 0 }} esMiniatura={true} tipoPieza={piezaGuardada.tipo} />
                    </div>
                ) : (
                    <p>No hay pieza guardada</p>
                )}
            </div>

            <div className="tablero-juego">
                {tablero.map((fila, indiceFila) => (
                    <div key={indiceFila} className="fila">
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
            <div className='ficha-siguiente'>
                <h2>Siguiente</h2>
                <p></p>
            </div>
        </div>
    );
};

export default TableroJuego;
