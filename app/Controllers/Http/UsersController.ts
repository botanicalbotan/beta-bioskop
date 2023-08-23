import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Studio from 'App/Models/Studio'
import { DateTime } from 'luxon'

interface DbTemplateBeta {
    id: string,
    node: string,
    col: number,
    row: number
    isKursi: number,
    harga: number
}

interface TglDiHome {
    isTarget: boolean,
    tgl: DateTime
}

// ini versi 2.0
function templateToGridBeta(hasil: DbTemplateBeta[]) {
    // sementara predefined max col row
    // let maxCol = 20
    let maxCol = 5 // test pertama make 5x10 dulu
    // let maxRow = 40
    let wadah: Array<Array<DbTemplateBeta>> = []

    for (let i = 1; i <= maxCol; i++) {
        let siap = hasil.filter((template) => template.col == i)
        wadah.push(siap)
    }

    return wadah
}

export default class UsersController {
    public async getHome({ view }: HttpContextContract){
        // bakal kepake buat param
        let targetTgl = DateTime.now().startOf('day')

        let tanggalAvail: Array<TglDiHome> = []
        let totalHari = 7

        for(let i=0; i<totalHari; i++){
            let temp = DateTime.now().startOf('day').plus({ days: i })
            let cek = targetTgl.toMillis() === temp.toMillis()
            tanggalAvail.push({
                isTarget: cek,
                tgl: temp
            })
        }

        return view.render('2_userv/home', {tanggalAvail})
    }


    public async reservasiKursi({ view, params }: HttpContextContract) {
        let studioId = params.id
        
        try {
            await Studio.findByOrFail('id', studioId).catch(() => {
                throw new Error('Studio id ga valid atau ga ada')
            })

            let base = await Database
                .from('kursis')
                .join('templates', 'kursis.template_id', 'templates.id')
                .where('studio_id', studioId)
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

            let grid = templateToGridBeta(base)

            // console.log(grid)

            return view.render('2_userv/reservasi_kursi', { grid })
        } catch (error) {
            return {
                msg: 'Studio yang lu cari error bro',
                err: error.message
            }
        }
    }
}
