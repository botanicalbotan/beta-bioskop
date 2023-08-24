import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Genre from 'App/Models/Genre';
import RatingSensor from 'App/Models/RatingSensor';
// import Kursi from 'App/Models/Kursi';
import Studio from 'App/Models/Studio';
import Template from 'App/Models/Template';
import TierStudio from 'App/Models/TierStudio';
import RawData from 'App/Asli/raw_data'
import Database from '@ioc:Adonis/Lucid/Database';
import { numToChar } from 'App/customFunction'

// function getNextChar(char: string) {
//   return String.fromCharCode(char.charCodeAt(0) + 1);
// }

async function bikinTier() {
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

async function bikinLayoutNode(stud: Studio) {
  // ngambil semua template sesuai col row terpilih
  // PENTING: max row ama col di template harus predefined dan fixed
  // PENTING: col ama row di request harus lebih kecil dari max row col template
  let templateTerpilih = await Database
    .from('templates')
    .select(
      'id',
      'node',
      'row',
      'col'
    )
    .where('row', '<=', stud.row)
    .andWhere('col', '<=', stud.col)
    .orderBy('col', 'asc')
    .orderBy('row', 'asc')

  for (const iterator of templateTerpilih) {
    await stud.related('kursis').create({
      templateId: iterator.id,
      isKursi: false,
      harga: 20000, // harga ini buat jaga2 aja, sekarang masih pake dari tier
      privId: numToChar(Math.floor(Math.random() * 20)) + stud.id + '$' + iterator.node + '$' + numToChar(Math.floor(Math.random() * 20)) + numToChar(Math.floor(Math.random() * 20)),
      pubId: iterator.node,
    })
  }
}

export default class extends BaseSeeder {
  public async run() {
    // ----- bikin tier studio -----
    let tierDefault = await bikinTier()

    // ----- bikin genre -----
    await bikinGenre()

    // ----- bikin rating sensor -----
    await bikinRatingSensor()

    let maxCol = RawData.maxCol // tes pertama pake 5 dulu
    // let maxCol = 20
    let maxRow = RawData.maxRow // tes pertama pake 10 dulu
    // let maxRow = 50

    // ----- bikin 1 studio dulu -----
    let stud = await Studio.create({
      nama: 'Jurug',
      tierStudioId: tierDefault.id,
      // 2 data dibawah super penting, harus dibawah maxcol maxrow
      row: 10,
      col: 5
    })

    // sekarang ini murni buat bikin template doang
    for (let i = 1; i <= maxCol; i++) {
      for (let j = 1; j <= maxRow; j++) {
        await Template.create({
          node: numToChar(i) + j,
          row: j,
          col: i
        })

        // await stud.related('kursis').create({
        //   pubId: numToChar(i) + j,
        //   privId: numToChar(Math.floor(Math.random() * 20)) + stud.id + '$' + numToChar(i) + j + '$' + numToChar(Math.floor(Math.random() * 20)) + numToChar(Math.floor(Math.random() * 20)),
        //   templateId: temp.id,
        //   harga: 10000,
        //   studioId: 1,
        // })
      }
    }

    // kalau udah kelar semua
    // ----- generate layout node kursinya -----
    await bikinLayoutNode(stud)

  }
}
