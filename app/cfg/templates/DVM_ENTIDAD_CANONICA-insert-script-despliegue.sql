	{{ ADD('entidad'  + VALORES.ID + ' DTVLA.DVM_ENTIDAD_CANONICA.ID%type;', 'DECLARACIONES') }}
	select count(1) into V_COUNT from DTVLA.DVM_ENTIDAD_CANONICA where NOMBRE = {{ VALORES.NOMBRE }};
	counter_ins_tot:=counter_ins_tot+1;
	if V_COUNT = 0 THEN
		select nvl(max(id),0)+1 into entidad{{ VALORES.ID }} from DTVLA.DVM_ENTIDAD_CANONICA;
		insert into {{ TABLA }} (ID, NOMBRE, DESCRIPCION) values  (entidad{{ VALORES.ID }} , {{ VALORES.NOMBRE }}, {{ VALORES.DESCRIPCION }});
		counter_ins:=counter_ins+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' se inserto OK' );
	else
		select ID into entidad{{ VALORES.ID }} where NOMBRE = {{ VALORES.NOMBRE }};
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' ya existe' );
	end if;
