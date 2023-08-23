import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Jadwal from 'App/Models/Jadwal'

export default class ReservasisController {
    public async lamanPesanBaru({ view, request }: HttpContextContract) {
        // data tanggal, studio sama film udah ada di tanggal
        let jadwalId = request.input('jadid')

        try {
            // ambil dan cocokin semua data tanggal
            let jadwal = await Jadwal.findOrFail(jadwalId)
                .catch(() => {
                    throw new Error('Waduh, kok id jadwalnya ngaco bro')
                })

            await jadwal.load('film')
            await jadwal.load('studio')

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

            let layoutKursi = templateToGridBeta(base)


            return view.render('2_userv/reservasi/reservasi_kursi', { layoutKursi, jadwal })
        } catch (error) {
            return {
                msg: 'Laman yang lu cari error bro',
                err: error.message
            }
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
