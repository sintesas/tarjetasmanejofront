export class Model{
    varhistorial:any = [];
    varhistorialTemp:any = [];
    varLista:any = {
        nombre_lista: "",
        nombre_lista_padre_id:"0",
        lista_padre_id:"0",
        activo:true
    }
    Listas:boolean = false;
    listListas:any = [];
    listHijos:any = [];
    nombre_lista_id:number = 0;
    isCrear:boolean = false;
    usuario = "";
}