import { unsavedChangesGuard, HasUnsavedChanges } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  let mockComponent: HasUnsavedChanges;

  it('should allow navigation when no unsaved changes', () => {
    mockComponent = { hasUnsavedChanges: () => false };

    const result = unsavedChangesGuard(
      mockComponent as any,
      {} as any,
      {} as any,
      {} as any,
    );

    expect(result).toBe(true);
  });

  it('should show confirm dialog when unsaved changes exist', () => {
    mockComponent = { hasUnsavedChanges: () => true };
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const result = unsavedChangesGuard(
      mockComponent as any,
      {} as any,
      {} as any,
      {} as any,
    );

    expect(window.confirm).toHaveBeenCalledWith('You have unsaved changes. Discard?');
    expect(result).toBe(true);
  });

  it('should block navigation when user cancels confirm', () => {
    mockComponent = { hasUnsavedChanges: () => true };
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const result = unsavedChangesGuard(
      mockComponent as any,
      {} as any,
      {} as any,
      {} as any,
    );

    expect(result).toBe(false);
  });
});
