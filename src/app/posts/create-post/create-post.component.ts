import { Post } from './../post.model';
import { PostsService } from './../posts.service';
import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent{

  constructor(private postsService:PostsService){

  }

  showDdArea: Boolean= false;
  private _media:string;

  newPost:Post

  post = new FormGroup({
    title: new FormControl('',Validators.required),
    description: new FormControl('',Validators.required),
  })

  get title() {
    return this.post.get('title')
  }
  get description() {
    return this.post.get('description')
  }
  get media() {
    if(this._media)
      return this._media
  }
  set media(mediaData) {
    this._media = mediaData
  }

  addPost(){
    this.postsService.addPost(this.title.value,this.description.value,this.media)
    this.post.reset()
  }

  getErrorMessage() {
    if (this.title.hasError('required')) {
      return 'You must enter a value';
    }
  }

  onFileComplete(data: any) {
    this.media = data.link

    /* this.newPost['media']=data.link
    console.log(data.link) */
  }

  onShowDdAreaChange(){
    console.log(this.showDdArea);
  }


}
