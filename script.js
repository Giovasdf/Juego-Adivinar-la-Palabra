$(document).ready(function() {
    const RANDOM_WORD_API_URL = 'https://clientes.api.greenborn.com.ar/public-random-word';

    let palabraAdivinar = '';
    let palabraMostrada = '';
    let vidasRestantes = 6;
    let letrasAdivinadas = [];

    $('#obtenerPalabraBtn').click(function() {
        obtenerPalabra();
    });

    $('#adivinarBtn').click(function() {
        const entradaAdivinanza = $('#entradaAdivinanza').val().trim().toUpperCase();

        if (entradaAdivinanza === '' || entradaAdivinanza.length !== 1) {
            alert('Por favor, introduce una sola letra.');
            return;
        }

        $('#entradaAdivinanza').val(''); // Limpiar el campo de entrada

        adivinarLetra(entradaAdivinanza);
    });

    function adivinarLetra(entradaAdivinanza) {
        if (letrasAdivinadas.includes(entradaAdivinanza)) {
            alert('Ya adivinaste esa letra.');
            return;
        }

        letrasAdivinadas.push(entradaAdivinanza);

        if (palabraAdivinar.includes(entradaAdivinanza)) {
            let nuevaPalabraMostrada = '';
            for (let i = 0; i < palabraAdivinar.length; i++) {
                nuevaPalabraMostrada += letrasAdivinadas.includes(palabraAdivinar[i]) ? palabraAdivinar[i] : '_';
            }
            palabraMostrada = nuevaPalabraMostrada;

            if (!palabraMostrada.includes('_')) {
                $('#mensaje').text('¡Ganaste!');
                $('#entradaAdivinanza').prop('disabled', true);
                $('#adivinarBtn').prop('disabled', true);
                return;
            }
        } else {
            vidasRestantes--;
            if (vidasRestantes <= 0) {
                $('#mensaje').text(`Perdiste. La palabra era: ${palabraAdivinar}`);
                $('#entradaAdivinanza').prop('disabled', true);
                $('#adivinarBtn').prop('disabled', true);
                return;
            }
        }

        actualizarPantalla();
    }

    function obtenerPalabra() {
        $.ajax({
            url: RANDOM_WORD_API_URL,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                const palabraEnEspañol = data[0].toUpperCase();
                palabraAdivinar = palabraEnEspañol;
                palabraMostrada = palabraAdivinar.replace(/./g, '_');
                vidasRestantes = 6;
                letrasAdivinadas = [];

                $('#configuracion').hide();
                $('#juego').show();
                actualizarPantalla();
            },
            error: function() {
                alert('Error al obtener la palabra. Intenta de nuevo.');
            }
        });
    }

    function actualizarPantalla() {
        // Añadimos espacios entre las letras para mejorar la visibilidad
        const palabraMostradaConEspacios = palabraMostrada.split('').join(' ');
        $('#palabraOculta').text(palabraMostradaConEspacios);
        $('#mensaje').text(`Vidas restantes: ${vidasRestantes}`);
        $('#letrasUsadas').text(`Letras usadas: ${letrasAdivinadas.join(', ')}`);
    }
});
