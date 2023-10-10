export class Model {
    varhistorial:any=[];
    varhistorialTemp:any=[];
    tarjeta:boolean = false;
    varTarjeta:any = {
        numero_identificacion:"",
        grado:0,
        nombres:"",
        apellidos:""
    };
    listTarjetas:any = [];
    filename:any = "../../../assets/images/avatar.jpg";
    tipoPersonalist:any = [];
    gradosList:any = [];
    tiposList:any = [];
    clasificacionList:any = [];
    listUnidadesP:any = [];
    listUnidadesH:any = [];
    isCrear = false;
    isLectura:boolean = false;
    Multimedia:any;
    nombreMultimedia:any;
    MultimediaBase64:any;
    title = "";
    iframe:boolean = false;
    link:string = "";
    Url_Tarjeta = "";
    d:any = new Date();
}