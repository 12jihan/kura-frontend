import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Sparkles, Send, UserCircle } from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  readonly sparklesIcon = Sparkles;
  readonly sendIcon = Send;
  readonly userCircleIcon = UserCircle;

  readonly features = [
    {
      icon: this.sparklesIcon,
      title: 'Daily fresh ideas',
      description:
        'AI generates content cards matched to your unique voice and niche — never run out of ideas.',
    },
    {
      icon: this.sendIcon,
      title: 'One-click publishing',
      description:
        'Schedule or post straight to LinkedIn with a single click. No copy-pasting needed.',
    },
    {
      icon: this.userCircleIcon,
      title: 'Your voice, amplified',
      description:
        'Define your brand identity once and let AI handle the rest — content that sounds like you.',
    },
  ];
}
