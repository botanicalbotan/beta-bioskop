import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Jadwal from 'App/Models/Jadwal'
import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import RawData from 'App/Asli/raw_data'
import Invoice from 'App/Models/Invoice'
import User from 'App/Models/User'
import Kursi from 'App/Models/Kursi'

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

    public async reservasiBaru({ view, request }: HttpContextContract) {
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

    public async buatInvoice({ request, response, session, auth }: HttpContextContract) {
        const jadwalId = request.input('jadid')
        // waktu tunggu ampe kursi dilepas lagi
        const waktuHoldMenit = RawData.holdInvoiceMinute

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

            // ------------ CEK KURSI ------------------
            const newInvoiceSchema = schema.create({
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
                schema: newInvoiceSchema,
                messages: {
                    '*': 'Data yang lu kirim ngga valid bro, benerin gih'
                }
            })

            // ------------ CEK KURSI LAGI GA DI HOLD ------------------
            for (const iterator of validrequest.dipilih) {
                const testKursi = await Database
                    .from('kursis')
                    .join('invoice_kursis', 'invoice_kursis.kursi_id', 'kursis.id') // kalau ada, berarti kehold
                    .join('invoices', 'invoice_kursis.invoice_id', 'invoices.id')
                    .join('jadwals', 'jadwals.studio_id', 'kursis.studio_id')
                    .select('kursis.id as idKursi')
                    .where('jadwals.id', jadwalId) // cek jadwal
                    .andWhereRaw('invoices.lock_until > ?', [DateTime.now().toSQL() as string]) // cek waktu lock
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

            // bikin invoice baru
            const invoiceBaru = await Invoice.create({
                hargaLock: hargaKursi,
                lockUntil: sekarang.plus({ minutes: waktuHoldMenit }),
                jadwalId: jadwalId,
                userId: userPengakses.id,
            })

            // attach kursi ke invoice
            for (const iterator of validrequest.dipilih) {
                try {
                    const kursi = await Kursi.findByOrFail('priv_id', iterator)
                        .catch(() => {
                            throw new Error('ada skip')
                        })

                    await invoiceBaru.related('kursis').attach([kursi.id])
                } catch (error) {
                    console.log(error.message)
                }
            }

            // kalau kelar, redirect ke laman invoice
            // return response.redirect().status(301).toPath(`/userv/reservasi/checkout/${invoiceBaru.id}`)

            return {
                msg: 'Kelar cuy'
            }
        } catch (error) {
            console.log(error.message)

            session.flash(
                'alertError',
                'Kursi yang anda pesan tidak valid. Mohon hanya pilih kursi yang tersedia!'
            )
            return response.redirect().withQs().back()
        }
    }

    public async listInvoice({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }

    public async lihatInvoice({ view, params }: HttpContextContract) {
        // data tanggal, studio sama film udah ada di tanggal
        let invoiceId = params.invoiceid
        try {
            // ambil dan cocokin semua data tanggal
            let invoice = await Invoice.findOrFail(invoiceId)
            .catch(() => {
                throw new Error('Waduh, kok id invoicenya ngaco bro')
            })

            // ngambil data jadwal ma film
            await invoice.load('jadwal', (jadwal) => {
                jadwal.preload('film')
                    .preload('studio', (studio) => {
                        studio.preload('tierStudio')
                    })  
            })

            await invoice.load('kursis')
            
            let listKursi = ''
            for (let i = 0; i < invoice.kursis.length; i++) {
                listKursi += invoice.kursis[i].pubId

                if(i < invoice.kursis.length - 1) {
                    listKursi += ', '
                }
            }

            return view.render('2_userv/reservasi/checkout_invoice', { invoice, fungsi: { rupiahParser }, listKursi })
            
        } catch (error) {
            return {
                msg: 'waduh',
                error: error.message
            }
        }
    }

    public async lamanBayarInvoice({ }: HttpContextContract) {

    }

    public async bayarInvoice({ }: HttpContextContract) {

    }

    public async batalInvoice({ }: HttpContextContract) {

    }

    public async getInvoiceAPI({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
    }

    public async getInvoiceCountAPI({ }: HttpContextContract) {
        return {
            msg: "Masih kosong bro"
        }
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

function rupiahParser(angka: number) {
    if (typeof angka == 'number') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(angka)
    } else return 'error'
  }
