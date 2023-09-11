import {
    Datepicker,
    Input,
    initTE,
} from "tw-elements";

initTE({ Datepicker, Input });

// ntar pas udah valid, kupon yang bisa dicopy cuma yang aktif
const semuaKupon = document.getElementsByClassName('kupon')

const epenCopy = function (e) {
    // currentTarget sama target BISA BEDA, pake yang current
    let data = e.currentTarget.dataset.kode
    if(data){
        navigator.clipboard.writeText(data)
        alert('Coppied: ' + data)
    } else {
        alert('Ngapain anda')
    }
}

for (let i = 0; i < semuaKupon.length; i++) {
    semuaKupon[i].addEventListener('click', epenCopy)
}

