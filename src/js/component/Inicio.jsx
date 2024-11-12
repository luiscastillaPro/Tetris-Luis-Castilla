import React, { useEffect, useState } from 'react';
import TableroJuego from './TableroJuego.jsx';
import MarcadorPuntaje from './MarcadorPuntaje.jsx';
import SiguientePieza from './SiguientePieza.jsx';
import Controles from './Controles.jsx';

const piezasDisponibles = [
    [
        [1, 1],
        [1, 1]
    ], 
    [
        [1, 1, 0],
        [0, 1, 1]
    ], 
    [
        [0, 1, 1],
        [1, 1, 0]
    ], 
    [
        [1, 1, 1],
        [0, 1, 0]
    ], 
    [
        [1, 1, 1, 1]
    ], 
    [
        [1, 0, 0],
        [1, 1, 1]
    ], 
    [
        [0, 0, 1],
        [1, 1, 1]
    ], 
];

const Inicio = () => {
    const filas = 22;
    const columnas = 13;
    const [tablero, setTablero] = useState(Array.from({ length: filas }, () => Array(columnas).fill(0)));
    const [piezaFija, setPiezaFija] = useState(false);
    const [pieza, setPieza] = useState({
        forma: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)],
        posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
    });

    const moverPieza = (direccion) => {
        if (piezaFija) return;
    
        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };
    
            if (direccion === 'abajo') {
                // Verificar si hay colisión antes de mover la pieza
                if (!colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) {
                    nuevaPosicion.y += 1;  // Solo mover si no hay colisión
                }
            } else if (direccion === 'izquierda') {
                if (nuevaPosicion.x > 0 && !colisionConFondo(prevPieza, { x: nuevaPosicion.x - 1, y: nuevaPosicion.y })) {
                    nuevaPosicion.x -= 1;  // Mover a la izquierda
                }
            } else if (direccion === 'derecha') {
                if (nuevaPosicion.x + prevPieza.forma[0].length < columnas && !colisionConFondo(prevPieza, { x: nuevaPosicion.x + 1, y: nuevaPosicion.y })) {
                    nuevaPosicion.x += 1;  // Mover a la derecha
                }
            }
    
            return { ...prevPieza, posicion: nuevaPosicion };
        });
    };
    
    const moverPiezaAbajo = () => {
        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };
            
            // Verificamos si la pieza puede moverse hacia abajo sin colisionar
            if (!colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) {
                nuevaPosicion.y += 1;
                return { ...prevPieza, posicion: nuevaPosicion };
            } else {
                // Si hay colisión, fijamos la pieza
                fijarPieza(prevPieza);
                generarNuevaPieza();  // Generamos una nueva pieza
                return {
                    forma: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)],
                    posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
                };
            }
        });
    };

    const colisionConFondo = (pieza, nuevaPosicion) => {
        // Verificamos si la pieza choca con el fondo o una pieza fija
        if (nuevaPosicion.y + pieza.forma.length > filas) {
            return true; // Colisión con el fondo
        }

        for (let i = 0; i < pieza.forma.length; i++) {
            for (let j = 0; j < pieza.forma[i].length; j++) {
                if (pieza.forma[i][j] === 1) {
                    const x = nuevaPosicion.x + j;
                    const y = nuevaPosicion.y + i;

                    // Si la pieza intenta ir fuera de los límites o toca una pieza ya fija
                    if (y >= filas || x < 0 || x >= columnas || tablero[y][x] === 1) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    const fijarPieza = (pieza) => {
        const nuevaTablero = [...tablero];
    
        for (let i = 0; i < pieza.forma.length; i++) {
            for (let j = 0; j < pieza.forma[i].length; j++) {
                if (pieza.forma[i][j] === 1) {
                    nuevaTablero[pieza.posicion.y + i][pieza.posicion.x + j] = 1;
                }
            }
        }
    
        setTablero(nuevaTablero);
        setPiezaFija(true); // Marcamos que la pieza ya está fijada
    };

    const generarNuevaPieza = () => {
        setPieza({
            forma: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)],
            posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
        });
        setPiezaFija(false);
    };

    useEffect(() => {
        const intervalo = setInterval(() => {
            moverPiezaAbajo();
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="app">
            <MarcadorPuntaje />
            <div className="contenedor-juego">
                <div className="guardar">
                    <SiguientePieza />
                </div>
                <TableroJuego pieza={pieza} tablero={tablero} /> 
                <div className="proxima-pieza">
                    <SiguientePieza />
                </div>
            </div>
            <Controles moverPieza={moverPieza} />
        </div>
    );
};

export default Inicio;
