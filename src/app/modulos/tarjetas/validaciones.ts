export class Validaciones{
    validarTarjeta(model:any){
        let error:boolean = false;
        let msg_error:string = "";
        for(let c = 0; c < model.listTarjetas.length; c = c + 1){
            let tarjeta = model.listTarjetas[c];
            let posicion = c + 1;
            if(tarjeta.tipo_id == 0){
                error = true;
                msg_error = "Seleccione un Tipo en la Tarjeta " + posicion;
                return {error,msg_error};
            }else{
                if(tarjeta.clasificacion_id == 0){
                    error = true;
                    msg_error = "Seleccione una Clasificacion en la Tarjeta " + posicion;
                    return {error,msg_error};
                }else{
                    if(tarjeta.fecha_inicio == "" || tarjeta.fecha_inicio == null || tarjeta.fecha_inicio == undefined){
                        error = true;
                        msg_error = "No ha seleccionado la Fecha de Inicio en la Tarjeta " + posicion;
                        return {error,msg_error}; 
                    }else{
                        if(tarjeta.nombre_firma == "" || tarjeta.nombre_firma == undefined || tarjeta.nombre_firma == null){
                            error = true;
                            msg_error = "LLene el campo Gr-Nombre Firma en la Tarjeta " + posicion;
                            return {error,msg_error};
                        }else{
                            if(tarjeta.cargo_firma == "" || tarjeta.cargo_firma == undefined || tarjeta.cargo_firma == null){
                                error = true;
                                msg_error = "LLene el campo Cargo Firma en la Tarjeta " + posicion;
                                return {error,msg_error};
                            }
                            // else{
                            //     if(tarjeta.acta == "" || tarjeta.acta == undefined || tarjeta.acta == null){
                            //         error = true;
                            //         msg_error = "Seleccione un Archivo para la Acta en la Tarjeta " + posicion;
                            //         return {error,msg_error};
                            //     }else{
                            //         if(tarjeta.reserva == "" || tarjeta.reserva == undefined || tarjeta.reserva == null){
                            //             error = true;
                            //             msg_error = "Seleccione un Archivo para la Reserva en la Tarjeta " + posicion;
                            //             return {error,msg_error}; 
                            //         }
                            //     }
                            // }
                        }
                    }
                }
            }
        }
        return {error,msg_error};
    }
}