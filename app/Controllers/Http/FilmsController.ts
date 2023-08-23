import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { faker } from '@faker-js/faker';
import Database from '@ioc:Adonis/Lucid/Database';
import Film from 'App/Models/Film';
import { kapitalKalimat } from 'App/customFunction'
import { DateTime } from 'luxon';


function generateOrang(max: number = 2) {
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

export default class FilmsController {

    public async listFilm({ view, request }: HttpContextContract) {
        let filterStart = request.input('start')
        let filterEnd = request.input('end')

        let validStart = DateTime.fromISO(filterStart).startOf('day')
        let validEnd = DateTime.fromISO(filterEnd).startOf('day')


        let films = await Database
            .from('films')
            .join('genres', 'films.genre_id', 'genres.id')
            .join('rating_sensors', 'films.rating_sensor_id', 'rating_sensors.id')
            .select(
                'films.nama as nama',
                'films.durasi as durasi',
                'genres.genre as genre',
                'rating_sensors.nama_singkat as rating'
            )
            .if(validStart.isValid, (query) => {
                query.whereRaw('DATE(films.tanggal_mulai_tayang) >= DATE(?)', [ validStart.toSQLDate() as string ])
            })
            .if(validEnd.isValid, (query) => {
                query.whereRaw('DATE(films.tanggal_selesai_tayang) <= DATE(?)', [ validEnd.toSQLDate() as string ])
            })
            .orderBy('films.nama', 'asc')

        return view.render('1_adminv/films/list_film', { films, start: validStart, end: validEnd })
    }

    public async viewFilm({} : HttpContextContract){

    }


    // ini masih pake dummy random
    public async filmBaru({ request, response }: HttpContextContract) {
        let nama = request.input('nama')
        if (!nama) return {
            msg: 'isi nama film dulu bro'
        }

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

            let directors = generateOrang(2).substring(0, 255)
            let starrings = generateOrang(4).substring(0, 255)
            let gachaDurasi = 60 + (Math.floor(Math.random() * 10) * 10) + Math.floor(Math.random() * 10)

            await Film.create({
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

            return {
                msg: 'annjaaayy mantap jaya'
            }

        } catch (error) {
            return response.internalServerError({
                msg: 'waduh ada error brooooooooo',
                err: error
            })
        }
    }
}
