export class Entitys{
    version:string = "V 1.0";
    Key = Number(localStorage.getItem("llave"));
    ruta:any = this.Key!= 0?'404':'login';
  }