export class Validaciones{
    validarListas(model:any){
        let error = false;
        let msg_error = "";
        for(let c = 0; c < model.listListas.length; c++){
            let listaH = model.listListas[c];
            let p = c + 1;
            if(listaH.lista_dinamica == null || listaH.lista_dinamica == undefined || listaH.lista_dinamica == ""){
                error = true;
                msg_error = "LLene el Campo Valor en la Posicion "+ p;
                return {error, msg_error};
            }
        }
        return {error, msg_error};
    }
}