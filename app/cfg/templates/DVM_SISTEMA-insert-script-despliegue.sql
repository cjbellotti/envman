	{{ ADD('sistema'  + VALORES.ID + ' DTVLA.DVM_SISTEMA.ID%type;', 'DECLARACIONES') }}
	select count(1) into V_COUNT from DTVLA.DVM_SISTEMA where NOMBRE = {{ VALORES.NOMBRE }} and PAIS = {{ VALORES.PAIS }};
	counter_ins_tot:=counter_ins_tot+1;
	if V_COUNT = 0 THEN
		select nvl(max(id),0)+1 into sistema{{ VALORES.ID }} from DTVLA.DVM_SISTEMA;
		insert into {{ TABLA }} (ID, NOMBRE, DESCRIPCION, PAIS) values  (sistema{{ VALORES.ID }}, {{ VALORES.NOMBRE }}, {{ VALORES.DESCRIPCION }});
		counter_ins:=counter_ins+1;
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' se inserto OK' );
	else
		select ID into sistema{{ VALORES.ID }} where NOMBRE = {{ VALORES.NOMBRE }} and PAIS = {{ VALORES.PAIS }};
		DBMS_OUTPUT.PUT_LINE ('Registro: '|| TO_CHAR(counter_ins_tot) || ' ya existe' );
	end if;		
