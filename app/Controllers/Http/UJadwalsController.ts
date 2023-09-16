import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Studio from 'App/Models/Studio'
import { DateTime } from 'luxon'

export default class UJadwalsController {
    public async defaultHome({ response, view }: HttpContextContract) {
        let tanggalTarget = DateTime.now()
        let targetStudio = 1 // asumsi studio 1 gabakal dihapus
        let totalHari = 7

        try {
            let tanggalAvail = generateTanggalAvail(tanggalTarget, totalHari)

            let studio = await Studio.findOrFail(targetStudio)
                .catch(() => {
                    throw new Error('Wah, id studionya ngaco bro')
                })

            let jadwals = await Database
                .from('jadwals')
                .join('films', 'jadwals.film_id', 'films.id')
                .join('rating_sensors', 'films.rating_sensor_id', 'rating_sensors.id')
                .join('genres', 'films.genre_id', 'genres.id')
                .where('jadwals.studio_id', studio.id)
                .andWhereRaw('DATE(jadwals.film_mulai) = DATE(?)', [tanggalTarget.toSQL() as string])
                .select(
                    'jadwals.id as id',
                    // 'films.nama as namaFilm',
                    'jadwals.film_mulai as mulaiTayang',
                    'jadwals.film_selesai as selesaiTayang',
                    // 'rating_sensors.nama_singkat as rating',
                    // 'genres.genre as genre',
                    // 'films.durasi as durasi',
                    'films.id as idFilm'
                )
                .select(
                    Database.from('kursis as a')
                        .join('reservasi_kursis', 'reservasi_kursis.kursi_id', 'a.id')
                        .join('reservasis', 'reservasi_kursis.reservasi_id', 'reservasis.id')
                        .whereColumn('reservasis.jadwal_id', 'jadwals.id')
                        .count('a.id')
                        .as('jumlahDipesan')
                )

            let filmsAktif = await Database
                .from('films')
                .join('rating_sensors', 'films.rating_sensor_id', 'rating_sensors.id')
                .join('genres', 'films.genre_id', 'genres.id')
                .join('jadwals', 'jadwals.film_id', 'films.id')
                .where('jadwals.studio_id', studio.id)
                .andWhereRaw('DATE(jadwals.film_mulai) = DATE(?)', [tanggalTarget.toSQL() as string])
                .select(
                    'films.id as idFilm',
                    'films.nama as namaFilm',
                    'rating_sensors.nama_singkat as rating',
                    'genres.genre as genre',
                    'films.durasi as durasi'
                )
                .groupBy('films.id')
                .orderBy('films.nama', 'asc')

            let totalKursi = await Database
                .from('kursis')
                .where('studio_id', studio.id)
                .count('id', 'jumlah')

            const totalKursiValid = totalKursi[0].jumlah ? totalKursi[0].jumlah : 0

            for (const iterator of jadwals) {
                iterator.maxKapasitas = totalKursiValid
                iterator.isPenuh = totalKursiValid <= iterator.jumlahDipesan
            }

            let filmMaJadwals = templateListJadwal(jadwals, filmsAktif)

            let studios = await Database
                .from('studios')
                .select(
                    'nama',
                    'id'
                )
                .orderBy('nama', 'asc')

            return view.render('2_userv/home', { filmMaJadwals, tanggalAvail, currentStudio: studio, studios, currentTanggal: tanggalTarget })
        } catch (error) {
            console.log(error)
            return response.badRequest({
                msg: error.message,
            })
        }
    }

    public async listJadwalAktif({ params, response, view }: HttpContextContract) {
        let tanggalTarget = params.tanggal
        let targetStudio = params.studioId
        let totalHari = 7

        try {
            let tanggalValid = DateTime.fromISO(tanggalTarget)

            if (!tanggalValid.isValid) {
                throw new Error('Tanggalnya ngga bener nih bro')
            }

            let tanggalAvail = generateTanggalAvail(tanggalValid, totalHari)

            let studio = await Studio.findOrFail(targetStudio)
                .catch(() => {
                    throw new Error('Wah, id studionya ngaco bro')
                })

            let jadwals = await Database
                .from('jadwals')
                .join('films', 'jadwals.film_id', 'films.id')
                .join('rating_sensors', 'films.rating_sensor_id', 'rating_sensors.id')
                .join('genres', 'films.genre_id', 'genres.id')
                .where('jadwals.studio_id', studio.id)
                .andWhereRaw('DATE(jadwals.film_mulai) = DATE(?)', [tanggalValid.toSQL() as string])
                .select(
                    'jadwals.id as id',
                    // 'films.nama as namaFilm',
                    'jadwals.film_mulai as mulaiTayang',
                    'jadwals.film_selesai as selesaiTayang',
                    'films.id as idFilm'
                    // 'rating_sensors.nama_singkat as rating',
                    // 'genres.genre as genre',
                    // 'films.durasi as durasi'
                )
                .select(
                    Database.from('kursis as a')
                        // .join('reservasis', 'reservasis.kursi_id', 'a.id')
                        .join('reservasi_kursis', 'reservasi_kursis.kursi_id', 'a.id')
                        .join('reservasis', 'reservasi_kursis.reservasi_id', 'reservasis.id')
                        .whereColumn('reservasis.jadwal_id', 'jadwals.id')
                        .count('a.id')
                        .as('jumlahDipesan')
                )

            let filmsAktif = await Database
                .from('films')
                .join('rating_sensors', 'films.rating_sensor_id', 'rating_sensors.id')
                .join('genres', 'films.genre_id', 'genres.id')
                .join('jadwals', 'jadwals.film_id', 'films.id')
                .where('jadwals.studio_id', studio.id)
                .andWhereRaw('DATE(jadwals.film_mulai) = DATE(?)', [tanggalValid.toSQL() as string])
                .select(
                    'films.id as idFilm',
                    'films.nama as namaFilm',
                    'rating_sensors.nama_singkat as rating',
                    'genres.genre as genre',
                    'films.durasi as durasi',
                )
                .groupBy('films.id')
                .orderBy('films.nama', 'asc')

            let totalKursi = await Database
                .from('kursis')
                .where('studio_id', studio.id)
                .count('id', 'jumlah')

            const totalKursiValid = totalKursi[0].jumlah ? totalKursi[0].jumlah : 0

            for (const iterator of jadwals) {
                iterator.maxKapasitas = totalKursiValid
                iterator.isPenuh = totalKursiValid <= iterator.jumlahDipesan
                let filmSel = DateTime.fromJSDate(iterator.selesaiTayang)
                iterator.isKelar = filmSel < DateTime.now()
            }

            let filmMaJadwals = templateListJadwal(jadwals, filmsAktif)

            let studios = await Database
            .from('studios')
            .select(
                'nama',
                'id'
            )
            .orderBy('nama', 'asc')

            return view.render('2_userv/home', { filmMaJadwals, tanggalAvail, currentStudio: studio, studios, currentTanggal: tanggalValid })


        } catch (error) {
            console.log(error)
            return response.badRequest({
                msg: error.message,
            })
        }
    }
}


interface TglDiHome {
    isTarget: boolean,
    tgl: DateTime
}

let generateTanggalAvail = function (targetTgl: DateTime, totalHari: number = 7) {
    let tanggalAvail: Array<TglDiHome> = []
    let targetNetral = targetTgl.startOf('day')

    for (let i = 0; i < totalHari; i++) {
        let temp = DateTime.now().startOf('day').plus({ days: i })
        let cek = targetNetral.toMillis() === temp.toMillis()
        tanggalAvail.push({
            isTarget: cek,
            tgl: temp
        })
    }

    return tanggalAvail
}

interface ListJadwal {
    id: number,
    mulaiTayang: DateTime,
    selesaiTayang: DateTime,
    idFilm: number,
    jumlahDipesan: number
}

interface ListFilm {
    idFilm: number,
    namaFilm: string,
    rating: string,
    genre: string,
    durasi: number
}

interface ListSiapKirim {
    idFilm: number,
    namaFilm: string,
    rating: string,
    genre: string,
    durasi: number,
    jadwals: Array<ListJadwal>
}

let templateListJadwal = function (jadwals: Array<ListJadwal>, films: Array<ListFilm>) {
    let wadah: Array<ListSiapKirim> = []

    for (const fil of films) {
        let siap = jadwals.filter((jad) => jad.idFilm == fil.idFilm)

        let temp: ListSiapKirim = {
            durasi: fil.durasi,
            genre: fil.genre,
            idFilm: fil.idFilm,
            rating: fil.rating,
            namaFilm: fil.namaFilm,
            jadwals: siap
        }

        wadah.push(temp)
    }

    return wadah
}