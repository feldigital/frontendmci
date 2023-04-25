import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    lider: any;

    constructor(private fb: FormBuilder,
        private miembroService: MiembroService, private router: Router) {
        this.crearFormulario();
    }

    ngOnInit(): void {

    }
    /*FUNCION DE CREACION DEL FORMULARIO*/
    crearFormulario() {
        this.loginForm = this.fb.group
            ({
                documento: ['', Validators.required],
                pwd: ['', Validators.required],
            });
    }


    validarIngreso() {       
        if (this.loginForm.status == 'VALID') {
            this.lider = null;
            let username = this.loginForm.get('documento')?.value;
            let pwd = this.loginForm.get('pwd')?.value;
            this.miembroService.getMiembrosDocumento(username)
                .subscribe((resp: MiembroI) => {
                    this.lider = resp;
                    this.lider = this.lider[0];
                    //console.log(this.lider);
                    if(this.lider.estado != "Activo" || this.lider.lider != true) {
                        Swal.fire({
                            title: '!Error',
                            text: `El usuario que esta ingresando se encuentra inactivo o no es un lider de celula!`,
                            icon: 'error',
                        });
                    }else{
                    if (this.lider.pwd === pwd) {                                          
                        let miembro = this.lider.idMiembro
                        sessionStorage.setItem("lidersistema", miembro);   
                        sessionStorage.setItem("nombsistema", this.lider.nomCompleto);                        
                        window.location.assign('http://54.163.179.39/');
                        //this.router.navigate(['/inicio']);
                       
                       
                       /* Swal.fire({
                            icon: 'success',
                            title: `Ok`,
                            text: `Bienvenid@ ${this.lider.nomCompleto} tu ingreso ha sido satisfactorio!`,
                            showConfirmButton: false,
                            timer: 2000
                          });*/

                         
                          
                    } else {
                        Swal.fire({
                            title: '!Error',
                            text: `La contraseña del usuario ingresada no es correcta!`,
                            icon: 'error',
                        });

                    }
                }         
                    (err: any) => { console.error(err) }
                });

                if (this.lider==null){
                    Swal.fire({
                        icon: 'warning',
                        title: "!Alerta",
                        text: 'El usuario que esta intentando acceder a la plataforma de la iglesia MCI no existe!'
                    });
                }
        } else {
            Swal.fire({
                icon: 'warning',
                title: "!Alerta",
                text: 'Datos incompletos para acceder a la plataforma de la iglesia MCI'
            });
        }
    }

}
