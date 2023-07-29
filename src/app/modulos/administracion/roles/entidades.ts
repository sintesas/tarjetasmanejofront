export class Model{
    varhistorial:any;
    varhistorialTemp:any;
    title:String = "";
    modal:boolean = false;
    varRol:any = {
        rol:"",
        descripcion:"",
        activo: true
    };
    isCreacion:boolean = false;
    rolPrivilegioModal:boolean = false;
    varprivilegio:any = [];
    varprivilegioTemp:any;
    selectModal:boolean = false;
    index:any;
    varRolPrivilegio:any = {
        rol_id: 0
    };
    rol_id:any = 0;
    varmodulo:any;
    array:any;
    inputform:any;
    cabezeras:any;
}