import { Select, initTE } from "tw-elements";
initTE({ Select });

import axios from "axios";

import Swal from 'sweetalert2'

const tierStud = document.getElementById('tierStud')
const iTierInstace = Select.getInstance(tierStud);

// ambil valuenya, cari
const currentTier = tierStud.dataset.currentTier
iTierInstace.setValue(currentTier);

let btBikinStudio = document.getElementById('btBikinStudio')
btBikinStudio.addEventListener('click', ()=>{
    let namaStudio = prompt('Masukin nama studio')

    // ini diganti sesuai max template
    let col = prompt('Masukin lebar node col (1-10)')
    let row = prompt('Masukin lebar node row (1-30)')

    if(validasiInput(namaStudio, col, row)){

        axios.post('/adminv/studios/baru', {
            nama: namaStudio,
            col,
            row
        })
        .then((res) => {
            alert('Berhasil bro!')
            window.location.reload()
        }).catch((err) => {
            alert('Error: ' + err.responseJSON.err)
            console.log(err)
        })


        // $.ajax({
        //     type: "POST",
        //     url: '/adminv/studios/baru',
        //     data: {
        //         nama: namaStudio,
        //         col,
        //         row
        //     },
        //     dataType: "json",
        //     success: function (response) {
        //         alert('Berhasil bro!')
        //         window.location.reload()
        //     },
        //     error: function (err) {
        //         alert('Error: ' + err.responseJSON.err)
        //         console.log(err)
        //     } 
        // });

    } else {
        alert('Waduh, input lu ga valid bro')
    }
    // nama stud, dimensi (gabisa diganti), tier studio
})

let validasiInput = function (namaStudio, col, row) {
    if(namaStudio == null || namaStudio == ''){
        return false
    }

    if(col == null || isNaN(col)){
        return false
    }

    if(namaStudio == null || isNaN(row)){
        return false
    }

    return true
}

