import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '../../Services/service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnInit{

  formg ! : FormGroup;

  constructor(private fb : FormBuilder, private service  :Service, private router  :Router){
  }

  ngOnInit(): void {
    this.formg = this.fb.group({
      name : ["", [Validators.required]],
      email : ["", [Validators.required, Validators.email]],
      password  :["", [Validators.required, Validators.minLength(8),
        Validators.maxLength(8)
      ]]
    })
  }

  signup(){
    this.service.signup(this.formg.value).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate(['/login']);
      },
      error : (response) => {
        alert(response.error.message);
      }
    })
  }
}
