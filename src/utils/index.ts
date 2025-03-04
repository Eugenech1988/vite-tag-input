export const extractSpecialCharacters = (text: string) => {
  const match = text.match(/^[^a-zA-Zа-яА-Я]+/);
  return match ? match[0] : '';
}