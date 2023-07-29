export class Model{
    varhistorial:any = [];
    varhistorialTemp:any = [];
    modalCrear:boolean = false;
    varUnidad:any = {
        nombre_unidad:"",
        denominacion:"",
        ciudad:"",
        direccion:"",
        estado:true,
        unidad_padre_id:''
    };
    isCrear:boolean = false;
    modalDependencias:boolean = false;
    varHistorialDependencias:any;
    title:String = "";
    unidad_id:number = 0;
    titulo:String = "";
}