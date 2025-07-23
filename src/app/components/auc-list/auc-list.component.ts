import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-auc-list',
  imports: [
    NgOptimizedImage
  ],

  template: `
    <div class="auc-list-container">
      @for (item of imageList; track item) {
        <div class="auc-img-box">
          <img [ngSrc]="item" width="100" height="100" alt="">
        </div>

      }
    </div>`,
})
export class AucListComponent {
  imageList = [ '/a1.png', '/a2.png', '/a3.png', '/a4.png',  '/a5.png', '/a6.png',  '/a7.png', '/a8.png' ];
}
