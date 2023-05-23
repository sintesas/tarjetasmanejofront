import { Observable, Subscriber } from 'rxjs';
export class Model{
    varhistorial:any = [];
    varPersona:any = {
        tipo_persona:"",
        numero_identificacion:0,
        grado:"",
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
    filename:any = "../../../../assets/images/avatar.jpg";
    modal:boolean = false;
    isCrear:boolean = false;
    Multimedia:any;
    nombreMultimedia:any;
    MultimediaBase64:any;
    title = "";
}