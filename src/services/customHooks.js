// =========== GET LETTER ===========
export function getLetter(n) {
  const first = "a".charCodeAt(0);
  const last = "z".charCodeAt(0);
  const length = last - first + 1; // letter range

  // console.log(String.fromCharCode(first + n - 1));
  return String.fromCharCode(first + n).toUpperCase();
}
