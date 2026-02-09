import { Component, input, output, signal, computed, OnInit } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.scss',
})
export class TagInputComponent implements OnInit {
  readonly xIcon = X;

  readonly inputId = input('');
  readonly placeholder = input('Type to add...');
  readonly maxTags = input(10);
  readonly initialTags = input<string[]>([]);
  readonly tags = signal<string[]>([]);

  readonly tagsChange = output<string[]>();

  ngOnInit(): void {
    const initial = this.initialTags();
    if (initial.length > 0) {
      this.tags.set([...initial]);
    }
  }

  readonly isAtMax = computed(() => this.tags().length >= this.maxTags());
  readonly highlightedTag = signal<string | null>(null);

  onKeyDown(event: KeyboardEvent): void {
    const inputEl = event.target as HTMLInputElement;
    const value = inputEl.value.trim();

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (value) {
        this.addTag(value, inputEl);
      }
    }

    if (event.key === 'Backspace' && !inputEl.value) {
      this.removeLastTag();
    }
  }

  addTag(value: string, inputEl: HTMLInputElement): void {
    const trimmed = value.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();

    if (this.isAtMax()) return;

    const existing = this.tags().find(t => t.toLowerCase() === normalized);
    if (existing) {
      this.highlightTag(existing);
      inputEl.value = '';
      return;
    }

    this.tags.update(tags => [...tags, trimmed]);
    this.tagsChange.emit(this.tags());
    inputEl.value = '';
  }

  removeTag(index: number): void {
    this.tags.update(tags => tags.filter((_, i) => i !== index));
    this.tagsChange.emit(this.tags());
  }

  removeLastTag(): void {
    if (this.tags().length > 0) {
      this.tags.update(tags => tags.slice(0, -1));
      this.tagsChange.emit(this.tags());
    }
  }

  private highlightTag(tag: string): void {
    this.highlightedTag.set(tag);
    setTimeout(() => this.highlightedTag.set(null), 1000);
  }
}
