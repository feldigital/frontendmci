import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reinicio',
  templateUrl: './reinicio.component.html',
  styleUrls: ['./reinicio.component.scss']
})
export class ReinicioComponent implements OnInit {

    reinicioForm!: FormGroup;
    lider: any;

    constructor(private fb: FormBuilder,
        private miembroService: MiembroService, private router: Router) {
        this.crearFormulario();
    }

    ngOnInit(): void {

    }
    /*FUNCION DE CREACION DEL FORMULARIO*/
    crearFormulario() {
        this.reinicioForm = this.fb.group
            ({
                documento: ['', Validators.required],
               
            });
    }


    notificar() {       
        if (this.reinicioForm.status == 'VALID') {
            this.lider = null;
            let username = this.reinicioForm.get('documento')?.value;
            this.miembroService.getMiembrosDocumento(username)
                .subscribe((resp: MiembroI) => {
                    this.lider = resp;
                    this.lider = this.lider[0];                  
                    if(this.lider.estado != "Activo" || this.lider.lider != true) {
                        Swal.fire({
                            title: '!Error',
                            text: `El usuario que intenta restablcer la contraseña se encuentra inactivo o no es un lider de celula!`,
                            icon: 'warning',
                        });
                    }
                    else
                    {
                    if (this.lider.email === "" ||this.lider.email==null) {  
                      Swal.fire({
                        title: '!Warning',
                        text: `El usuario no tiene buzón de correo electronico para restablecer la contraseña!`,
                        icon: 'warning',
                    });               
                          
                    } else {                    
                     this.miembroService.enviarCorreo(this.lider).subscribe(miembro => {
                      Swal.fire({
                        icon: 'success',
                        title: `Ok`,
                        text: `La contraseña fue enviada al correo ${this.lider.email} por favor verificar `,
                      });
              
                    },
                      err => {
                        Swal.fire({
                          icon: 'error',
                          title: 'Error...',
                          text: 'No se pudo enviar el correa electronico al usuario para restablecer la contraseña!',
                          footer: err.mensaje //JSON.stringify(err)
                        });
                      }
                    );
                     this.router.navigate(['/login']);          

                    }
                }         
                    (err: any) => { console.error(err) }                
                  });                  
                  if (this.lider.idMiembro!=0){
                    Swal.fire({
                        icon: 'warning',
                        title: "!Alerta",
                        text: 'El usuario que esta intentando restablecer la contraseña no existe!'
                    });
                }
               
        } else {
            Swal.fire({
                icon: 'warning',
                title: "!Alerta",
                text: 'Datos incompletos para restablecer la contraseña en la plataforma de la iglesia MCI'
            });
        }
    }

}
