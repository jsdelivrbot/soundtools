import { Component } from '@angular/core';
import { ChakraTuner } from './chakratuner.component';

@Component({
    selector: 'my-app',
    template: `
      <div class="main">
        <h1>Sound Tools</h1>
        <chakratuner></chakratuner>
      </div>
    `
})

export class AppComponent { }
