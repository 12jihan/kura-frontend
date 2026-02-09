import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardSkeletonComponent } from './card-skeleton.component';

describe('CardSkeletonComponent', () => {
  let component: CardSkeletonComponent;
  let fixture: ComponentFixture<CardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton blocks', () => {
    const el: HTMLElement = fixture.nativeElement;
    const blocks = el.querySelectorAll('.card-skeleton__block');
    expect(blocks.length).toBeGreaterThan(0);
  });

  it('should have aria-busy attribute', () => {
    const el: HTMLElement = fixture.nativeElement;
    const skeleton = el.querySelector('.card-skeleton');
    expect(skeleton?.getAttribute('aria-busy')).toBe('true');
  });

  it('should have aria-label for loading', () => {
    const el: HTMLElement = fixture.nativeElement;
    const skeleton = el.querySelector('.card-skeleton');
    expect(skeleton?.getAttribute('aria-label')).toBe('Loading card');
  });
});
