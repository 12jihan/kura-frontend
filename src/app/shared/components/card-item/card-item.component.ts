import { Component, input } from '@angular/core';
import { LucideAngularModule, Linkedin } from 'lucide-angular';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { Card } from '../../../core/services/card.service';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [LucideAngularModule, RelativeTimePipe],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss',
})
export class CardItemComponent {
  readonly card = input.required<Card>();
  readonly linkedinIcon = Linkedin;
}
