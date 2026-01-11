/**
 * Konwertuje string z ilością na liczbę (obsługuje ułamki i przecinki)
 * np. "1/2" -> 0.5, "1,5" -> 1.5, "1 1/2" -> 1.5
 */
const parseAmount = (amountStr) => {
  if (!amountStr) return null;
  
  let str = amountStr.trim().replace(',', '.'); // Zamiana , na .

  // 1. Obsługa ułamków mieszanych: "1 1/2"
  if (str.match(/^\d+\s+\d+\/\d+$/)) {
    const [whole, fraction] = str.split(/\s+/);
    const [num, den] = fraction.split('/');
    return parseFloat(whole) + (parseFloat(num) / parseFloat(den));
  }

  // 2. Obsługa zwykłych ułamków: "1/2", "3/4"
  if (str.match(/^\d+\/\d+$/)) {
    const [num, den] = str.split('/');
    return parseFloat(num) / parseFloat(den);
  }

  // 3. Obsługa zakresów: "1-2" lub "1 - 2" -> Zwracamy średnią do obliczeń? 
  // Nie, lepiej zwrócić tablicę, ale tutaj uprościmy: parsujemy to osobno w głównej funkcji.
  
  // 4. Zwykła liczba
  const parsed = parseFloat(str);
  return isNaN(parsed) ? null : parsed;
};

/**
 * Formatuje liczbę z powrotem na ładny string
 * 0.5 -> "0.5" (lub można bawić się w zamianę na "1/2", ale decimal jest czytelniejszy przy skalowaniu)
 * 1.00 -> "1"
 * 1.33333 -> "1.3"
 */
const formatAmount = (num) => {
  if (num === null || isNaN(num)) return '';
  
  // Zaokrąglamy do 2 miejsc po przecinku, ale usuwamy niepotrzebne zera
  return parseFloat(num.toFixed(2)).toString(); 
};

/**
 * GŁÓWNA FUNKCJA SKALUJĄCA
 * @param {string} amountStr - np. "1/2", "1-2", "500", "szczypta"
 * @param {number} baseServings - np. 4
 * @param {number} targetServings - np. 6
 */
export const scaleIngredient = (amountStr, baseServings, targetServings) => {
  if (!amountStr || !baseServings || !targetServings) return amountStr;
  if (baseServings === targetServings) return amountStr;

  const ratio = targetServings / baseServings;
  const str = amountStr.toString().trim();

  // EDGE CASE 1: Zakresy ("1-2", "100 - 200")
  if (str.includes('-')) {
    const parts = str.split('-').map(p => p.trim());
    // Sprawdzamy, czy obie części są liczbami
    const val1 = parseAmount(parts[0]);
    const val2 = parseAmount(parts[1]);

    if (val1 !== null && val2 !== null) {
      return `${formatAmount(val1 * ratio)} - ${formatAmount(val2 * ratio)}`;
    }
  }

  // EDGE CASE 2: Zwykłe liczby i ułamki
  const val = parseAmount(str);
  if (val !== null) {
    return formatAmount(val * ratio);
  }

  // EDGE CASE 3: Tekst niematematyczny ("szczypta", "do smaku", "kilka")
  // Jeśli parser zwrócił null, oddajemy tekst bez zmian.
  return amountStr;
};