import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Genre from 'App/Models/Genre';
import RatingSensor from 'App/Models/RatingSensor';
// import Kursi from 'App/Models/Kursi';
import Studio from 'App/Models/Studio';
import Template from 'App/Models/Template';
import TierStudio from 'App/Models/TierStudio';
import RawData from 'App/Asli/raw_data'
import Database from '@ioc:Adonis/Lucid/Database';
import { numToChar, kapitalKalimat } from 'App/customFunction'
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import Film from 'App/Models/Film';
import Kupon from 'App/Models/Kupon';
import User from 'App/Models/User';


// function getNextChar(char: string) {
//   return String.fromCharCode(char.charCodeAt(0) + 1);
// }

async function bikinUser() {
  await User.createMany([
    {
      nama: 'Budi'
    },
    {
      nama: 'Lengkuas'
    }
  ])
}

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

async function bikinStudio(nama: string, maxCol: number, maxRow: number, tier: TierStudio) {
  // ----- bikin 1 studio dulu -----
  let stud = await Studio.create({
    nama: nama,
    tierStudioId: tier.id,
    // 2 data dibawah super penting, harus dibawah maxcol maxrow
    row: maxRow,
    col: maxCol
  })

  let gachaRow1 = Math.floor(Math.random() * Math.ceil(maxRow / 2))
  let gachaRow2 = Math.ceil(maxRow / 2) - 1 + Math.floor(Math.random() * Math.ceil(maxRow / 2))

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
      isKursi: (iterator.row === gachaRow1 || iterator.row === gachaRow2) ? false : true,
      harga: 20000, // harga ini buat jaga2 aja, sekarang masih pake dari tier
      privId: numToChar(Math.floor(Math.random() * 20)) + stud.id + '$' + iterator.node + '$' + numToChar(Math.floor(Math.random() * 20)) + numToChar(Math.floor(Math.random() * 20)),
      pubId: (iterator.row === gachaRow1 || iterator.row === gachaRow2)? '*' : iterator.node,
    })
  }

  return stud
}

async function bikinFilmRandom(nama: string) {
  // fungsi ini masih copas dari FilmsController
  try {
    // ngambil semua genre dulu
    let genres = await Database
      .from('genres')
      .select('id')

    if (genres.length === 0) {
      throw new Error('Lah kosong genrenya.')
    }

    let gachaGenre = Math.floor(Math.random() * (genres.length))

    // ngambil semua rating_sensor dulu
    let ratings = await Database
      .from('rating_sensors')
      .select('id')

    if (ratings.length === 0) {
      throw new Error('Lah kosong rating sensornya.')
    }

    let gachaRating = Math.floor(Math.random() * (ratings.length))

    let directors = generateOrangFilm(2).substring(0, 255)
    let starrings = generateOrangFilm(4).substring(0, 255)
    // gacha max 160 menitan
    let gachaDurasi = 60 + (Math.floor(Math.random() * 10) * 10) + Math.floor(Math.random() * 10)

    let filmBaru = await Film.create({
      nama: kapitalKalimat(nama.substring(0, 30)),
      deskripsi: faker.lorem.sentence({ min: 8, max: 10 }).substring(0, 50),
      direktor: directors,
      starring: starrings,
      durasi: gachaDurasi,
      ratingSensorId: ratings[gachaRating].id,
      genreId: genres[gachaGenre].id,

      // sementara gini
      tanggalMulaiTayang: DateTime.now(),
      tanggalSelesaiTayang: DateTime.now().plus({ days: 7 })
    })

    return filmBaru

  } catch (error) {
    return null
  }
}

// dikasi null, soalnya dari bikinFilmRandom bisa null
async function bikinJadwalDariFilm(films: Array<Film | null>) {
  // jam 7 pagi besok
  let startWaktuDum = DateTime.now().plus({ days: 1 }).startOf('day').plus({ hours: 7 })
  let interlude = 30 // menit

  // bikin 7 jadwal
  for (let i = 0; i < 8; i++) {
    // max durasi 160 menit, kasi jarak 200 menit buat dummy
    if (i !== 0) startWaktuDum = startWaktuDum.plus({ minutes: 200 })

    let gachaFilm = Math.floor(Math.random() * films.length)

    const filmTarget = films[gachaFilm]
    const targetMulaiFilm = startWaktuDum
    const targetSelesaiFilm = targetMulaiFilm.plus({ minutes: filmTarget?.durasi })
    const targetPostInter = targetSelesaiFilm.plus({ minutes: interlude })

    await filmTarget?.related('jadwals').create({
      filmMulai: targetMulaiFilm,
      filmSelesai: targetSelesaiFilm,
      postInterlude: targetPostInter,
      studioId: 1 // biar enak liatnya, samain
    })
  }
}

async function bikinKupon() {
  await Kupon.createMany([
    {
      kode: faker.string.nanoid(12),
      nama: 'Diskon 10%',
      isPersen: true,
      nominal: 10,
      maxRedeem: 2,
      expiredAt: DateTime.now().plus({ days: 7 })
    },
    {
      kode: faker.string.nanoid(12),
      nama: 'Diskon Rp. 10.000',
      isPersen: false,
      nominal: 10000,
      maxRedeem: 2,
      expiredAt: DateTime.now().plus({ days: 7 })
    },
    {
      kode: faker.string.nanoid(12),
      nama: 'Kupon Expired',
      isPersen: true,
      nominal: 5,
      maxRedeem: 2,
      expiredAt: DateTime.now().minus({ days: 1 })
    },
    {
      kode: faker.string.nanoid(12),
      nama: 'Kupon Abis',
      isPersen: true,
      nominal: 5,
      maxRedeem: 2,
      jumlahRedeem: 2,
      expiredAt: DateTime.now().plus({ days: 7 })
    },
  ])
}

export default class extends BaseSeeder {
  public async run() {
    // ----- bikin user ------
    await bikinUser()

    // ----- bikin tier studio -----
    let tierDefault = await bikinTier()

    // ----- bikin genre -----
    await bikinGenre()

    // ----- bikin rating sensor -----
    await bikinRatingSensor()

    let maxCol = RawData.maxCol
    // let maxCol = 20
    let maxRow = RawData.maxRow
    // let maxRow = 50

    // sekarang ini murni buat bikin template doang
    for (let i = 1; i <= maxCol; i++) {
      for (let j = 1; j <= maxRow; j++) {
        await Template.create({
          node: numToChar(i) + j,
          row: j,
          col: i
        })
      }
    }

    // ----- generate layout node kursinya -----
    await bikinStudio('Basiclah', 8, 20, tierDefault)
    await bikinStudio('Minini', 5, 10, tierDefault)
    await bikinStudio('Dekaisugi', maxCol, maxRow, tierDefault)

    // ----- generate film random -----
    const films = [
      await bikinFilmRandom('Film Pertama'),
      await bikinFilmRandom('Gitu Lah Ya'),
      await bikinFilmRandom('Anjay Mabar')
    ]

    // ----- generate jadwal ------
    await bikinJadwalDariFilm(films)

    // ----- generate kupon -------
    await bikinKupon()
  }
}


// Fungsi secondary disini

function generateOrangFilm(max: number = 2) {
  let gachaTotal = Math.floor(Math.random() * max) + 1

  let wadah = ''
  let pemisah = '$' // ide sementara nyimpen dipisah ginian

  for (let i = 0; i < gachaTotal; i++) {
    wadah += faker.person.fullName()

    if (i !== gachaTotal - 1) {
      wadah += pemisah
    }
  }

  return wadah
}
