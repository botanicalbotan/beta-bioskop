// Initialization for ES Users
import {
    Datepicker,
    Input,
    initTE,
} from "tw-elements";

initTE({ Datepicker, Input });



let bikinFilmRandom = document.getElementById('bikinFilmRandom')
bikinFilmRandom.addEventListener('click', () => {
    let namaFilm = prompt('Masukin nama film')

    if (namaFilm == null || namaFilm == '') {

    } else {
        $.ajax({
            type: "POST",
            url: '/adminv/films/baru',
            data: {
                nama: namaFilm
            },
            dataType: "json",
            success: function (response) {
                alert('Berhasil bro!')
                console.log(response)
                window.location.reload()
            },
            error: function (err) {
                alert('Gagal bro, ada error')
                console.log(err)
            }

        });
    }
})

