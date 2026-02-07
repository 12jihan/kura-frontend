import { Component, input } from '@angular/core';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent {
  readonly currentStep = input(1);
  readonly steps = input<string[]>([]);

  readonly checkIcon = Check;
}
