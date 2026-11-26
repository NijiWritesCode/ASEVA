import { useMemo } from 'react';
import { formatKoboToNaira, formatCompactKobo, nairaToKobo } from '../utils/currency';

export function useKobo() {
  return useMemo(() => ({
    formatNaira: (kobo, includeDecimals = true) => formatKoboToNaira(kobo, includeDecimals),
    formatCompact: (kobo) => formatCompactKobo(kobo),
    toKobo: (naira) => nairaToKobo(naira),
  }), []);
}
