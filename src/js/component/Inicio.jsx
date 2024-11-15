import React, { useEffect, useState, useRef } from 'react';
import TableroJuego from './TableroJuego.jsx';
import MarcadorPuntaje from './MarcadorPuntaje.jsx';
import Controles from './Controles.jsx';
import fondo from "../../img/fondo.jpg";
import "../../styles/inicio.css";
import audioFile from "../../img/Tetris.mp3";
import gameOverSound from "../../img/gameover.mp3";
import bienvenidaSound from "../../img/bienvenida.mp3";
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
    const gameOverAudioRef = useRef(null);
    const bienvenidaAudioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(false);
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
        if (bienvenidaAudioRef.current) {
            bienvenidaAudioRef.current.pause();
            bienvenidaAudioRef.current.currentTime = 0;
        }

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



    const toggleMute = () => {
        setIsMuted(prevState => !prevState);
    };

    useEffect(() => {
        // Si el mute está activado, silencia todos los audios
        if (isMuted) {
            if (audioRef.current) audioRef.current.muted = true;
            if (gameOverAudioRef.current) gameOverAudioRef.current.muted = true;
            if (bienvenidaAudioRef.current) bienvenidaAudioRef.current.muted = true;
        } else {
            // Si no está activado, restaura los audios
            if (audioRef.current) audioRef.current.muted = false;
            if (gameOverAudioRef.current) gameOverAudioRef.current.muted = false;
            if (bienvenidaAudioRef.current) bienvenidaAudioRef.current.muted = false;
        }
    }, [isMuted]);

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
            setJuegoTerminado(true); // Cambia el estado a 'juegoTerminado'

            // Pausa el audio principal
            if (audioRef.current) {
                audioRef.current.pause();
            }

            // Reproduce el sonido de Game Over si aún no se está reproduciendo
            if (gameOverAudioRef.current) {
                gameOverAudioRef.current.currentTime = 0; // Reinicia el sonido
                gameOverAudioRef.current.play();
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
        if (juegoTerminado && gameOverAudioRef.current) {
            gameOverAudioRef.current.volume = 0.1; // Reducir volumen
            gameOverAudioRef.current.currentTime = 0;
            gameOverAudioRef.current.play();
        }
    }, [juegoTerminado]);

    useEffect(() => {
        if (puntaje >= nivel * 1000) {
            setNivel((prevNivel) => prevNivel + 1);
            setMensajeNivel('¡Nuevo Nivel!');
            setTimeout(() => {
                setMensajeNivel('');
            }, 2000);
        }
    }, [puntaje, nivel]);

    useEffect(() => {
        if (!juegoIniciado && !cuentaRegresiva && bienvenidaAudioRef.current) {
            bienvenidaAudioRef.current.volume = 0.3;
            bienvenidaAudioRef.current.currentTime = 0;
            bienvenidaAudioRef.current.play();
        }
    }, [juegoIniciado, cuentaRegresiva]);

    useEffect(() => {
        if (!juegoIniciado || juegoTerminado) return;

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
        if (bienvenidaAudioRef.current) {
            bienvenidaAudioRef.current.pause();
            bienvenidaAudioRef.current.currentTime = 0;
            bienvenidaAudioRef.current.play();
        }
        iniciarCuentaRegresiva();
        setPiezaFija(false);
    };

    const handleBienvenidaAudioEnd = () => {
        if (bienvenidaAudioRef.current) {
            bienvenidaAudioRef.current.currentTime = 0;
            bienvenidaAudioRef.current.play();
        }
    };

    const estiloFondo = {
        backgroundImage: `url(${fondo})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
    };

    return (
        <div className="app" style={estiloFondo}>
            {!juegoIniciado && !cuentaRegresiva ? (
                <div className='container-gifsito'>
                    <h1 className="bienvenida">
                        "Bienvenido a este maravilloso mundo del Tetris"
                    </h1>

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

            <div className="mute-button" onClick={toggleMute}>
                {isMuted ? '🔇' : '🎵'}
            </div>

            <footer className="footer">
                @Este juego es elaborado por Luis Castilla 2024
            </footer>

            <audio ref={bienvenidaAudioRef} src={bienvenidaSound} onEnded={handleBienvenidaAudioEnd} />
            <audio ref={audioRef} src={audioFile} loop />
            <audio ref={gameOverAudioRef} src={gameOverSound} />
        </div>
    );
};

export default Inicio;