import { ValidationErrors, AbstractControl } from "@angular/forms";

export class RegisterValidators {
  static matchPasswords = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    const error = password?.value !== confirmPassword?.value ? { notSame: true } : null;
    if (!confirmPassword?.hasError('required')) confirmPassword?.setErrors(error)
    return error;
  }
}



