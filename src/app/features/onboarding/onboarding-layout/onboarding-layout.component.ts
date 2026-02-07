import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { ProgressComponent } from '../../../shared/components/progress/progress.component';

@Component({
  selector: 'app-onboarding-layout',
  standalone: true,
  imports: [RouterOutlet, ProgressComponent],
  templateUrl: './onboarding-layout.component.html',
  styleUrl: './onboarding-layout.component.scss',
})
export class OnboardingLayoutComponent {
  private readonly router = inject(Router);

  readonly steps = ['Handle', 'Content', 'Voice', 'Keywords'];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url)
    )
  );

  readonly currentStep = computed(() => {
    const url = this.url() ?? this.router.url;
    const match = url.match(/step-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  });
}
