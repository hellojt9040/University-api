import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class EditPostComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  private id : string
  private post

  constructor(
    private _formBuilder: FormBuilder,
    private postsService:PostsService,
    private acivatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      title: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      description: ['', Validators.required]
    });

    this.acivatedRoute.paramMap
      .subscribe((params => {
        this.id = params.get('id')
        this.post = this.postsService.getPost(this.id)
        this.firstFormGroup.controls.title.setValue(this.post.title)
        this.secondFormGroup.controls.description.setValue(this.post.description)
      }),
      (error) => {
        console.log(error.message)
      })

  }

  editPost(){
    this.postsService.editPost({id:this.id,title:this.firstFormGroup.value.title,description:this.secondFormGroup.value.description})
  }

}
