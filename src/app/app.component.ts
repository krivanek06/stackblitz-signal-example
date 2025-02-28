import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  template: `
  <div class="h-10 bg-green-500 text-white text-center p-2">
    asdsda
  </div>
  `,
  styles: []
})
export class AppComponent {
}
