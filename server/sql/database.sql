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

CREATE TABLE boletin (
    id int PRIMARY KEY AUTO_INCREMENT,
    sede VARCHAR(50) NOT NULL,
    jornada VARCHAR(50) NOT NULL,
    grado VARCHAR(50) NOT NULL,
    periodo YEAR NOT NULL,
    identificacion int NOT NULL,
    estudiante_pertenece int NOT NULL,
    aprobacion boolean not null
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

create table encuestas (
	id int primary key auto_increment,
    titulo varchar(45)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

create table dep_preguntas_encuestas(
	id int primary key auto_increment,
    encuesta int,
    pregunta varchar(45),
    foreign key (encuesta) references encuestas (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

create table dep_respuestas_preguntas(
	id int primary key auto_increment,
    encuesta int,
    pregunta int,
    respuesta varchar(255),
    foreign key (encuesta) references encuestas,
    foreign key (pregunta) references dep_preguntas_encuestas
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

