-- =============================================================
--  Base de datos CineAPP
--  Tablas: Peliculas, Directores, Categorias
--  ATENCIÓN: este script BORRA y vuelve a crear la base "cine".
--  Si ya la tienes creada y solo quieres actualizar títulos y
--  sinopsis, usa database/actualizacion.sql
-- =============================================================
DROP DATABASE IF EXISTS cine;
CREATE DATABASE cine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cine;

CREATE TABLE Directores (
  IDDirector INT AUTO_INCREMENT PRIMARY KEY,
  Director   VARCHAR(100) NOT NULL
);

CREATE TABLE Categorias (
  Identificador INT AUTO_INCREMENT PRIMARY KEY,
  Categoria     VARCHAR(60) NOT NULL
);

CREATE TABLE Peliculas (
  Identificador INT AUTO_INCREMENT PRIMARY KEY,
  Titulo        VARCHAR(150) NOT NULL,
  IDDirector    INT NOT NULL,
  Duracion      INT NOT NULL COMMENT 'Minutos',
  IDCategoria   INT NOT NULL,
  Sinopsis      TEXT,
  CONSTRAINT fk_pelicula_director  FOREIGN KEY (IDDirector)  REFERENCES Directores(IDDirector),
  CONSTRAINT fk_pelicula_categoria FOREIGN KEY (IDCategoria) REFERENCES Categorias(Identificador)
);

INSERT INTO Directores (Director) VALUES
('Christopher Nolan'),      -- 1
('Guillermo del Toro'),     -- 2
('Alfonso Cuarón'),         -- 3
('Denis Villeneuve'),       -- 4
('Greta Gerwig'),           -- 5
('Alejandro G. Iñárritu');  -- 6

INSERT INTO Categorias (Categoria) VALUES
('Ciencia ficción'),  -- 1
('Fantasía'),         -- 2
('Drama'),            -- 3
('Comedia'),          -- 4
('Suspenso');         -- 5

-- El Identificador de cada película coincide con sus imágenes en api/public (posters/1.jpg, fondos/1.jpg, ...)
INSERT INTO Peliculas (Titulo, IDDirector, Duracion, IDCategoria, Sinopsis) VALUES
('Interestelar', 1, 169, 1,
 'Con la Tierra al borde del colapso por sequías y tormentas de polvo, el expiloto Cooper acepta una última misión: atravesar un agujero de gusano junto a un equipo de científicos para encontrar un planeta habitable. Mientras el tiempo avanza de forma distinta en el espacio, deberá elegir entre volver con sus hijos o salvar a la humanidad.'),
('El origen', 1, 148, 5,
 'Dom Cobb es un experto en infiltrarse en los sueños para robar secretos del subconsciente. Un poderoso empresario le ofrece recuperar su vida a cambio de algo que parece imposible: implantar una idea en la mente de un heredero. Para lograrlo, Cobb y su equipo deberán descender por varios niveles de sueños donde nada es lo que parece.'),
('El laberinto del fauno', 2, 112, 2,
 'España, 1944. Ofelia llega con su madre enferma a un molino en el monte, donde su nuevo padrastro, un cruel capitán del ejército, persigue a la resistencia. Entre las ruinas de un antiguo laberinto, la niña conoce a un misterioso fauno que le revela que podría ser una princesa perdida, siempre que supere tres peligrosas pruebas.'),
('La forma del agua', 2, 124, 2,
 'En plena Guerra Fría, Elisa, una conserje muda de un laboratorio secreto del gobierno, descubre que ahí mantienen cautiva a una enigmática criatura anfibia. Poco a poco nace entre ambos un vínculo único, y Elisa arriesgará todo para liberarla antes de que los militares acaben con ella.'),
('Roma', 3, 135, 3,
 'Ciudad de México, principios de los años setenta. Cleo trabaja como empleada doméstica para una familia de clase media en la colonia Roma. Mientras el matrimonio de sus patrones se desmorona y el país vive tiempos convulsos, Cleo enfrenta su propia crisis personal en un retrato íntimo filmado en blanco y negro.'),
('Gravedad', 3, 91, 1,
 'La doctora Ryan Stone realiza su primera misión espacial junto al veterano astronauta Matt Kowalski. Una lluvia de escombros destruye su transbordador y los deja a la deriva, sin comunicación con la Tierra y con el oxígeno agotándose. Su única esperanza es alcanzar una estación espacial cercana.'),
('Duna', 4, 155, 1,
 'Paul Atreides, heredero de una casa noble, se traslada con su familia a Arrakis, un planeta desértico y hostil, única fuente de la especia, la sustancia más valiosa del universo. Cuando una traición destruye a su familia, Paul deberá sobrevivir en el desierto junto al pueblo Fremen y enfrentar el destino que lo persigue en sus visiones.'),
('La llegada', 4, 116, 1,
 'Doce naves extraterrestres aparecen en distintos puntos del planeta. El ejército recluta a la lingüista Louise Banks para descifrar el lenguaje de los visitantes y averiguar qué quieren antes de que el pánico desate una guerra mundial. Comprender su idioma cambiará para siempre su manera de percibir el tiempo.'),
('Lady Bird', 5, 94, 4,
 'Christine, quien insiste en que la llamen Lady Bird, cursa su último año de preparatoria en Sacramento y sueña con estudiar lejos de casa. Entre primeros amores, amistades que cambian y una relación tan intensa como complicada con su madre, descubrirá quién es realmente.'),
('Birdman o (La inesperada virtud de la ignorancia)', 6, 120, 4,
 'Riggan Thomson, un actor que fue famoso por interpretar a un superhéroe, intenta recuperar su prestigio montando una obra en Broadway. A días del estreno, entre un actor impredecible, una hija recién salida de rehabilitación y la voz de su antiguo personaje en la cabeza, Riggan lucha por demostrar que aún es relevante.');
