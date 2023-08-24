// punya tailwind-elements
import {
  Select, initTE, Datepicker, Timepicker,
  Input,
} from "tw-elements";

// import Swal from "sweetalert2"
import Swal from 'sweetalert2'

import axios from "axios";

// punya luxon
const { DateTime } = require("luxon");

initTE({
  Select, Datepicker,
  Input,
});

// ===  panggil semua element ===
const mainForm = document.getElementById('mainForm')

// cek slot
const iStudio = document.getElementById('iStudio')
const iTanggalTayang = document.getElementById('iTanggalTayang')
const btCariSlot = document.getElementById('btCariSlot')
const lbNamaStudio = document.getElementById('lbNamaStudio')
const lbTanggalTayang = document.getElementById('lbTanggalTayang')

// form film
const iFilm = document.getElementById('iFilm')
const wadahKeteranganFilm = document.getElementById('wadahKeteranganFilm')

// form waktu tayang
const wrapperWaktuTayang = document.querySelector("#iWaktuTayang-value");
const tminputValue = new Timepicker(wrapperWaktuTayang); // init timepicker

const iInterlude = document.getElementById('iInterlude')
const iSelesaiFilm = document.getElementById('iSelesaiFilm')
const iSelesaiInterlude = document.getElementById('iSelesaiInterlude')
const wadahKeteranganError = document.getElementById('wadahKeteranganError')

const btKirim = document.getElementById('btKirim')



// ============== BASE DATA ======================
let SUDAHPILIHFILM = false
let DURASI = 0

// SUPER KEPAKE
let IDSTUDIO = -1
let TANGGALTAYANG
let ISO_TANGGALTAYANG

let IDFILM = -1

let WAKTUTAYANG
let ISO_WAKTUTAYANG

// ========================== CARI SLOT ==================
let wadahFilm = []

function resetSlot() {
  // kalau btCariSlot dipencet, ada tampilan yang kudu direset

  // ngehidden semua tampilan
  mainForm.classList.add('hidden')

  // ngosongin select film
  wadahFilm.length = 0
  setIsiFilm(wadahFilm)

  // ngedefaultin data lokal
  IDSTUDIO = -1
  TANGGALTAYANG = null
  ISO_TANGGALTAYANG = null

  SUDAHPILIHFILM = false
  DURASI = 0
  IDFILM = -1

  WAKTUTAYANG = null
  ISO_WAKTUTAYANG = null

  // nutup semua tampilan error
  wadahKeteranganError.textContent = ''
}

function setIsiFilm(dataFilm) {
  if (Array.isArray(dataFilm)) {
    // kosongin dulu
    var i, L = iFilm.options.length - 1;
    for (i = L; i >= 0; i--) {
      iFilm.remove(i);
    }

    dataFilm.forEach(element => {
      let opsi = document.createElement('option')
      opsi.innerHTML = element.nama
      opsi.value = element.id

      iFilm.append(opsi)
    });
  }

  return false
}

btCariSlot.addEventListener('click', (e) => {
  let tempTanggal = iTanggalTayang.value
  let tempStudio = iStudio.value
  resetSlot()

  Swal.fire({
    title: 'Mencari slot waktu...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    scrollbarPadding: false,
    didOpen: () => {
      Swal.showLoading()

      setTimeout(() => {

        axios.get(`/adminv/jadwals/cari_slot?iTanggalTayang=${tempTanggal}&iStudio=${tempStudio}`)
          .then((res) => {
            if (res.data.filmsByTanggal && res.data.filmsByTanggal.length > 0) {
              wadahFilm = res.data.filmsByTanggal
              setIsiFilm(res.data.filmsByTanggal)
              updateKeteranganFilmById(res.data.filmsByTanggal[0].id)
              IDFILM = res.data.filmsByTanggal[0].id
              DURASI = res.data.filmsByTanggal[0].durasi
            }

            updateJadwalAktif(res.data.jadwalsAktif)

            // set studio ID sama waktu tayang
            IDSTUDIO = tempStudio
            ISO_TANGGALTAYANG = tempTanggal
            TANGGALTAYANG = DateTime.fromISO(tempTanggal)

            lbTanggalTayang.textContent = DateTime.fromISO(tempTanggal).toFormat('dd LLLL yyyy', { locale: 'id-ID' })
            lbNamaStudio.textContent = tempStudio
            Swal.close()

            mainForm.classList.remove('hidden')
          })
          .catch((err) => {
            console.log(err)
            Swal.fire({
              icon: 'error',
              title: 'Terdapat error dari server!',
              scrollbarPadding: false,
              text: err.response.data.msg,
              confirmButtonText: 'Tutup'
            })

            resetSlot()
          })

        // $.get("/adminv/jadwals/cari_slot", {
        //   iTanggalTayang: tempTanggal,
        //   iStudio: tempStudio
        // },
        //   function (data, textStatus, jqXH54R) {
        //     // cek data beneran ada
        //     if (data.filmsByTanggal && data.filmsByTanggal.length > 0) {
        //       wadahFilm = data.filmsByTanggal
        //       setIsiFilm(data.filmsByTanggal)
        //       updateKeteranganFilmById(data.filmsByTanggal[0].id)
        //       IDFILM = data.filmsByTanggal[0].id
        //       DURASI = data.filmsByTanggal[0].durasi
        //     }

        //     updateJadwalAktif(data.jadwalsAktif)

        //     // set studio ID sama waktu tayang
        //     IDSTUDIO = tempStudio
        //     ISO_TANGGALTAYANG = tempTanggal
        //     TANGGALTAYANG = DateTime.fromISO(tempTanggal)

        //     lbTanggalTayang.textContent = DateTime.fromISO(tempTanggal).toFormat('dd LLLL yyyy', { locale: 'id-ID' })
        //     lbNamaStudio.textContent = tempStudio
        //     Swal.close()

        //     mainForm.classList.remove('hidden')
        //   },
        //   "json"
        // ).catch((xhr) => {
        //   console.log(xhr)
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Terdapat error dari server!',
        //     scrollbarPadding: false,
        //     text: xhr.responseJSON.msg,
        //     confirmButtonText: 'Tutup'
        //   })

        //   resetSlot()
        // })
      }, 1000)
    }
  })


})


iFilm.addEventListener('change', (e) => {
  updateKeteranganFilmById(e.target.value)

  SUDAHPILIHFILM = true
  IDFILM = e.target.value
})

function updateKeteranganFilmById(id) {
  wadahKeteranganFilm.classList.remove('hidden')
  let cari = wadahFilm[wadahFilm.findIndex(elemen => elemen.id == id)]

  if (cari) {
    SUDAHPILIHFILM = true
    DURASI = cari.durasi

    wadahKeteranganFilm.textContent = ''
    wadahKeteranganFilm.append(generateKeteranganFilm('Durasi', `${cari.durasi} menit`))
    wadahKeteranganFilm.append(generateKeteranganFilm('Rating', cari.rating))
    wadahKeteranganFilm.append(generateKeteranganFilm('Genre', cari.genre))

    return true
  }

  return false
}

function generateKeteranganFilm(param, isi) {
  let wadahLuar = document.createElement('div')
  wadahLuar.classList.add('flex', 'space-x-2', 'max-w-xs')

  let wadah1T1 = document.createElement('div')
  wadah1T1.classList.add('flex-none', 'flex', 'w-32')

  let wadah1T2 = document.createElement('div')
  wadah1T2.classList.add('flex-1')
  wadah1T2.innerText = param

  let wadah1T2T = document.createElement('div')
  wadah1T2T.classList.add('flex-none')
  wadah1T2T.innerText = ':'

  wadah1T1.append(wadah1T2, wadah1T2T)

  let wadah2T1 = document.createElement('div')
  wadah2T1.classList.add('flex-1')
  wadah2T1.innerText = isi

  wadahLuar.append(wadah1T1, wadah2T1)

  return wadahLuar
}

let wadahJadwalAktif = document.getElementById('wadahJadwalAktif')

function updateJadwalAktif(dataJadwals) {
  // kosongin duls
  wadahJadwalAktif.textContent = ''

  if (Array.isArray(dataJadwals) && dataJadwals.length > 0) {
    for (let i = 0; i < dataJadwals.length; i++) {
      let mulaiTayang = DateTime.fromISO(dataJadwals[i].mulaiTayang).toLocaleString({ timeStyle: 'short' })
      let selesaiTayang = DateTime.fromISO(dataJadwals[i].selesaiTayang).toLocaleString({ timeStyle: 'short' })
      let selesaiInterlude = DateTime.fromISO(dataJadwals[i].selesaiInterlude).toLocaleString({ timeStyle: 'short' })

      let jadwalBaru = generateJadwal(dataJadwals[i].id, dataJadwals[i].namaFilm, mulaiTayang, selesaiTayang, selesaiInterlude)
      wadahJadwalAktif.append(jadwalBaru)
    }

    return
  }

  // kalau gaada jadwal, auto generate ini
  let wadah = document.createElement('div')
  wadah.classList.add('flex', 'items-center', 'justify-center')

  let inner = document.createElement('div')
  inner.textContent = 'Tidak ada jadwal aktif!'

  wadah.append(inner)
  wadahJadwalAktif.append(wadah)
}

function generateJadwal(idFilm, film, mulai, selesaiTayang, selesaiInterlude) {
  let wadah = document.createElement('div')
  wadah.classList.add('jadwal-film', 'p-2', 'text-sm', 'bg-gray-100', 'flex', 'space-x-6')
  wadah.dataset.film = idFilm

  let subWadah1 = document.createElement('div')
  subWadah1.classList.add('flex-1')

  let judulFilm = document.createElement('a')
  judulFilm.classList.add('font-semibold', 'hover:underline', 'cursor-pointer')
  judulFilm.href = '/adminv/films/' + idFilm
  judulFilm.textContent = film

  let div = document.createElement('div')
  let div1 = generateSubJadwal('Selesai tayang', selesaiTayang)
  let div2 = generateSubJadwal('Selesai interlude', selesaiInterlude)
  div.append(div1, div2)
  subWadah1.append(judulFilm, div)

  let subWadah2 = document.createElement('div')
  subWadah2.classList.add('flex-none', 'flex', 'items-center', 'justify-center')

  let mulaiTayang = document.createElement('div')
  mulaiTayang.classList.add('p-1', 'text-white', 'bg-slate-900')
  mulaiTayang.textContent = mulai

  subWadah2.append(mulaiTayang)
  wadah.append(subWadah1, subWadah2)

  return wadah
}

function generateSubJadwal(param, value) {
  let div1 = document.createElement('div')
  div1.classList.add('flex', 'space-x-2', 'max-w-xs')

  let subDiv1 = document.createElement('div')
  subDiv1.classList.add('flex-none', 'flex', 'w-32')

  let subDiv1Sub1 = document.createElement('div')
  subDiv1Sub1.classList.add('flex-1')
  subDiv1Sub1.textContent = param

  let subDiv1Sub2 = document.createElement('div')
  subDiv1Sub2.classList.add('flex-none')
  subDiv1Sub2.textContent = ':'

  subDiv1.append(subDiv1Sub1, subDiv1Sub2)

  let subDiv2 = document.createElement('div')
  subDiv2.classList.add('flex-1')
  subDiv2.textContent = value

  div1.append(subDiv1, subDiv2)

  return div1
}


wrapperWaktuTayang.addEventListener("input.te.timepicker", (input) => {
  let jam = DateTime.fromISO(input.target.value)
  let interlude = 30 // default

  if (jam.isValid) {
    let jams = jam.toISO().split('T')
    let ISOJamBaru = ISO_TANGGALTAYANG + 'T' + jams[1]

    let mulaiTayang = DateTime.fromISO(ISOJamBaru)
    let selesaiTayang = mulaiTayang.plus({ minutes: DURASI })
    let selesaiInter = selesaiTayang.plus({ minutes: interlude })

    // set ke global
    WAKTUTAYANG = mulaiTayang
    ISO_WAKTUTAYANG = mulaiTayang.toISO()

    // formatting lagi
    iSelesaiFilm.value = selesaiTayang.toFormat('HH:mm')
    iSelesaiInterlude.value = selesaiInter.toFormat('HH:mm')
  }
});




//  AWYEAHHH INPUT TIME
btKirim.addEventListener('click', () => {
  // netralin style tabrakan
  let jadwals = document.getElementsByClassName('jadwal-film')
  for (const elemen of jadwals) {
    elemen.classList.remove('text-red-600', 'bg-red-300')
  }

  if (validasiError()) {
    Swal.fire({
      title: 'Menambah jadwal...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      scrollbarPadding: false,
      didOpen: () => {
        Swal.showLoading()

        setTimeout(() => {
          axios.post(window.location.pathname, {
            mulaiTayang: ISO_WAKTUTAYANG,
            filmId: IDFILM,
            studioId: IDSTUDIO
          })
          .then((res) => {
            Swal.fire('WEYYYYYY', 'INPUT BERHASIL BRO', 'success').then(() => {
              window.location.reload()
            })
          })
          .catch((err) => {
            Swal.fire({
              icon: 'error',
              title: 'Terdapat error dari server!',
              scrollbarPadding: false,
              text: err.response.data.msg,
              confirmButtonText: 'Tutup'
            }).then(() => {
              // cek tabrakan disini

              if (err.response.data.idTabrak && (err.response.data.isTabrakAtas || err.response.data.isTabrakBawah)) {
                tandainTabrakan(err.response.data.idTabrak)
              }
            })
          })

          // $.post(window.location.pathname, {
          //   mulaiTayang: ISO_WAKTUTAYANG,
          //   filmId: IDFILM,
          //   studioId: IDSTUDIO
          // },
          //   function (data, textStatus, jqXH54R) {
          //     // cek data beneran ada
          //     Swal.fire('WEYYYYYY', 'INPUT BERHASIL BRO', 'success').then(() => {
          //       window.location.reload()
          //     })

          //   },
          //   "json"
          // ).catch((xhr) => {
          //   Swal.fire({
          //     icon: 'error',
          //     title: 'Terdapat error dari server!',
          //     scrollbarPadding: false,
          //     text: xhr.responseJSON.msg,
          //     confirmButtonText: 'Tutup'
          //   }).then(() => {
          //     // cek tabrakan disini

          //     if (xhr.responseJSON.idTabrak && (xhr.responseJSON.isTabrakAtas || xhr.responseJSON.isTabrakBawah)) {
          //       tandainTabrakan(xhr.responseJSON.idTabrak)
          //     }
          //   })
          // })

        }, 1000)
      }
    })
  }
})

let validasiError = function () {
  if (!IDSTUDIO || IDSTUDIO == -1) {
    swalError('Somehow, lu belom milih studio bro')
    return false
  }

  let tempTanggal = DateTime.fromISO(ISO_TANGGALTAYANG)

  if (!TANGGALTAYANG || !ISO_TANGGALTAYANG || !tempTanggal.isValid) {
    swalError('Somehow, lu belom milih tanggal tayang bro')
    return false
  }

  if (!SUDAHPILIHFILM || DURASI == 0 || !IDFILM || IDFILM == -1) {
    swalError('Pilih film dulu bro')
    return false
  }

  let tempWaktu = DateTime.fromISO(ISO_WAKTUTAYANG)

  if (!WAKTUTAYANG || !ISO_WAKTUTAYANG || !tempWaktu.isValid) {
    swalError('Bro, pilih waktu tayang dulu lah')
    return false
  }

  return true
}

let swalError = function (pesan) {
  Swal.fire('Waduh', pesan, 'error')
}

function tandainTabrakan(filmId) {
  // cari pake class 'jadwal-film'
  let cari = document.querySelector(`div.jadwal-film[data-film="${filmId}"]`)

  if (cari) {
    cari.classList.add('text-red-600', 'bg-red-300')
    return true
  }

  return false
}