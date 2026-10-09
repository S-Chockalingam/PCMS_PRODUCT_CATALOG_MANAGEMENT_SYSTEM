import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../Services/service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatSelectModule, RouterLink, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {

  public formg ! : FormGroup;

  constructor(private fb : FormBuilder, private service : Service, private router : Router){

  }

  ngOnInit(): void {
    this.formg = this.fb.group({
      email : ["", [Validators.required, Validators.email]],
      password : ["", [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(8)
      ]]
    })
  }


  login(){
    this.service.login(this.formg.value).subscribe({
      next : (response) => {
        alert("logged in successfully!!!");
        localStorage.setItem("token", response.message);
        localStorage.setItem("role", response.role);
        localStorage.setItem("id", response.id);
        this.service.loginUpdated.next();
        this.router.navigate(['/viewproduct']);
      },
      error : (response) => {
        alert(`${response.error.message}`);
      }
    })
  }

}
 