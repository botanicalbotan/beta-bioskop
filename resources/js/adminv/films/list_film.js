// Initialization for ES Users
import {
    Datepicker,
    Input,
    initTE,
} from "tw-elements";

initTE({ Datepicker, Input });

import axios from "axios";


let bikinFilmRandom = document.getElementById('bikinFilmRandom')
bikinFilmRandom.addEventListener('click', () => {
    let namaFilm = prompt('Masukin nama film')

    if(validasiInput(namaFilm)){
        axios.post('/adminv/films/baru', {
            nama: namaFilm
        })
        .then((res) => {
            alert('Berhasil bro!')
            window.location.reload()
        })
        .catch((err) => {
            alert('Gagal bro, ada error')
            console.log(err)
        })
    }
})

let validasiInput = function (namaFilm) {
    if(namaFilm == null || namaFilm == ''){
        return false
    }

    return true
}