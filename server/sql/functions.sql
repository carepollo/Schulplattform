DELIMITER $$

CREATE PROCEDURE getAnswerElection(
	IN idVotacion int,
    IN idPersona int
)
BEGIN
	IF (select count(id) from preguntas_votacion WHERE encuesta = idVotacion) > (SELECT count(id) FROM preguntas_votacion as a LEFT JOIN dep_votaciones_personas as b ON a.id = b.opcion  WHERE a.encuesta = idVotacion AND (b.persona = idPersona OR b.persona IS null)) THEN 
		
        SELECT id, pregunta AS name FROM preguntas_votacion WHERE encuesta = idVotacion;
        
	ELSE
    
		SELECT * FROM preguntas_votacion as a LEFT JOIN dep_votaciones_personas AS b ON a.id = b.opcion  WHERE a.encuesta = idVotacion AND (b.persona = idPersona OR b.persona IS null);
        
    END IF;
    

	SELECT * FROM elections; 

END $$

DELIMITER $$

