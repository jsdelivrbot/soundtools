import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule }   from '@angular/forms';


@Component({
  selector: 'chakratuner',
  template: `
    <h3>Chakra Tuner</h3>
    <div class="chakratuner">
      <div class="tunercontainer">
        <table class="tunertable tableslider">
          <tr>
            <td class="tdlabel">Master Tuning: <input type="number" min="220" max="880" [(ngModel)]="masterfreq" (ngModelChange)="masterChange()"></td>
            <td class="tdslider">
              <div class="ui-slider">
                <input type="range" name="mastertune" id="slider-1" min="220" max="880" step="1" value="440" [(ngModel)]="masterfreq" (ngModelChange)="masterChange()">
              </div>
            </td>
          </tr>
        </table>
        <table class="tunertable keys">
          <tr>
            <td *ngFor="let key of keyfreqs" class="key" (click)="this.calcfreq = (key.value)">
              <div class="keyoctave">{{key.octave}}</div>
              <div class="keynote">{{key.key}}</div>
              <div class="keyoctave">{{key.value}}</div>
            </td>
          </tr>
        </table>
        <div class="freqslider">
          <h3>Frequency: <input type="number" min="0" max="20000" [(ngModel)]="calcfreq" (ngModelChange)="freqChange()"></h3>
          <div class="ui-slider">
            <input type="range" name="slider-2" id="slider-2" min="0" max="20000" step="1" value="440" [(ngModel)]="calcfreq" (ngModelChange)="freqChange()">
          </div>
        </div>
        <div class="frequency">
          {{calcfreq}}
        </div>
      </div>
    </div>
  `
})

export class ChakraTuner implements OnInit {
  private masterfreq:number;
  private calcfreq:number;
  private calcfreqprev:number;
  private keyfreqs:any;
  private masteroctave:number;
  test:any;

  Constructor(){
  }

  ngOnInit(){
    this.masterfreq = 440;
    this.calcfreq = 440;
    this.masteroctave = 4;
    this.calcfreqprev = this.calcfreq;
    this.keyfreqs = [
      { key: "C", offset: -9 },
      { key: "D", offset: -7 },
      { key: "E", offset: -5 },
      { key: "F", offset: -4 },
      { key: "G", offset: -2 },
      { key: "A", offset: 0 },
      { key: "B", offset: 2 }
    ];
    this.updateKeyOctaves();
    this.updateKeyFreqs();
  }

  masterChange() {
    this.updateKeyFreqs();
    this.updateKeyOctaves();
  }

  freqChange() {
    this.updateKeyOctaves();

    /*  calcfreqprev will have old value, calcfreq will have new,
        this way we can figure out if they are sliding up or down

        this slider is so coarse that we probably wont land on the specific
        frequencies, we will need to MOVE from one key to another, maybe
        we have a range?
    */
    if (this.calcfreq == 0) {
      console.log("hit 0!");
    }
    if (this.calcfreq == 20000) {
      console.log("hit 20000!");
    }
  }

  updateKeyFreqs() {
    var a:number = Math.pow(2, (1/12));
    var newfreqs = [];
    var calculatedfreq:number;

    newfreqs = this.keyfreqs;

    if (newfreqs.length > 0) {
      for(var x=0;x<newfreqs.length;x++) {
        calculatedfreq = Math.round(this.masterfreq * Math.pow(a, newfreqs[x].offset));
        newfreqs[x].value = calculatedfreq;
        if (newfreqs[x].key == "A") { this.calcfreq = calculatedfreq; }
      }
    }
    this.keyfreqs = newfreqs;
  }

  updateKeyOctaves() {
    var newfreqs = [];
    var calculatedoctave:number;
    var freqdiff:number;

    newfreqs = this.keyfreqs;

    for (var x=0;x<newfreqs.length;x++){
      calculatedoctave = 4;
      if (this.calcfreq > (this.masterfreq) * 2) {
        freqdiff = this.masterfreq * 2;
        for(var i=1;this.calcfreq>freqdiff;i++){
          freqdiff = freqdiff * 2;
          calculatedoctave++;
        }
      } else if (this.calcfreq < Math.round(this.masterfreq / 2)) {
        freqdiff = Math.round(this.masterfreq / 2);
        for(var i=0;freqdiff>this.calcfreq;i++){
          freqdiff = freqdiff - Math.round(freqdiff / 2);
          calculatedoctave--;
        }
      }
      newfreqs[x].octave = calculatedoctave;
    }
    this.keyfreqs = newfreqs;
  }

}
