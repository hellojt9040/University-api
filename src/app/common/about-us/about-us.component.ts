import { UserService } from './../../users/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../../common/validators/mime-type.validator'
import { Component } from '@angular/core';

@Component({
  selector: 'about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {

  imagePreview: string

  uploadAvatar = new FormGroup({
    avatar: new FormControl(null, {
      validators: [Validators.required],    //required validaot is requred, else
      asyncValidators:[mimeType]
    })
  })

  constructor(private userService: UserService){

  }

  onFilePicked(event: Event){
    const file: File = (event.target as HTMLInputElement).files[0]

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = (reader.result as string)
      this.uploadAvatar.setValue({avatar:file})
      this.uploadAvatar.get('avatar').updateValueAndValidity()
      this.uploadNewAvatar(this.uploadAvatar.value.avatar)
    }
    reader.readAsDataURL(file)
  }

  uploadNewAvatar(avatar:File){
    this.userService.uploadNewAvatar({avatar})
  }
}
