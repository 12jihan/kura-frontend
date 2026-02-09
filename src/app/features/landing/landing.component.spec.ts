import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LandingComponent } from './landing.component';
import { routes } from '../../app.routes';
import { noAuthGuard } from '../../core/auth/no-auth.guard';

describe('LandingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the hero headline', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headline = compiled.querySelector('.landing__headline');
    expect(headline).toBeTruthy();
    expect(headline!.textContent).toContain('AI-powered content engine');
  });

  it('should render Get Started CTA linking to /register', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const primaryCta = compiled.querySelector('.landing__cta--primary') as HTMLAnchorElement;
    expect(primaryCta).toBeTruthy();
    expect(primaryCta.textContent!.trim()).toBe('Get Started');
    expect(primaryCta.getAttribute('href')).toBe('/register');
  });

  it('should render Log In CTA linking to /login', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const secondaryCta = compiled.querySelector('.landing__cta--secondary') as HTMLAnchorElement;
    expect(secondaryCta).toBeTruthy();
    expect(secondaryCta.textContent!.trim()).toBe('Log In');
    expect(secondaryCta.getAttribute('href')).toBe('/login');
  });

  it('should render 3 value proposition cards', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.landing__feature-card');
    expect(cards.length).toBe(3);
  });

  it('should render feature card titles', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titles = compiled.querySelectorAll('.landing__feature-title');
    expect(titles[0]!.textContent).toContain('Daily fresh ideas');
    expect(titles[1]!.textContent).toContain('One-click publishing');
    expect(titles[2]!.textContent).toContain('Your voice, amplified');
  });

  it('should render feature icons with aria-hidden', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const iconContainers = compiled.querySelectorAll('.landing__feature-icon');
    iconContainers.forEach((container) => {
      expect(container.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should render footer CTA linking to /register', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footerCta = compiled.querySelector('.landing__footer-cta .landing__cta--primary') as HTMLAnchorElement;
    expect(footerCta).toBeTruthy();
    expect(footerCta.getAttribute('href')).toBe('/register');
  });

  it('should use semantic HTML with 3 sections', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('section');
    expect(sections.length).toBe(3);
  });

  it('should have proper heading hierarchy (h2 + h3s)', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    const h3s = compiled.querySelectorAll('h3');
    expect(h2).toBeTruthy();
    expect(h3s.length).toBe(3);
  });

  it('should have features section with aria-label', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const featuresSection = compiled.querySelector('.landing__features');
    expect(featuresSection!.getAttribute('aria-label')).toBe('Platform benefits');
  });

  describe('Route Configuration', () => {
    const authLayoutRoute = routes.find(
      (r) => r.path === '' && r.children?.some((c) => c.path === 'login')
    );
    const landingRoute = authLayoutRoute?.children?.find(
      (r) => r.path === '' && r.pathMatch === 'full'
    );

    it('should configure landing page as default route with pathMatch full (AC1)', () => {
      expect(authLayoutRoute).toBeTruthy();
      expect(landingRoute).toBeTruthy();
      expect(landingRoute!.pathMatch).toBe('full');
    });

    it('should lazy-load LandingComponent for the default route', async () => {
      expect(landingRoute!.loadComponent).toBeTruthy();
      const component = await (landingRoute!.loadComponent as Function)();
      expect(component).toBe(LandingComponent);
    });

    it('should use noAuthGuard to redirect authenticated users (AC6)', () => {
      expect(landingRoute!.canActivate).toContain(noAuthGuard);
    });
  });
});
