import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from '../app.menu.service';
import {
    ColorScheme,
    LayoutService,
    MenuMode,
} from '../service/app.layout.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgFor, NgClass, NgIf, NgStyle } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        SidebarModule,
        NgFor,
        NgClass,
        RadioButtonModule,
        FormsModule,
        NgIf,
        InputSwitchModule,
        NgStyle,
    ],
})
export class AppConfigComponent implements OnInit {
    @Input() minimal: boolean = false;

    componentThemes: any[] = [];

    menuThemes: any[] = [];

    topbarThemes: any[] = [];

    scales: number[] = [12, 13, 14, 15, 16];

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) {}

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config().scale;
    }
    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
    }

    get menuMode(): MenuMode {
        return this.layoutService.config().menuMode;
    }
    set menuMode(_val: MenuMode) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
        if (this.layoutService.isSlim() || this.layoutService.isHorizontal()) {
            this.menuService.reset();
        }
    }

    get menuProfilePosition(): string {
        return this.layoutService.config().menuProfilePosition;
    }
    set menuProfilePosition(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuProfilePosition: _val,
        }));
        if (
            this.layoutService.isSlimPlus() ||
            this.layoutService.isSlim() ||
            this.layoutService.isHorizontal()
        ) {
            this.menuService.reset();
        }
    }

    get colorScheme(): ColorScheme {
        return this.layoutService.config().colorScheme;
    }
    set colorScheme(_val: ColorScheme) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuTheme: _val === 'dark' ? 'dark' : config.menuTheme,
            colorScheme: _val,
        }));
    }

    get inputStyle(): string {
        return this.layoutService.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            inputStyle: _val,
        }));
    }

    get ripple(): boolean {
        return this.layoutService.config().ripple;
    }
    set ripple(_val: boolean) {
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
    }

    get menuTheme(): string {
        return this.layoutService.config().menuTheme;
    }
    set menuTheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuTheme: val,
        }));
    }

    get topbarTheme(): string {
        return this.layoutService.config().topbarTheme;
    }
    set topbarTheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            topbarTheme: val,
        }));
    }

    get componentTheme(): string {
        return this.layoutService.config().componentTheme;
    }
    set componentTheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            componentTheme: val,
        }));
    }

    ngOnInit() {
        this.componentThemes = [
            { name: 'indigo', color: '#3F51B5' },
            { name: 'pink', color: '#E91E63' },
            { name: 'purple', color: '#9C27B0' },
            { name: 'deeppurple', color: '#673AB7' },
            { name: 'blue', color: '#2196F3' },
            { name: 'lightblue', color: '#03A9F4' },
            { name: 'cyan', color: '#00BCD4' },
            { name: 'teal', color: '#009688' },
            { name: 'green', color: '#377B53' },
            { name: 'lightgreen', color: '#8BC34A' },
            { name: 'lime', color: '#CDDC39' },
            { name: 'yellow', color: '#FFEB3B' },
            { name: 'amber', color: '#FFC107' },
            { name: 'orange', color: '#FF9800' },
            { name: 'deeporange', color: '#FF5722' },
            { name: 'brown', color: '#795548' },
            { name: 'bluegrey', color: '#607D8B' },
        ];

        this.menuThemes = [
            { name: 'light', color: '#FDFEFF' },
            { name: 'dark', color: '#434B54' },
            { name: 'indigo', color: '#1A237E' },
            { name: 'bluegrey', color: '#37474F' },
            { name: 'brown', color: '#4E342E' },
            { name: 'cyan', color: '#006064' },
            { name: 'green', color: '#377B53' },
            { name: 'deeppurple', color: '#4527A0' },
            { name: 'deeporange', color: '#BF360C' },
            { name: 'pink', color: '#880E4F' },
            { name: 'purple', color: '#6A1B9A' },
            { name: 'teal', color: '#00695C' },
        ];

        this.topbarThemes = [
            { name: 'lightblue', color: '#2E88FF' },
            { name: 'dark', color: '#363636' },
            { name: 'white', color: '#FDFEFF' },
            { name: 'blue', color: '#1565C0' },
            { name: 'deeppurple', color: '#4527A0' },
            { name: 'purple', color: '#6A1B9A' },
            { name: 'pink', color: '#AD1457' },
            { name: 'cyan', color: '#0097A7' },
            { name: 'teal', color: '#00796B' },
            { name: 'green', color: '#377B53' },
            { name: 'lightgreen', color: '#689F38' },
            { name: 'lime', color: '#AFB42B' },
            { name: 'yellow', color: '#FBC02D' },
            { name: 'amber', color: '#FFA000' },
            { name: 'orange', color: '#FB8C00' },
            { name: 'deeporange', color: '#D84315' },
            { name: 'brown', color: '#5D4037' },
            { name: 'grey', color: '#616161' },
            { name: 'bluegrey', color: '#546E7A' },
            { name: 'indigo', color: '#3F51B5' },
        ];
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string) {
        this.componentTheme = theme;
    }

    changeTopbarTheme(theme: string) {
        this.topbarTheme = theme;
    }

    changeMenuTheme(theme: string) {
        this.menuTheme = theme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
}
