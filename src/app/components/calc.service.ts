import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

export interface FeeTier {
  fromRange: number;
  toRange: number | null; //todo dm
  baseFee: number;
  additionalFees: number;
}


export interface caclData {
  data: any,
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CalcService {

  http = inject(HttpClient);

  // testData = {
  //   "transport": "auto", //Тип транспорта
  //   "platform": "Abilene",
  //   "auction": "Iaai", //Copart , Iaai
  //   "deliveryTo": "by", //Доставка в //by //ge
  //   "carPrice": "3000", //Стоимость авт
  //   "year": null, // null ??
  //   "age": 1, //Возраст авто, лет 0, 1, 2, 3..., 16
  //   "engine": "2000", //Объем двигателя, куб.см.
  //   "enginePower": "90", //Мощность двигателя ??
  //   "preferential": false, // Льготная растаможка
  //   "isElectro": false, // Электромобиль
  //   "isGibrid": false, //Гибрид чекбокс isGibrid
  //   "isSUV": false, // Внедорожник
  //   "isConnectableGibrid": false, //Подключаемый гибрид
  //   "fuel": "gasoline", // топливо
  //   "weight": 0,
  //   "length": 0,
  //   "boatType": "motor",
  //   "trailerWithBoat": true,
  //   "NDSReturn": false,
  //   "deliveryViaGermany": true,
  //   "deliveryViaPoti": false,
  //   "ptsRF": false,
  //   "isRetroAuto": false,
  //   "deliveryToHome": false,
  //   "isOffside": false,
  //   "commercialRecyclingFee": false //коммерческий сбор за переработку
  // }

  API_URL = 'https://old.westmotors.by/themes/autousa/is/wm-calculator/calculator/api/doCalculate.php';

  // Таблица сборов Copart Canada для стандартных ТС
  // СЕРВИСНЫЙ СБОР: $95 долларов США за единицу
  // (включая выдачу и погрузку)
  feeTiers: FeeTier[] = [
    {fromRange: 0, toRange: 500, baseFee: 99, additionalFees: 50},
    {fromRange: 500, toRange: 1000, baseFee: 149, additionalFees: 50},
    {fromRange: 1000, toRange: 2000, baseFee: 199, additionalFees: 50},
    {fromRange: 2000, toRange: 3000, baseFee: 249, additionalFees: 50},
    {fromRange: 15_000, toRange: null, baseFee: 799, additionalFees: 200},
  ];


  constructor() {
  }

  getDataFromWMCalculator(params: any) {
    // const {carPrice, deliveryTo, carAge, auction} = params;

    console.log(params);

    return this.http.post<caclData>(this.API_URL, {...params});
  }



}
