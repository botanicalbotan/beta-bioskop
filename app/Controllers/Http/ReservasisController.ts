import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Jadwal from 'App/Models/Jadwal'
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import RawData from 'App/Asli/raw_data'
import Kuncikur from 'App/Models/Kuncikur'
import User from 'App/Models/User'
// import Kursi from 'App/Models/Kursi'
import { checkAndGetKupon } from 'App/Asli/lib_fungsi'
import Reservasi from 'App/Models/Reservasi'
import VaBankDebit from 'App/Models/VaBankDebit'
import { faker } from '@faker-js/faker'

export default class ReservasisController {
    public async listReservasi({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }

    public async lihatReservasi({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }

    public async pilihKursi({ view, request }: HttpContextContract) {
        // data tanggal, studio sama film udah ada di tanggal
        let jadwalId = request.input('jadid')

        try {
            // ambil dan cocokin semua data tanggal
            let jadwal = await Jadwal.findOrFail(jadwalId)
                .catch(() => {
                    throw new Error('Waduh, kok id jadwalnya ngaco bro')
                })

            await jadwal.load('film')
            await jadwal.load('studio', (studio) => {
                studio.preload('tierStudio')
            })

            // ambil semua kursi, tandain yang udah kepesan ama yang belom
            // pake format template baru

            let base = await Database
                .from('kursis')
                .join('templates', 'kursis.template_id', 'templates.id')
                .where('studio_id', jadwal.studio.id)
                .select(
                    'kursis.pub_id as node',
                    'kursis.priv_id as id',
                    'kursis.is_kursi as isKursi',
                    'kursis.harga as harga',
                    'templates.col as col',
                    'templates.row as row'
                    // segini dulu
                )
                .select(
                    // ngecek kuncikur aktif
                    Database.from('kuncikur_kursis')
                        .join('kuncikurs', 'kuncikur_kursis.kuncikur_id', 'kuncikurs.id')
                        .select('kuncikurs.id')
                        .whereColumn('kuncikur_kursis.kursi_id', 'kursis.id')
                        .andWhere('kuncikurs.lock_until', '>=', DateTime.now().toSQL() as string)
                        .limit(1)
                        .as('kuncikurAktifId')
                )
                .select(
                    // ngecek reservasi aktif, entah yang udah dibayar atau belum, yang penting valid
                    Database.from('reservasi_kursis')
                        .join('reservasis', 'reservasi_kursis.reservasi_id', 'reservasis.id')
                        .select('reservasis.id')
                        .whereColumn('reservasi_kursis.kursi_id', 'kursis.id')
                        .andWhere('reservasis.lock_until', '>=', DateTime.now().toSQL() as string) // cek lock
                        .andWhere('reservasis.is_active', true) // cek aktif, ntar ada mekanisme cron buat ngecek status tiap 10 menit
                        .limit(1)
                        .as('reservasiAktifId')
                )
                .orderBy('templates.col', 'asc')
                .orderBy('templates.row', 'asc')

            let layoutKursi = templateToGridBeta(base, jadwal.studio.col)

            // Mulai compile harga disini
            let hargaKursi = jadwal.studio.tierStudio.hargaReguler
            const sekarang = DateTime.now()

            if (sekarang.weekday == 5) {
                // kalau jumat
                hargaKursi = jadwal.studio.tierStudio.hargaFriday
            } else if (sekarang.weekday >= 6) {
                // kalau weekend
                hargaKursi = jadwal.studio.tierStudio.hargaWeekend
            }

            return view.render('2_userv/reservasi/reservasi_kursi', { layoutKursi, jadwal, hargaKursi })
        } catch (error) {
            return {
                msg: 'Laman yang lu cari error bro',
                err: error.message
            }
        }
    }

    // DISINI MULAI VALIDASI BIKIN RESERVASI BARU
    public async buatReservasiDebit({ request, params, response, auth, session }: HttpContextContract) {
        const kuncikurId = params.kuncikurid

        try {
            // ------------ PENGAKSES ------------------
            if (!auth.user) throw 'auth ngga valid'
            const userPengakses = await User.findOrFail(auth.user.id)

            // ------------ CEK PARAM -----------------
            const targetKuncikur = await Kuncikur.findOrFail(kuncikurId)
                .catch(() => {
                    throw new Error('Waduh url lu ngaco bro')
                })
            await targetKuncikur.load('kursis')
            await targetKuncikur.load('jadwal')

            // ---------- CEK WAKTU LOCK --------------
            if(targetKuncikur.lockUntil < DateTime.now()) {
                throw new Error('Lah, udah ngga valid brooo')
            }

            // ---------- CEK FILM SELESAI -------------
            if(targetKuncikur.jadwal.filmSelesai < DateTime.now()){
                throw new Error('Lah filmnya udah kelar broooo')
            }

            // --------- CEK INPUT ---------------------
            // yang perlu dicek:  1.data debit, 2.data kupon (idnya aja)
            let newReservasiDebitSchema = schema.create({
                vaDebit: schema.number([
                    rules.exists({
                        table: 'va_bank_debits',
                        column: 'id'
                    })
                ]),
                kuponValidDebit: schema.string.optional([
                    // redundan sih, tp biar gampang, ntar ngecek kuponnya dibawah
                    rules.exists({
                        table: 'kupons',
                        column: 'kode',
                    })
                ]),
            })

            const validrequest = await request.validate({
                schema: newReservasiDebitSchema,
                messages: {
                    '*': 'Lah input lu salah brooo'
                }
            })

            // --------- CEK KUPON ----------------
            const kuponTarget = (validrequest.kuponValidDebit) ? await checkAndGetKupon(validrequest.kuponValidDebit) : null

            // hitung harga barang
            let diskon = 0
            if (kuponTarget) {
                diskon = (kuponTarget.isPersen) ? kuponTarget.nominal / 100 * targetKuncikur.hargaLock : kuponTarget.nominal
            }
            const dataOngkos = RawData.ongkosPembayaran.debit_transfer // masih hardcoded
            let ongkos = (dataOngkos.isPersen) ? dataOngkos.nominal / 100 * targetKuncikur.hargaLock : dataOngkos.nominal

            let hargaTiket = targetKuncikur.hargaLock - diskon + ongkos

            // --------- AMBIL VA ----------------
            const targetVA = await VaBankDebit.findOrFail(validrequest.vaDebit)

            const reservasiBaru = await Reservasi.create({
                hargaTiketBase: targetKuncikur.hargaLock, // harga semua tiket
                hargaTiketAkhir: hargaTiket, // harga semua tiket
                ongkosLayanan: ongkos,
                lockUntil: targetKuncikur.lockUntil,
                isActive: true,
                isPaid: false,
                metodeBayar: `Debit-${targetVA.nama}`,
                noTransaksi: faker.string.numeric({ length: 12 }),
                noVa: targetVA.noVa.toString() + faker.string.numeric(5),
                redeemToken: faker.string.nanoid(20), // apa baru dikasi pas lunas?
                isUsed: false,
                userId: userPengakses.id,
                jadwalId: targetKuncikur.jadwalId
            })

            // --------- COPY SEMUA KURSI ----------
            for (const kursi of targetKuncikur.kursis) {
                try {
                    await reservasiBaru.related('kursis').attach([kursi.id])
                } catch (error) {
                    console.log(error)
                }
            }

            // --------- KUPON LAGIIIII -----------
            if (kuponTarget) {
                reservasiBaru.related('kupons').attach([kuponTarget.id])
            }


            // set kuncikur ke kelar
            targetKuncikur.lockUntil = DateTime.now().minus({ minute: 1 }) // whynot
            await targetKuncikur.save()

            // kalau kelar, redirect ke laman baru
            // return response.redirect().status(301).toPath('')

            return {
                msg: 'Anjay kelar lu'
            }
        } catch (error) {
            console.log(error.message)

            session.flash(
                'alertError',
                error.message
            )
            return response.redirect().withQs().back()
        }
    }

    public async buatReservasiBBPoint({ }: HttpContextContract) {
        // to do...
    }

    public async buatReservasiKartuKredit({ }: HttpContextContract) {
        // to do...
    }

    public async buatReservasiLainnya({ }: HttpContextContract) {
        // to do...
    }


    // DISINI SELESAI VALIDASINYA


    public async lihatPembayaranReservasi({ }: HttpContextContract) {
        return {
            msg: 'ini laman pembayaran, mamamia'
        }
    }

    // kalau lanjut nyimpen kuncikur jadi reservasi
    public async simpanPembayaranReservasi({ }: HttpContextContract) {

    }
}


interface DbTemplateBeta {
    id: string,
    node: string,
    col: number,
    row: number
    isKursi: number,
    harga: number
}

// ini versi 2.0
function templateToGridBeta(hasil: DbTemplateBeta[], maxCol: number) {
    // sementara predefined max col row
    // let maxCol = 20
    // let maxCol = 5 // test pertama make 5x10 dulu
    // let maxRow = 40
    let wadah: Array<Array<DbTemplateBeta>> = []

    for (let i = 1; i <= maxCol; i++) {
        let siap = hasil.filter((template) => template.col == i)
        wadah.push(siap)
    }

    return wadah
}
