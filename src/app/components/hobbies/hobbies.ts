import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface HobbyCard {
  title: string;
  text: string;
}

@Component({
  selector: 'app-hobbies',
  imports: [ScrollRevealDirective],
  templateUrl: './hobbies.html',
  styleUrl: './hobbies.css',
})
export class Hobbies {
  readonly cards: HobbyCard[] = [
    {
      title: 'Sports',
      text: 'Cricket and football strengthen discipline, consistency, and team communication.',
    },
    {
      title: 'Continuous Learning',
      text: 'I regularly explore new tools and frameworks, then turn those learnings into practical solutions.',
    },
    {
      title: 'Coffee & Travel',
      text: 'Coffee supports focused deep work, while travel brings fresh perspective and long-term creativity.',
    },
  ];
}
