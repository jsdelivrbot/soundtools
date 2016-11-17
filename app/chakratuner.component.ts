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
            <td *ngFor="let key of keyfreqs" [ngClass]="{ 'keyactive': (key.active), 'key': (!key.active) }" (click)="keyClick(key);">
              <div class="keyoctave">{{key.octave}}</div>
              <div class="keynote">{{key.key}}</div>
              <!-- <div class="keyoctave">{{key.value}}</div> -->
            </td>
          </tr>
        </table>
        <div class="freqslider">
          <h3>Frequency:  </h3>
          <div class="ui-slider">
            <input type="range" name="slider-2" id="slider-2" min="44" max="4400" step="1" value="440" [(ngModel)]="calcfreq" (ngModelChange)="freqChange()">
          </div>
        </div>
        <div class="frequency">
          <input type="number" min="44" max="4400" [(ngModel)]="calcfreq" (ngModelChange)="freqChange()">
        </div>
      </div>
    </div>
  `
})

export class ChakraTuner implements OnInit {
  private masterfreq:number;
  private calcfreq:number;
  private keyfreqs:any;
  private masteroctave:number;
  private TWELTH_ROOT:number;

  Constructor(){
  }

  ngOnInit(){
    this.masterfreq = 440;
    this.calcfreq = 440;
    this.masteroctave = 4;
    this.keyfreqs = [
      { key: "C", offset: -9, octave: 3 },
      { key: "D", offset: -7, octave: 3 },
      { key: "E", offset: -5, octave: 3 },
      { key: "F", offset: -4, octave: 3 },
      { key: "G", offset: -2, octave: 3 },
      { key: "A", offset: 0, octave: 4, active: true },
      { key: "B", offset: 2, octave: 4 }
    ];
    this.TWELTH_ROOT = Math.pow(2, (1/12));
    this.masterChange();
  }

  masterChange() {

    this.updateKeyFreqs();    /* set frequencies of each key */
    this.updateKeyOctaves();  /* set octaves of each key */
    this.activateKey("A");    /* light up A key */
  }

  freqChange() {
    this.updateKeyOctaves();  /* set octaves according to frequency slider */
    /* this.updateFreqFromOctave(); */

    /* there should be a function here that lights up the nearest key relative to master octave */
  }

  keyClick(key:any) {
    /* this should actually pull a recalculated frequency based on the key.octave */
    this.calcfreq = key.value;
    this.updateKeyOctaves();  /* this currently resets octaves back to 3 and 4 */
    this.activateKey(key.key);      /* light up key when clicked */
  }

  activateKey(keyNote:string){
    this.keyfreqs.map((key:any) => {
      key.active = (key.key == keyNote) ? true : false;
    });
  }

  updateKeyFreqs() {          /* runs when master tuning frequency is changed */
    this.keyfreqs.map((key:any) => {
      /* calculate the frequency based on master frequency and key.offset */
      key.value = Math.round(this.masterfreq * Math.pow(this.TWELTH_ROOT, key.offset));
    });
    this.calcfreq = this.masterfreq;  /* set frequency slider to master frequency */
  }

  updateKeyOctaves() {
  	this.keyfreqs.map((key:any) => {
  		let oct_top:number = key.value * 2;
  		let oct_bottom:number = Math.round(key.value / 2);
  		let calculatedoctave:number = key.octave;
  		while (this.calcfreq > oct_top) { oct_top = oct_top * 2; calculatedoctave++; }
  		while (oct_bottom >= this.calcfreq) { oct_bottom = oct_bottom - Math.round(oct_bottom / 2); calculatedoctave--; }
      let octavediff:number = calculatedoctave - key.octave;
      let freqdiff:number = key.value;
      while (octavediff < 0) { freqdiff = Math.round(freqdiff / 2); octavediff++ }
  		while (octavediff > 0) { freqdiff = freqdiff * 2; octavediff-- }
      key.value = freqdiff;
      key.octave = calculatedoctave;
  		if (key.key == "A") { this.masteroctave = calculatedoctave; }
    });
  }

  updateFreqFromOctave() {
  	this.keyfreqs.map((key:any) => {
      console.log("OCTAVE: " + key.octave);
  		let octavediff:number = (key.offset < 0) ? (key.octave - 3) : (key.octave - 4);
      console.log("OCTAVEDIFF: " + octavediff);
      let freqdiff:number = key.value;
  		while (octavediff < 0) { freqdiff = Math.round(freqdiff / 2); octavediff++ }
  		while (octavediff > 0) { freqdiff = freqdiff * 2; octavediff-- }
      key.value = freqdiff;
      console.log("VALUE: " + key.value);
  	});
  }

  updateKeyOctaves2() {
    var calculatedoctave:number;
    var freqdiff:number;
    var oct_top:number = this.masterfreq * 2;
    var oct_bottom:number = Math.round(this.masterfreq / 2);

    this.keyfreqs.map((key:any) => {
      calculatedoctave = 4;

      /* frequency slider is above upper range of the master frequency's octave */
      if (this.calcfreq > oct_top) {
        freqdiff = oct_top;
        while(this.calcfreq > freqdiff) {
          freqdiff = freqdiff * 2;
          calculatedoctave++;
        }

      /* frequency slider is below the lower range of master frequencie's octave */
      } else if (this.calcfreq < oct_bottom) {
        freqdiff = oct_bottom;
        while(freqdiff>this.calcfreq) {
          freqdiff = freqdiff - Math.round(freqdiff / 2);
          calculatedoctave--;
        }
      }
      /* octave splits in the middle, so if the note is below the master A frequency, it's the next octave down */
      if (key.offset < 0) { calculatedoctave--; }

      /* set octave */
      key.octave = calculatedoctave;

      /* if we are measuring A, set this to the master octave */
      if (key.key == "A") { this.masteroctave = calculatedoctave; }
    });
  }

}
