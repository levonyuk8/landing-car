import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface caclData {
  data: any,
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  http = inject(HttpClient);

  API_URL = 'https://old.westmotors.by/themes/autousa/is/wm-calculator/calculator/api/doCalculate.php';

  getDataFromWMCalculator(params: any) {
    return this.http.post<caclData>(this.API_URL, {...params});
  }
}
