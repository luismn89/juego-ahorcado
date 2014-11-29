// variables globales usadas en la logica.
var hombre, resultado;

// Objeto principal para el desarrollo del juego y que contiene los datos del mismo.
var Ahorcado = function (contexto){
	// atributos o variables del objeto
	this.contexto = contexto;
	this.maximo = 5;
	this.intentos = 0;
	this.vivo = true;
	this.completo = false;

	this.fondo = new ImagenEstatica(0, 0, 'img/Desierto.png');
	this.fondo.imagen.img.onload = function (){
		confirmarImagen(hombre.fondo.imagen);
	};
	this.poste = new ImagenEstatica(130, 40, 'img/Poste.png');
	this.poste.imagen.img.onload = function (){
		confirmarImagen(hombre.poste.imagen);
	};
	this.cabeza = new ImagenEstatica(140, 80, 'img/Cabeza.png');
	this.cabeza.imagen.img.onload = function (){
		confirmarImagen(hombre.cabeza.imagen);
	};
	this.torso = new ImagenEstatica(157, 135, 'img/Torso.png');
	this.torso.imagen.img.onload = function (){
		confirmarImagen(hombre.torso.imagen);
	};
	this.brazos = new ImagenEstatica(147, 174, 'img/Brazos.png');
	this.brazos.imagen.img.onload = function (){
		confirmarImagen(hombre.brazos.imagen);
	};
	this.pies = new ImagenEstatica(161, 205, 'img/Pies.png');
	this.pies.imagen.img.onload = function (){
		confirmarImagen(hombre.pies.imagen);
	};
	this.cara = new ImagenEstatica(140, 80, 'img/Rostro.png');
	this.cara.imagen.img.onload = function (){
		confirmarImagen(hombre.cara.imagen);
	};

	// llamada a metodo dibujar para construir la parte inicial del juego (fondo y poste)
	this.dibujar();
};

// Metodos del objeto.
// Metodo dibujar que permite montar cada una de las imagenes iniciales del juego, las imagenes de acuerdo a los intentos
// fallidos del usuario y el resultado del juego.
Ahorcado.prototype.dibujar = function (){
	// variable que almacena el contexto del canvas
	var dibujo = this.contexto;

	// condicionales para dibujar las imagenes iniciales del juego (fondo y poste)
	if (this.fondo.imagen.imgOK){
		dibujo.drawImage(this.fondo.imagen.img, this.fondo.x, this.fondo.y);
	}
	if (this.poste.imagen.imgOK){
		dibujo.drawImage(this.poste.imagen.img, this.poste.x, this.poste.y);
	}

	// condicionales para dibujar cada parte del hombre ahorcado de acuerdo a los intentos errados.
	if (this.intentos > 0){
		if (this.cabeza.imagen.imgOK){
			dibujo.drawImage(this.cabeza.imagen.img, this.cabeza.x, this.cabeza.y);
		}

		if (this.intentos > 1){
			if (this.torso.imagen.imgOK){
				dibujo.drawImage(this.torso.imagen.img, this.torso.x, this.torso.y);
			}

			if (this.intentos > 2){
				if (this.brazos.imagen.imgOK){
					dibujo.drawImage(this.brazos.imagen.img, this.brazos.x, this.brazos.y);
				}

				if (this.intentos > 3){
					if (this.pies.imagen.imgOK){
						dibujo.drawImage(this.pies.imagen.img, this.pies.x, this.pies.y);
					}

					if (this.intentos > 4){
						if (this.cara.imagen.imgOK){
							dibujo.drawImage(this.cara.imagen.img, this.cara.x, this.cara.y);
						}

						if (!this.vivo){
							if (resultado.imagen.imgOK){
								dibujo.drawImage(resultado.imagen.img, resultado.x, resultado.y);
							}
						}
					}
				}
			}
		}
	}

	// condicion que mostrara la imagen del resultado del juego (si perdio o gano) si se cumple que el hombre aun vive y
	// si se ha completado la palabra buscada.
	if (this.vivo && this.completo) {
		if (resultado.imagen.imgOK){
			dibujo.drawImage(resultado.imagen.img, resultado.x, resultado.y);
		}
	}
};

// Metodo trazar que permite controlar los intentos del usuario para resolver el juego
Ahorcado.prototype.trazar = function (){
	this.intentos++;

	// Solo si el numero de intentos pasa el maximo permitido, entonces el hombre pasa false y se define el resultado a mostrar.
	if (this.intentos >= this.maximo){
		this.vivo = false;
		resultado = new ImagenEstatica(130, 440, 'img/Lose.png');
		resultado.imagen.img.onload = function(){
			confirmarImagen(resultado.imagen);
		};
	}

	// Se redibuja o refresca el canvas.
	this.dibujar();
};

// Objeto secundario definido para controlar los datos de las imagenes a usar dentro del canvas.
var ImagenEstatica = function (x, y, url){
	// atributos o variables del objeto. Se maneja las coordenadas y el objeto de imagen a usar.
	this.x = x;
	this.y = y;
	this.imagen = new Imagen(url);
};

// Objeto definido para manejar los datos internos de cada imagen a usar.
var Imagen = function (url){
	// variables del objeto. Se usa una variable boolena para verficar si la imagen se ha cargado y se usa un objeto interno
	// de js Image() para las imagenes, definiendo inicialmente la url de la imagen.
	this.imgOK = false;
	this.img = new Image();
	this.img.src = url;
};

// Funcion definida para el arranque del juego.
function iniciar(){
	// Se obtienen los elementos del html junto con el contexto del canvas.
	var boton = document.getElementById('boton');
	var lienzo = document.getElementById('lienzo');
	var contexto = lienzo.getContext("2d");

	// Se definen las dimensiones del canvas
	lienzo.width = 500;
	lienzo.height = 500;

	// Se busca una palabra al azar desde el metodo seleccionarPalabra y se almacena en palabra.
	var palabra = seleccionarPalabra();

	// Se transforma la palabra obtenida en mayuscula.
	palabra = palabra.toUpperCase();

	// Se define un objeto Array con un tamaño igual al de la palabra seleccionada para controlar las letras encontradas.
	var espacio = new Array(palabra.length);

	// Se crea una instancia de la clase Ahorcado para el manejo del juego.
	hombre = new Ahorcado(contexto);

	// Se llama al metodo mostrarPista para conocer la cantidad de letras que lleva la palabra seleccionada.
	mostrarPista(espacio);

	// Se le asigna el evento click al boton 'boom' y se llama a la funcion agregarLetra para verificar si la letra jugada
	// es la correcta y decidir que accion tomar.
	boton.addEventListener('click', function(){
		agregarLetra(palabra, espacio);
	});
}

// Funcion definida para cambiar el status de una imagen una vez cargada en el canvas y luego refrescar el canvas.
// Recibe como parametro la imagen a modificar.
function confirmarImagen(imagen){
	imagen.imgOK = true;
	hombre.dibujar();
}

// Funcion definida para la eleccion de una palabra de forma aleatoria para el juego y retornar dicha palabra.
function seleccionarPalabra(){
	var palabras = ["diccionario", "programacion", "estructura", "condicion", "funciones", "diseño", "canvas", "ciclos", "objeto", "clase"];
	var pos = Math.round(Math.random() * palabras.length - 1);
	return palabras[pos];
}

// Funcion definida para mostrar las guias o pistas de la palabra elegida para el juego e ir rellenando las letras halladas.
// Recibe como parametro el array espacio que controla las letras encontradas y los espacios que quedan.
function mostrarPista(espacio){
	var pista = document.getElementById('pista');
	var texto = '';

	for (var i = 0; i < espacio.length; i++) {
		if (espacio[i] !== undefined){
			texto += espacio[i] + ' ';
		} else {
			texto += '_ ';
		}
	}

	pista.innerText = texto;
}

// Funcion definida para capturar la letra insertada en la caja de texto, limpiar la caja, llamar al metodo mostrarPalabra y
// devolver el foco a la caja de texto.
// Recibe como parametro la palabra seleccionada y el arreglo con los espacios..
function agregarLetra(palabra, espacio){
	var l = document.getElementById('letra');
	var letra = l.value;
	l.value = '';
	mostrarPalabra(palabra, letra, espacio);
	l.focus();
}

// Funcion definida para verificar si la letra ingresada se encuentra dentro de la palabra elegida y dibujar una parte del
// hombre en caso de ser erronea, mostrar la palabra en caso de consumir todos los intentos o verificar si la palabra ha
// completada.
// Recibe como parametros la palabra elegida, la letra insertada y el array con los espacios faltantes.
function mostrarPalabra(palabra, letra, espacio){
	var encontrado = false;
	var p;
	var btn_refresh = document.getElementById('refresh');

	// transforma la letra insertada en mayuscula para evitar conflictos a la hora de comparar.
	letra = letra.toUpperCase();

	// recorre la palabra elegida verificando si la letra insertada coincide con alguna de ellas y cambiando a true la variable encontrado.
	for (p in palabra){
		if (letra == palabra[p]){
			espacio[p] = letra;
			encontrado = true;
		}
	}

	// llama al metodo mostrarPista para actualizar la guia de las letras halladas.
	mostrarPista(espacio);

	// si la letra insertada no se encuentra en la palabra, entonces se dibujara una de las partes del hombre.
	if (!encontrado){
		hombre.trazar();
	}

	// si el jugador a perdido (hombre es false) se deshabilita la caja de texto, se muestra el boton de reinicio de juego
	// y se le asigna el evento reiniciarJuego, se carga en el arreglo espacio la palabra buscada y se muestr en la pista.
	if (!hombre.vivo){
		var l = document.getElementById('letra');
		l.disabled = true;
		btn_refresh.style.display = 'inline';
		btn_refresh.addEventListener('click', reiniciarJuego);
		for (p in palabra){
			espacio[p] = palabra[p];
		}
		mostrarPista(espacio);
	}

	// Si las condiciones anteriores no se cumplen, se recorre el arreglo espacio y se verifica por cada casilla si hay un espacio
	// vacio (undefined) y se maneja una bandera (variable booleana) para identificarlo cambiandolo a true, luego si nos encontramos
	// en la ultima casilla y no hay ningun espacio quiere decir que se encontro la palabra completa antes de terminar el hombre, por
	// lo tanto se define hombre.completo como true para indicar el fin del juego.
	for (var aux = false, i = 0; i < espacio.length; i++){
		if (espacio[i] === undefined){
			aux = true;
		} else if (i == espacio.length - 1 && !aux){
			hombre.completo = true;
		}
	}

	// Si hombre.completo es true (juego terminado) se crea una imagen con el resultado del juego, se dibuja y se muestra el boton
	// de reinicio del juego
	if (hombre.completo){
		resultado = new ImagenEstatica(130, 440, 'img/Win.png');
		resultado.imagen.img.onload = function (){
			confirmarImagen(resultado.imagen);
		};
		btn_refresh.style.display = 'inline';
		btn_refresh.addEventListener('click', reiniciarJuego);
	}

}

// Funcion definida para el reinicio del juego una vez terminado. Esto se logra usando el objeto location de js y llamando al
// metodo reload() para recargar el site (funcion que se ejecuta al pulsar F5).
function reiniciarJuego(){
	location.reload();
}