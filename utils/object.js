export function firstEntry(object) {
  if (!object) {
    return null;
  }
  for (const key in object) {
    return [key, object[key]];
  }
  return null;
}
