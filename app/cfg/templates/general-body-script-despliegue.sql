ALTER SESSION SET CURRENT_SCHEMA=DTVLA;

DECLARE

counter_ins_tot NUMBER;
counter_upd_tot NUMBER;
counter_ins NUMBER;
counter_upd NUMBER;
V_COUNT NUMBER;

{{ DECLARACIONES }}

BEGIN

{{ ACCIONES }}

	DBMS_OUTPUT.Put_line ('Termino Ok.');
	DBMS_OUTPUT.Put_line ('Se insertaron: ' || TO_CHAR(counter_ins) || ' nuevos de los ' || TO_CHAR(counter_ins_tot) || ' registros.');
	DBMS_OUTPUT.Put_line ('Se actualizaron: ' || TO_CHAR(counter_upd) || ' de los ' || TO_CHAR(counter_upd_tot) || ' a actualizar.');


	EXCEPTION
   WHEN OTHERS
   THEN
      DBMS_OUTPUT.Put_line ('No se realizo ningun Insert.Error: ' || SQLERRM);

END;
