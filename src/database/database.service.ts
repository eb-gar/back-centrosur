import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigParametersI, ProxyDatabaseI } from 'src/config/models/models.config';
import { RESPONSE_DATABASE } from '../models/response.models';
import { DatabaseConnectionService } from './database.connection';
import * as moment from 'moment';
import { NameTableDatabase } from '../models/database.models';
import { REQUEST_CREATEONE, REQUEST_DELETEONE, REQUEST_FIND, REQUEST_FINDONE_BYID, REQUEST_SQLQUERY, REQUEST_UPDATEONE } from '../models/request.models';
const axios = require('axios');

@Injectable()
export class DatabaseService {

    private pool: any;
    private codigoSociedad: number;
    withProxy: boolean = true;

    constructor(private databaseConnectionService: DatabaseConnectionService,
                private configService: ConfigService<ConfigParametersI>) {

        this.pool = this.databaseConnectionService.getConnection();
        this.codigoSociedad = + configService.get<number>('codigoSociedad', { infer: true }); 
        const proxyDB2 = this.configService.get<ProxyDatabaseI>('proxy_database', { infer: true }) as ProxyDatabaseI;           
        this.withProxy = proxyDB2.enable == '1'
        console.log('Proxy DB2 -> ', this.withProxy);
        

    }  

    /**
     * Permite leer una fila especifica de una tabla por su id
     *
     * @param library Libreria o esquema de la base de datos
     * @param table Nombre de la tabla.
     * @param id Id de la fila que se desea leer
     *      
     */
    findOneById<tipo>(library: string, table: NameTableDatabase, id: any) {
        return new Promise<RESPONSE_DATABASE<tipo>>( async (resolve) => {
            let response: RESPONSE_DATABASE<tipo> = {ok: false }; 
            try {
                if (this.withProxy) {
                    const request: REQUEST_FINDONE_BYID = {library, table, id}       
                    response = await this.sendRequestProxyDatabase('findOneById', request);
                    resolve(response);
                    return;
                } else {
                    let queryId: string = id;
                    if (typeof id === 'string') {
                        queryId = `'${id}'`
                    }
                    const query = `
                        SELECT * FROM ${library}.${table} WHERE id=${queryId}
                    `              
                    const results = await this.pool.query(query);
                    response.ok = true;
                    response.data = this.setDataLowerCase<tipo>(results[0]); 
                    resolve(response);
                    return;
                }
            }
            catch (error) {
                console.log('error -> ', error);
                response.error = error;
                resolve(response);
                return;
            }
        })
    }

    /**
     * Permite leer una fila especifica de una tabla por su id
     *
     * @param library Libreria o esquema de la base de datos
     * @param table Nombre de la tabla.
     * @param id Id de la fila que se desea leer
     *      
    */
    findOne<tipo>(library: string, table: NameTableDatabase, conditions: any[]) {
        return new Promise<RESPONSE_DATABASE<tipo>>( async (resolve, reject) => {
            let response: RESPONSE_DATABASE<tipo> = {ok: false }; 
            try {
                if (this.withProxy) {
                    const request: REQUEST_FIND = {library, table, conditions}        
                    response = await this.sendRequestProxyDatabase('findOne', request);
                    resolve(response);
                    return;
                } else {
                    const result = await this.find<tipo>(library, table, conditions);
                    if (result.ok && result.data.length) {
                        response.data = this.setDataLowerCase<tipo>(result.data[0]);
                        response.ok = true;
                    } else {
                        if (result.ok) {
                            response.ok = true;
                            response.data = null;
                        }
                    }
                    // console.log('response findone -> ', response);          
                    resolve(response);
                    return;
                }
            }
            catch (error) {
                response.error = error;
                console.log('error findone');
                // console.log('error findone-> ', error);
                resolve(response);
                return;
            }
        })

    }

    /**
     * Permite crear una fila especifica de una tabla
     *
     * @param library Libreria o esquema de la base de datos
     * @param table Nombre de la tabla.
     * @param data Data a guardar
     *      
    */
    createOne<tipo>(library: string, table: NameTableDatabase, data: tipo, metadata: boolean = true) {

        return new Promise<RESPONSE_DATABASE<tipo>>( async (resolve) => {
                let response: RESPONSE_DATABASE<tipo> = {ok: false }; 
                try {
                    if (metadata) {
                        const now = moment(new Date());
                        data['created'] = now.format('YYYY-MM-DD HH:mm:ss.000000');
                        data['updated'] = now.format('YYYY-MM-DD HH:mm:ss.000000');
                        data['sociedad'] = this.codigoSociedad;
                    }
                    if (this.withProxy) {
                        const request: REQUEST_CREATEONE<any> = {library, table, data}
                        response = await this.sendRequestProxyDatabase('createOne',  request);
                        resolve(response);
                        return;
                    } else {
                        const columns = this.getFields(data);
                        let COLUMNS = '';
                        let VALUES = '';
                        // console.log('columns -> ', columns);
                        columns.forEach( (column, index) => {
                            if (index != (columns.length - 1)) {
                                COLUMNS = COLUMNS + column.label + ', ';
                                VALUES = VALUES + column.value + ', ';
                            } else {
                                COLUMNS = COLUMNS + column.label;
                                VALUES = VALUES + column.value;
                            }
                        });
                        const query = ` INSERT INTO ${library}.${table} (${COLUMNS}) VALUES(${VALUES}) `
                        // console.log('query ->  ', query);
    
                        let results: any;
                        results = await this.pool.insertAndGetId(query);
                        response.ok = true;
                        response.data = results; 
                        resolve(response);
                        return;
                    }

                }
                catch (error) {
                    console.log('error createOne');
                    console.log('error createOne -> ', error);
                    response.error = error;
                    resolve(response);
                    return;
                }
            })
    }

    /**
     * Permite eliminar una fila especifica de una tabla por su id
     *
     * @param library Libreria o esquema de la base de datos
     * @param table Nombre de la tabla.
     * @param id Id de la fila que se desea leer
     * @output rowsDeleted     
    */
    deleteOne(library: string, table: NameTableDatabase, id: any) {
        return new Promise<RESPONSE_DATABASE<number>>( async (resolve) => {
            // console.log('deleteOne -> ', table, id);
            let response: RESPONSE_DATABASE<number> = {ok: false }; 
                try {
                    if (this.withProxy) {
                        const request: REQUEST_DELETEONE = {library, table, id} 
                        response = await this.sendRequestProxyDatabase('deleteOne', request);
                        resolve(response);
                        return;
                    } else {
                        let queryId: string = id;
                        if (typeof id === 'string') {
                            queryId = `'${id}'`
                        }
                        const query = ` DELETE FROM ${library}.${table} WHERE ID = ${queryId}`
                        let rowsDeleted: any = 0;
                        rowsDeleted = await this.pool.insertAndGetId(query);
                        response.ok = true;
                        response.data = rowsDeleted;
                        console.log('response deleted ->  ', response);
                        resolve(response);
                        return;
                        
                    }
                }
                catch (error) {
                    console.log('error -> ', error);
                    response.error = error;
                    resolve(response);
                    return;
                }
            })
    }

    /**
     * Permite actualizar una fila especifica de una tabla por su id
     *
     * @param library Libreria o esquema de la base de datos
     * @param table Nombre de la tabla.
     * @param id Id de la fila que se desea leer
     * @param data Data a guardar
     * @param backend si la actualizacion es desde el backend, por defecto true
     *      
    */
    updateOne<tipo>(library: string, table: NameTableDatabase, id: any, data: tipo, backend: boolean = true) {
        return new Promise<RESPONSE_DATABASE<number>>( async (resolve, reject) => {
            let response: RESPONSE_DATABASE<number> = {ok: false }; 
            // console.log('update -> ', library, table, id, data, backend);
            try {
                if (!backend) {
                    const now = moment(new Date());
                    data['updated'] = now.format('YYYY-MM-DD HH:mm:ss.000000');  
                }
                if (this.withProxy) {
                    const request: REQUEST_UPDATEONE<tipo> = {library, table, id, data} 
                    response = await this.sendRequestProxyDatabase('updateOne', {request});
                    resolve(response);
                    return;
                } else {
                    const columns = this.getFields(data);
                    let UPDATE = '';
                    columns.forEach( (column, index) => {
                        if (index != (columns.length - 1)) {
                            UPDATE = UPDATE + column.label + '=' + column.value + ', ';
                        } else {
                            UPDATE = UPDATE + column.label + '=' + column.value;
                        }
                    });
                    let queryId: string = id;
                    if (typeof id === 'string') {
                        queryId = `'${id}'`
                    }
                    const query = `
                        UPDATE ${library}.${table} SET ${UPDATE}
                        WHERE ID = ${queryId}
                    `            
                    let results: any;                    
                    results = await this.pool.update(query);
                    // console.log('results -> ', results); 
                    response.ok = true;
                    response.data = results;
                    resolve(response)
                    return;

                }
            }
            catch (error) {
                console.log('error -> ', error);
                response.error = error;
                resolve(response)
                return;
            }
        })
    }

    /**
     * Permite leer filas de una tabla por una o varias condiciones
     *
     * @param library Libreria o esquema de la base de datos
     * @param table Nombre de la tabla.
     * @param conditions Condiciones de busqueda ej: {id: 5}
     * @param orderFieldName(opcional) Nombre del campo de ordenamiento
     * @param ORDER(opcional) tipo de ordanamiento 'asc' | 'desc'
     * @param LIMIT(opcional) limite de filas a leer
     * @param STARTAT(opcional) desplazaminiento de filas para la consulta  
     *  
    */
    find<tipo>(library: string, table: NameTableDatabase, conditions: any[], orderFieldName: string = null, ORDER: 'asc' | 'desc' = 'asc', LIMIT: number = null, STARTAT: number = null) {
        return new Promise<RESPONSE_DATABASE<tipo[]>>( async (resolve, reject) => {
            let response: RESPONSE_DATABASE<tipo[]> = {ok: false }; 
            try {
                if (this.withProxy) {
                    const request: REQUEST_FIND = {
                        library,
                        table,
                        conditions,
                        orderFieldName: orderFieldName ? orderFieldName : null,  
                        order: ORDER ? ORDER : 'desc',
                        limit: LIMIT ? LIMIT : null,
                        start_at: STARTAT ? STARTAT : null
                    };
                    response = await this.sendRequestProxyDatabase('find', request);
                    resolve(response);
                    return;
                } else {
                    let CONDITION = '';
                    conditions.forEach( (condition, indexC) => {
                        CONDITION = CONDITION + '(';
                        const columns = this.getFields(condition);
                        columns.forEach( (column, index) => {
                            const query = this.separateConditionOfValue(column.value);
                            if (index != (columns.length - 1)) {
                                CONDITION = CONDITION + column.label + query.conditional + query.value + ' AND ';
                            } else {
                                CONDITION = CONDITION + column.label + query.conditional + query.value + ')';;
                            }
                        });
                        if (indexC != (conditions.length - 1)) {
                          CONDITION = CONDITION + ' OR ';
                        } 
                    });
                    // console.log('CONDITION -> ', CONDITION);  
                    let query = `
                        SELECT * FROM ${library}.${table} WHERE ${CONDITION}
                    `
                    if (orderFieldName && ORDER) {
                        query = query + ` ORDER BY ${orderFieldName} ${ORDER}`
                    }
                    if (LIMIT != null && STARTAT != null) {
                        query = query + ` LIMIT ${STARTAT} , ${LIMIT}`
                    } else if (LIMIT != null) {
                        query = query + ` LIMIT ${LIMIT} `
                    }
                    // console.log('find query -> ', query);
                    const results = await this.pool.query(query);
                    // console.log('results -> ', results);
                    
                    response.data = [];
                    results.forEach((result: tipo) => {
                        const value = this.setDataLowerCase(result);
                        response.data.push(value);
                    });
                    response.ok = true;
                    // console.log('response -> ', response);
                    
                    resolve(response);
                    return;
                }
            }
            catch (error) {
                response.error = error;
                console.log('error find -> ', table, conditions, error);
                resolve(response);
                return;
            }
        })

    }

        /**
     * Permite hacer una consulta por una sentencia sql
     *
     * @param sentencia Sql query
     *  
    */
    sqlQuery<tipo>(sentencia: string, values: any[] = []) {
            return new Promise<RESPONSE_DATABASE<tipo[]>>( async (resolve, reject) => {
                let response: RESPONSE_DATABASE<tipo[]> = {ok: false }; 
                try {
                        let query = sentencia
                        // console.log('sqlQuery sentencia -> ', sentencia);
                        let results: any;
                        if (values.length) {
                            results = await this.pool.update(query, values);
                        } else {
                            results = await this.pool.query(query);
                        }
                        response.data = [];
                        if (!values.length) {
                            results.forEach((result: tipo) => {
                                const value = this.setDataLowerCase(result);
                                response.data.push(value);
                            });                
                        }
                        response.ok = true;
                        resolve(response);
                        return;
                    
                }
                catch (error) {
                    response.error = error;
                    console.log('error sqlQuery -> ', error);
                    resolve(response);
                    return;
                }
            })
        }

    private getFields(element: any): COLUMNS[] {
        let columns: COLUMNS[] = [];
        for (const key in element) {
          if (Object.prototype.hasOwnProperty.call(element, key)) {
            let value: any;
            if (typeof element[key] === 'string') {
                value = `'${element[key]}'` ;
            } else {
                value = element[key];
            }
            let column = {label: key, value}
            columns.push(column);
          }
        }
        return columns;
    } 
    
    private separateConditionOfValue(value: any): {conditional: string; value: any} {
        // console.log('separateConditionOfValue -> ', value);
        let separate = {conditional: '=', value};
        if (typeof value === 'string') { 
            let existConditional: boolean = false;
            conditionals.every( conditional => {
                if (value.search(conditional) == 0) {
                    separate.conditional = conditional;
                    existConditional = true;
                    return false;
                }
                return true;
            });            
            if (existConditional) {
                console.log('existConditional');
                value = value.split(separate.conditional + ' ')[1];
                value = value.substring(0, (value.length - 1));
                separate.value = (+ value) ? + value : value;
            }        
        }
        return separate;
    } 

    setDataLowerCase<tipo>(data: tipo) {
       const value: any = {};
    //    console.log('setDataLowerCase -> ', data);
       for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const element = data[key] as string;
                if ( !isNaN( + element) ) {
                    if (element) {
                        if (element.length == ((+ element) + '').length ) {
                            if (key.toLocaleLowerCase() != 'phone') {
                                value[key.toLocaleLowerCase()] = + element; 
                                continue;
                            }
                        }
                    }
                }    
                value[key.toLocaleLowerCase()] = element; 
            }
       } 
    //    console.log('value -> ', value);
          
       return value;    
    }

    private async sendRequestProxyDatabase(path: string, request: any): Promise<RESPONSE_DATABASE<any>> {
        const proxyDB2credentials = this.configService.get<ProxyDatabaseI>('proxy_database', { infer: true }) as ProxyDatabaseI;           
        const url = proxyDB2credentials.host;
        const auth = "Bearer " + proxyDB2credentials.token; 
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        const result = await axios.post(
            url + '/' + path,
            request, 
            { headers: {
                'Content-Type': 'application/json',
                "Authorization" : `${auth}`
                }
            }
        ) 
        return result.data;
    }

}


interface COLUMNS {
    label: string; 
    value: any;
} 

const conditionals = ['=', '>', '<', '>=', '<=', '!='];