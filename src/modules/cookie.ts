try {
  Object.defineProperty(document, 'cookie', {
    get() {
      return '';
    },
    set() {
      return true;
    }
  });
} catch (e) {
  // если браузер не позволит — просто игнорируем
}