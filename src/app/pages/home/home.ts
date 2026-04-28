import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Experience } from '../../components/experience/experience';
import { Education } from '../../components/education/education';
import { Projects } from '../../components/projects/projects';
import { Achievement } from '../../components/achievement/achievement';
import { Skills } from '../../components/skills/skills';
import { Hobbies } from '../../components/hobbies/hobbies';
import { Contact } from '../../components/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Experience, Education, Projects, Achievement, Skills, Hobbies, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home { }
