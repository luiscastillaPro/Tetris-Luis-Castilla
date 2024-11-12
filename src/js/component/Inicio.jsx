import React, { useEffect, useState } from 'react';
import TableroJuego from './TableroJuego.jsx';
import MarcadorPuntaje from './MarcadorPuntaje.jsx';
import SiguientePieza from './SiguientePieza.jsx';
import Controles from './Controles.jsx';

const piezasDisponibles = [
    {
        tipo: 'cuadrado',
        forma: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        tipo: 'L1',
        forma: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    {
        tipo: 'L2',
        forma: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    {
        tipo: 'T',
        forma: [
            [1, 1, 1],
            [0, 1, 0]
        ]
    },
    {
        tipo: 'linea',
        forma: [
            [1, 1, 1, 1]
        ]
    },
    {
        tipo: 'S',
        forma: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    {
        tipo: 'Z',
        forma: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    }
];

const Inicio = () => {
    const filas = 25;
    const columnas = 14;
    const [tablero, setTablero] = useState(Array.from({ length: filas }, () => Array(columnas).fill(0)));
    const [piezaFija, setPiezaFija] = useState(false);
    const [pieza, setPieza] = useState({
        tipo: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)].tipo,
        forma: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)].forma,
        posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
    });

    const moverPieza = (direccion) => {
        if (piezaFija) return;

        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };

            if (direccion === 'abajo') {
                if (!colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) {
                    nuevaPosicion.y += 1;
                }
            } else if (direccion === 'izquierda') {
                if (nuevaPosicion.x > 0 && !colisionConFondo(prevPieza, { x: nuevaPosicion.x - 1, y: nuevaPosicion.y })) {
                    nuevaPosicion.x -= 1;
                }
            } else if (direccion === 'derecha') {
                if (nuevaPosicion.x + prevPieza.forma[0].length < columnas && !colisionConFondo(prevPieza, { x: nuevaPosicion.x + 1, y: nuevaPosicion.y })) {
                    nuevaPosicion.x += 1;
                }
            }

            return { ...prevPieza, posicion: nuevaPosicion };
        });
    };

    const rotarPieza = () => {
        setPieza((prevPieza) => {
            const nuevaForma = prevPieza.forma[0].map((_, index) => 
                prevPieza.forma.map(row => row[index])
            ).reverse();

            if (!colisionConFondo({ ...prevPieza, forma: nuevaForma }, prevPieza.posicion)) {
                return { ...prevPieza, forma: nuevaForma };
            }

            return prevPieza; // Si hay colisión, no rotamos
        });
    };

    const moverPiezaAbajo = () => {
        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };

            if (!colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) {
                nuevaPosicion.y += 1;
                return { ...prevPieza, posicion: nuevaPosicion };
            } else {
                fijarPieza(prevPieza);
                generarNuevaPieza();
                return {
                    forma: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)].forma,
                    tipo: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)].tipo,
                    posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
                };
            }
        });
    };

    const colisionConFondo = (pieza, nuevaPosicion) => {
        if (nuevaPosicion.y + pieza.forma.length > filas) {
            return true; // Colisión con el fondo
        }

        for (let i = 0; i < pieza.forma.length; i++) {
            for (let j = 0; j < pieza.forma[i].length; j++) {
                if (pieza.forma[i][j] === 1) {
                    const x = nuevaPosicion.x + j;
                    const y = nuevaPosicion.y + i;

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
        setPiezaFija(true);
    };

    const generarNuevaPieza = () => {
        setPieza({
            tipo: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)].tipo,
            forma: piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)].forma,
            posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
        });
        setPiezaFija(false);
    };

    useEffect(() => {
        const intervalo = setInterval(() => {
            moverPiezaAbajo();
        }, 1000);

        const handleKeyDown = (event) => {
            if (event.key === "ArrowDown") {
                moverPieza('abajo');
            } else if (event.key === "ArrowLeft") {
                moverPieza('izquierda');
            } else if (event.key === "ArrowRight") {
                moverPieza('derecha');
            } else if (event.key === " ") {
                rotarPieza();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            clearInterval(intervalo);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [pieza]);

    return (
        <div className="app">
            <MarcadorPuntaje />
            <div className="contenedor-juego">
                <div className="guardar">
                    <SiguientePieza pieza={pieza} />
                </div>
                <TableroJuego pieza={pieza} tablero={tablero} /> 
                <div className="proxima-pieza">
                    <SiguientePieza pieza={pieza} /> 
                </div>
            </div>
            <Controles moverPieza={moverPieza} />
        </div>
    );
};

export default Inicio;