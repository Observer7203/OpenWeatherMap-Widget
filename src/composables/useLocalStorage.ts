export function useLocalStorage() {
  const save = <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`localStorage save error: ${key}`, error);
    }
  };

  const load = <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`localStorage load error: ${key}`, error);
      return null;
    }
  };

  const remove = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage remove error: ${key}`, error);
    }
  };

  return { save, load, remove };
}
