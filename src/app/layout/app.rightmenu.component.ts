import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { SidebarModule } from 'primeng/sidebar';

@Component({
    selector: 'app-rightmenu',
    templateUrl: './app.rightmenu.component.html',
    standalone: true,
    imports: [SidebarModule]
})
export class AppRightMenuComponent {

    constructor(public layoutService: LayoutService) { }

    get rightMenuActive(): boolean {
        return this.layoutService.state.rightMenuActive;
    }

    set rightMenuActive(_val: boolean) {
        this.layoutService.state.rightMenuActive = _val;
    }


}
