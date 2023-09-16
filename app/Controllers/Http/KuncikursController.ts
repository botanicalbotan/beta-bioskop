import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RawData from 'App/Asli/raw_data'
import Kuncikur from 'App/Models/Kuncikur'
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Kursi from 'App/Models/Kursi'
import Jadwal from 'App/Models/Jadwal'
import Database from '@ioc:Adonis/Lucid/Database'

export default class KuncikursController {
    public async listKuncikur({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }

    public async buatKuncikur({ request, response, session, auth }: HttpContextContract) {
        const jadwalId = request.input('jadid')
        // waktu tunggu ampe kursi dilepas lagi
        const waktuHoldMenit = RawData.holdKuncikurMinute

        try {
            // ------------ PENGAKSES ------------------
            if (!auth.user) throw 'auth ngga valid'
            const userPengakses = await User.findOrFail(auth.user.id)

            const jadwalTarget = await Jadwal.findOrFail(jadwalId)
                .catch(() => {
                    throw new Error('Jadwal idnya ga valid bro')
                })

            await jadwalTarget.load('studio', (studio) => {
                studio.preload('tierStudio')
            })

            // ---------- CEK FILM SELESAI -------------
            if(jadwalTarget.filmSelesai < DateTime.now()){
                throw new Error('Lah filmnya udah kelar broooo')
            }

            // ------------ CEK KURSI ------------------
            const newKuncikurSchema = schema.create({
                dipilih: schema.array([
                    rules.minLength(1),
                    // kalau mau, dikasi maxlength banyak kursi yang belom diambil di jadwal ini
                ]).members(
                    schema.string([
                        rules.exists({
                            table: 'kursis',
                            column: 'priv_id',
                            where: {
                                studio_id: jadwalTarget.studio.id
                            }
                        })
                    ])
                )
            })

            const validrequest = await request.validate({
                schema: newKuncikurSchema,
                messages: {
                    '*': 'Data yang lu kirim ngga valid bro, benerin gih'
                }
            })

            // ------------ CEK KURSI LAGI GA DI HOLD ------------------
            for (const iterator of validrequest.dipilih) {
                const testKursi = await Database
                    .from('kursis')
                    .join('kuncikur_kursis', 'kuncikur_kursis.kursi_id', 'kursis.id') // kalau ada, berarti kehold
                    .join('kuncikurs', 'kuncikur_kursis.kuncikur_id', 'kuncikurs.id')
                    .join('jadwals', 'jadwals.studio_id', 'kursis.studio_id')
                    .select('kursis.id as idKursi')
                    .where('jadwals.id', jadwalId) // cek jadwal
                    .andWhereRaw('kuncikurs.lock_until > ?', [DateTime.now().toSQL() as string]) // cek waktu lock
                    .andWhere('kursis.priv_id', iterator) // cek kursi
                    .first()

                    console.log(testKursi)
                if(testKursi){
                    throw new Error('Ada kursi yang ke hold! :' + iterator)
                }
            }

            // Mulai compile harga disini
            let hargaKursi = jadwalTarget.studio.tierStudio.hargaReguler
            const sekarang = DateTime.now()

            if (sekarang.weekday == 5) {
                // kalau jumat
                hargaKursi = jadwalTarget.studio.tierStudio.hargaFriday
            } else if (sekarang.weekday >= 6) {
                // kalau weekend
                hargaKursi = jadwalTarget.studio.tierStudio.hargaWeekend
            }

            // bikin kuncikur baru
            const kuncikurBaru = await Kuncikur.create({
                hargaLock: hargaKursi,
                lockUntil: sekarang.plus({ minutes: waktuHoldMenit }),
                jadwalId: jadwalId,
                userId: userPengakses.id,
            })

            // attach kursi ke kuncikur
            for (const iterator of validrequest.dipilih) {
                try {
                    const kursi = await Kursi.findByOrFail('priv_id', iterator)
                        .catch(() => {
                            throw new Error('ada skip')
                        })

                    await kuncikurBaru.related('kursis').attach([kursi.id])
                } catch (error) {
                    console.log(error.message)
                }
            }

            // kalau kelar, redirect ke laman kuncikur
            return response.redirect().status(301).toPath(`/userv/reservasi/checkout/${kuncikurBaru.id}`)

        } catch (error) {
            console.log(error.message)

            session.flash(
                'alertError',
                error.message
            )
            return response.redirect().withQs().back()
        }
    }

    public async formCheckout({ view, params }: HttpContextContract) {
        // data tanggal, studio sama film udah ada di tanggal
        let kuncikurId = params.kuncikurid
        try {
            // ambil dan cocokin semua data tanggal
            let kuncikur = await Kuncikur.findOrFail(kuncikurId)
            .catch(() => {
                throw new Error('Waduh, kok id kuncikurnya ngaco bro')
            })

            // ngambil data jadwal ma film
            await kuncikur.load('jadwal', (jadwal) => {
                jadwal.preload('film')
                    .preload('studio', (studio) => {
                        studio.preload('tierStudio')
                    })  
            })

            await kuncikur.load('kursis')
            
            let listKursi = ''
            for (let i = 0; i < kuncikur.kursis.length; i++) {
                listKursi += kuncikur.kursis[i].pubId

                if(i < kuncikur.kursis.length - 1) {
                    listKursi += ', '
                }
            }

            const listVaBank = await Database.from('va_bank_debits')
                .select(
                    'id',
                    'nama',
                )
                .orderBy('nama', 'asc')

            return view.render('2_userv/reservasi/checkout_metode', { kuncikur, fungsi: { rupiahParser }, listKursi, listVaBank })
            
        } catch (error) {
            return {
                msg: 'waduh',
                error: error.message
            }
        }
    }

    // auto ngecancel kuncikur yang lagi aktif
    public async batalCheckout({ params, response, session }: HttpContextContract) {
        const kuncikurId = params.kuncikurid
        try {
            const kunciTarget = await Kuncikur.findOrFail(kuncikurId)
            await kunciTarget.load('jadwal')
            kunciTarget.lockUntil = DateTime.now().minus({ minutes: 1 }) // gaperlu gini sih, tp intinya dimatiin
            await kunciTarget.save()

            // dibalikin ke jadwal
            return response.redirect().toPath(`/userv/reservasi/baru?jadid=${kunciTarget.jadwal.id}`)
        } catch (error) {
            session.flash('alertError', 'Lah kuncinya ga valid atau aneh bro....')
            return response.redirect().back()
        }
    }
    
    public async getOngkosPembayaranAPI({ }: HttpContextContract) {
        return {
            ongkos: RawData.ongkosPembayaran
        }
    }

    
    public async getKuncikurAPI({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }

    public async getKuncikurCountAPI({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }
}


function rupiahParser(angka: number) {
    if (typeof angka == 'number') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(angka)
    } else return 'error'
  }