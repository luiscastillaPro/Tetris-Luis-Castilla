import React, { useEffect, useState, useRef } from 'react';
import TableroJuego from './TableroJuego.jsx';
import MarcadorPuntaje from './MarcadorPuntaje.jsx';
import Controles from './Controles.jsx';
import fondo from "../../img/fondo.jpg";
import "../../styles/inicio.css";
import audioFile from "../../img/Tetris.mp3";
import cryingImage from "../../img/giphy.gif";
import guerrero from "../../img/200.gif";

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
    const audioRef = useRef(null);
    const filas = 25;
    const columnas = 14;
    const [tablero, setTablero] = useState(Array.from({ length: filas }, () => Array(columnas).fill(0)));
    const [piezaFija, setPiezaFija] = useState(false);
    const [puntaje, setPuntaje] = useState(0);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [nivel, setNivel] = useState(1);
    const [cuentaRegresiva, setCuentaRegresiva] = useState(null);
    const [filasEliminadas, setFilasEliminadas] = useState(0);
    const [mensajePuntos, setMensajePuntos] = useState('');
    const [juegoIniciado, setJuegoIniciado] = useState(false);
    const [piezaGuardada, setPiezaGuardada] = useState(null);
    const [mensajeNivel, setMensajeNivel] = useState('');
    const [pieza, setPieza] = useState(generarPiezaAleatoria());
    const [siguientePieza, setSiguientePieza] = useState(generarPiezaAleatoria());

    function generarPiezaAleatoria() {
        const piezaRandom = piezasDisponibles[Math.floor(Math.random() * piezasDisponibles.length)];
        return {
            ...piezaRandom,
            posicion: { x: Math.floor((columnas - piezaRandom.forma[0].length) / 2), y: 0 }
        };
    }

    const iniciarCuentaRegresiva = () => {
        setCuentaRegresiva(3);
        let contador = 3;

        const intervalo = setInterval(() => {
            contador -= 1;
            if (contador === 0) {
                setCuentaRegresiva("¡Let's go!");
            } else if (contador < 0) {
                clearInterval(intervalo);
                setCuentaRegresiva(null);
                iniciarJuego();
            } else {
                setCuentaRegresiva(contador);
            }
        }, 1000);
    };

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
        const filasCompletas = tableroActual.reduce((acumulador, fila, indice) => {
            if (fila.every(celda => celda === 1)) {
                acumulador.push(indice);
            }
            return acumulador;
        }, []);

        if (filasCompletas.length === 0) {
            return tableroActual;
        }

        const puntosPorEliminar = filasCompletas.length * 100;
        setFilasEliminadas(prev => prev + filasCompletas.length);
        setPuntaje(prev => prev + puntosPorEliminar);

        setMensajePuntos(`${puntosPorEliminar} Puntos`);

        setTimeout(() => {
            setMensajePuntos('');
        }, 1500);

        const tableroConAnimacion = tableroActual.map((fila, indice) => {
            if (filasCompletas.includes(indice)) {
                return fila.map(() => 1);
            }
            return fila;
        });

        setTablero(tableroConAnimacion);

        setTimeout(() => {
            const nuevoTablero = tableroActual.filter((_, indice) => !filasCompletas.includes(indice));

            while (nuevoTablero.length < filas) {
                nuevoTablero.unshift(new Array(columnas).fill(0));
            }

            setTablero(nuevoTablero);
        }, 500);

        return tableroActual;
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
            if (audioRef.current) {
                audioRef.current.pause();
            }
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
        if (puntaje >= nivel * 1000) {
            setNivel((prevNivel) => prevNivel + 1);
            setMensajeNivel('¡Nuevo Nivel!');
            setTimeout(() => {
                setMensajeNivel('');
            }, 2000); // El mensaje desaparece después de 2 segundos
        }
    }, [puntaje, nivel]);

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
        if (audioRef.current) {
            audioRef.current.volume = 0.1;
            audioRef.current.play();
        }

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
        iniciarCuentaRegresiva();
        setPiezaFija(false);
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
            {!juegoIniciado && !cuentaRegresiva ? (
                <div className='container-gifsito'>
                    <img src={guerrero} alt="Guerrero GIF" className="gif-play" />
                <button onClick={iniciarCuentaRegresiva} className="btn-play">
                    Play
                </button>

                </div>
            ) : juegoTerminado ? (
                <div className="game-over">
                    <img src={cryingImage} alt="Crying GIF" className="gif-game-over" />
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

            {cuentaRegresiva && (
                <div className="modal-cuenta-regresiva">
                    <div className="texto-cuenta">{cuentaRegresiva}</div>
                </div>
            )}

            {mensajePuntos && (
                <div className="mensaje-puntos">
                    {mensajePuntos}
                </div>
            )}

            {mensajeNivel && (
                <div className="mensaje-nivel">
                    {mensajeNivel}
                </div>
            )}

            {/* Componente de audio que se reproduce cuando se inicia el juego */}
            <audio ref={audioRef} src={audioFile} loop /> {/* Loop lo mantiene sonando en bucle */}
        </div>
    );
};

export default Inicio;