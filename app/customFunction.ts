export function kapitalKalimat(text: string) {
    let pure = text.split(' ')
    let newText = ''
    for (let i = 0; i < pure.length; i++) {
        newText += kapitalHurufPertama(pure[i])
        if (i !== pure.length - 1) {
            newText += ' '
        }
    }
    return newText
}

export function kapitalHurufPertama(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function numToChar(angka: number = 0) {
    let base = 'a'.charCodeAt(0)
    return (angka === 0 || angka === 1) ? 'a' : String.fromCharCode(base + angka - 1)
}