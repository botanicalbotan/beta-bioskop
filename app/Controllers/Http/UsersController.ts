import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
// import Studio from 'App/Models/Studio'
// import { DateTime } from 'luxon'

export default class UsersController {
    public async getPilihUser({ view, auth }: HttpContextContract){
        // otomatis dilogout semua
        await auth.use('web').logout()

        let users = await Database
            .from('users')
            .select(
                'nama',
                'id'
            )
            .orderBy('nama', 'asc')

        return view.render('2_userv/pilih_user', { users })
    }

    public async pilihUserIni({ request, response, auth, session }: HttpContextContract){
        const userId = request.input('userId')

        try {
            // cek valid ga
            // ntar kasih syarat macem2 disini
            const userTarget = await User.findOrFail(userId)

            // buat session, udah disetting kadaluarsa 2 jam
            await auth.use('web').login(userTarget)

            return response.redirect().toPath('/userv')

        } catch (error) {
            session.flash('alertError', 'Lah error broooo')
            return response.redirect().back()
        }
    }

    public async getActiveUser({ response, auth }: HttpContextContract){
        try {
            if(!auth.user) return { error: 'auth ngga valid' }
            const uAktif = await User.findOrFail(auth.user.id)

            return {
                nama: uAktif.nama,
                id: uAktif.id
            }
        } catch (error) {
            return response.forbidden({
                msg: 'Gaboleh brooo'
            })
        }
    }


    // public async getHome({ view }: HttpContextContract){
    //     // bakal kepake buat param
    //     let targetTgl = DateTime.now().startOf('day')

    //     let tanggalAvail: Array<TglDiHome> = []
    //     let totalHari = 7

    //     for(let i=0; i<totalHari; i++){
    //         let temp = DateTime.now().startOf('day').plus({ days: i })
    //         let cek = targetTgl.toMillis() === temp.toMillis()
    //         tanggalAvail.push({
    //             isTarget: cek,
    //             tgl: temp
    //         })
    //     }

    //     return view.render('2_userv/home', {tanggalAvail})
    // }


    // public async reservasiKursi({ view, params }: HttpContextContract) {
    //     let studioId = params.id
        
    //     try {
    //         await Studio.findByOrFail('id', studioId).catch(() => {
    //             throw new Error('Studio id ga valid atau ga ada')
    //         })

    //         let base = await Database
    //             .from('kursis')
    //             .join('templates', 'kursis.template_id', 'templates.id')
    //             .where('studio_id', studioId)
    //             .select(
    //                 'kursis.pub_id as node',
    //                 'kursis.priv_id as id',
    //                 'kursis.is_kursi as isKursi',
    //                 'kursis.harga as harga',
    //                 'templates.col as col',
    //                 'templates.row as row'
    //                 // segini dulu
    //             )
    //             .orderBy('templates.col', 'asc')
    //             .orderBy('templates.row', 'asc')

    //         let grid = templateToGridBeta(base)

    //         // console.log(grid)

    //         return view.render('2_userv/reservasi_kursi', { grid })
    //     } catch (error) {
    //         return {
    //             msg: 'Studio yang lu cari error bro',
    //             err: error.message
    //         }
    //     }
    // }
}
