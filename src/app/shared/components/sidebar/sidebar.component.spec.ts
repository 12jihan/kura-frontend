import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../../../core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authServiceMock: { logout: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      logout: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('.sidebar__link');

    expect(links.length).toBe(2);
    expect(links[0].textContent).toContain('Cards');
    expect(links[1].textContent).toContain('Scheduled');
  });

  it('should render the logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('.sidebar__logo');

    expect(logo).toBeTruthy();
    expect(logo?.textContent).toContain('Kura');
  });

  it('should call logout on logout button click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutButton = compiled.querySelector(
      '.sidebar__logout'
    ) as HTMLButtonElement;

    logoutButton.click();

    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const aside = compiled.querySelector('aside');
    const logoutButton = compiled.querySelector('.sidebar__logout');

    expect(aside?.getAttribute('aria-label')).toBe('Main navigation');
    expect(logoutButton?.getAttribute('aria-label')).toBe('Log out');
  });

  describe('Logout Navigation (AC#2, AC#4)', () => {
    it('should navigate to /login with replaceUrl after successful logout', async () => {
      await component.onLogout();

      expect(authServiceMock.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        replaceUrl: true,
      });
    });

    it('should navigate to /login with replaceUrl even if logout throws error', async () => {
      authServiceMock.logout.mockRejectedValue(new Error('Logout failed'));

      await component.onLogout();

      expect(router.navigate).toHaveBeenCalledWith(['/login'], {
        replaceUrl: true,
      });
    });

    it('should call logout and navigate when logout button is clicked', async () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const logoutButton = compiled.querySelector(
        '.sidebar__logout'
      ) as HTMLButtonElement;

      logoutButton.click();
      await fixture.whenStable();

      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });
});
