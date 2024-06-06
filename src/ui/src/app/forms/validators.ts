import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  Validator,
} from '@angular/forms';

export class EqualFieldsValidator implements Validator {
  constructor(private field1Name: string, private field2Name: string) {}

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    let gp = control as FormGroup;
    if (
      gp.get(this.field1Name)?.value === gp.get(this.field2Name)?.value &&
      gp.get(this.field1Name) != undefined
    ) {
      return {};
    } else {
      return {
        equalFields: true,
      };
    }
  }
}
