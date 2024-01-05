import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MiembroI } from 'src/app/models/miembro.model';
import { MiembroService } from 'src/app/servicios/miembro.service';
import Swal from 'sweetalert2';
import { TokenService } from 'src/app/servicios/token.service';



@Component({
    selector: 'login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    lider: any;    
    //const  TOKEN_KEY = 'AuthToken';

    constructor(private fb: FormBuilder,
        private miembroService: MiembroService,
        private tokenService: TokenService,
        private router: Router) {
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

    validarIngreso() 
    {
        if (this.loginForm.status == 'VALID') 
        {
            this.lider = null;
            let username = this.loginForm.get('documento')?.value;
            let pwd = this.loginForm.get('pwd')?.value;
            this.miembroService.getMiembrosDocumento(username)
                .subscribe((resp: MiembroI) => {
                    this.lider = resp;
                    this.lider = this.lider[0];                  
                    if (this.lider.estado != "Activo" || this.lider.lider != true) {
                        Swal.fire({
                            title: '!Error',
                            text: `El usuario que esta ingresando se encuentra inactivo o no es un lider de celula!`,
                            icon: 'error',
                        });
                    }   
                    else {
                 
                        if (this.lider.pwd == pwd) {
                            //console.log("si son igauales los adtos y cierra ciclo para inicir")
                            let miembro = this.lider.idMiembro
                            localStorage.setItem("lidersistema", miembro);
                            localStorage.setItem("nombsistema", this.lider.nomCompleto);
                            this.tokenService.setToken(miembro);                              
                            //this.router.navigate(['/inicio']); 
                            //window.location.assign('http://34.226.141.169/'); 
                            window.location.assign('https://www.mcisantamarta.com/#/inicio'); 
                          
                             
                                             

                        } else {
                            //console.log(" existe el usuario pero no son igauales los adtos de la contraseña")
                            Swal.fire({
                                title: '!Error',
                                text: `La contraseña del usuario ingresada no es correcta!`,
                                icon: 'error',
                            });
                        }
                    }
                    (err: any) => { console.error(err) }
                });


            if (this.lider === null || this.lider === undefined) {
                  Swal.fire({
                    icon: 'warning',
                    title: "!Alerta",
                    text: 'El usuario que esta intentando acceder a la plataforma de la iglesia MCI no existe!'
                });
            }            
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: "!Alerta",
                text: 'Datos incompletos para acceder a la plataforma de la iglesia MCI'
            });
        }
    }


}
