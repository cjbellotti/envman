	select count(1) into V_COUNT from DVM_SISTEMA where NOMBRE = {{ ORIGEN.NOMBRE }} and PAIS = {{ ORIGEN.PAIS }};
	counter_upd_tot:=counter_upd_tot+1;
	if V_COUNT > 0 then
		update DVM_SISTEMA set (NOMBRE = {{ VALORES.NOMBRE }}, DESCRIPCION = {{ VALORES.DESCRIPCION }}, PAIS = {{ VALORES.PAIS }}) where NOMBRE = {{ ORIGEN.NOMBRE }};
		counter_upd:=counter_upd+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_upd_tot) || ' actualizado OK' );
	else
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_upd_tot) || ' inexistente.' );
	end if;		

