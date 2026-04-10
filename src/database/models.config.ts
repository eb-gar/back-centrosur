
export type ParametroType = 'SOCIEDAD' | 'SAP_USERNAME' | 
                            'SAP_PASSWORD' | 'SAP_WSLD_GET_SERVICES' |
                            'CORREO_HOST' | 'CORREO_USER' | 'CORREO_PASSWORD' | 
                            'URL_PAYPHONE' | 'TOKEN_PAYPHONE' | 'URL_CREATE_PAYPHONE' | 'TOKEN_PAYPHONE_APP' | 'URL_CONFIRM_PAYPHONE' |
                            'ENLACE_IOS_APP' | 'ENLACE_WEB_APP' | 'ENLACE_ANDROID_APP' | 
                            'SAP_WSLD_GET_DOCUMENTOS' | 'SAP_WSLD_GET_FILE' | 'SAP_WSLD_GET_FILE_USERNAME' | 
                            'SAP_WSLD_GET_FILE_PASSWORD' | 'TERMINOS_CONDICIONES' |
                            'CREDENCIALES_FIREBASE' | 'ANYWAY_TOKEN' | 'ANYWAY_URL' | 
                            'SAP_WSLD_UPDATE_DATA' | 'SAP_WSLD_UPDATE_DATA_PASSWORD' | 'SAP_WSLD_UPDATE_DATA_USERNAME' | 
                            'USER_AIVO' | 'PASSWORD_AIVO' | 'URL_AIVO' |
                            'SAP_WSLD_UPDATE_DATA' | 'SAP_WSLD_UPDATE_DATA_PASSWORD' | 'SAP_WSLD_UPDATE_DATA_USERNAME' |
                            'SAP_WSLD_HISTORIAL' | 
                            'PASSWORD_ALFRESCO' | 'USERNAME_ALFRESCO' | 'URL_ALFRESCO' | 'SAP_WSLD_FACT_INST' | 'SAP_WSLD_CORTE_RECONEXION' |
                            'URL_API_RECLAMOS' | 'URL_API_GET_RECLAMOS' | 'URL_API_VALID_CONTRATISTA' | 'URL_API_REINGRESO_RECLAMOS' |
                            'Reclamos' | 'URL_API_CORREO' | 'URL_API_ESTADO_ORDENES_TRABAJO' |
                            'URL_API_CUENTAS_BANCARIAS' |
                            'URL_API_CONSENTIMIENTO' | 'TOKEN_API_CONSENTIMIENTO' | 'Solicitudes' |
                            'PATH_WS_GET_ENCUESTA' |
                            'HOST_NAME_GENEXUS' | 'PATH_WS_SET_ENCUESTA' | 'KEY_WS_SET_ENCUESTA' |
                            'PATH_WS_LOCATION_OF_SERVICIO' | 'KEY_WS_LOCATION_OF_SERVICIO' |
                            'URL_API_QUEJAS_DENUNCIAS' | 
                            'MPLUS' | 'MPLUS_TOKEN' | 'MPLUS_DEV' |
                            'PATH_WS_VERIFICAR_ORDEN_TRABAJO'|'HOST_SGDA_SERVICES'|'METHOD_SGDA_TECNICO_HABILITADO'|'METHOD_SGDA_REGISTRAR_TECNICO'|
                            'HOST_SGDA_SERVICES_BPM' |'MENSAJE_BOTONPAGOS_DESHABILITADO'|'TOKEN_CONFIRMA_VALORACION_MRD'|'URL_VALORACION_MRD'|'URL_API_CONFIRMA_VALORACION_MRD'|
                            'METHOD_CONSULTA_VALORACION_MRD'|'URL_AUTH_INTRANET'|'INTRANET_METHOD_SWVALIDARTOKEN'|'INTRANET_VKEY'|'INTRANET_METHOD_SWMENU'|
                            'TOKEN_CONSULTA_VALORACION_MDR'| 'METHOD_SGDA_PROVINCIAS' | 'METHOD_SGDA_CANTONES' | 'METHOD_SGDA_PARROQUIAS'|
                            'NUVEI_SERVER_TOKEN'|'NUVEI_TOKEN'|'HOST_NUVEI'|'METHOD_INIT_REFERENCE_NUVEI'|
                            'SAP_USERNAME_NUEVOS_SERVICIOS'| 'SAP_OPEN_SUMMARY'|'SAP_PASSWORD_NUEVOS_SERVICIOS'|'LOGS_TOKEN'|'LOGS_URL'|
                            'SAP_CAJA_REFERENCE_ID'|'SAP_CAJA_OFFICE_REFERENCE_ID'| 'URL_SW_TIPO_MEDIDOR'|'TOKEN_SW_TIPO_MEDIDOR';
           
export interface ParametrosValue {
    SAP_USERNAME?: string;
    SAP_PASSWORD?: string;
    SAP_WSLD_GET_SERVICES?: string;
    SOCIEDAD?: string;
    CORREO_HOST?: string;
    CORREO_USER?: string;
    CORREO_PASSWORD?: string;
    URL_PAYPHONE?: string;
    TOKEN_PAYPHONE?: string;
    URL_CREATE_PAYPHONE?: string;
    URL_CONFIRM_PAYPHONE?: string;
    TOKEN_PAYPHONE_APP?: string;
    ENLACE_ANDROID_APP?: string;
    ENLACE_IOS_APP?: string;
    ENLACE_WEB_APP?: string;
    SAP_WSLD_GET_DOCUMENTOS?: string;
    SAP_WSLD_GET_FILE?: string;
    SAP_WSLD_GET_FILE_USERNAME?: string;
    SAP_WSLD_GET_FILE_PASSWORD?: string;
    TERMINOS_CONDICIONES?: string;
    CREDENCIALES_FIREBASE?: string;
    ANYWAY_TOKEN?: string;
    ANYWAY_URL?: string;
    SAP_WSLD_UPDATE_DATA?: string;
    SAP_WSLD_UPDATE_DATA_PASSWORD?: string;
    SAP_WSLD_UPDATE_DATA_USERNAME?: string;
    USER_AIVO?: string;
    PASSWORD_AIVO?: string;
    URL_AIVO?: string;
    SAP_WSLD_HISTORIAL?: string;
    SAP_WSLD_FACT_INST?: string;
    SAP_WSLD_CORTE_RECONEXION?: string;
    PASSWORD_ALFRESCO?: string;
    USERNAME_ALFRESCO?: string;
    URL_ALFRESCO?: string;
    URL_API_RECLAMOS?: string;
    URL_API_GET_RECLAMOS?: string;
    URL_API_VALID_CONTRATISTA?: string;
    URL_API_REINGRESO_RECLAMOS?: string;
    Reclamos?: string;
    URL_API_CORREO?: string;
    URL_API_ESTADO_ORDENES_TRABAJO?: string;
    URL_API_CUENTAS_BANCARIAS?: string;
    URL_API_CONSENTIMIENTO?: string;
    TOKEN_API_CONSENTIMIENTO?: string;
    Solicitudes?: string;
    PATH_WS_GET_ENCUESTA?: string;
    HOST_NAME_GENEXUS?: string;
    PATH_WS_SET_ENCUESTA?: string;
    KEY_WS_SET_ENCUESTA?: string;
    PATH_WS_LOCATION_OF_SERVICIO?: string;
    KEY_WS_LOCATION_OF_SERVICIO?: string;
    URL_API_QUEJAS_DENUNCIAS?: string;
    MPLUS?: string;
    MPLUS_TOKEN?: string;
    MPLUS_DEV?: string;
    PATH_WS_VERIFICAR_ORDEN_TRABAJO?: string;
    HOST_SGDA_SERVICES?: string;
    METHOD_SGDA_TECNICO_HABILITADO?: string;
    HOST_SGDA_SERVICES_BPM?: string;
    METHOD_SGDA_REGISTRAR_TECNICO?: string;
    METHOD_SGDA_PROVINCIAS?: string;
    METHOD_SGDA_CANTONES?: string;
    METHOD_SGDA_PARROQUIAS?: string;
    TOKEN_CONFIRMA_VALORACION_MRD?:string;
    TOKEN_CONSULTA_VALORACION_MDR?:string;
    URL_VALORACION_MRD?:string;
    URL_API_CONFIRMA_VALORACION_MRD?:string;
    METHOD_CONSULTA_VALORACION_MRD?:string;
    URL_AUTH_INTRANET?:string;
    INTRANET_METHOD_SWVALIDARTOKEN?:string;
    INTRANET_VKEY?:string;
    INTRANET_METHOD_SWMENU?:string;
    MENSAJE_BOTONPAGOS_DESHABILITADO?: string;
    NUVEI_SERVER_TOKEN?: string;
    NUVEI_TOKEN?:string;
    HOST_NUVEI?:string;
    METHOD_INIT_REFERENCE_NUVEI?:string;
    SAP_USERNAME_NUEVOS_SERVICIOS?:string;
    SAP_OPEN_SUMMARY?:string;
    SAP_PASSWORD_NUEVOS_SERVICIOS?:string;
    LOGS_TOKEN?:string;
    LOGS_URL?:string;
    SAP_CAJA_REFERENCE_ID?:string;
    SAP_CAJA_OFFICE_REFERENCE_ID?:string;
    URL_SW_TIPO_MEDIDOR?: string;
    TOKEN_SW_TIPO_MEDIDOR?: string;
}

export type VaribleEnvironmentType = 'host_backend' | 'codigoSociedad'; 

export interface ConfigParametersI {
    portBackend?: number;
    database?: ConfigDatabaseI,
    codigoSociedad?: number;
    jwtSecret?: string;
    securityKey?: string;
    host_backend?: string;
    proxy_database?: ProxyDatabaseI;
    production?: string;
}

export interface ConfigDatabaseI {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    esquema: string;
    databaseType: 'db2' | 'postgress';
}

export interface ParametroI {
    id?: number;
    name: string;
    value: string;
    descrip: string;
    cifrado: number;
    created?: string;
    updated?: string;
}

export interface ProxyDatabaseI {
    host: string
    token: string;
    enable: '0' | '1'
}


