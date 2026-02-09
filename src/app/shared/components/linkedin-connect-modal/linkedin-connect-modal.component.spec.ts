import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkedInConnectModalComponent } from './linkedin-connect-modal.component';

describe('LinkedInConnectModalComponent', () => {
  let component: LinkedInConnectModalComponent;
  let fixture: ComponentFixture<LinkedInConnectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedInConnectModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedInConnectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render modal content when isOpen is false', () => {
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeFalsy();
  });

  it('should render modal content when isOpen is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();

    const title = fixture.nativeElement.querySelector('.linkedin-modal__title');
    expect(title.textContent).toContain('Connect LinkedIn');

    const text = fixture.nativeElement.querySelector('.linkedin-modal__text');
    expect(text.textContent).toContain('Connect to publish directly to LinkedIn');
  });

  it('should emit connect when "Connect LinkedIn" button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const connectSpy = vi.spyOn(component.connect, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    const connectButton = buttons[1]; // second button is "Connect LinkedIn"
    connectButton.querySelector('button').click();

    expect(connectSpy).toHaveBeenCalled();
  });

  it('should emit skip when "Skip for now" button is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const skipSpy = vi.spyOn(component.skip, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('app-button');
    const skipButton = buttons[0]; // first button is "Skip for now"
    skipButton.querySelector('button').click();

    expect(skipSpy).toHaveBeenCalled();
  });

  it('should emit skip when Escape key is pressed', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const skipSpy = vi.spyOn(component.skip, 'emit');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(skipSpy).toHaveBeenCalled();
  });

  it('should emit skip when backdrop is clicked', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const skipSpy = vi.spyOn(component.skip, 'emit');
    const backdrop = fixture.nativeElement.querySelector('.linkedin-modal__backdrop');
    backdrop.click();

    expect(skipSpy).toHaveBeenCalled();
  });

  it('should have role="dialog" and aria-modal="true"', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBe('linkedin-modal-title');
  });

  it('should not listen for Escape key when closed', () => {
    const skipSpy = vi.spyOn(component.skip, 'emit');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(skipSpy).not.toHaveBeenCalled();
  });

  it('should remove Escape listener when modal closes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const skipSpy = vi.spyOn(component.skip, 'emit');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(skipSpy).not.toHaveBeenCalled();
  });
});
