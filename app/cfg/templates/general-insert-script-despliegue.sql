	select count(1) in V_COUNT from {{ TABLA }} where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo] }} {% if !loop.last %} and {% endif %}{% endfor %};
	counter_ins_tot:=counter_ins_tot+1;
	if V_COUNT = 0 then
		insert into {{ TABLA }} ( {% for campo in CAMPOS %} {{ campo }} {% if !loop.last %}, {% endif %}{% endfor %}) values  ({% for campo in CAMPOS %} {{ VALORES[campo] }}{% if !loop.last %}, {% endif %}{% endfor %});
		counter_ins:=counter_ins+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' se inserto OK' );
	else
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' ya existe' );
	end if;


