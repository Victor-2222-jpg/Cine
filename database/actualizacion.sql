-- =============================================================
--  Actualización de datos (NO borra nada)
--  Pone los títulos oficiales en México, las duraciones reales
--  y sinopsis más completas a las 10 películas de ejemplo.
-- =============================================================
USE cine;

UPDATE Peliculas SET Titulo = 'Interestelar', Duracion = 169,
 Sinopsis = 'Con la Tierra al borde del colapso por sequías y tormentas de polvo, el expiloto Cooper acepta una última misión: atravesar un agujero de gusano junto a un equipo de científicos para encontrar un planeta habitable. Mientras el tiempo avanza de forma distinta en el espacio, deberá elegir entre volver con sus hijos o salvar a la humanidad.'
 WHERE Identificador = 1;

UPDATE Peliculas SET Titulo = 'El origen', Duracion = 148,
 Sinopsis = 'Dom Cobb es un experto en infiltrarse en los sueños para robar secretos del subconsciente. Un poderoso empresario le ofrece recuperar su vida a cambio de algo que parece imposible: implantar una idea en la mente de un heredero. Para lograrlo, Cobb y su equipo deberán descender por varios niveles de sueños donde nada es lo que parece.'
 WHERE Identificador = 2;

UPDATE Peliculas SET Titulo = 'El laberinto del fauno', Duracion = 112,
 Sinopsis = 'España, 1944. Ofelia llega con su madre enferma a un molino en el monte, donde su nuevo padrastro, un cruel capitán del ejército, persigue a la resistencia. Entre las ruinas de un antiguo laberinto, la niña conoce a un misterioso fauno que le revela que podría ser una princesa perdida, siempre que supere tres peligrosas pruebas.'
 WHERE Identificador = 3;

UPDATE Peliculas SET Titulo = 'La forma del agua', Duracion = 124,
 Sinopsis = 'En plena Guerra Fría, Elisa, una conserje muda de un laboratorio secreto del gobierno, descubre que ahí mantienen cautiva a una enigmática criatura anfibia. Poco a poco nace entre ambos un vínculo único, y Elisa arriesgará todo para liberarla antes de que los militares acaben con ella.'
 WHERE Identificador = 4;

UPDATE Peliculas SET Titulo = 'Roma', Duracion = 135,
 Sinopsis = 'Ciudad de México, principios de los años setenta. Cleo trabaja como empleada doméstica para una familia de clase media en la colonia Roma. Mientras el matrimonio de sus patrones se desmorona y el país vive tiempos convulsos, Cleo enfrenta su propia crisis personal en un retrato íntimo filmado en blanco y negro.'
 WHERE Identificador = 5;

UPDATE Peliculas SET Titulo = 'Gravedad', Duracion = 91,
 Sinopsis = 'La doctora Ryan Stone realiza su primera misión espacial junto al veterano astronauta Matt Kowalski. Una lluvia de escombros destruye su transbordador y los deja a la deriva, sin comunicación con la Tierra y con el oxígeno agotándose. Su única esperanza es alcanzar una estación espacial cercana.'
 WHERE Identificador = 6;

UPDATE Peliculas SET Titulo = 'Duna', Duracion = 155,
 Sinopsis = 'Paul Atreides, heredero de una casa noble, se traslada con su familia a Arrakis, un planeta desértico y hostil, única fuente de la especia, la sustancia más valiosa del universo. Cuando una traición destruye a su familia, Paul deberá sobrevivir en el desierto junto al pueblo Fremen y enfrentar el destino que lo persigue en sus visiones.'
 WHERE Identificador = 7;

UPDATE Peliculas SET Titulo = 'La llegada', Duracion = 116,
 Sinopsis = 'Doce naves extraterrestres aparecen en distintos puntos del planeta. El ejército recluta a la lingüista Louise Banks para descifrar el lenguaje de los visitantes y averiguar qué quieren antes de que el pánico desate una guerra mundial. Comprender su idioma cambiará para siempre su manera de percibir el tiempo.'
 WHERE Identificador = 8;

UPDATE Peliculas SET Titulo = 'Lady Bird', Duracion = 94,
 Sinopsis = 'Christine, quien insiste en que la llamen Lady Bird, cursa su último año de preparatoria en Sacramento y sueña con estudiar lejos de casa. Entre primeros amores, amistades que cambian y una relación tan intensa como complicada con su madre, descubrirá quién es realmente.'
 WHERE Identificador = 9;

UPDATE Peliculas SET Titulo = 'Birdman o (La inesperada virtud de la ignorancia)', Duracion = 120,
 Sinopsis = 'Riggan Thomson, un actor que fue famoso por interpretar a un superhéroe, intenta recuperar su prestigio montando una obra en Broadway. A días del estreno, entre un actor impredecible, una hija recién salida de rehabilitación y la voz de su antiguo personaje en la cabeza, Riggan lucha por demostrar que aún es relevante.'
 WHERE Identificador = 10;
