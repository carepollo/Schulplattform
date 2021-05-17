CREATE DATABASE schoolsystem;
USE schoolsystem;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NULL DEFAULT 'Estudiante',
    foto VARCHAR(50) NULL DEFAULT ''
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE personas (
    id_persona INT PRIMARY KEY,
    t_documento VARCHAR(50) NOT NULL,
    nombres_persona VARCHAR(50) NOT NULL,
    apellidos_persona VARCHAR(50) NOT NULL,
    departamento_expedicion INT(10) DEFAULT 1,
    ciudad_expedicion INT(10) DEFAULT 1101,
    rh VARCHAR(50) DEFAULT '',
    salud VARCHAR(50) DEFAULT '',
    escalafon VARCHAR(50) DEFAULT '',
    nivel_estudio VARCHAR(50) DEFAULT '',
    departamento_residencia INT(10) DEFAULT 1,
    ciudad_residencia INT(10) DEFAULT 1101,
    direccion VARCHAR(50) DEFAULT '',
    celular VARCHAR(50) DEFAULT '',
    correo VARCHAR(50) DEFAULT '',
    sede VARCHAR(50) DEFAULT '',
    jornada VARCHAR(50) DEFAULT '',
    asig_usuario INT NULL,
    CONSTRAINT asig_usuario FOREIGN KEY (asig_usuario)
        REFERENCES usuarios (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE grados (
    nombre VARCHAR(50) NOT NULL UNIQUE,
    INDEX (nombre)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE asignaturas (
    nombre VARCHAR(50) NOT NULL UNIQUE,
    INDEX (nombre)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE periodos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_periodo INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL
)ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE logros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grado_logro VARCHAR(50) NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE notas (
    id_nota INT PRIMARY KEY AUTO_INCREMENT,
    nota_p1 INT NULL,
    nota_p2 INT NULL,
    nota_p3 INT NULL,
    nota_p4 INT NULL,
    nota_final INT NULL,
    periodo_corresponde INT NOT NULL,
    materia_corresponde VARCHAR(50) NOT NULL,
    estudiante_corresponde INT NOT NULL,
    CONSTRAINT periodo_corresponde FOREIGN KEY (periodo_corresponde)
        REFERENCES periodos (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT estudiante_corresponde FOREIGN KEY (estudiante_corresponde)
        REFERENCES personas (id_persona) ON UPDATE CASCADE ON DELETE CASCADE ,
    CONSTRAINT materia_corresponde FOREIGN KEY (materia_corresponde)
        REFERENCES asignaturas (nombre) ON UPDATE CASCADE ON DELETE CASCADE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE grupos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grado VARCHAR(50) NOT NULL,
    nomeclatura_grupo VARCHAR(50),
    jornada VARCHAR(50) NOT NULL,
    sede VARCHAR(50) NOT NULL,
    CONSTRAINT grado FOREIGN KEY (grado)
        REFERENCES grados (nombre) ON UPDATE CASCADE ON DELETE CASCADE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE observaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    autor VARCHAR(50) NOT NULL,
    sujeto_destinatario INT NOT NULL,
    CONSTRAINT sujeto_destinatario FOREIGN KEY (sujeto_destinatario)
        REFERENCES personas (id_persona) ON UPDATE CASCADE ON DELETE CASCADE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

CREATE TABLE dep_grados_materia (
    grado_corresponde VARCHAR(50) NOT NULL,
    materia_grado VARCHAR(50) NOT NULL,
    CONSTRAINT grado_corresponde FOREIGN KEY (grado_corresponde)
        REFERENCES grados (nombre)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT materia_grado FOREIGN KEY (materia_grado)
        REFERENCES asignaturas (nombre)
        ON DELETE CASCADE ON UPDATE CASCADE
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

ALTER TABLE personas ADD COLUMN grupo_corresponde int null;
ALTER TABLE personas ADD CONSTRAINT grupo_corresponde FOREIGN KEY (grupo_corresponde) REFERENCES grupos(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE grupos ADD COLUMN periodo_cursado int null;
ALTER TABLE grupos ADD CONSTRAINT periodo_cursado FOREIGN KEY (periodo_cursado) REFERENCES periodos(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE logros ADD COLUMN materia varchar(50) not null;
ALTER TABLE logros ADD CONSTRAINT materia FOREIGN KEY (materia) REFERENCES asignaturas(nombre) ON UPDATE CASCADE ON DELETE CASCADE;

/*inserciones de inicialización*/

INSERT INTO usuarios (nombre_usuario, clave, tipo) VALUES ("admin", "miclave", "Docente");
INSERT INTO personas (id_persona, t_documento, nombres_persona, apellidos_persona, asig_usuario) VALUES (123456789, "C.C.", "un nombre", "un apellido", 1);

INSERT INTO grados VALUES
("Preescolar"),
("Primero"),
("Segundo"),
("Tercero"),
("Cuarto"),
("Quinto"),
("Sexto"),
("Séptimo"),
("Octavo"),
("Noveno"),
("Décimo"),
("Once"),
("Ciclo 1"),
("Ciclo 2"),
("Ciclo 3"),
("Ciclo 4"),
("Ciclo 5"),
("Ciclo 6");

INSERT INTO asignaturas VALUES
("Ciencias Naturales"),
("Ciencias Sociales"),
("Matemáticas"),
("Geometría"),
("Lengua Castellana"),
("Inglés"),
("Artística"),
("Ética y Valores"),
("Religión"),
("Educación Física"),
("Tecnología"),
("Comportamiento");

INSERT INTO periodos (numero_periodo, fecha_inicio, fecha_fin) VALUES
(1, '2021-01-01', '2021-03-01'),
(2, '2021-03-01', '2021-06-01'),
(3, '2021-06-01', '2021-09-01'),
(4, '2021-09-01', '2021-12-31');


INSERT INTO dep_grados_materia (grado_corresponde, materia_grado) VALUES
("Primero", "Ciencias Naturales"),
("Primero", "Ciencias Sociales"),
("Primero", "Matemáticas"),
("Primero", "Geometría"),
("Primero", "Lengua Castellana"),
("Primero", "Inglés"),
("Primero", "Artística"),
("Primero", "Ética y Valores"),
("Primero", "Religión"),
("Primero", "Educación Física"),
("Primero", "Tecnología"),
("Primero", "Comportamiento"),
("Segundo", "Ciencias Naturales"),
("Segundo", "Ciencias Sociales"),
("Segundo", "Matemáticas"),
("Segundo", "Geometría"),
("Segundo", "Lengua Castellana"),
("Segundo", "Inglés"),
("Segundo", "Artística"),
("Segundo", "Ética y Valores"),
("Segundo", "Religión"),
("Segundo", "Educación Física"),
("Segundo", "Tecnología"),
("Segundo", "Comportamiento"),
("Tercero", "Ciencias Naturales"),
("Tercero", "Ciencias Sociales"),
("Tercero", "Matemáticas"),
("Tercero", "Geometría"),
("Tercero", "Lengua Castellana"),
("Tercero", "Inglés"),
("Tercero", "Artística"),
("Tercero", "Ética y Valores"),
("Tercero", "Religión"),
("Tercero", "Educación Física"),
("Tercero", "Tecnología"),
("Tercero", "Comportamiento"),
("Cuarto", "Ciencias Naturales"),
("Cuarto", "Ciencias Sociales"),
("Cuarto", "Matemáticas"),
("Cuarto", "Geometría"),
("Cuarto", "Lengua Castellana"),
("Cuarto", "Inglés"),
("Cuarto", "Artística"),
("Cuarto", "Ética y Valores"),
("Cuarto", "Religión"),
("Cuarto", "Educación Física"),
("Cuarto", "Tecnología"),
("Cuarto", "Comportamiento"),
("Quinto", "Ciencias Naturales"),
("Quinto", "Ciencias Sociales"),
("Quinto", "Matemáticas"),
("Quinto", "Geometría"),
("Quinto", "Lengua Castellana"),
("Quinto", "Inglés"),
("Quinto", "Artística"),
("Quinto", "Ética y Valores"),
("Quinto", "Religión"),
("Quinto", "Educación Física"),
("Quinto", "Tecnología"),
("Quinto", "Comportamiento");

