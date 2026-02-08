import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagInputComponent } from './tag-input.component';

describe('TagInputComponent', () => {
  let component: TagInputComponent;
  let fixture: ComponentFixture<TagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input field with placeholder', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Type to add...');
  });

  it('should add a tag when Enter is pressed', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = 'angular';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(component.tags()).toEqual(['angular']);
    const tags = fixture.nativeElement.querySelectorAll('.tag');
    expect(tags.length).toBe(1);
    expect(tags[0].querySelector('.tag__text').textContent.trim()).toBe('angular');
  });

  it('should add a tag when comma is pressed', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = 'react';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: ',' }));
    fixture.detectChanges();

    expect(component.tags()).toEqual(['react']);
  });

  it('should clear input after adding a tag', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = 'vue';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(input.value).toBe('');
  });

  it('should display tag text and remove button for each tag', () => {
    component.tags.set(['indie hacking', 'bootstrapping']);
    fixture.detectChanges();

    const tags = fixture.nativeElement.querySelectorAll('.tag');
    expect(tags.length).toBe(2);

    const firstTag = tags[0];
    expect(firstTag.querySelector('.tag__text').textContent.trim()).toBe('indie hacking');
    expect(firstTag.querySelector('.tag__remove')).toBeTruthy();

    const secondTag = tags[1];
    expect(secondTag.querySelector('.tag__text').textContent.trim()).toBe('bootstrapping');
    expect(secondTag.querySelector('.tag__remove')).toBeTruthy();
  });

  it('should remove a tag when clicking the remove button', () => {
    component.tags.set(['one', 'two', 'three']);
    fixture.detectChanges();

    const removeButtons = fixture.nativeElement.querySelectorAll('.tag__remove');
    removeButtons[1].click();
    fixture.detectChanges();

    expect(component.tags()).toEqual(['one', 'three']);
  });

  it('should remove last tag on Backspace with empty input', () => {
    component.tags.set(['first', 'second']);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = '';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(component.tags()).toEqual(['first']);
  });

  it('should not add duplicate keywords (case-insensitive)', () => {
    component.tags.set(['Angular']);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = 'angular';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(component.tags()).toEqual(['Angular']);
    expect(input.value).toBe('');
  });

  it('should prevent adding 11th keyword when max is 10', () => {
    component.tags.set([
      'tag1', 'tag2', 'tag3', 'tag4', 'tag5',
      'tag6', 'tag7', 'tag8', 'tag9', 'tag10',
    ]);
    fixture.detectChanges();

    expect(component.isAtMax()).toBe(true);
    const input = fixture.nativeElement.querySelector('.tag-input__field');
    expect(input).toBeFalsy();
  });

  it('should show max tags message when limit reached', () => {
    component.tags.set([
      'tag1', 'tag2', 'tag3', 'tag4', 'tag5',
      'tag6', 'tag7', 'tag8', 'tag9', 'tag10',
    ]);
    fixture.detectChanges();

    const limit = fixture.nativeElement.querySelector('.tag-input__limit');
    expect(limit).toBeTruthy();
    expect(limit.textContent).toContain('Maximum 10 keywords allowed');
  });

  it('should ignore trimmed empty strings', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = '   ';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(component.tags()).toEqual([]);
  });

  it('should emit tagsChange when tags are added', () => {
    const emitSpy = vi.spyOn(component.tagsChange, 'emit');

    const input: HTMLInputElement = fixture.nativeElement.querySelector('.tag-input__field');
    input.value = 'SaaS';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(emitSpy).toHaveBeenCalledWith(['SaaS']);
  });

  it('should emit tagsChange when tags are removed', () => {
    component.tags.set(['one', 'two']);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.tagsChange, 'emit');

    const removeButtons = fixture.nativeElement.querySelectorAll('.tag__remove');
    removeButtons[0].click();

    expect(emitSpy).toHaveBeenCalledWith(['two']);
  });

  it('should have accessible remove buttons with aria-label', () => {
    component.tags.set(['indie hacking']);
    fixture.detectChanges();

    const removeButton = fixture.nativeElement.querySelector('.tag__remove');
    expect(removeButton.getAttribute('aria-label')).toBe('Remove indie hacking');
  });

  it('should have role="list" on tags container and role="listitem" on tags', () => {
    component.tags.set(['tag1']);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="list"]');
    expect(list).toBeTruthy();

    const listItem = fixture.nativeElement.querySelector('[role="listitem"]');
    expect(listItem).toBeTruthy();
  });
});
