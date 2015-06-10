	select count(1) into V_COUNT from {{ TABLA }} where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo] }} {% if !loop.last %} and {% endif %}{% endfor %};
	if V_COUNT > 0 then
		delete from {{ TABLA }} where {% for campo in CLAVES %} {{ campo }} = {{ VALORES[campo] }} {% if !loop.last %} and {% endif %}{% endfor %};
	end if;
