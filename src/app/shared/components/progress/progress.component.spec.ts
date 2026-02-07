import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressComponent } from './progress.component';

describe('ProgressComponent', () => {
  let component: ProgressComponent;
  let fixture: ComponentFixture<ProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', ['Handle', 'Content', 'Voice', 'Keywords']);
    fixture.componentRef.setInput('currentStep', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all 4 steps', () => {
    const steps = fixture.nativeElement.querySelectorAll('.progress__step');
    expect(steps.length).toBe(4);
  });

  it('should display step labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('.progress__label');
    expect(labels[0].textContent.trim()).toBe('Handle');
    expect(labels[1].textContent.trim()).toBe('Content');
    expect(labels[2].textContent.trim()).toBe('Voice');
    expect(labels[3].textContent.trim()).toBe('Keywords');
  });

  it('should mark step 1 as active when currentStep is 1', () => {
    const steps = fixture.nativeElement.querySelectorAll('.progress__step');
    expect(steps[0].classList.contains('progress__step--active')).toBe(true);
    expect(steps[1].classList.contains('progress__step--active')).toBe(false);
  });

  it('should show step numbers in indicators', () => {
    const indicators = fixture.nativeElement.querySelectorAll('.progress__indicator');
    expect(indicators[0].textContent.trim()).toBe('1');
    expect(indicators[1].textContent.trim()).toBe('2');
  });

  it('should mark previous steps as complete when currentStep is 2', () => {
    fixture.componentRef.setInput('currentStep', 2);
    fixture.detectChanges();

    const steps = fixture.nativeElement.querySelectorAll('.progress__step');
    expect(steps[0].classList.contains('progress__step--complete')).toBe(true);
    expect(steps[1].classList.contains('progress__step--active')).toBe(true);
    expect(steps[2].classList.contains('progress__step--active')).toBe(false);
  });

  it('should show check icon for completed steps', () => {
    fixture.componentRef.setInput('currentStep', 3);
    fixture.detectChanges();

    const completedSteps = fixture.nativeElement.querySelectorAll('.progress__step--complete');
    expect(completedSteps.length).toBe(2);

    const checkIcons = fixture.nativeElement.querySelectorAll('.progress__step--complete lucide-icon');
    expect(checkIcons.length).toBe(2);
  });

  it('should have progressbar role with aria attributes', () => {
    const progressbar = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(progressbar).toBeTruthy();
    expect(progressbar.getAttribute('aria-valuenow')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('4');
    expect(progressbar.getAttribute('aria-label')).toBe('Step 1 of 4');
  });

  it('should update aria-valuenow when step changes', () => {
    fixture.componentRef.setInput('currentStep', 3);
    fixture.detectChanges();

    const progressbar = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('3');
    expect(progressbar.getAttribute('aria-label')).toBe('Step 3 of 4');
  });

  it('should accept currentStep and steps as inputs', () => {
    fixture.componentRef.setInput('steps', ['A', 'B']);
    fixture.componentRef.setInput('currentStep', 2);
    fixture.detectChanges();

    const steps = fixture.nativeElement.querySelectorAll('.progress__step');
    expect(steps.length).toBe(2);
  });

  it('should not mark any step as active when currentStep exceeds step count', () => {
    fixture.componentRef.setInput('currentStep', 5);
    fixture.detectChanges();

    const activeSteps = fixture.nativeElement.querySelectorAll('.progress__step--active');
    expect(activeSteps.length).toBe(0);

    const completeSteps = fixture.nativeElement.querySelectorAll('.progress__step--complete');
    expect(completeSteps.length).toBe(4);
  });
});
