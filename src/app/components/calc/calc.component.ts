import {Component, inject, OnInit, signal} from '@angular/core';
import {CalcService} from '../calc.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, of, startWith, switchMap, tap} from 'rxjs';
import {Fieldset} from 'primeng/fieldset';
import {Fluid} from 'primeng/fluid';
import {Select} from 'primeng/select';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {Divider} from 'primeng/divider';
import {InputNumberModule} from 'primeng/inputnumber';
import {Checkbox} from 'primeng/checkbox';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {locationList} from './location-list';

enum TRANSPORT_TYPE { auto = 'auto', moto = 'moto', moto_big = 'moto-big', quadro = 'quadro'}

@Component({
  selector: 'app-calc',
  standalone: true,
  imports: [
    InputNumberModule,
    ReactiveFormsModule,
    Fieldset,
    Fluid,
    Select,
    InputGroup,
    InputGroupAddon,
    Divider,
    Checkbox,
    ToggleSwitch,

  ],
  templateUrl: './calc.component.html',
  styleUrl: './calc.component.scss'
})
export class CalcComponent implements OnInit {

  calcService = inject(CalcService);

  public readonly ourServicePrice = 900;
  private fb = inject(FormBuilder)
  calcForm!: FormGroup;

  venueList = locationList;

  public readonly minCarCost = 0;
  public readonly maxCarCost = 100_000;
  public readonly maxCarAge = 15;

  priceDefaultValue = 10_000;
  engineCapacityDefaultValue = 2_000;


  carAgeList =
    [
      {
        value: 0,
        label: `Менее года`,
      },
      ...Array(this.maxCarAge).fill(0).map((_, i) => Object({label: i, value: i})),
      {
        value: 16,
        label: `Более 15`,
      }

    ]

  deliveryToAddresses = [
    {
      value: 'by',
      label: 'Беларусь, Минск (через Клайпеду)'
    },
    {
      value: 'ge',
      label: 'Беларусь, Минск (через Грузию, Поти)'
    },
  ]

  typesOfTransport = [
    {
      value: 'auto',
      label: 'Автомобиль'
    },
    {
      value: 'moto',
      label: 'Мотоцикл'
    },
    {
      value: 'moto-big',
      label: 'Большой мотоцикл'
    },
    {
      value: 'quadro',
      label: 'Квадроцикл'
    },
  ]

  groupedAuctionList = [
    {label: 'Copart', value: 'Copart'},
    {label: 'Iaai', value: 'Iaai'},
  ];

  params = signal(null);
  private searchParams = toObservable(this.params);

  books = toSignal(
    this.searchParams.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(term => this.fetchCalcResult(term))
    )
  );

  private fetchCalcResult(params: any) {
    return this.calcService.getDataFromWMCalculator(params).pipe(map((data: any) => data?.data));
  }

  ngOnInit(): void {

    this.calcForm = this.fb.group({
      transport: [this.typesOfTransport[0].value, Validators.required],
      carPrice: [this.priceDefaultValue, Validators.required],
      sliderPrice: [this.priceDefaultValue, Validators.required],
      carAge: [this.carAgeList[0].value, Validators.required],
      engine: [this.engineCapacityDefaultValue, Validators.required],
      platform: [this.venueList[0].value, Validators.required],
      auction: [this.groupedAuctionList[0].value, Validators.required],
      deliveryTo: [this.deliveryToAddresses[0].value, Validators.required],
      isElectro: [false],
      isGibrid: [false],
      isOffside: [false],
      preferential: [false],
      isRetroAuto: [false],
      isSUV: [false],
      isConnectableGibrid: [{value: false, disabled: true}],
    });

    this.calcForm.get('isGibrid')?.valueChanges.subscribe(isMember => {
      const connectableGibridControl = this.calcForm.get('isConnectableGibrid');
      const electroControl = this.calcForm.get('isElectro');
      if (isMember) {
        connectableGibridControl?.enable();
        electroControl?.reset();
      } else {
        connectableGibridControl?.disable();
        connectableGibridControl?.reset();
      }
    });

    this.calcForm.get('isElectro')?.valueChanges.subscribe(isMember => {
      const gibridControl = this.calcForm.get('isGibrid');
      if (isMember) gibridControl?.reset();
    });


    this.calcForm?.valueChanges.pipe(
      startWith(this.calcForm.value),
      tap(value => {
        this.params.set(value);
      })
    ).subscribe()


    // this.paramsSignal = toSignal( this.calcForm?.valueChanges);

    // this.calcData = toSignal(
    //   this.calcForm?.valueChanges.pipe(
    //     startWith(this.calcForm.value),
    //     distinctUntilChanged(),
    //     debounceTime(500),
    //     switchMap((value: any) => this.fetchCalcResult(value))
    //   )
    // );

    // this.calcForm.get('sliderPrice')?.valueChanges.subscribe(val => {
    //   this.calcForm.get('price')?.patchValue(val);
    // });
    //
    // this.calcForm.get('price')?.valueChanges.subscribe(val => {
    //   const numericValue = Number(val);
    //   if (!isNaN(numericValue)) {
    //     this.calcForm.get('sliderPrice')?.patchValue(numericValue);
    //   }
    // });
    //   calc Аукционный сбор

    this.calcForm.get('price')?.valueChanges
      .pipe(
        startWith(this.calcForm.get('price')?.value),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((data: any) => {
          console.log(data);
          return of(data);
        })
      ).subscribe(val => {
    })
  }

  protected readonly TRANSPORT_TYPE = TRANSPORT_TYPE;
}
