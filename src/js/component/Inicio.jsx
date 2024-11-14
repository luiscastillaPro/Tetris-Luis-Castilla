import React, { useEffect, useState } from 'react';
import TableroJuego from './TableroJuego.jsx';
import MarcadorPuntaje from './MarcadorPuntaje.jsx';
import Controles from './Controles.jsx';
import fondo from "../../img/fondo.jpg";
import "../../styles/inicio.css";
// import Audio from "../../img/Tetris.mp3";

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
    const [puntaje, setPuntaje] = useState(0);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [nivel, setNivel] = useState(1);
    const [filasEliminadas, setFilasEliminadas] = useState(0);
    const [juegoIniciado, setJuegoIniciado] = useState(false); 
    const [piezaGuardada, setPiezaGuardada] = useState(null);
    const [pieza, setPieza] = useState(generarPiezaAleatoria());
    const [siguientePieza, setSiguientePieza] = useState(generarPiezaAleatoria());

    function generarPiezaAleatoria() {
        const piezaRandom = piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)];
        return {
            ...piezaRandom,
            posicion: { x: Math.floor((columnas - piezaRandom.forma[0].length) / 2), y: 0 }
        };
    }

    const moverPieza = (direccion) => {
        if (piezaFija) return;
        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };
            if (direccion === 'abajo' && !colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) nuevaPosicion.y += 1;
            else if (direccion === 'izquierda' && nuevaPosicion.x > 0 && !colisionConFondo(prevPieza, { x: nuevaPosicion.x - 1, y: nuevaPosicion.y })) nuevaPosicion.x -= 1;
            else if (direccion === 'derecha' && nuevaPosicion.x + prevPieza.forma[0].length < columnas && !colisionConFondo(prevPieza, { x: nuevaPosicion.x + 1, y: nuevaPosicion.y })) nuevaPosicion.x += 1;
            return { ...prevPieza, posicion: nuevaPosicion };
        });
    };

    const rotarPieza = () => {
        setPieza((prevPieza) => {
            const nuevaForma = prevPieza.forma[0].map((_, index) => prevPieza.forma.map(row => row[index])).reverse();
            if (!colisionConFondo({ ...prevPieza, forma: nuevaForma }, prevPieza.posicion)) return { ...prevPieza, forma: nuevaForma };
            return prevPieza;
        });
    };

    const manejarReservaPieza = () => {
        setPieza((prevPieza) => {
            const piezaIntercambiada = piezaGuardada
                ? {
                    ...piezaGuardada,
                    posicion: { x: Math.floor((columnas - 2) / 2), y: 0 }
                }
                : generarPiezaAleatoria();
            setPiezaGuardada(prevPieza);
            return piezaIntercambiada;
        });
    };

    const moverPiezaAbajo = () => {
        if (juegoTerminado) return; 
    
        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };
            if (!colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) {
                nuevaPosicion.y += 1;
                return { ...prevPieza, posicion: nuevaPosicion };
            } else {
                fijarPieza(prevPieza);
                generarNuevaPieza();
                return prevPieza;
            }
        });
    };

    const colisionConFondo = (pieza, nuevaPosicion) => {
        if (nuevaPosicion.y + pieza.forma.length > filas) return true;
        for (let i = 0; i < pieza.forma.length; i++) {
            for (let j = 0; j < pieza.forma[i].length; j++) {
                if (pieza.forma[i][j] === 1) {
                    const x = nuevaPosicion.x + j;
                    const y = nuevaPosicion.y + i;
                    if (y >= filas || x < 0 || x >= columnas || tablero[y][x] === 1) return true;
                }
            }
        }
        return false;
    };

    const eliminarFilasCompletas = (tableroActual) => {
        const nuevoTablero = tableroActual.filter(fila => fila.some(celda => celda === 0));

        const filasEliminadasEstaVez = filas - nuevoTablero.length;

        setFilasEliminadas(prev => prev + filasEliminadasEstaVez);

        const puntajeNuevo = filasEliminadasEstaVez * 10;
        setPuntaje(prev => prev + puntajeNuevo);

        while (nuevoTablero.length < filas) {
            nuevoTablero.unshift(new Array(columnas).fill(0));
        }

        return nuevoTablero;
    };

    const fijarPieza = (pieza) => {
        const nuevoTablero = [...tablero];

        for (let i = 0; i < pieza.forma.length; i++) {
            for (let j = 0; j < pieza.forma[i].length; j++) {
                if (pieza.forma[i][j] === 1) {
                    nuevoTablero[pieza.posicion.y + i][pieza.posicion.x + j] = 1;
                }
            }
        }

        const tableroConFilasEliminadas = eliminarFilasCompletas(nuevoTablero);
        setTablero(tableroConFilasEliminadas);

        setPiezaFija(true);
    };

    const generarNuevaPieza = () => {
        const nuevaPieza = siguientePieza;
        if (colisionConFondo(nuevaPieza, nuevaPieza.posicion)) {
            setJuegoTerminado(true);
        } else {
            setPieza(nuevaPieza);
            setSiguientePieza(generarPiezaAleatoria());
            setPiezaFija(false);
        }
    };

    const bajarPiezaRapidamente = () => {
        setPieza((prevPieza) => {
            let nuevaPosicion = { ...prevPieza.posicion };

            while (!colisionConFondo(prevPieza, { x: nuevaPosicion.x, y: nuevaPosicion.y + 1 })) {
                nuevaPosicion.y += 1;
            }

            fijarPieza({ ...prevPieza, posicion: nuevaPosicion });
            generarNuevaPieza();

            return prevPieza;
        });
    };

    useEffect(() => {
        if (filasEliminadas >= 10 * nivel) {
            setNivel((prevNivel) => prevNivel + 1);
        }
    }, [filasEliminadas, nivel]);

    useEffect(() => {
        if (!juegoIniciado || juegoTerminado) return; // Pausa si el juego no ha iniciado o ha terminado

        const intervalo = setInterval(() => moverPiezaAbajo(), 1000 - (nivel - 1) * 100);

        const handleKeyDown = (event) => {
            if (event.key === "ArrowDown") moverPieza('abajo');
            else if (event.key === "ArrowLeft") moverPieza('izquierda');
            else if (event.key === "ArrowRight") moverPieza('derecha');
            else if (event.key === " ") rotarPieza();
            else if (event.key === "d" || event.key === "D") bajarPiezaRapidamente();
            else if (event.key === "s" || event.key === "S") manejarReservaPieza();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            clearInterval(intervalo);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [pieza, piezaGuardada, nivel, juegoIniciado, juegoTerminado]);

    const iniciarJuego = () => {
        setJuegoIniciado(true);
        setJuegoTerminado(false);
        setPuntaje(0);
        setNivel(1);
        setFilasEliminadas(0);
        setTablero(Array.from({ length: filas }, () => Array(columnas).fill(0)));
        setPieza(generarPiezaAleatoria());
        setSiguientePieza(generarPiezaAleatoria());
        setPiezaGuardada(null);
    };

    const reiniciarJuego = () => {
        iniciarJuego();
    };

    const estiloFondo = {
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
    };

    return (
        <div className="app" style={estiloFondo}>
            {!juegoIniciado ? (
                <button onClick={iniciarJuego} className="btn-play">Play</button>
            ) : juegoTerminado ? (
                <div className="game-over">
                    <h1 className='titulo-gamer'>Game Over</h1>
                    <button onClick={reiniciarJuego} className="btn-reintentar">Volver a Intentarlo</button>
                </div>
            ) : (
                <>
                    <MarcadorPuntaje filasEliminadas={filasEliminadas} puntaje={puntaje} nivel={nivel} />
                    <div className="contenedor-juego">
                        <TableroJuego
                            pieza={pieza}
                            tablero={tablero}
                            piezaGuardada={piezaGuardada}
                            siguientePieza={siguientePieza}
                            nivel={nivel}
                        />
                    </div>
                    <Controles moverPieza={moverPieza} />
                </>
            )}
        </div>
    );
};

export default Inicio;