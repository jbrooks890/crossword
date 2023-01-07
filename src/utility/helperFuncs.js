// =========== DEBOUNCE ===========

export function debounce(fn, ms = 1000) {
  // console.log("Running debounce");
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, ms);
  };
}

// =========== GET LETTER ===========

export function getLetter(n) {
  const first = "a".charCodeAt(0);
  const last = "z".charCodeAt(0);
  const length = last - first + 1; // letter range

  return String.fromCharCode(first + n).toUpperCase();
}
