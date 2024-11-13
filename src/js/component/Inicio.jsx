import React, { useEffect, useState } from 'react';
import TableroJuego from './TableroJuego.jsx';
import MarcadorPuntaje from './MarcadorPuntaje.jsx';
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
    const [filasEliminadas, setFilasEliminadas] = useState(0);
    const [piezaGuardada, setPiezaGuardada] = useState(null);
    const [pieza, setPieza] = useState(generarPiezaAleatoria());

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
    
        while (nuevoTablero.length < filas) {
            nuevoTablero.unshift(new Array(columnas).fill(0));
        }
    
        return nuevoTablero;
    };

    const fijarPieza = (pieza) => {
        const nuevoTablero = [...tablero];

        // Añadir la pieza al tablero
        for (let i = 0; i < pieza.forma.length; i++) {
            for (let j = 0; j < pieza.forma[i].length; j++) {
                if (pieza.forma[i][j] === 1) {
                    nuevoTablero[pieza.posicion.y + i][pieza.posicion.x + j] = 1;
                }
            }
        }

        // Eliminar filas completas y actualizar el tablero
        const tableroConFilasEliminadas = eliminarFilasCompletas(nuevoTablero);
        setTablero(tableroConFilasEliminadas);

        // Marcar que la pieza está fijada y preparar la siguiente
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
        const intervalo = setInterval(() => moverPiezaAbajo(), 1000);
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
    }, [pieza, piezaGuardada]);

    return (
        <div className="app">
            <MarcadorPuntaje filasEliminadas={filasEliminadas} />
            <div className="contenedor-juego">
                <TableroJuego pieza={pieza} tablero={tablero} piezaGuardada={piezaGuardada} />
            </div>
            <Controles moverPieza={moverPieza} />
        </div>
    );
};

export default Inicio;