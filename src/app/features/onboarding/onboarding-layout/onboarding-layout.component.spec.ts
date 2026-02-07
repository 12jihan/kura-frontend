import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { OnboardingLayoutComponent } from './onboarding-layout.component';

describe('OnboardingLayoutComponent', () => {
  let component: OnboardingLayoutComponent;
  let fixture: ComponentFixture<OnboardingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 onboarding steps', () => {
    expect(component.steps).toEqual(['Handle', 'Content', 'Voice', 'Keywords']);
  });

  it('should render the Kura logo', () => {
    const logo = fixture.nativeElement.querySelector('.onboarding__logo');
    expect(logo).toBeTruthy();
    expect(logo.textContent).toBe('Kura');
  });

  it('should render the subtitle', () => {
    const subtitle = fixture.nativeElement.querySelector('.onboarding__subtitle');
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent).toBe('Set up your content profile');
  });

  it('should render the progress component', () => {
    const progress = fixture.nativeElement.querySelector('app-progress');
    expect(progress).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should default to step 1', () => {
    expect(component.currentStep()).toBe(1);
  });
});
