	select count(1) into V_COUNT from DTVLA.DVM_VALOR_CANONICO where VALOR_CANONICO == {{ VALORES.VALOR_CANONICO }} and ID_ENTIDAD_CANONICA in (select id from DTVLA.DVM_ENTIDAD_CANONICA where NOMBRE = '{{ GET_DATA('DVM_ENTIDAD_CANONICA', 'NOMBRE', VALORES.ID_ENTIDAD_CANONICA) }}');
	counter_del_tot:=counter_del_tot+1;
	if V_COUNT > 0 then
		delete from DTVLA.DVM_VALOR_CANONICO where VALOR_CANONICO = {{ VALORES.VALOR_CANONICO }} and ID_ENTIDAD_CANONICA = {{ VALORES.ID_ENTIDAD_CANONICA }};
		counter_del:=counter_del+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_del_tot) || ' se eliminó OK' );
	else
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_del_tot) || ' no existe.' );
	end if;
