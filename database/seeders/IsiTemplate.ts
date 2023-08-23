import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Genre from 'App/Models/Genre';
import RatingSensor from 'App/Models/RatingSensor';
// import Kursi from 'App/Models/Kursi';
import Studio from 'App/Models/Studio';
import Template from 'App/Models/Template';
import TierStudio from 'App/Models/TierStudio';

// function getNextChar(char: string) {
//   return String.fromCharCode(char.charCodeAt(0) + 1);
// }

function numToChar(angka: number = 0) {
  let base = 'a'.charCodeAt(0)
  return (angka === 0 || angka === 1)? 'a': String.fromCharCode(base + angka - 1)
}

async function bikinTier(){
  let tier1 = await TierStudio.create({
    nama: 'reguler',
    deskripsi: 'bioskop tapi reguler',
    hargaReguler: 20000,
    hargaFriday: 25000,
    hargaWeekend: 30000
  })

  // gausah diwadahin yang ini
  await TierStudio.create({
    nama: 'gold',
    deskripsi: 'bioskop tapi gold',
    hargaReguler: 30000,
    hargaFriday: 35000,
    hargaWeekend: 40000
  })

  return tier1
}

async function bikinGenre() {
  // data diambil seadanya, 5 lah cukup

  await Genre.createMany([
    {
      genre: 'Horror'
    },
    {
      genre: 'Drama'
    },
    {
      genre: 'Action'
    },
    {
      genre: 'Comedy'
    },
    {
      genre: 'Fantasy'
    }
  ])
}

async function bikinRatingSensor() {
  // di scrap dari kategori LSF
  await RatingSensor.createMany([
    {
      nama: 'Semua Umur',
      namaSingkat: 'SU',
      keterangan: 'Semua umur bro'
    },
    {
      nama: 'Anak',
      namaSingkat: 'A',
      keterangan: 'Anak usia 3-12 taun bro'
    },
    {
      nama: 'Bimbingan Ortu Untuk Anak',
      namaSingkat: 'BO-A',
      keterangan: 'Anak dibawah bimbingan ortu'
    },
    {
      nama: 'Bimbingan Ortu',
      namaSingkat: 'BO',
      keterangan: 'Anak usia 13 kebawah dibawah bimbingan ortu'
    },
    {
      nama: 'Bimbingan Ortu Semua Umur',
      namaSingkat: 'BO-SU',
      keterangan: 'Semua umur dibawah bimbingan ortu'
    },
    {
      nama: 'Remaja',
      namaSingkat: 'R',
      keterangan: 'Remaja usia 13-16 taun bro'
    },
    {
      nama: 'Dewasa',
      namaSingkat: 'D',
      keterangan: '17 taun keatas bro'
    },
  ])
}

export default class extends BaseSeeder {
  public async run () {
    // ----- bikin tier studio -----
    let tierDefault = await bikinTier()

    // ----- bikin genre -----
    await bikinGenre()

    // ----- bikin rating sensor -----
    await bikinRatingSensor()

    // ----- bikin 1 studio dulu -----
    let stud = await Studio.create({
      nama: 'Jurug',
      tierStudioId: tierDefault.id
    })

    let maxCol = 5 // tes pertama pake 5 dulu
    // let maxCol = 20
    let maxRow = 10 // tes pertama pake 10 dulu
    // let maxRow = 50

    for(let i=1; i<= maxCol; i++){
      for(let j=1; j<= maxRow; j++){
        let temp = await Template.create({
          node: numToChar(i) + j,
          row: j,
          col: i
        })

        await stud.related('kursis').create({
          pubId: numToChar(i) + j,
          privId: numToChar(Math.floor(Math.random()*20)) + stud.id + '$' + numToChar(i) + j + '$' + numToChar(Math.floor(Math.random()*20)) + numToChar(Math.floor(Math.random()*20)),
          templateId: temp.id,
          harga: 10000,
          studioId: 1,
        })
      }
    }
    
  }
}
