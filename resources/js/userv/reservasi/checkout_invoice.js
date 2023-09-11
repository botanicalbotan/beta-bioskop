// Initialization for ES Users
import {
  Input,
  Tab,
  Select,
  initTE,
} from "tw-elements";
initTE({ Input, Select, Tab });

import axios from "axios";
import Swal from "sweetalert2";

const dataSimpanan = document.getElementById('data-simpanan')
const hargaLock = dataSimpanan.dataset.harga
const validUntil = dataSimpanan.dataset.lock
const banyakTiket = dataSimpanan.dataset.banyak
const hargaBase = hargaLock * banyakTiket

// mulai dari sini, menu samping
let lbOngkosPembayaran = document.getElementById('lbOngkosPembayaran')
let wadahKuponSamping = document.getElementById('wadahKuponSamping')

const generateKupon = function (judul, nominal) {
  const divLuar = document.createElement('div')
  divLuar.classList.add('flex', 'space-x-2')

  const judulKupon = document.createElement('div')
  judulKupon.classList.add('flex-1 flex-wrap')
  judulKupon.textContent = judul

  const nominalKupon = document.createElement('div')
  nominalKupon.classList.add('flex-none')
  nominalKupon.textContent = nominal

  divLuar.append(judulKupon, nominalKupon)
  return divLuar
}

// ngambil & ngeset ongkos pembayaran
let ongkosPembayaran = [] // sesuai tabAktif
let ongkosAktif = {
  nominal: 0,
  isPersen: false
} // default state ongkos
await axios.get('/userv/reservasi/get_ongkos_pembayaran')
  .then((res) => {
    const dataOngkos = res.data.ongkos
    if(dataOngkos.bb_point && dataOngkos.debit_transfer && dataOngkos.kartu_kredit && dataOngkos.lainnya){
      // 0 kosong
      ongkosPembayaran[1] = dataOngkos.bb_point
      ongkosPembayaran[2] = dataOngkos.debit_transfer
      ongkosPembayaran[3] = dataOngkos.kartu_kredit
      ongkosPembayaran[4] = dataOngkos.lainnya

      // set ongkos aktif default, tab 1
      ongkosAktif.isPersen = ongkosPembayaran[1].nominal
      ongkosAktif.nominal = ongkosPembayaran[1].isPersen
    } else {
      throw new Error('Hayooo datanya ga lengkap')
    }
  })
  .catch((err) => {
    console.log(err)
    alert('Waduh bro, asli ada error. Gaboleh Lanjut.')
    // do somethin here...
  })

const lbCountdown = document.getElementById('lbCountdown')
let countDownDate = new Date(validUntil).getTime();

// Update the count down every 1 second
let cd = setInterval(function () {
  let now = new Date().getTime();
  let distance = countDownDate - now;

  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  lbCountdown.textContent = ((hours > 9) ? hours : '0' + hours) + ":"
    + ((minutes > 9) ? minutes : '0' + minutes) + ":" + ((seconds > 9) ? seconds : '0' + seconds);

  if (distance < 0) {
    clearInterval(cd);
    lbCountdown.textContent = "EXPIRED";
    // harusnya dikasi reload pag ntar
  }
}, 1000);


// ========= KUPOOONNN ==========
const inCekKupon = document.getElementById('inCekKupon')
const btCekKupon = document.getElementById('btCekKupon')
btCekKupon.addEventListener('click', () => {
  if(inCekKupon.value){
    Swal.fire({
      title: 'Mengecek kupon...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      scrollbarPadding: false,
      didOpen: () => {
        Swal.showLoading()
  
        setTimeout(() => {
  
          axios.get(`/userv/kupons/cek_kupon?kuponid=${inCekKupon.value}`)
            .then((res) => {
              if (res.data.isPersen && res.data.nominal) {
                // to do...
              }
  
              console.log(res.data)

              Swal.close()
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
            })
        }, 1000)
      }
    })
  } else {
    alert ('diisi dulu kuponnya bambang')
  }
})

// default tab aktif
let tabAktif = 1
const pillsBB = document.getElementById('pills-bbpoint-tab')
const pillsDebit = document.getElementById('pills-debit-tab')
const pillsKredit = document.getElementById('pills-kredit-tab')
const pillsLain = document.getElementById('pills-lain-tab')

// buat nyari tau tab mana yang aktif
pillsBB.addEventListener('click', () => { tabAktif = 1; prepareTab();})
pillsDebit.addEventListener('click', () => { tabAktif = 2; prepareTab() })
pillsKredit.addEventListener('click', () => { tabAktif = 3; prepareTab() })
pillsLain.addEventListener('click', () => { tabAktif = 4; prepareTab() })

// section BB Point
const ownBBPoint = 0
const bbInBbPoint = document.getElementById('bbInBbPoint')
const bbInPassword = document.getElementById('bbInPassword')
const bbCbKonfirm1 = document.getElementById('bbCbKonfirm1')
const bbCbKonfirm2 = document.getElementById('bbCbKonfirm2')


const prepareTab = function () {
   // ganti ongkos bayar sesuai tab
   ongkosAktif.isPersen = ongkosPembayaran[tabAktif].isPersen
   ongkosAktif.nominal = ongkosPembayaran[tabAktif].nominal

   // reset semua tampilan tab
   resetSemuaTab()
}

const resetSemuaTab = function () {
  // reset BB Point
  bbInPassword.value = ''
  bbCbKonfirm1.checked = false
  bbCbKonfirm2.checked = false

  // reset debit transfer

  
  // to do...
}

const validasiTabBB = function () {
  // to do...
  return false
}

const validasiTabDebit = function () {
  // to do...
  return false
}

const validasiTabKredit = function () {
  // to do...
  return false
}

const validasiTabLain = function () {
  // to do...
  return false
}
