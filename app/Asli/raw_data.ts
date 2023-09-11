
// ditaro jadi satu biar kalau ada ngubah, semua keganti, ga ribet

const ongkosPembayaran = {
    bb_point: {
        isPersen: false,
        nominal: 0
    },
    debit_transfer: {
        isPersen: false,
        nominal: 5000
    },
    kartu_kredit: {
        isPersen: true,
        nominal: 5
    },
    lainnya: {
        isPersen: false,
        nominal: 5000
    }
}

// test awal maxCol 5, maxRow 10
// const _ = {
//     minCol: 1,
//     maxCol: 5,
//     minRow: 1,
//     maxRow: 10
// }

// sekarang maxCol 10, maxRow 30
const _ = {
    minCol: 1,
    maxCol: 10,
    minRow: 1,
    maxRow: 30,
    holdInvoiceMinute: 10, // menit invoice ampe kursi dilepas lagi,
    ongkosPembayaran
}

// ntar paling optimalnya maxCol 20, maxRow 50
// const _ = {
//     minCol: 1,
//     maxCol: 20,
//     minRow: 1,
//     maxRow: 50
// }


export default _