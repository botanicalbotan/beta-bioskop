// import '../../css/app.css'
import axios from 'axios';

const studio = document.getElementById('studio')
const studioId = studio.dataset.idstud


function selectKursiTemplate(event) {
    let currentStat = event.target.dataset.iskursi
    if (currentStat && currentStat !== '0') {
        event.target.classList.add('bukan-kursi')
        event.target.dataset.iskursi = 0
        console.log('klik 1')
    } else {
        event.target.classList.remove('bukan-kursi')
        event.target.dataset.iskursi = 1
        console.log('klik 2')
    }

    event.target.dataset.berubah = 1
}

// buat tes!!
window.cekBerubah = function () {
    let wadah = []
    for (let i = 0; i < kursiTemplate.length; i++) {
        if (kursiTemplate[i].dataset.berubah === '1') {
            wadah.push(kursiTemplate[i])
        }
    }

    // returnnya array DOM
    return wadah
}

let persiapanKirim = function () {
    let wadah = []
    for (let i = 0; i < kursiTemplate.length; i++) {
        if (kursiTemplate[i].dataset.berubah === '1') {
            wadah.push({
                id: kursiTemplate[i].dataset.id,
                isKursi: kursiTemplate[i].dataset.iskursi,
            })
        }
    }

    // returnnya array DOM
    return wadah
}

let persiapanPromise = function () {
    return new Promise((resolve, reject) => {
        let wadah = []
        for (let i = 0; i < kursiTemplate.length; i++) {
            if (kursiTemplate[i].dataset.berubah === '1') {
                wadah.push({
                    id: kursiTemplate[i].dataset.id,
                    isKursi: kursiTemplate[i].dataset.iskursi,
                })
            }
        }

        resolve(wadah)
    })
}

let simpanLayout = document.getElementById('simpanLayout')

simpanLayout.addEventListener('click', () => {
    // JQUERY
    // persiapanPromise().then(data => {
    //     console.log(data)
    //     console.log('Typeof: ', typeof data)
    //     console.log('Is array: ', Array.isArray(data))

    //     // JQUERY
    //     $.ajax({
    //     type: "POST",
    //     url: `/adminv/studios/${studioId}/update_layout`,
    //     data: { update:data, tes: 'kalau bisa tolol sih' },
    //     dataType: "json",
    //     success: function (response) {
    //         console.log(response)
    //         alert('berhasil weeeyyyy')

    //         window.location.reload()
    //     },
    //     error: function (e) {
    //         alert('error ajg')
    //         console.log(e)
    //     }
    // });
    // })

    // AXIOS
    persiapanPromise().then(data => {
        console.log(data)
        console.log('Typeof: ', typeof data)
        console.log('Is array: ', Array.isArray(data))

        axios.post(`/adminv/studios/${studioId}/update_layout`, { update:data, msg: 'ini dari axios' })
            .then((res) => {
                console.log(res)
                alert('bisa boooyyyy')
            }).catch((err) => {
                alert('sama aja error')
                console.log(err)
            })
            
    });

// kalau gapake promise
    // let prepare = { update: persiapanKirim() }
    // $.ajax({
    //     type: "POST",
    //     url: `/adminv/studios/${studioId}/update_layout`,
    //     data: prepare,
    //     dataType: "json",
    //     success: function (response) {
    //         console.log(response)
    //         alert('berhasil weeeyyyy')

    //         window.location.reload()
    //     },
    //     error: function (e) {
    //         alert('error ajg')
    //         console.log(e)
    //     }
    // });
})

// set semua DOM kursi template
let kursiTemplate = document.getElementsByClassName('kursi-cgv-template')

// gabisa pake foreach
for (let i = 0; i < kursiTemplate.length; i++) {
    kursiTemplate[i].addEventListener('click', selectKursiTemplate)
}


