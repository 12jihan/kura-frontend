import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PasswordResetComponent } from './password-reset.component';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display password reset title', () => {
    const title = fixture.nativeElement.querySelector('.password-reset__title');
    expect(title.textContent).toContain('Reset your password');
  });

  it('should display placeholder message for Story 1.5', () => {
    const placeholder = fixture.nativeElement.querySelector(
      '.password-reset__placeholder'
    );
    expect(placeholder.textContent).toContain('Story 1.5');
  });

  it('should have back to login link', () => {
    const backLink = fixture.nativeElement.querySelector(
      'a[routerLink="/login"]'
    );
    expect(backLink).toBeTruthy();
    expect(backLink.textContent).toContain('Back to login');
  });
});
