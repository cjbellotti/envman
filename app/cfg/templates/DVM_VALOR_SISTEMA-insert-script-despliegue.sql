	{{ ADD('valorsistema' + VALORES.ID + ' DTVLA.DVM_VALOR_SISTEMA.ID%type;', 'DECLARACIONES') }}
	select ID into V_COUNT from DTVLA.DVM_VALOR_SISTEMA where ID_SISTEMA = {% if EXIST(DECLARACIONES, 'sistema' + VALORES.ID_SISTEMA) %} sistema{{ VALORES.ID_SISTEMA}} {% else %} {{ VALORES.ID_SISTEMA }} {% endif %} and ID_ENTIDAD_CANONICA = {% if EXIST(DECLARACIONES, 'entidad' + VALORES.ID_ENTIDAD_CANONICA) %} entidad{{ VALORES.ID_ENTIDAD_CANONICA}} {% else %} {{ VALORES.ID_ENTIDAD_CANONICA }} {% endif %} and ID_VALOR_CANONICO = {% if EXIST(DECLARACIONES, 'valorcanonico' + VALORES.ID_VALOR_CANONICO) %} valorcanonico{{ VALORES.ID_VALOR_CANONICO}} {% else %} {{ VALORES.ID_VALOR_CANONICO }} {% endif %} ;
	counter_ins_tot:=counter_ins_tot+1;
	if V_COUNT = 0 then
		select nvl(max(id),0)+1 into valorsistema{{ VALORES.ID }} from DTVLA.DVM_VALOR_SISTEMA;
		insert into DTVLA.DVM_VALOR_SISTEMA (ID, ID_SISTEMA, ID_ENTIDAD_CANONICA, ID_VALOR_CANONICO, VALOR_SISTEMA)
			values (valorsistema{{ VALORES.ID }},
					{% if EXIST(DECLARACIONES, 'sistema' + VALORES.ID_SISTEMA) %} sistema{{ VALORES.ID_SISTEMA}} {% else %} {{ VALORES.ID_SISTEMA }} {% endif %},
					{% if EXIST(DECLARACIONES, 'entidad' + VALORES.ID_ENTIDAD_CANONICA) %} entidad{{ VALORES.ID_ENTIDAD_CANONICA}} {% else %} {{ VALORES.ID_ENTIDAD_CANONICA }} {% endif %},
					{% if EXIST(DECLARACIONES, 'valorcanonico' + VALORES.ID_VALOR_CANONICO) %} valorcanonico{{ VALORES.ID_VALOR_CANONICO}} {% else %} {{ VALORES.ID_VALOR_CANONICO }} {% endif %},
					{{ VALORES.VALOR_SISTEMA }});
		counter_ins:=counter_ins+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' se inserto OK' );	
	else
		select ID into valorsistema{{ VALORES.ID }} from DTVLA.DVM_VALOR_SISTEMA where ID_SISTEMA = {% if EXIST(DECLARACIONES, 'sistema' + VALORES.ID_SISTEMA) %} sistema{{ VALORES.ID_SISTEMA}} {% else %} {{ VALORES.ID_SISTEMA }} {% endif %} and ID_ENTIDAD_CANONICA = {% if EXIST(DECLARACIONES, 'entidad' + VALORES.ID_ENTIDAD_CANONICA) %} entidad{{ VALORES.ID_ENTIDAD_CANONICA}} {% else %} {{ VALORES.ID_ENTIDAD_CANONICA }} {% endif %} and ID_VALOR_CANONICO = {% if EXIST(DECLARACIONES, 'valorcanonico' + VALORES.ID_VALOR_CANONICO) %} valorcanonico{{ VALORES.ID_VALOR_CANONICO}} {% else %} {{ VALORES.ID_VALOR_CANONICO }} {% endif %} ;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' ya existe' );
	end if;
