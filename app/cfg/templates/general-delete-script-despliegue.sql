	select count(1) into V_COUNT from {{ TABLA }} where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo] }} {% if !loop.last %} and {% endif %}{% endfor %};
	counter_del_tot:=counter_del_tot+1;
	if V_COUNT > 0 then
		delete from {{ TABLA }} where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo] }} {% if !loop.last %} and {% endif %}{% endfor %};
		counter_del:=counter_del+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_del_tot) || ' se eliminó OK' );
	else
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_del_tot) || ' no existe.' );
	end if;
