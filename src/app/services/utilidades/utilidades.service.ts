import { Injectable } from '@angular/core';
import { Observable, Observer, from } from 'rxjs';
import { ApiService } from '../api.service';
import { ListasService } from '../param/listas/listas.service';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(private api:ApiService,private apiL:ListasService) { }
  
  pad(n:any){
    return (n<10?'0'+ n: n);
  }

  public parseFecha(date:any, isparaMostrar:boolean, version = 1){ //v3.7
    let T;
    if(version == 1){
      if(date != null || date != undefined || date != ""){
        let f =  date.split("-");
        if(isparaMostrar == false){ //aaaa-mm-dd
          if(f[0].length < 4){
            if(f[0].length > 2){
              T = f[0].search("T");
              if(T != -1){
                f[0] = f[0].substring(0, f[0].indexOf("T"));
              }
            }
            let fecha = f[2] + "-" + f[1] + "-" + f[0];
            return fecha;
          }else{
            T = f[2].search("T");
            if(T != -1){
              f[2] = f[2].substring(0, f[2].indexOf("T"));
            }
            let fecha = f[0] + "-" + f[1] + "-" + f[2];
            return fecha;
          }
        }else{
          if(isparaMostrar == true){
            if(f[0].length == 4){ //dd-mm-aaaa
              if(f[2].length > 2){
                T = f[2].search("T");
                if(T != -1){
                  f[2] = f[2].substring(0, f[2].indexOf("T"));
                }
              }
              let fecha = f[2] + "-" + f[1] + "-" + f[0];
              return fecha;
            }else{
              T = f[2].search("T");
              if(T != -1){
                f[2] = f[2].substring(0, f[2].indexOf("T"));
              }
              let fecha = f[0] + "-" + f[1] + "-" + f[2];
              return fecha;
            }
          }
        }
      }else{
        return date;
      }
    }else{
      if(version == 4){
        let f = new Date(date);
        if(isparaMostrar == false){ //aaaa-mm-dd
          let fecha = f.getFullYear() + "-" + this.pad(f.getMonth()+1) + "-" + this.pad(f.getDate());
          return fecha;
        }else
          if(isparaMostrar == true){ //dd-mm-aaaa
            let fecha = this.pad(f.getDate())  + "-" + this.pad(f.getMonth()+1) + "-" + f.getFullYear();
            return fecha;
          }
      }else{
        return "No es el codigo";
      }
     }
  }

  UsuarioConectado(){
   let data;
   data = JSON.parse(localStorage.getItem("currentUser") as any);
   return data.usuario;
  }

  DatosUsuario(){
    let data;
    data = JSON.parse(localStorage.getItem("currentUser") as any);
    return data;
  }

  compressImage(image: File, maxSize: number): Observable<Blob> {
    return new Observable((observer: Observer<Blob>) => {
      if (!image.type.match(/image.*/)) {
        observer.error(new Error('File must be an image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx:any = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob: Blob | null) => {
            if (blob !== null) {
              observer.next(blob);
            } else {
              observer.error(new Error('Failed to compress image'));
            }
          }, image.type, 1);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(image);
    });
  }

  ObtenerListas(Lista:string){
    this.apiL.GetListaByName({nombre:Lista}).subscribe(data=>{
      let response:any = this.api.ProcesarRespuesta(data);
      if(response.tipo == 0){
        localStorage.setItem(Lista,JSON.stringify(response.result));
      }
    });
  }
}
