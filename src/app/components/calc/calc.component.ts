import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
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
import {takeUntilDestroyed, toObservable, toSignal} from '@angular/core/rxjs-interop';
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
  private destroyRef = inject(DestroyRef)
  calcForm!: FormGroup;

  venueList = locationList;

  public readonly minCarCost = 0;
  public readonly maxCarCost = 100_000;
  public readonly maxCarAge = 15;

  priceDefaultValue = 3_000;
  engineCapacityDefaultValue = 2_000;


  carAgeList =
    [
      {
        value: 0,
        label: `Менее года`,
      },
      ...Array(this.maxCarAge).fill(0).map((_, i) => Object({label: ++i, value: i})),
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
      value: TRANSPORT_TYPE.auto,
      label: 'Автомобиль'
    },
    {
      value: TRANSPORT_TYPE.moto,
      label: 'Мотоцикл'
    },
    {
      value: TRANSPORT_TYPE.moto_big,
      label: 'Большой мотоцикл'
    },
    {
      value: TRANSPORT_TYPE.quadro,
      label: 'Квадроцикл'
    },
  ]

  groupedAuctionList = [
    {label: 'Copart', value: 'Copart'},
    {label: 'Iaai', value: 'Iaai'},
  ];

  params = signal(null);
  shippingCost = signal(0);
  private searchParams = toObservable(this.params);

  calcData = toSignal(
    this.searchParams.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500),
      switchMap((term: any) => this.fetchCalcResult(term))
    )
  );

  private fetchCalcResult(params: any) {
    return this.calcService.getDataFromWMCalculator(params).pipe(map((data: any) => data?.data));
  }

  ngOnInit(): void {
    console.log(this.carAgeList)
    this.createForm();
    this.createValueChangesByControls();
  }

  private createForm() {
    this.calcForm = this.fb.group({
      transport: [this.typesOfTransport[0].value, Validators.required],
      carPrice: [this.priceDefaultValue, Validators.required],
      sliderPrice: [this.priceDefaultValue, Validators.required],
      age: [this.carAgeList[1].value, Validators.required],
      engine: [this.engineCapacityDefaultValue, Validators.required],
      platform: [this.venueList[0].value, Validators.required],
      auction: [this.groupedAuctionList[0].value, Validators.required],
      deliveryTo: [this.deliveryToAddresses[1].value, Validators.required],
      isElectro: [false],
      isGibrid: [false],
      isOffside: [false],
      preferential: [false],
      isRetroAuto: [false],
      isSUV: [false],
      isConnectableGibrid: [{value: false, disabled: true}],
    });
  }

  private createValueChangesByControls() {
    this.calcForm.get('isGibrid')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isMember => {
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

    this.calcForm.get('isElectro')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isMember => {
        const gibridControl = this.calcForm.get('isGibrid');
        if (isMember) gibridControl?.reset();
      });


    this.calcForm.get('transport')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap( () => {
        this.calcForm.get('isGibrid')?.reset();
        this.calcForm.get('isElectro')?.reset();
        this.calcForm.get('isSUV')?.reset();
      })
    ).subscribe();

    this.calcForm?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(this.calcForm.value),
      tap(value => {
        this.params.set(value);
        this.calcShippingCost(value);
      })
    ).subscribe()
  }

  private calcShippingCost(value: any) {
    switch (value.transport) {
      case TRANSPORT_TYPE.auto:
        if (value.isElectro) {
          this.shippingCost.set(3100);
          break;
        }
        if (value.isSUV) {
          this.shippingCost.set(2700);
          break;
        }
        this.shippingCost.set(2500)
        break;
      case TRANSPORT_TYPE.moto:
      case TRANSPORT_TYPE.moto_big:
      case TRANSPORT_TYPE.quadro:
        this.shippingCost.set(800)
        break;
    }
  }

  protected readonly TRANSPORT_TYPE = TRANSPORT_TYPE;
}
