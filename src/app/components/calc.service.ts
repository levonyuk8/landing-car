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

  test = {
    NDSReturn: false,
    age: "4",
    auction: "Copart",
    boatType: "motor",
    carPrice: "5000",
    commercialRecyclingFee: false,
    deliveryTo: "by",
    deliveryToHome: false,
    deliveryViaGermany: true,
    deliveryViaPoti: false,
    engine: "1499",
    enginePower: "90",
    fuel: "gasoline",
    isConnectableGibrid: false,
    isElectro: false,
    isGibrid: false,
    isOffside: false,
    isRetroAuto: false,
    isSUV: false,
    length: 0,
    platform: "Abilene",
    preferential: true,
    ptsRF: false,
    trailerWithBoat: true,
    transport: "auto",
    weight: 0,
    year: null
  }
  http = inject(HttpClient);

  API_URL = 'https://old.westmotors.by/themes/autousa/is/wm-calculator/calculator/api/doCalculate.php';

  getDataFromWMCalculator(params: any) {
    console.log(params);
    return this.http.post<caclData>(this.API_URL, {...this.test, ...params});
  }
}
