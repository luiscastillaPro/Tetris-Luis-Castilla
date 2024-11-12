import React, { useEffect } from 'react';

const Controles = ({ moverPieza }) => {
    // Función para manejar el teclado
    const manejarTeclado = (event) => {
        if (event.key === 'ArrowDown') {
            moverPieza('abajo');
        } else if (event.key === 'ArrowLeft') {
            moverPieza('izquierda');
        } else if (event.key === 'ArrowRight') {
            moverPieza('derecha');
        }
    };

    // Añadir event listener para las teclas cuando el componente se monta
    useEffect(() => {
        window.addEventListener('keydown', manejarTeclado);

        // Limpiar el event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('keydown', manejarTeclado);
        };
    }, [moverPieza]);

    return (
        <div className="controles">
            <p>Usa las teclas de flecha para mover la pieza:</p>
            <ul>
                <li>Flecha abajo: Mover pieza hacia abajo</li>
                <li>Flecha izquierda: Mover pieza a la izquierda</li>
                <li>Flecha derecha: Mover pieza a la derecha</li>
            </ul>
        </div>
    );
};

export default Controles;
