import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Studio from 'App/Models/Studio'
import { DateTime } from 'luxon'

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Film from 'App/Models/Film'
import Jadwal from 'App/Models/Jadwal'


export default class JadwalsController {
    public async listJadwal({ view }: HttpContextContract) {
        return view.render('1_adminv/jadwals/list_jadwal')
    }

    public async viewJadwal({ params }: HttpContextContract) {
        // SEMENTARA LOM ADA BEDANYA SET GRID AMA INDEX
        let jadwalid = params.id
        
        try {
            let jadwal = await Jadwal.findByOrFail('id', jadwalid)
                .catch(() => {
                throw new Error('Jadwal id ga valid atau ga ada')
            })

            await jadwal.load('film')
            await jadwal.load('studio')

            return { jadwal }

        } catch (error) {
            return {
                msg: 'Studio yang lu cari error bro',
                err: error.message
            }
        }
    }

    public async cariSlot({ request, response }: HttpContextContract) {
        let tanggal = request.input('iTanggalTayang')
        let studio = request.input('iStudio')

        try {
            let tanggalValid = DateTime.fromISO(tanggal)
            if (!tanggalValid || !tanggalValid.isValid) {
                throw new Error('Input tanggal ngga valid!')
            }

            let studioValid = await Studio.findByOrFail('id', studio).catch(() => {
                throw new Error('Studio id ga valid atau ga ada!')
            })

            // cari yang AIRING di tanggal terpilih
            let filmsByTanggal = await Database
                .from('films')
                .join('rating_sensors', 'films.rating_sensor_id', 'rating_sensors.id')
                .join('genres', 'films.genre_id', 'genres.id')
                .select(
                    'films.id as id',
                    'films.nama as nama',
                    'films.durasi as durasi',
                    'rating_sensors.nama_singkat as rating',
                    'genres.genre as genre'
                )
                .whereRaw('DATE(tanggal_mulai_tayang) <= DATE(?)', [tanggalValid.toISO()!])
                .andWhereRaw('DATE(tanggal_selesai_tayang) >= DATE(?)', [tanggalValid.toISO()!])

            let jadwalsAktif = await Database
                    .from('jadwals')
                    .join('films', 'jadwals.film_id', 'films.id')
                    .select(
                        'jadwals.id as id',
                        'jadwals.film_mulai as mulaiTayang',
                        'jadwals.film_selesai as selesaiTayang',
                        'jadwals.post_interlude as selesaiInterlude',
                        'films.nama as namaFilm'
                    )
                    .where('jadwals.studio_id', studioValid.id)
                    .andWhereRaw('DATE(jadwals.film_mulai) = DATE(?)', [ tanggalValid.toSQL() as string ])

            return {
                tanggal, studio, filmsByTanggal, jadwalsAktif
            }
        } catch (error) {
            return response.badRequest({
                msg: error.message,
                test: 'testing aja',
                data: tanggal
            })
        }



        // return view.render('1_adminv/jadwals/jadwal_baru', { studios })
    }

    public async jadwalBaru({ view }: HttpContextContract) {
        let studios = await Database
            .from('studios')
            .select(
                'nama',
                'id'
            )
            .orderBy('nama', 'asc')

        return view.render('1_adminv/jadwals/jadwal_baru', { studios })
    }

    public async simpanJadwal({ request, response }: HttpContextContract) {
        let interlude = 30 // menit

        // validasi disini
        let newJadwalSchema = schema.create({
            mulaiTayang: schema.date({
                format: 'iso',
            }),
            filmId: schema.number([
                rules.exists({
                    table: 'films',
                    column: 'id'
                })
            ]),

            studioId: schema.number([
                rules.exists({
                    table: 'studios',
                    column: 'id'
                })
            ]),
        })

        try {
            // cekk
            const validrequest = await request.validate({
                schema: newJadwalSchema
            })

            // step1: panggil studio, olah datanya
            let film = await Film.findOrFail(validrequest.filmId)
            let targetTayang = validrequest.mulaiTayang


            let targetSelesai = targetTayang.plus({ minutes: film.durasi })
            let targetPostInter = targetSelesai.plus({ minutes: interlude })

            // cek tanggal mulai beneran sama ama airing film ngga
            let isFilmAiring = film.tanggalMulaiTayang.startOf('day') <= targetTayang && targetTayang <= film.tanggalSelesaiTayang.endOf('day')
            if (!isFilmAiring) {
                throw {
                    isCustom: true,
                    msg: `Film ini tidak tayang pada tanggal ${targetTayang.toLocaleString({ dateStyle:'short' })}`
                }
            }

            // cek tanggal mulai slotnya dipake orang ngga
            let deketAtasTabrakan = await Database
                .from('jadwals')
                .join('films', 'jadwals.film_id', 'films.id')
                .select(
                    'films.nama as namaFilm',
                    'jadwals.film_mulai as jamTayang', 
                    'jadwals.post_interlude as jamSelesai',
                    'jadwals.id as id'
                    )
                .whereRaw('jadwals.film_mulai <= ?', [targetTayang.toSQL() as string])
                .andWhereRaw('jadwals.post_interlude > ?', [targetTayang.toSQL() as string])
                .orderBy('jadwals.film_mulai', 'desc')
                .limit(1)
            // 1. film_mulai <= target_tayang < post_interlude

            let isTabrakAtas = deketAtasTabrakan.length > 0
            if(isTabrakAtas){
                throw {
                    isCustom: true,
                    isTabrakAtas: true,
                    msg: `Jadwal ini bertabrakan dengan film sebelumnya!`,
                    idTabrak: deketAtasTabrakan[0].id
                }
            }


            let deketBawahTabrakan = await Database
                .from('jadwals')
                .join('films', 'jadwals.film_id', 'films.id')
                .select(
                    'films.nama as namaFilm',
                    'jadwals.film_mulai as jamTayang', 
                    'jadwals.post_interlude as jamSelesai',
                    'jadwals.id as id'
                    )
                .whereRaw('jadwals.film_mulai < ?', [targetPostInter.toSQL() as string])
                .andWhereRaw('jadwals.film_mulai >= ?', [targetTayang.toSQL() as string])
                .orderBy('jadwals.film_mulai', 'desc')
                .limit(1)
            // 2. target_tayang <= film_mulai < target_post

            let isTabrakBawah = deketBawahTabrakan.length > 0
            if(isTabrakBawah){
                throw {
                    isCustom: true,
                    isTabrakBawah: true,
                    msg: `Jadwal ini bertabrakan dengan film selanjutnya!`,
                    idTabrak: deketBawahTabrakan[0].id
                }
            }

            // step2: studio.related('jadwal').create()
            await film.related('jadwals').create({
                studioId: validrequest.studioId,
                filmMulai: targetTayang,
                filmSelesai: targetSelesai,
                postInterlude: targetPostInter
            })

            return response.accepted({
                message: 'Data jadwal berhasil ditambahkan!'
            })

        } catch (error) {
            if(error.isCustom){
                return response.badRequest(error)
            } else {
                return response.badRequest({
                    msg: 'waduh error bro',
                    error: error.message
                })
            }
        }
    }
}
