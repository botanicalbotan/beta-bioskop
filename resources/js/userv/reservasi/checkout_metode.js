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
let tabAktif = 1 // default tab aktif

const hargaDefault = hargaLock * banyakTiket // harga static
let hargaFinal = hargaDefault // harga final + ongkos ama diskonnya

let ongkosPembayaran = [] // sesuai tabAktif
let ongkosDefault = {
  nominal: 0,
  isPersen: false
} // default state ongkos
let ongkosFinal = 0 // nominal ongkos final baik persen atau ngga

// let kuponAktif = {
//   nominal: 0,
//   isPersen: false,
//   nama: 'alo'
// } // bentuk aslinya gini
let kuponAktif = null
let nominalKupon = 0


// mulai dari sini, menu samping
const lbOngkosPembayaran = document.getElementById('lbOngkosPembayaran')
const wadahKuponSamping = document.getElementById('wadahKuponSamping')
const lbGrandTotal = document.getElementById('lbGrandTotal')
const btBatal = document.getElementById('btBatal')
const btLanjut = document.getElementById('btLanjut')

const kalkulasiOngkos = function () {
  // ganti ongkos bayar sesuai tab
  ongkosDefault.isPersen = ongkosPembayaran[tabAktif].isPersen
  ongkosDefault.nominal = ongkosPembayaran[tabAktif].nominal

  // kupon dulu baru ongkos!
  wadahKuponSamping.textContent = ''

  if(kuponAktif && kuponAktif.namaKupon && !isNaN(kuponAktif.nominal) && typeof kuponAktif.isPersen != 'undefined'){
    nominalKupon = (kuponAktif.isPersen)? kuponAktif.nominal / 100 * hargaDefault : kuponAktif.nominal
    wadahKuponSamping.append(generateKuponSamping(kuponAktif.namaKupon, rupiahParser(-nominalKupon)))
  } else {
    wadahKuponSamping.textContent = '-'
  }

  // ongkos harga
  ongkosFinal = (ongkosDefault.isPersen) ? ongkosDefault.nominal / 100 * hargaDefault : ongkosDefault.nominal
  
  // finalisasi
  hargaFinal = hargaDefault - nominalKupon + ongkosFinal

  // reset tampilan menu samping
  lbOngkosPembayaran.textContent = rupiahParser(ongkosFinal)
  lbGrandTotal.textContent = rupiahParser(hargaFinal)
}

// ngambil & ngeset ongkos pembayaran
await axios.get('/userv/reservasi/get_ongkos_pembayaran')
  .then((res) => {
    const dataOngkos = res.data.ongkos
    if (dataOngkos.bb_point && dataOngkos.debit_transfer && dataOngkos.kartu_kredit && dataOngkos.lainnya) {
      // 0 kosong
      ongkosPembayaran[1] = dataOngkos.debit_transfer
      ongkosPembayaran[2] = dataOngkos.bb_point
      ongkosPembayaran[3] = dataOngkos.kartu_kredit
      ongkosPembayaran[4] = dataOngkos.lainnya

      // siapin tab pake data yang ada
      kalkulasiOngkos()
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
const generateKuponSamping = function (judul, nominal) {
  const divLuar = document.createElement('div')
  divLuar.classList.add('flex', 'space-x-2')

  const judulKupon = document.createElement('div')
  judulKupon.classList.add('flex-1', 'flex-wrap')
  judulKupon.textContent = judul

  const nominalKupon = document.createElement('div')
  nominalKupon.classList.add('flex-none')
  nominalKupon.textContent = nominal

  divLuar.append(judulKupon, nominalKupon)
  return divLuar
}

const inCekKupon = document.getElementById('inCekKupon')
const btCekKupon = document.getElementById('btCekKupon')

const wadahKupon = document.getElementById('wadahKupon')
const judulKupon = document.getElementById('judulKupon')
const keteranganKupon = document.getElementById('keteranganKupon')
const btHapusKupon = document.getElementById('btHapusKupon')

btCekKupon.addEventListener('click', () => {
  let kode = inCekKupon.value
  if (kode) {
    Swal.fire({
      title: 'Mengecek kupon...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      scrollbarPadding: false,
      didOpen: () => {
        Swal.showLoading()

        setTimeout(() => {

          axios.get(`/userv/kupons/cek_kupon?kuponid=${kode}`)
            .then((res) => {
              if (typeof res.data.isPersen != 'undefined' && !isNaN(res.data.nominal) && res.data.nama) {
                // kuponAktif.isPersen = res.data.isPersen
                // kuponAktif.nominal = res.data.nominal
                kuponAktif = {
                  isPersen: res.data.isPersen,
                  nominal: res.data.nominal,
                  namaKupon: res.data.nama,
                  kode: kode
                }

                kalkulasiOngkos()

                judulKupon.textContent = res.data.nama
                keteranganKupon.textContent = 'Disini keterangan kalau ntar dah ada'
                wadahKupon.classList.remove('hidden')
              } else {
                alert('Hayooooo ga lengkap')
              }

              Swal.close()
            })
            .catch((err) => {
              console.log(err)
              if(err.response && err.response.data.msg){
                Swal.fire({
                  icon: 'error',
                  title: err.response.data.msg,
                  scrollbarPadding: false,
                  text: 'Ini error dari server bro.',
                  confirmButtonText: 'Tutup'
                })
              }

              kuponAktif = null
              nominalKupon = 0
              judulKupon.textContent = ''
              keteranganKupon.textContent = ''
              wadahKupon.classList.add('hidden')
            })
        }, 1000)
      }
    })
  } else {
    alert('diisi dulu kuponnya bambang')
  }
})

btHapusKupon.addEventListener('click', (e) => {
  Swal.fire({
    title: 'Hapus kupon?',
    text: 'Potongan harga kamu bakal hilang!',
    confirmButtonText: 'Hapus',
    confirmButtonColor: '#ef4444',
    showCancelButton: true,
    cancelButtonText: 'Batal',
    focusCancel: true
  }).then((hasil) => {
    if (hasil.isConfirmed) {
      judulKupon.textContent = ''
      keteranganKupon.textContent = ''
      wadahKupon.classList.add('hidden')

      kuponAktif = null
      nominalKupon = 0
      kalkulasiOngkos()
    }
  })
})

// ========= MORE TAB ==========
const pillsBB = document.getElementById('pills-bbpoint-tab')
const pillsDebit = document.getElementById('pills-debit-tab')
const pillsKredit = document.getElementById('pills-kredit-tab')
const pillsLain = document.getElementById('pills-lain-tab')

// buat nyari tau tab mana yang aktif
pillsDebit.addEventListener('click', () => {
  tabAktif = 1
  kalkulasiOngkos()
  resetTampilanTab()
})
pillsBB.addEventListener('click', () => {
  tabAktif = 2
  kalkulasiOngkos()
  resetTampilanTab()
})
pillsKredit.addEventListener('click', () => {
  tabAktif = 3;
  kalkulasiOngkos()
  resetTampilanTab()
})
pillsLain.addEventListener('click', () => {
  tabAktif = 4;
  kalkulasiOngkos()
  resetTampilanTab()
})

// section Debit Transfer
const formDebitTransfer = document.getElementById('formDebitTransfer')
const dtSelBankVa = document.getElementById('dtSelBankVA')
const dtSelBankVaInstance = Select.getInstance(dtSelBankVa);
const dtCbKonfirm1 = document.getElementById('dtCbKonfirm1')
const dtCbKonfirm2 = document.getElementById('dtCbKonfirm2')
const dtInKuponValid = document.getElementById('dtInKuponValid')

// section BB Point
let ownBBPoint = 0
const bbInBbPoint = document.getElementById('bbInBbPoint')
const bbInPassword = document.getElementById('bbInPassword')
const bbCbKonfirm1 = document.getElementById('bbCbKonfirm1')
const bbCbKonfirm2 = document.getElementById('bbCbKonfirm2')

const resetTampilanTab = function () {
  // disable btLanjut
  btLanjut.disabled = true

  // reset BB Point
  bbInPassword.value = ''
  bbCbKonfirm1.checked = false
  bbCbKonfirm2.checked = false

  // reset debit transfer
  dtSelBankVaInstance.setValue("") // gabisa langsung, tp ngambil valuenya tetep bisa
  dtCbKonfirm1.checked = false
  dtCbKonfirm2.checked = false

  // to do...
}

// validasi kupon juga disini??

const validasiTabDebit = function () {
  if(!dtSelBankVa.value) return false

  if(!dtCbKonfirm1.checked || !dtCbKonfirm2.checked) return false

  return true
}

const validasiTabBB = function () {
  // perlu cek isi passwordnya juga dulu kah?
  if(!bbInPassword.value) return false

  if(!bbCbKonfirm1.checked || !bbCbKonfirm2.checked) return false

  return true
}

const validasiTabKredit = function () {
  // to do...
  return false
}

const validasiTabLain = function () {
  // to do...
  return false
}

// ========== MATI NYALAIN BT LANJUT =========
function resetBtLanjut() {
  // set default
  btLanjut.disabled = true

  if(tabAktif === 1){
    if(validasiTabDebit()) btLanjut.disabled = false
  } else if(tabAktif === 2){
    if(validasiTabBB()) btLanjut.disabled = false
  } else if (tabAktif === 3){
    if(validasiTabKredit()) btLanjut.disabled = false
  } else if (tabAktif === 4){
    if(validasiTabLain()) btLanjut.disabled = false
  }
}

// set ke semua input
dtSelBankVa.addEventListener('change', resetBtLanjut)
dtCbKonfirm1.addEventListener('change', resetBtLanjut)
dtCbKonfirm2.addEventListener('change', resetBtLanjut)

bbInPassword.addEventListener('change', resetBtLanjut)
bbCbKonfirm1.addEventListener('change', resetBtLanjut)
bbCbKonfirm2.addEventListener('change', resetBtLanjut)


// ========== BATAAALLLLLLLLL =========
btBatal.addEventListener('click', ()=>{
  Swal.fire({
    title: 'Batal transaksi?',
    text: 'Kursi kamu bakal dilepas!',
    confirmButtonText: 'Ya',
    confirmButtonColor: '#ef4444',
    showCancelButton: true,
    cancelButtonText: 'Tidak',
    focusCancel: true
  }).then((hasil) => {
    if (hasil.isConfirmed) {
      window.location = currentPathBersih() + '/batal'
    }
  })
})

// ======== LANJUTTTTTTTTTTTTTT =========
btLanjut.addEventListener('click', () => {
  // keknya ntar jadi post, tp dibedain urlnya biar rapi

  if(tabAktif === 1){
    if(validasiTabDebit()){
      // kalau ada kupon, set sekarang!
      if(kuponAktif && kuponAktif.kode){
        dtInKuponValid.value = kuponAktif.kode
      }

      pesanKonfirmasi(`debit transfer: ${ dtSelBankVa.options[dtSelBankVa.selectedIndex].textContent }`)
        .then((hasil)=>{
          if(hasil.isConfirmed){
            formDebitTransfer.submit()
          }
        })
    }
  } else if(tabAktif === 2){
    if(validasiTabBB()){
      pesanKonfirmasi(`BB Point`)
        .then((hasil)=>{
          if(hasil.isConfirmed){
            // to do...
          }
        })
    }
  } else if (tabAktif === 3){
    if(validasiTabKredit()){
      // to do...
    }
  } else if (tabAktif === 4){
    if(validasiTabLain()){
      // to do...
    }
  }
})

// pesan konfirmasi
function pesanKonfirmasi(pakaiapa){
  return Swal.fire({
    title: 'Konfirmasi',
    text: `Kamu mau bayar pake ${pakaiapa}. Lanjutkan?`,
    confirmButtonText: 'Ya',
    showCancelButton: true,
    cancelButtonText: 'Tidak',
    focusCancel: true
  })
}


function rupiahParser(number) {
  if (typeof number == 'number') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
  } else {
    return 'error'
  }
}

function currentPathBersih(){
  let path = location.pathname
  if(path.charAt(path.length - 1) === '/'){
    return path.slice(0, path.length-1)
  }
  return path
}