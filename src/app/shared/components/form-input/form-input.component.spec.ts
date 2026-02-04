import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormInputComponent } from './form-input.component';
import { FormControl, Validators } from '@angular/forms';

describe('FormInputComponent', () => {
  async function createComponent(inputs: Partial<FormInputComponent> = {}) {
    await TestBed.configureTestingModule({
      imports: [FormInputComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(FormInputComponent);
    const component = fixture.componentInstance;

    // Set all inputs before first detectChanges
    Object.assign(component, {
      inputId: 'test-input',
      ...inputs,
    });

    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  it('should render with label', async () => {
    const { fixture } = await createComponent({ label: 'Email' });
    const label = fixture.nativeElement.querySelector('.form-input__label');
    expect(label).toBeTruthy();
    expect(label.textContent).toBe('Email');
  });

  it('should render with placeholder', async () => {
    const { fixture } = await createComponent({ placeholder: 'Enter your email' });
    const input = fixture.nativeElement.querySelector('.form-input__field');
    expect(input.getAttribute('placeholder')).toBe('Enter your email');
  });

  it('should render hint text when provided', async () => {
    const { fixture } = await createComponent({ hint: 'This is a hint' });
    const hint = fixture.nativeElement.querySelector('.form-input__hint');
    expect(hint).toBeTruthy();
    expect(hint.textContent).toBe('This is a hint');
  });

  it('should show error message when control is invalid and touched', async () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();

    const { fixture } = await createComponent({
      control,
      errorMessages: { required: 'This field is required' },
    });

    const error = fixture.nativeElement.querySelector('.form-input__error');
    expect(error).toBeTruthy();
    expect(error.textContent).toBe('This field is required');
  });

  it('should not show error message when control is valid', async () => {
    const control = new FormControl('valid@email.com', [
      Validators.required,
      Validators.email,
    ]);
    control.markAsTouched();

    const { fixture } = await createComponent({
      control,
      errorMessages: { required: 'Required', email: 'Invalid email' },
    });

    const error = fixture.nativeElement.querySelector('.form-input__error');
    expect(error).toBeFalsy();
  });

  it('should apply error class when showing error', async () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();

    const { fixture } = await createComponent({
      control,
      errorMessages: { required: 'Required' },
    });

    const container = fixture.nativeElement.querySelector('.form-input');
    expect(container.classList.contains('form-input--error')).toBe(true);
  });

  it('should disable input when disabled', async () => {
    const { fixture } = await createComponent({ disabled: true });
    const input = fixture.nativeElement.querySelector('.form-input__field');
    expect(input.disabled).toBe(true);
  });

  it('should mark as touched on blur', async () => {
    const { fixture, component } = await createComponent();
    expect(component.touched).toBe(false);

    const input = fixture.nativeElement.querySelector('.form-input__field');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.touched).toBe(true);
  });

  it('should support password type', async () => {
    const { fixture } = await createComponent({ type: 'password' });
    const input = fixture.nativeElement.querySelector('.form-input__field');
    expect(input.getAttribute('type')).toBe('password');
  });

  it('should update value on input', async () => {
    const { fixture, component } = await createComponent();
    const input = fixture.nativeElement.querySelector('.form-input__field');
    input.value = 'test value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value).toBe('test value');
  });

  it('should have accessible aria attributes when error is shown', async () => {
    const control = new FormControl('', [Validators.required]);
    control.markAsTouched();

    const { fixture } = await createComponent({
      control,
      errorMessages: { required: 'Required' },
    });

    const input = fixture.nativeElement.querySelector('.form-input__field');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('test-input-error');

    const error = fixture.nativeElement.querySelector('.form-input__error');
    expect(error.getAttribute('role')).toBe('alert');
  });
});
