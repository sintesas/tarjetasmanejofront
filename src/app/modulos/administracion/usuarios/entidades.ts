export class Model{
    modal: boolean = false;
    rolModal: boolean = false;
    varhistorial:any;
    varhistorialTemp:any;
    varRol:any = [];
    isCrear:boolean = false;
    title = "";
    varUsuario:any = {
        usuario:"",
        nombres:"",
        apellidos:"",
        tipo_usuario: 0,
        email:"",
        activo: true
    };
    usuario = "";
    array:any;
    inputform:any;
    index:any;
    selectModal:boolean = false;
    listRoles:any;
    listPrivilegios:any;
    userdata:any;
}