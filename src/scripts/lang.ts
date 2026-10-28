const KEY = 'lang'

// The language chosen in Settings, used when a link carries none (/, /MyProgress, the installed app).
export function storedLang(): string | null {
    try { return localStorage.getItem(KEY) } catch { return null }
}

export function storeLang(code: string): void {
    try { localStorage.setItem(KEY, code) } catch { /* storage unavailable: browser language next time */ }
}
