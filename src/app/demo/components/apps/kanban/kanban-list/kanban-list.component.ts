import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, SharedModule } from 'primeng/api';
import { KanbanCard, KanbanList } from 'src/app/demo/api/kanban';
import { KanbanAppComponent } from '../kanban.app.component';
import { KanbanService } from '../service/kanban.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { KanbanCardComponent } from '../kanban-card/kanban-card.component';
import { NgFor } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { InplaceModule } from 'primeng/inplace';

@Component({
    selector: 'app-kanban-list',
    templateUrl: './kanban-list.component.html',
    styleUrls: ['./kanban-list.component.scss'],
    standalone: true,
    imports: [InplaceModule, SharedModule, TooltipModule, FormsModule, InputTextModule, ButtonModule, RippleModule, MenuModule, CdkDropList, NgFor, KanbanCardComponent, CdkDrag, CdkDragHandle]
})
export class KanbanListComponent implements OnInit {

    @Input() list!: KanbanList;

    @Input() listIds!: string[];

    menuItems: MenuItem[] = [];

    title: string = '';

    timeout: any = null;

    isMobileDevice: boolean = false;

    @ViewChild('inputEl') inputEl!: ElementRef;

    @ViewChild('listEl') listEl!: ElementRef;

    constructor(public parent: KanbanAppComponent, private kanbanService: KanbanService) { }

    ngOnInit(): void {
        this.isMobileDevice = this.kanbanService.isMobileDevice();

        this.menuItems = [
            {
                label: 'List actions', items: [
                    { separator: true },
                    { label: 'Copy list', command: () => this.onCopy(this.list) },
                    { label: 'Remove list', command: () =>  {
                        if (this.list.listId) {
                            this.onDelete(this.list.listId)
                        }
                    }},
                ]
            }
        ];
    }

    toggleSidebar() {
        this.parent.sidebarVisible = true;
    }

    onDelete(id: string) {
        this.kanbanService.deleteList(id);
    }

    onCopy(list: KanbanList) {
        this.kanbanService.copyList(list);
    }

    onCardClick(event: Event, card: KanbanCard) {
        const eventTarget = event.target as HTMLElement;
        if (!(eventTarget.classList.contains('p-button-icon') || eventTarget.classList.contains('p-trigger'))) {
            if (this.list.listId) {
                this.kanbanService.onCardSelect(card, this.list.listId);
            }
            this.parent.sidebarVisible = true;
        }
    }

    insertCard() {
        if (this.list.listId) {
            this.kanbanService.addCard(this.list.listId);
        }
    }

    dropCard(event: CdkDragDrop<KanbanCard[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    focus() {
        this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
    }

    insertHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '10rem';
    }

    removeHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '2rem';
    }

}
