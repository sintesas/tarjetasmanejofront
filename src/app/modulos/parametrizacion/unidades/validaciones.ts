export class Validaciones{
    validarUnidades(model:any){
        let error = false;
        let msg_error = "";
        let unidad = model.varUnidad;
        if(unidad.nombre_unidad == "" || unidad.nombre_unidad == null || unidad.nombre_unidad == undefined){
            error = true;
            msg_error = "LLene el Campo Nombre";
            return {error, msg_error};
        }
        if(unidad.nombre_unidad == "" || unidad.nombre_unidad == null || unidad.nombre_unidad == undefined){
            error = true;
            msg_error = "LLene el Campo Ciudad";
            return {error, msg_error};
        }
        if(unidad.nombre_unidad == "" || unidad.nombre_unidad == null || unidad.nombre_unidad == undefined){
            error = true;
            msg_error = "LLene el Campo Direccion";
            return {error, msg_error};
        }
        return {error, msg_error};
    }
}