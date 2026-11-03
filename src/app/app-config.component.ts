import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-config',
  standalone: true,
  template: `
    <div [class.minimal]="minimal">
      <!-- Votre contenu -->
    </div>
  `
})
export class AppConfigComponent {
  @Input() minimal: boolean = false;
}