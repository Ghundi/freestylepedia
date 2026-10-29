// vue-i18n plural rules for locales with more than two forms.
// Polish with three choices: [one | few | many]; fewer choices use the default rule.
export function pluralPl(choice: number, choicesLength: number): number {
    if (choicesLength < 3) return choice ? (choice > 1 ? 1 : 0) : 1
    const n = Math.abs(choice)
    if (n === 1) return 0
    const last = n % 10
    const lastTwo = n % 100
    return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 1 : 2
}
