ALTER SESSION SET CURRENT_SCHEMA=DTVLA;

DECLARE

counter NUMBER;
counter_ins NUMBER;
V_COUNT NUMBER;

{{ DECLARACIONES }}

BEGIN

{{ ACCIONES }}
	
	COMMIT;
		DBMS_OUTPUT.Put_line ('Termino OK');
	EXCEPTION
   WHEN OTHERS
   THEN
      DBMS_OUTPUT.Put_line ('No se realizo ningun Insert.Error: ' || SQLERRM);

END;
