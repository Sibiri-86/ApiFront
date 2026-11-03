import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ValidationErrors, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forms-validation',
  standalone: true,
  imports: [NgIf],
  templateUrl: './forms-validation.component.html',
  styleUrl: './forms-validation.component.scss'
})
export class FormsValidationComponent {

  @Input() validationsError!: ValidationErrors[];
  @Input() entityField!: string;
  @Input() formGroup!: FormGroup


  getErrorMessage(error : ValidationErrors | null){
    if (error) {
      if(error['required']){
        return "Ce champs est obligatoire" ;
      }
      else if(error['minlength']){
        return "Ce champs doit contenir au moins " + error['minlength']['requiredLength'] + " caractères"
      }
      else if(error['maxlength']){
        return "Ce champs doit contenir au maximum " + error['maxlength']['requiredLength'] + " caractères"
      }
      else if (error['pattern']){
        return "Ce champs n'est pas valide"
      }
      else if (error['email']){
        return "Ce champs n'est pas valide"
      }
      else return ""
    }
    else return ""
  }
}
