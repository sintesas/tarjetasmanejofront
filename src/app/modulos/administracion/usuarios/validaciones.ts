export class Validaciones{
    validacionUsuarios(model:any){
        let user = model.varUsuario;
        let error = false;
        let msg_error = "";
        if(user.nombres == "" || user.nombres == null || user.nombres == undefined){
            error = true;
            msg_error = "Ingrese Los Nombres";
            return {error, msg_error};
        }
        if(user.apellidos == "" || user.apellidos == null || user.apellidos == undefined ){
            error = true;
            msg_error = "Ingrese Los Apellidos";
            return {error, msg_error};
        }
        if(user.email == "" || user.email == null || user.email == undefined){
            error = true;
            msg_error = "Ingrese el Correo electronico";
            return {error, msg_error};
        }
        if(user.usuario == "" || user.usuario == null || user.usuario == undefined){
            error = true;
            msg_error = "Ingrese un Usuario";
            return {error, msg_error};
        }
        if(user.password == "" || user.password == null || user.password == undefined){
            error = true;
            msg_error = "Ingrese una contraseña";
            return {error, msg_error};
        }
        // if(user.password2 == "" || user.password2 == null || user.password2 == undefined){
        //     error = true;
        //     msg_error = "Ingrese una contraseña en el Campo Confirmar Contraseña";
        //     return {error, msg_error};
        // }
        return {error, msg_error};
    }
}