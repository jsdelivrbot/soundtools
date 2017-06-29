import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule }   from '@angular/forms';


@Component({
  selector: 'chakratuner',
  templateUrl: 'app/chakratuner.template.html',
  styleUrls: ['app/chakratuner.css']

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
    this.activateClosestKey();

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

  activateClosestKey() {
    var closestKey = this.keyfreqs.find(function(key:any){ return key.active == true; });
    var keyDifference = Math.abs(this.calcfreq - closestKey.value);
    this.keyfreqs.map((key:any) => {
      keyDifference = Math.abs(this.calcfreq - closestKey.value);
      if (Math.abs(this.calcfreq - key.value) < keyDifference) { closestKey = key; }
      key.active = false;
    });
    closestKey.active = true;
  }
}
