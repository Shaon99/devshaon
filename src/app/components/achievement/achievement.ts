import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-achievement',
  imports: [ScrollRevealDirective],
  templateUrl: './achievement.html',
  styleUrl: './achievement.css',
})
export class Achievement {
  readonly creativeGroupUrl = 'https://creativegroupbd.com/';
  /** Creative Group official brand asset (Cloudinary). */
  readonly coverImageSrc =
    'https://res.cloudinary.com/dsqmpansp/image/upload/v1710253753/CG/GeneralImage/t3f8zsdf9mt2b261aaxb.png';
}
