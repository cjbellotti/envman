	{{ %ADD(valorsistema{{ %VALORES.ID% }} DTVLA.DVM_VALOR_SISTEMA.ID%type;, DECLARACIONES)% }}
	select nvl(max(id),0)+1 into valorsistema{{ %VALORES.ID% }} from DTVLA.DVM_VALOR_SISTEMA;
	insert into DTVLA.DVM_VALOR_SISTEMA (ID, ID_SISTEMA, ID_ENTIDAD_CANONICA, ID_VALOR_CANONICO, VALOR_SISTEMA) values  (valorsistema{{ %VALORES.ID% }}, {{ %(into\ssistema{{ %IVALORES.D_SISTEMA% }}) ? sistema{{ %VALORES.ID_SISTEMA% }} : {{ %VALORES.ID_SISTEMA% }}% }}, {{ %(into\sentidad{{ %VALORES.ID_ENTIDAD_CANONICA% }}) ? entidad{{ %VALORES.ID_ENTIDAD_CANONICA% }} : {{ %VALORES.ID_ENTIDAD_CANONICA% }}% }}, {{ %(into\svalorcanonico{{ %VALORES.ID_VALOR_CANONICO% }}) ? valorcanonico{{ %VALORES.ID_VALOR_CANONICO% }} : {{ %VALORES.ID_VALOR_CANONICO% }}% }}, {{ %VALORES.VALOR_SISTEMA% }});