import React, { useEffect } from 'react';

const Controles = ({ moverPieza }) => {

    const manejarTeclado = (event) => {
        if (event.key === 'ArrowDown') {
            moverPieza('abajo');
        } else if (event.key === 'ArrowLeft') {
            moverPieza('izquierda');
        } else if (event.key === 'ArrowRight') {
            moverPieza('derecha');
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', manejarTeclado);
        return () => {
            window.removeEventListener('keydown', manejarTeclado);
        };
    }, [moverPieza]);

    return (
        <div className="controles">
            
        </div>
    );
};

export default Controles;
