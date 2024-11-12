import React from 'react';
import Pieza from './Pieza';

const TableroJuego = ({ pieza, tablero }) => {
    return (
        <div className='tablero-container'>
            <div className='ficha-guardada'>
                <h2>reserva</h2>
                <p></p>
            </div>
            <div className="tablero-juego">
                {tablero.map((fila, indiceFila) => (
                    <div key={indiceFila} className="fila">
                        {fila.map((celda, indiceCelda) => {
                            let claseCelda = 'celda';

                            if (
                                pieza.forma[indiceFila - pieza.posicion.y] &&
                                pieza.forma[indiceFila - pieza.posicion.y][indiceCelda - pieza.posicion.x] === 1
                            ) {
                                claseCelda += ` celda-activa-${pieza.tipo}`;
                            }
                            else if (celda === 1) {
                                claseCelda += ' celda-ocupada';
                            }

                            return (
                                <div key={indiceCelda} className={claseCelda}></div>
                            );
                        })}
                    </div>
                ))}
                <Pieza forma={pieza.forma} posicion={pieza.posicion} />
            </div>
            <div className='ficha-siguiente'>
                <h2>Siguiente</h2>
                <p></p>
            </div>
        </div>
    );
};

export default TableroJuego;
