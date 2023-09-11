
const dataStudio = document.getElementById('data-studio')
const hargaKursi = dataStudio.dataset.harga

const wadahKursi = document.getElementById('wadahKursi')
const jumlahKursi = document.getElementById('jumlahKursi')
const totalHarga = document.getElementById('totalHarga')

const btSubmit = document.getElementById('btSubmit')
const formKursi = document.getElementById('formKursi')

btSubmit.addEventListener('click', (e) => {
    const kursiDipilih = document.querySelectorAll('input[name="dipilih[]"]:checked')
    if(kursiDipilih.length>0){
        formKursi.submit()
    }
})

function pilihKursi(event) {
    let currentStat = event.currentTarget.dataset.ispilih
    if (currentStat && currentStat == '0') {
        event.currentTarget.classList.add('selected')
        event.currentTarget.dataset.ispilih = 1
        console.log('klik 1')
    } else {
        event.currentTarget.classList.remove('selected')
        event.currentTarget.dataset.ispilih = 0
        console.log('klik 2')
    }

    // masa gini sih anz, telat soalnya epennya
    setTimeout(() => {
        refreshTotalan()
    }, 200);
}

function refreshTotalan() {
    const kursiDipilih = document.querySelectorAll('input[name="dipilih[]"]:checked')

    let tempTeks = '-'
    btSubmit.disabled = true

    if(kursiDipilih.length > 0){
        tempTeks = ''
        btSubmit.disabled = false
    }

    // let tempTeks = (kursiDipilih.length>0)? '':'-'
    for (let i = 0; i < kursiDipilih.length; i++) {
        tempTeks += kursiDipilih[i].dataset.label

        if(i !== kursiDipilih.length-1){
            tempTeks += ', '
        } 
    }

    jumlahKursi.textContent = kursiDipilih.length
    totalHarga.textContent = rupiahParser(kursiDipilih.length * hargaKursi)
    wadahKursi.textContent = tempTeks
}

// set semua DOM kursi studio, ini label btw
let kursiStudio = document.getElementsByClassName('kursi-userv')

// gabisa pake foreach
for (let i = 0; i < kursiStudio.length; i++) {
    kursiStudio[i].addEventListener('click', pilihKursi)
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


