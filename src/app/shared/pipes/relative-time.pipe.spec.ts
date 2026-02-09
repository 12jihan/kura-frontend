import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  const pipe = new RelativeTimePipe();

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for falsy value', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should return empty string for invalid date', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });

  it('should return "Just now" for future timestamps', () => {
    const future = new Date(Date.now() + 60000).toISOString();
    expect(pipe.transform(future)).toBe('Just now');
  });

  it('should return "Just now" for timestamps less than 1 minute ago', () => {
    const now = new Date().toISOString();
    expect(pipe.transform(now)).toBe('Just now');
  });

  it('should return "1 min ago" for 1 minute ago', () => {
    const date = new Date(Date.now() - 60 * 1000).toISOString();
    expect(pipe.transform(date)).toBe('1 min ago');
  });

  it('should return "X min ago" for minutes', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(pipe.transform(date)).toBe('5 min ago');
  });

  it('should return "1 hour ago" for 1 hour', () => {
    const date = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(pipe.transform(date)).toBe('1 hour ago');
  });

  it('should return "X hours ago" for multiple hours', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(pipe.transform(date)).toBe('3 hours ago');
  });

  it('should return "Yesterday" for 1 day ago', () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(pipe.transform(date)).toBe('Yesterday');
  });

  it('should return formatted date for older timestamps', () => {
    const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const result = pipe.transform(date);
    // Should be in "Mon DD" format like "Feb 3"
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
  });
});
