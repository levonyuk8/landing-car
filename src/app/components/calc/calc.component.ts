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
  // cdr = inject(ChangeDetectorRef);

  public readonly ourServicePrice = 900;
  private fb = inject(FormBuilder)
  calcForm!: FormGroup;

  venueList = [
    {id: 1, value: 'Abilene'},
    {id: 2, value: 'ACE - Carson'},
    {id: 3, value: 'ACE - Perris'},
    {id: 4, value: 'Adamsburg'},
    {id: 5, value: 'ADESA Boston'},
    {id: 6, value: 'ADESA Great Lakes'},
    {id: 7, value: 'ADESA New Jersey'},
    {id: 8, value: 'Adesa PA'},
    {id: 9, value: 'ADESA Sioux Falls'},
    {id: 10, value: 'ADESA Wisconsin'},
    {id: 11, value: 'Akron-Canton'},
    {id: 12, value: 'Albany'},
    {id: 13, value: 'Albuquerque'},
    {id: 14, value: 'Altoona'},
    {id: 15, value: 'Amarillo'},
    {id: 16, value: 'Anaheim'},
    {id: 17, value: 'Anchorage'},
    {id: 18, value: 'Andrews'},
    {id: 19, value: 'Antelope'},
    {id: 20, value: 'Appleton'},
    {id: 21, value: 'Arizona Auto Auction'},
    {id: 22, value: 'Asheville'},
    {id: 23, value: 'Ashland'},
    {id: 24, value: 'Atlanta Auto Auction'},
    {id: 25, value: 'Atlanta East'},
    {id: 26, value: 'Atlanta North'},
    {id: 27, value: 'Atlanta South'},
    {id: 28, value: 'Atlanta West'},
    {id: 29, value: 'Augusta'},
    {id: 30, value: 'Austin'},
    {id: 31, value: 'Avenel New Jersey'},
    {id: 32, value: 'Bakersfield'},
    {id: 33, value: 'Baltimor'},
    {id: 34, value: 'Bangor'},
    {id: 35, value: 'Baton Rouge'},
    {id: 36, value: 'Bay Area'},
    {id: 37, value: 'Bel-Air Auto Auction'},
    {id: 38, value: 'Billings'},
    {id: 39, value: 'Birmingham'},
    {id: 40, value: 'Boise'},
    {id: 41, value: 'Boston'},
    {id: 42, value: 'Boston - Shirley'},
    {id: 43, value: 'Bowlimg Green'},
    {id: 44, value: 'Bridgeport'},
    {id: 45, value: 'Bridgeview'},
    {id: 46, value: 'Buckhannon'},
    {id: 47, value: 'Buffalo'},
    {id: 48, value: 'Burlington'},
    {id: 49, value: 'Candia'},
    {id: 50, value: 'Cartersville'},
    {id: 51, value: 'Casper'},
    {id: 52, value: 'Central Auto Auction'},
    {id: 53, value: 'Central New Jersey'},
    {id: 54, value: 'Chambersburg'},
    {id: 55, value: 'Charleston - SC'},
    {id: 56, value: 'Charleston - WV'},
    {id: 57, value: 'Charlotte'},
    {id: 58, value: 'Chattanooga'},
    {id: 59, value: 'Chicago North'},
    {id: 60, value: 'Chicago South'},
    {id: 61, value: 'Chicago West'},
    {id: 62, value: 'China Grove'},
    {id: 63, value: 'Cicero'},
    {id: 64, value: 'Cincinnati'},
    {id: 65, value: 'Clayton'},
    {id: 66, value: 'Clearwater'},
    {id: 67, value: 'Cleveland'},
    {id: 68, value: 'Cleveland East'},
    {id: 69, value: 'Cleveland West'},
    {id: 70, value: 'Clinton'},
    {id: 71, value: 'Colorado Springs'},
    {id: 72, value: 'Columbia MO'},
    {id: 73, value: 'Columbia SC'},
    {id: 74, value: 'Columbus AL'},
    {id: 75, value: 'Columbus OH'},
    {id: 76, value: 'Concord'},
    {id: 77, value: 'Corpus Christi'},
    {id: 78, value: 'Culpeper,VA'},
    {id: 79, value: 'Dallas'},
    {id: 80, value: 'Dallas South'},
    {id: 81, value: 'Danville'},
    {id: 82, value: 'Davenport'},
    {id: 83, value: 'Dayton'},
    {id: 84, value: 'Defuniak Springs'},
    {id: 85, value: 'Denver'},
    {id: 86, value: 'Denver South'},
    {id: 87, value: 'Des Moines'},
    {id: 88, value: 'Detroit'},
    {id: 89, value: 'Dothan'},
    {id: 90, value: 'Dundalk'},
    {id: 91, value: 'East Bay'},
    {id: 92, value: 'East NC'},
    {id: 93, value: 'El Paso'},
    {id: 94, value: 'Eldridge'},
    {id: 95, value: 'Englishtown'},
    {id: 96, value: 'Erie'},
    {id: 97, value: 'Essex'},
    {id: 98, value: 'Eugene'},
    {id: 99, value: 'Exeter'},
    {id: 100, value: 'Fargo'},
    {id: 101, value: 'Fayetteville'},
    {id: 102, value: 'Flint'},
    {id: 103, value: 'Florence'},
    {id: 104, value: 'Fontana'},
    {id: 105, value: 'Fort Myers'},
    {id: 106, value: 'Fort Wayne'},
    {id: 107, value: 'Fort Worth North'},
    {id: 108, value: 'Four Oaks, NC'},
    {id: 109, value: 'Fredericksburg-South'},
    {id: 110, value: 'Fremont'},
    {id: 111, value: 'Fresno'},
    {id: 112, value: 'Ft. Pierce'},
    {id: 113, value: 'Ft. Worth'},
    {id: 114, value: 'Ft.Lauderdale'},
    {id: 115, value: 'Glassboro East'},
    {id: 116, value: 'Glassboro West'},
    {id: 117, value: 'Golden Gate'},
    {id: 118, value: 'Gr.Rapids'},
    {id: 119, value: 'Graham'},
    {id: 120, value: 'Grand Island'},
    {id: 300, value: 'Wheeling'},
    {id: 301, value: 'Wichita'},
    {id: 302, value: 'Wilmington'},
    {id: 303, value: 'York Haven'},
    {id: 304, value: 'York Springs'}
  ];


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

  title = 'landing-car';
  groupedAuctionList: any[];

  params = signal(null);
  private searchParams = toObservable(this.params);

  books = toSignal(
    this.searchParams.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap(term => this.fetchCalcResult(term))
    )
  );

  constructor() {
    this.groupedAuctionList = [
      {label: 'Copart', value: 'Copart'},
      {label: 'Iaai', value: 'Iaai'},
    ];
  }

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
      venue: [this.venueList[0], Validators.required],
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
      const control = this.calcForm.get('isConnectableGibrid');
      if (isMember) {
        control?.enable();
      } else {
        control?.disable();
        control?.reset();
      }
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
}
