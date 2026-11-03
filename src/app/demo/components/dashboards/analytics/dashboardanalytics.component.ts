import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectItem, SharedModule } from 'primeng/api';
import { UIChart, ChartModule } from 'primeng/chart';
import { Subscription, debounceTime } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Product } from 'src/app/demo/api/product';
import { EventService } from 'src/app/demo/service/event.service';
import { ProductService } from 'src/app/demo/service/product.service';
import {
    AppConfig,
    LayoutService,
} from 'src/app/layout/service/app.layout.service';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { NgIf, NgClass, CurrencyPipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    templateUrl: './dashboardanalytics.component.html',
    styles: [
        `
            :host ::ng-deep .p-progressbar {
                height: 6px;
            }
        `,
    ],
    standalone: true,
    imports: [
        RippleModule,
        ButtonModule,
        ChartModule,
        MenuModule,
        ProgressBarModule,
        NgIf,
        NgClass,
        TableModule,
        SharedModule,
        SelectButtonModule,
        FormsModule,
        CurrencyPipe,
    ],
})
export class DashboardAnalyticsComponent implements OnInit, OnDestroy {
    cities: SelectItem[] = [];

    products: Product[] = [];

    chartMonthlyData: any;

    chartMonthlyOptions: any;

    doughnutData: any;

    doughnutOptions: any;

    storeATotalValue = 100;

    storeADiff = 0;

    storeAStatus = 0;

    storeAData: any;

    storeAOptions: any;

    storeBTotalValue = 120;

    storeBDiff = 0;

    storeBStatus = 0;

    storeBData: any;

    storeBOptions: any;

    storeCTotalValue = 150;

    storeCDiff = 0;

    storeCStatus = 0;

    storeCData: any;

    storeCOptions: any;

    storeDTotalValue = 80;

    storeDDiff = 0;

    storeDStatus = 0;

    storeDData: any;

    storeDOptions: any;

    storeInterval: any;

    expensesData: any;

    expensesOptions: any;

    pieData: any;

    pieOptions: any;

    mainData: any;

    events: any[] = [];

    stateOptions: any[];

    optionValue: string = 'weekly';

    selectedCity: any;

    config: AppConfig = this.layoutService.config();

    subscription!: Subscription;

    @ViewChild('doughnut') doughnutViewChild!: UIChart;

    @ViewChild('bar') chartViewChild!: UIChart;

    @ViewChild('storeA') storeAViewChild!: UIChart;

    @ViewChild('storeB') storeBViewChild!: UIChart;

    @ViewChild('storeC') storeCViewChild!: UIChart;

    @ViewChild('storeD') storeDViewChild!: UIChart;

    @ViewChild('pie') pieViewChild!: UIChart;

    constructor(
        public app: AppComponent,
        private productService: ProductService,
        private eventService: EventService,
        public layoutService: LayoutService
    ) {
        this.stateOptions = [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
        ];

        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initCharts();
            });
    }

    ngOnInit() {
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.eventService.getEvents().then((events) => {
            this.events = events;
        });

        this.cities = [];
        this.cities.push({ label: 'Select City', value: null });
        this.cities.push({
            label: 'New York',
            value: { id: 1, name: 'New York', code: 'NY' },
        });
        this.cities.push({
            label: 'Rome',
            value: { id: 2, name: 'Rome', code: 'RM' },
        });
        this.cities.push({
            label: 'London',
            value: { id: 3, name: 'London', code: 'LDN' },
        });
        this.cities.push({
            label: 'Istanbul',
            value: { id: 4, name: 'Istanbul', code: 'IST' },
        });
        this.cities.push({
            label: 'Paris',
            value: { id: 5, name: 'Paris', code: 'PRS' },
        });

        this.initCharts();

        this.storeAData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
            ],
            datasets: [
                {
                    data: [55, 3, 45, 6, 44, 58, 84, 68, 64],
                    borderColor: ['#4DD0E1'],
                    backgroundColor: ['rgba(77, 208, 225, 0.8)'],
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };

        this.storeBData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
            ],
            datasets: [
                {
                    data: [81, 75, 63, 100, 69, 79, 38, 37, 76],
                    borderColor: ['#4DD0E1'],
                    backgroundColor: ['rgba(77, 208, 225, 0.8)'],
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };

        this.storeCData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
            ],
            datasets: [
                {
                    data: [99, 55, 22, 72, 24, 79, 35, 91, 48],
                    borderColor: ['#4DD0E1'],
                    backgroundColor: ['rgba(77, 208, 225, 0.8)'],
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };

        this.storeDData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
            ],
            datasets: [
                {
                    data: [5, 51, 68, 82, 28, 21, 29, 45, 44],
                    borderColor: ['#4DD0E1'],
                    backgroundColor: ['rgba(77, 208, 225, 0.8)'],
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };

        this.storeAOptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            responsive: true,
            aspectRatio: 4,
            scales: {
                y: {
                    display: false,
                },
                x: {
                    display: false,
                },
            },
            tooltips: {
                enabled: false,
            },
            elements: {
                point: {
                    radius: 0,
                },
            },
        };

        this.storeBOptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            responsive: true,
            aspectRatio: 4,
            scales: {
                y: {
                    display: false,
                },
                x: {
                    display: false,
                },
            },
            tooltips: {
                enabled: false,
            },
            elements: {
                point: {
                    radius: 0,
                },
            },
        };

        this.storeCOptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            responsive: true,
            aspectRatio: 4,
            scales: {
                y: {
                    display: false,
                },
                x: {
                    display: false,
                },
            },
            tooltips: {
                enabled: false,
            },
            elements: {
                point: {
                    radius: 0,
                },
            },
        };

        this.storeDOptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            responsive: true,
            aspectRatio: 4,
            scales: {
                y: {
                    display: false,
                },
                x: {
                    display: false,
                },
            },
            tooltips: {
                enabled: false,
            },
            elements: {
                point: {
                    radius: 0,
                },
            },
        };

        const calculateStore = (storeData: any, totalValue: number) => {
            let randomNumber = +(Math.random() * 500).toFixed(2);
            let data = [...storeData.datasets[0].data];
            let length = data.length;
            data.push(randomNumber);
            data.shift();
            storeData.datasets[0].data = data;

            let diff = +(data[length - 1] - data[length - 2]).toFixed(2);
            let status = diff === 0 ? 0 : diff > 0 ? 1 : -1;
            totalValue = +(totalValue + diff).toFixed(2);

            return { diff, totalValue, status };
        };

        this.storeInterval = setInterval(() => {
            requestAnimationFrame(() => {
                const {
                    diff: storeADiff,
                    totalValue: storeATotalValue,
                    status: storeAStatus,
                } = calculateStore(this.storeAData, this.storeATotalValue);
                this.storeADiff = storeADiff;
                this.storeATotalValue = storeATotalValue;
                this.storeAStatus = storeAStatus;
                this.storeAViewChild.refresh();

                const {
                    diff: storeBDiff,
                    totalValue: storeBTotalValue,
                    status: storeBStatus,
                } = calculateStore(this.storeBData, this.storeBTotalValue);
                this.storeBDiff = storeBDiff;
                this.storeBTotalValue = storeBTotalValue;
                this.storeBStatus = storeBStatus;
                this.storeBViewChild.refresh();

                const {
                    diff: storeCDiff,
                    totalValue: storeCTotalValue,
                    status: storeCStatus,
                } = calculateStore(this.storeCData, this.storeCTotalValue);
                this.storeCDiff = storeCDiff;
                this.storeCTotalValue = storeCTotalValue;
                this.storeCStatus = storeCStatus;
                this.storeCViewChild.refresh();

                const {
                    diff: storeDDiff,
                    totalValue: storeDTotalValue,
                    status: storeDStatus,
                } = calculateStore(this.storeDData, this.storeDTotalValue);
                this.storeDDiff = storeDDiff;
                this.storeDTotalValue = storeDTotalValue;
                this.storeDStatus = storeDStatus;
                this.storeDViewChild.refresh();
            });
        }, 2000);
    }

    monthlyChartInit() {
        this.chartMonthlyData = this.getChartData();
        this.chartMonthlyOptions = this.getChartOptions();
    }

    doughnutChartInit() {
        this.doughnutData = this.getDoughnutData();
        this.doughnutOptions = this.getDoughnutOptions();
    }

    pieChartInit() {
        this.pieData = this.getPieData();
        this.pieOptions = this.getPieOptions();
    }

    expensesChartInit() {
        this.expensesData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    data: [44, 59, 32, 44, 58, 52],
                    borderColor: [
                        this.layoutService.config().colorScheme === 'dark'
                            ? '#fff'
                            : '#000',
                    ],
                    backgroundColor: [
                        this.layoutService.config().colorScheme === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                    ],
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                },
            ],
        };

        this.expensesOptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            maintainAspectRatio: false,
            responsive: true,
            aspectRatio: 4,
            scales: {
                y: {
                    display: false,
                    beginAtZero: true,
                },
                x: {
                    display: false,
                },
            },
            tooltips: {
                enabled: false,
            },
            elements: {
                point: {
                    radius: 5,
                    pointBackgroundColor:
                        this.layoutService.config().colorScheme === 'dark'
                            ? '#fff'
                            : '#000',
                },
            },
        };
    }

    getColors() {
        const isLight = true;
        return {
            pinkColor: isLight ? '#EC407A' : '#F48FB1',
            purpleColor: isLight ? '#AB47BC' : '#CE93D8',
            deeppurpleColor: isLight ? '#7E57C2' : '#B39DDB',
            indigoColor: isLight ? '#5C6BC0' : '#9FA8DA',
            blueColor: isLight ? '#42A5F5' : '#90CAF9',
            lightblueColor: isLight ? '#29B6F6' : '#81D4FA',
            cyanColor: isLight ? '#00ACC1' : '#4DD0E1',
            tealColor: isLight ? '#26A69A' : '#80CBC4',
            greenColor: isLight ? '#66BB6A' : '#A5D6A7',
            lightgreenColor: isLight ? '#9CCC65' : '#C5E1A5',
            limeColor: isLight ? '#D4E157' : '#E6EE9C',
            yellowColor: isLight ? '#FFEE58' : '#FFF59D',
            amberColor: isLight ? '#FFCA28' : '#FFE082',
            orangeColor: isLight ? '#FFA726' : '#FFCC80',
            deeporangeColor: isLight ? '#FF7043' : '#FFAB91',
            brownColor: isLight ? '#8D6E63' : '#BCAAA4',
        };
    }

    getPieData() {
        const { limeColor, blueColor, tealColor } = this.getColors();
        const borderColor =
            getComputedStyle(document.body).getPropertyValue(
                '--surface-border'
            ) || 'rgba(160, 167, 181, .3)';
        return {
            labels: ['O', 'D', 'R'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [blueColor, tealColor, limeColor],
                    borderColor,
                },
            ],
        };
    }

    getPieOptions() {
        const textColor =
            getComputedStyle(document.body).getPropertyValue('--text-color') ||
            'rgba(0, 0, 0, 0.87)';
        const fontFamily = getComputedStyle(document.body).getPropertyValue(
            '--font-family'
        );
        return {
            responsive: true,
            aspectRatio: 1,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        fontFamily,
                        color: textColor,
                    },
                },
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            cutout: '0',
        };
    }

    getChartData() {
        const {
            limeColor,
            amberColor,
            orangeColor,
            blueColor,
            lightblueColor,
            cyanColor,
            tealColor,
            greenColor,
            lightgreenColor,
        } = this.getColors();

        return {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: '2012',
                    data: [6, 25, 97, 12, 7, 70, 42],
                    borderColor: blueColor,
                    backgroundColor: blueColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2013',
                    data: [81, 3, 5, 11, 59, 47, 99],
                    borderColor: lightblueColor,
                    backgroundColor: lightblueColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2014',
                    data: [68, 47, 46, 46, 61, 70, 94],
                    borderColor: cyanColor,
                    backgroundColor: cyanColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2015',
                    data: [31, 9, 18, 76, 6, 11, 79],
                    borderColor: tealColor,
                    backgroundColor: tealColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2016',
                    data: [85, 37, 47, 29, 2, 10, 54],
                    borderColor: greenColor,
                    backgroundColor: greenColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2017',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: lightgreenColor,
                    backgroundColor: lightgreenColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2018',
                    data: [89, 18, 95, 18, 97, 61, 54],
                    borderColor: limeColor,
                    backgroundColor: limeColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2019',
                    data: [18, 36, 39, 58, 41, 50, 72],
                    borderColor: amberColor,
                    backgroundColor: amberColor,
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: '2020',
                    data: [31, 4, 35, 74, 47, 35, 46],
                    borderColor: orangeColor,
                    backgroundColor: orangeColor,
                    borderWidth: 2,
                    fill: true,
                },
            ],
        };
    }

    getChartOptions() {
        const textColor =
            getComputedStyle(document.body).getPropertyValue('--text-color') ||
            'rgba(0, 0, 0, 0.87)';
        const gridLinesColor =
            getComputedStyle(document.body).getPropertyValue(
                '--surface-border'
            ) || 'rgba(160, 167, 181, .3)';
        const fontFamily = getComputedStyle(document.body).getPropertyValue(
            '--font-family'
        );
        return {
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        fontFamily,
                        color: textColor,
                    },
                },
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        fontFamily,
                        color: textColor,
                    },
                    grid: {
                        color: gridLinesColor,
                    },
                },
                x: {
                    categoryPercentage: 0.9,
                    barPercentage: 0.8,
                    ticks: {
                        fontFamily,
                        color: textColor,
                    },
                    grid: {
                        color: gridLinesColor,
                    },
                },
            },
        };
    }

    getDoughnutData() {
        const {
            blueColor,
            lightblueColor,
            cyanColor,
            tealColor,
            greenColor,
            lightgreenColor,
            orangeColor,
        } = this.getColors();
        const borderColor =
            getComputedStyle(document.body).getPropertyValue(
                '--surface-border'
            ) || 'rgba(160, 167, 181, .3)';

        return {
            labels: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ],
            datasets: [
                {
                    data: [11, 29, 71, 33, 28, 95, 6],
                    backgroundColor: [
                        blueColor,
                        lightblueColor,
                        cyanColor,
                        tealColor,
                        greenColor,
                        lightgreenColor,
                        orangeColor,
                    ],
                    borderColor,
                },
            ],
        };
    }

    getDoughnutOptions() {
        const textColor =
            getComputedStyle(document.body).getPropertyValue('--text-color') ||
            'rgba(0, 0, 0, 0.87)';
        const fontFamily = getComputedStyle(document.body).getPropertyValue(
            '--font-family'
        );
        return {
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        fontFamily,
                        color: textColor,
                    },
                },
            },
            circumference: 180,
            rotation: -90,
            animation: {
                animateScale: true,
                animateRotate: true,
            },
        };
    }

    changeMonthlyDataView() {
        if (this.chartViewChild.chart.options.scales.x.stacked) {
            this.chartViewChild.chart.options.scales.x.stacked = false;
            this.chartViewChild.chart.options.scales.y.stacked = false;
        } else {
            this.chartViewChild.chart.options.scales.x.stacked = true;
            this.chartViewChild.chart.options.scales.y.stacked = true;
        }

        this.chartViewChild.chart.update();
    }

    changeDoughnutDataView() {
        if (this.doughnutViewChild.chart.options.circumference === 180) {
            this.doughnutViewChild.chart.options.circumference = 360;
            this.doughnutViewChild.chart.options.rotation = -45;
        } else {
            this.doughnutViewChild.chart.options.circumference = 180;
            this.doughnutViewChild.chart.options.rotation = -90;
        }

        this.doughnutViewChild.chart.update();
    }

    togglePieDoughnut() {
        this.pieViewChild.chart.options.cutout =
            this.pieViewChild.chart.options.cutout !== '0' ? '0' : '50%';
        this.pieViewChild.chart.update();
    }

    changePieDoughnutDataView() {
        if (this.pieViewChild.chart.options.circumference === 180) {
            this.pieViewChild.chart.options.circumference = 360;
            this.pieViewChild.chart.options.rotation = -45;
        } else {
            this.pieViewChild.chart.options.circumference = 180;
            this.pieViewChild.chart.options.rotation = -90;
        }

        this.pieViewChild.chart.update();
    }

    initCharts() {
        this.monthlyChartInit();
        this.pieChartInit();
        this.doughnutChartInit();
        this.expensesChartInit();
    }

    ngOnDestroy() {
        if (this.storeInterval) {
            clearInterval(this.storeInterval);
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
