	select count(1) into V_COUNT from {{ TABLA }} where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo] }} {% if !loop.last %} and {% endif %}{% endfor %};
	counter_upd_tot:=counter_upd_tot+1;
	if V_COUNT > 0 then
		update {{ TABLA }} set ({% for campo in CAMPOS %}{% if campo != 'ID' %}{{ campo }} = {{ VALORES[campo]}}{% if !loop.last %}, {% endif %}{% endif %}{% endfor %}) where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo]}}{% if !loop.last %} and {% endif %}{% endfor %};
		counter_upd:=counter_upd+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_upd_tot) || ' actualizado OK' );
	else
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_upd_tot) || ' inexistente.' );
	end if;



