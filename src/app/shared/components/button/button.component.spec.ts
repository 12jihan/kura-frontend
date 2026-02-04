import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  async function createComponent(inputs: Partial<ButtonComponent> = {}) {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ButtonComponent);
    const component = fixture.componentInstance;

    // Set all inputs before first detectChanges
    Object.assign(component, inputs);

    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', async () => {
    const { component } = await createComponent();
    expect(component).toBeTruthy();
  });

  it('should apply primary variant by default', async () => {
    const { fixture } = await createComponent();
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.classList.contains('btn--primary')).toBe(true);
  });

  it('should apply secondary variant when specified', async () => {
    const { fixture } = await createComponent({ variant: 'secondary' });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.classList.contains('btn--secondary')).toBe(true);
  });

  it('should apply ghost variant when specified', async () => {
    const { fixture } = await createComponent({ variant: 'ghost' });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.classList.contains('btn--ghost')).toBe(true);
  });

  it('should disable button when disabled is true', async () => {
    const { fixture } = await createComponent({ disabled: true });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.disabled).toBe(true);
  });

  it('should disable button when loading is true', async () => {
    const { fixture } = await createComponent({ loading: true });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.disabled).toBe(true);
  });

  it('should show spinner when loading', async () => {
    const { fixture } = await createComponent({ loading: true });
    const spinner = fixture.nativeElement.querySelector('.btn__spinner');
    expect(spinner).toBeTruthy();
  });

  it('should apply loading class when loading', async () => {
    const { fixture } = await createComponent({ loading: true });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.classList.contains('btn--loading')).toBe(true);
  });

  it('should emit buttonClick when clicked', async () => {
    const { fixture, component } = await createComponent();
    const spy = vi.fn();
    component.buttonClick.subscribe(spy);

    const button = fixture.nativeElement.querySelector('.btn');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should not emit buttonClick when disabled', async () => {
    const { component } = await createComponent({ disabled: true });
    const spy = vi.fn();
    component.buttonClick.subscribe(spy);

    component.onClick();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not emit buttonClick when loading', async () => {
    const { component } = await createComponent({ loading: true });
    const spy = vi.fn();
    component.buttonClick.subscribe(spy);

    component.onClick();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should apply full-width class when fullWidth is true', async () => {
    const { fixture } = await createComponent({ fullWidth: true });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.classList.contains('btn--full-width')).toBe(true);
  });

  it('should set type attribute to submit when specified', async () => {
    const { fixture } = await createComponent({ type: 'submit' });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('should have aria-busy when loading', async () => {
    const { fixture } = await createComponent({ loading: true });
    const button = fixture.nativeElement.querySelector('.btn');
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('should return correct isDisabled value', async () => {
    const { component } = await createComponent();
    expect(component.isDisabled).toBe(false);

    component.disabled = true;
    expect(component.isDisabled).toBe(true);

    component.disabled = false;
    component.loading = true;
    expect(component.isDisabled).toBe(true);
  });
});
