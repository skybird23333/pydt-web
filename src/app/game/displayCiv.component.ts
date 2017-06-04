import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CivDef } from 'pydt-shared';

@Component({
  selector: 'pydt-display-civ',
  templateUrl: './displayCiv.component.html'
})
export class DisplayCivComponent {
  @Input() civ: CivDef;
  @Output() click = new EventEmitter<CivDef>();

  constructor() {
  }

  imageUrl() {
    let url = 'RANDOM_RANDOM.png';

    if (this.civ) {
      url = this.civ.getImageFileName();
    }

    return `/img/civs/${url}`;
  }

  clicked() {
    this.click.emit(this.civ);
  }
}
