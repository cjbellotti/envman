ALTER SESSION SET CURRENT_SCHEMA=DTVLA;

DECLARE

counter_ins_tot NUMBER;
counter_upd_tot NUMBER;
counter_del_tot NUMBER;
counter_ins NUMBER;
counter_upd NUMBER;
counter_del NUMBER;
V_COUNT NUMBER;
DB_NAME VARCHAR(30);
AMBIENTE_INCORRECTO EXCEPTION;

{{ DECLARACIONES }}

BEGIN

	select sys_context('userenv', 'db_name') into DB_NAME from dual;

	if DB_NAME <> '{{ DB_NAME }}' then
		raise AMBIENTE_INCORRECTO;
	end if;

{{ ACCIONES }}

	if counter_ins_tot > 0 then
		DBMS_OUTPUT.Put_line ('Se insertaron: ' || TO_CHAR(counter_ins) || ' nuevos de los ' || TO_CHAR(counter_ins_tot) || ' registros.');
	end if;
	if counter_upd_tot > 0 then
		DBMS_OUTPUT.Put_line ('Se actualizaron: ' || TO_CHAR(counter_upd) || ' de los ' || TO_CHAR(counter_upd_tot) || ' a actualizar.');
	end if;
	if counter_del_tot > 0 then
		DBMS_OUTPUT.Put_line ('Se eliminaron: ' || TO_CHAR(counter_del) || ' de los ' || TO_CHAR(counter_del_tot) || ' a eliminar.');
	end if;

	if counter_ins = counter_ins_tot and counter_upd = counter_upd_tot and counter_del = counter_del_tot then
		DBMS_OUTPUT.Put_line ('Termino Ok.');
	end if;

EXCEPTION
	WHEN AMBIENTE_INCORRECTO THEN
		DBMS_OUTPUT.Put_line ('Este script solo puede ejecutarse en la base de datos {{ DB_NAME }}.');

   	WHEN OTHERS THEN
      	DBMS_OUTPUT.Put_line ('No se realizo ningun Insert.Error: ' || SQLERRM);
		ROLLBACK;

END;
