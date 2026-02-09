import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardItemComponent } from './card-item.component';
import { Card } from '../../../core/services/card.service';

const mockCard: Card = {
  id: 'card-1',
  user_id: 'user-1',
  content: 'This is a test LinkedIn post\nWith multiple lines',
  original_content: 'This is a test LinkedIn post\nWith multiple lines',
  status: 'active',
  created_at: new Date(Date.now() - 5000).toISOString(),
  updated_at: new Date(Date.now() - 5000).toISOString(),
  platform: 'linkedin',
  is_edited: false,
};

describe('CardItemComponent', () => {
  let component: CardItemComponent;
  let fixture: ComponentFixture<CardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', mockCard);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display card content', () => {
    const el: HTMLElement = fixture.nativeElement;
    const content = el.querySelector('.card-item__content');
    expect(content?.textContent?.trim()).toContain('This is a test LinkedIn post');
  });

  it('should display LinkedIn icon', () => {
    const el: HTMLElement = fixture.nativeElement;
    const icon = el.querySelector('lucide-icon');
    expect(icon).toBeTruthy();
  });

  it('should display relative timestamp', () => {
    const el: HTMLElement = fixture.nativeElement;
    const meta = el.querySelector('.card-item__meta');
    expect(meta?.textContent).toBeTruthy();
    // A just-created card should show "Generated Just now"
    expect(meta?.textContent).toContain('Generated Just now');
  });

  it('should use article element with aria-label', () => {
    const el: HTMLElement = fixture.nativeElement;
    const article = el.querySelector('article');
    expect(article).toBeTruthy();
    expect(article?.getAttribute('aria-label')).toBeTruthy();
  });

  it('should have card-item BEM class', () => {
    const el: HTMLElement = fixture.nativeElement;
    const cardItem = el.querySelector('.card-item');
    expect(cardItem).toBeTruthy();
  });
});
