	{{ ADD('valorcanonico' + VALORES.ID + ' DTVLA.DVM_VALOR_CANONICO.ID%type;', 'DECLARACIONES') }}
	select count(1) into V_COUNT from DTVLA.DVM_VALOR_CANONICO where ID_ENTIDAD_CANONICA = {% if EXIST(DECLARACIONES, 'entidad' + VALORES.ID_ENTIDAD_CANONICA) %} entidad{{ VALORES.ID_ENTIDAD_CANONICA}} {% else %} {{ VALORES.ID_ENTIDAD_CANONICA }} {% endif %} and VALOR_CANONICO = {{ VALORES.VALOR_CANONICO }};
	counter_ins_tot:=counter_ins_tot+1;
	if V_COUNT = 0 then
		select nvl(max(id),0)+1 into valorcanonico{{ VALORES.ID }} from DTVLA.DVM_VALOR_CANONICO;
		insert into {{ TABLA }} (ID, ID_ENTIDAD_CANONICA, VALOR_CANONICO, DESCRIPCION) values (valorcanonico{{ VALORES.ID }}, 
																							{% if EXIST(DECLARACIONES, 'entidad' + VALORES.ID_ENTIDAD_CANONICA) %} entidad{{ VALORES.ID_ENTIDAD_CANONICA}} {% else %} {{ VALORES.ID_ENTIDAD_CANONICA }} {% endif %},
																							{{ VALORES.VALOR_CANONICO }},
																							{{ VALORES.DESCRIPCION }});
		counter_ins:=counter_ins+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' se inserto OK' );
	else
		select ID into valorcanonico{{ VALORES.ID }} from DTVLA.DVM_VALOR_CANONICO where ID_ENTIDAD_CANONICA = {% if EXIST(DECLARACIONES, 'entidad' + VALORES.ID_ENTIDAD_CANONICA) %} entidad{{ VALORES.ID_ENTIDAD_CANONICA}} {% else %} {{ VALORES.ID_ENTIDAD_CANONICA }} {% endif %} and VALOR_CANONICO = {{ VALORES.VALOR_CANONICO }};
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' ya existe' );
	end if;			
