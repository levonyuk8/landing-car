import {Component} from '@angular/core';
import {CalcComponent} from './components/calc/calc.component';
import {GalleriaModule} from 'primeng/galleria';
import {InfoComponent} from './components/info/info.component';
import {AucListComponent} from './components/auc-list/auc-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    CalcComponent,
    GalleriaModule,
    InfoComponent,
    AucListComponent
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
