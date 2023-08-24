import Saved from 'App/Asli/saved'

function getNextChar(char: string) {
    return String.fromCharCode(char.charCodeAt(0) + 1);
}

interface Seat {
    id: string, isValid: boolean
}

interface IsiSaved {
    id: string, isValid: boolean, isPesan: boolean
}

function createGrid(col: number = 0, row: number = 0) {
    if (col <= 0 || row <= 0) {
        return []
    }

    let wadah: Array<any> = []
    let huruf = 'A'

    // nuat ngetes doang kalau ga valid
    let zonk = Math.floor(Math.random() * row)

    // set ke 0
    Saved.length = 0

    for (let i = 0; i < col; i++) {
        let wedeh: Seat[] = []
        let wuduh: IsiSaved[] = []

        for (let j = 1; j <= row; j++) {
            if (j === zonk) {
                wedeh.push({
                    id: huruf + j,
                    isValid: false
                })

                wuduh.push({
                    id: huruf + j,
                    isValid: false,
                    isPesan: false
                })
            } else {
                wedeh.push({
                    id: huruf + j,
                    isValid: true
                })

                wuduh.push({
                    id: huruf + j,
                    isValid: true,
                    isPesan: false
                })
            }

            // console.log(zonk)
        }

        huruf = getNextChar(huruf)
        wadah.push(wedeh)
        Saved.push(wuduh)
    }

    return wadah
}

const _ = {
    createGrid
}

export default _