import { UserService } from './../../../users/user.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class UsernameValidator{

constructor(private userService: UserService) { }

// Can not contain space
  static canNotContainSpace(control: AbstractControl): ValidationErrors | null {
    if((control.value as string).indexOf(' ') >= 0)
      return {canNotContainSpace:true}

    return null
  }

// Should be unique
  /* static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>{
    return new Promise((resolve, reject) => {
      userService.
    })
  } */
}
