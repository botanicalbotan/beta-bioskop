import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
// import Kupon from 'App/Models/Kupon'
import { DateTime } from 'luxon'
import { checkAndGetKupon } from 'App/Asli/lib_fungsi'

export default class KuponsController {
    public async listKupon({ view, request }: HttpContextContract) {
        let filterAktif = request.input('aktif')
        let filterTanggal = request.input('expired')

        let aktifValid = (filterAktif == 1) ? true : false
        let tempTanggal = DateTime.fromISO(filterTanggal)
        let tanggalValid = (tempTanggal.isValid) ? tempTanggal : DateTime.now()

        let kupons = await Database
            .from('kupons')
            .select(
                'nama',
                'kode',
                'max_redeem as maxRedeem',
                'jumlah_redeem as jumlahRedeem',
                'expired_at as expiredAt'
            )
            .if(aktifValid, (query) => {
                query.whereRaw('DATE(expired_at) >= DATE(?)', [tanggalValid.toSQLDate() as string])
                query.whereColumn('jumlah_redeem', '<', 'max_redeem')
            })


        return view.render('1_adminv/kupons/list_kupon', { kupons, aktif: aktifValid, expired: tanggalValid })
    }

    public async kuponBaru({ view }: HttpContextContract) {

    }

    public async viewKupon({ view }: HttpContextContract) {

    }

    // ini userv
    public async cekKuponAPI({ request, response }: HttpContextContract) {
        let kodeKupon = request.input('kuponid', 'gaboleh default kosong') // soalnya kodenya bisa kosong

        try {
            // const kuponTarget = await Kupon.findByOrFail('kode', kodeKupon)
            //     .catch(() => {
            //         throw new Error('Kode kupon ngga valid broooo')
            //     })

            // if (!kuponTarget.isValid) {
            //     throw new Error('Kode kupon ngga valid broooo (2)')
            // }

            // if (DateTime.now() > kuponTarget.expiredAt) {
            //     throw new Error('Kupon udah expired broooo')
            // }

            // if (kuponTarget.jumlahRedeem + 1 > kuponTarget.maxRedeem) {
            //     throw new Error('Kupon udah abis brooo')
            // }

            const kuponTarget = await checkAndGetKupon(kodeKupon)

            // kalau lolos semua....
            return {
                isPersen: kuponTarget.isPersen,
                nominal: kuponTarget.nominal,
                nama: kuponTarget.nama
            }

        } catch (error) {
            return response.badRequest({
                msg: error.message,
            })
        }
    }
}