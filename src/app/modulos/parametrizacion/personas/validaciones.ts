export class Validaciones {
    validacionespersonas(model:any){
        let persona = model.varPersona;
        let error = false;
        let msg_error = "";
        if(persona.tipo_persona == 0){
            error = true;
            msg_error = "Selecciones un Tipo de Persona";
            return {error, msg_error};
        }
        if(persona.numero_identificacion == null || persona.numero_identificacion == undefined || persona.numero_identificacion == ""){
            error = true;
            msg_error = "Ingrese un Numero de Identificacion";
            return {error, msg_error};
        }
        if(persona.nombres == null || persona.nombres == undefined || persona.nombres == ""){
            error = true;
            msg_error = "Ingrese los Nombres";
            return {error, msg_error};
        }
        if(persona.apellidos == null || persona.apellidos == undefined || persona.apellidos == ""){
            error = true;
            msg_error = "Ingrese los Apellidos";
            return {error, msg_error};
        }
        if(persona.cargo == null || persona.cargo == undefined || persona.cargo == ""){
            error = true;
            msg_error = "Ingrese el Cargo";
            return {error, msg_error};
        }
        return {error, msg_error};
    }
}