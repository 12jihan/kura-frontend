import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutGrid, CalendarClock, LogOut, User } from 'lucide-angular';
import { AuthService } from '../../../core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly icons = {
    layoutGrid: LayoutGrid,
    calendarClock: CalendarClock,
    logOut: LogOut,
    user: User,
  };

  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      // Logout errors are rare but handle gracefully
      console.error('Logout error:', error);
    }
    // Always navigate to login with replaceUrl to prevent back button access (AC#4)
    await this.router.navigate(['/login'], { replaceUrl: true });
  }
}
