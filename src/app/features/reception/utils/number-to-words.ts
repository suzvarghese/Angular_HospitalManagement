// Converts a rupee amount into words using the Indian numbering system
// (Crore / Lakh / Thousand), the way it's printed on a real invoice, e.g.
// amountInWordsIndian(1234.5) -> "One Thousand Two Hundred Thirty Four Rupees and Fifty Paise Only"

const ONES = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function twoDigits(n: number): string {
    if (n < 20) return ONES[n];
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return TENS[tens] + (ones ? ' ' + ONES[ones] : '');
}

function threeDigits(n: number): string {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    let out = '';
    if (hundreds) out += ONES[hundreds] + ' Hundred';
    if (rest) out += (out ? ' ' : '') + twoDigits(rest);
    return out;
}

export function amountInWordsIndian(amount: number): string {
    const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
    let rupees = Math.floor(rounded);
    const paise = Math.round((rounded - rupees) * 100);

    if (rupees === 0 && paise === 0) return 'Zero Rupees Only';

    const segments: string[] = [];
    const crore = Math.floor(rupees / 10000000); rupees %= 10000000;
    const lakh = Math.floor(rupees / 100000); rupees %= 100000;
    const thousand = Math.floor(rupees / 1000); rupees %= 1000;
    const hundred = rupees;

    if (crore) segments.push(threeDigits(crore) + ' Crore');
    if (lakh) segments.push(threeDigits(lakh) + ' Lakh');
    if (thousand) segments.push(threeDigits(thousand) + ' Thousand');
    if (hundred) segments.push(threeDigits(hundred));

    let words = segments.join(' ') + ' Rupees';
    if (paise > 0) {
        words += ' and ' + twoDigits(paise) + ' Paise';
    }
    return words + ' Only';
}
