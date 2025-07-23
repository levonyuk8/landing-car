import {Component} from '@angular/core';
import {CalcComponent} from './components/calc/calc.component';
import {NgOptimizedImage} from '@angular/common';
import {GalleriaModule} from 'primeng/galleria';
import {InfoComponent} from './components/info/info.component';
import {AucListComponent} from './components/auc-list/auc-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CalcComponent,
    NgOptimizedImage,
    GalleriaModule,
    InfoComponent,
    AucListComponent
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
   responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '1199px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ]
}
