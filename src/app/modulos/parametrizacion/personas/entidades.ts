import { Observable, Subscriber } from 'rxjs';
export class Model{
    varhistorial:any = [];
    varhistorialTemp:any = [];
    varPersona:any = {
        tipo_persona:0,
        numero_identificacion:"",
        tmp_numero_identificacion:"",
        grado:0,
        nombres:"",
        apellidos:"",
        unidad:0,
        dependencia:0,
        cargo:"",
        imagen:null,
        tipo_imagen: ''
    }
    selectedFile: File | null = null;
    // imagen!: Observable<any>;
    base64!: any;
    imagen: string | ArrayBuffer | null | undefined
    tmp_imagen: string | ArrayBuffer | null | undefined
    filename:any = "../../../../assets/images/avatar.jpg";
    modal:boolean = false;
    isCrear:boolean = false;
    Multimedia:any;
    nombreMultimedia:any;
    MultimediaBase64:any;
    title = "";
    listUnidades:any = [];
    tipoPersonalist:any = [];
    gradosList:any = [];
    selectModal:boolean = false;
    array:any;
    inputform:any;
    cabezeras:any;
}