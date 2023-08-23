// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// // import temi from 'App/Asli/template'
// // import Saved from 'App/Asli/saved'
// import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import Database from '@ioc:Adonis/Lucid/Database'
// import Kursi from 'App/Models/Kursi'
// import Studio from 'App/Models/Studio'

// interface DbTemplate {
//     id: number,
//     node: string,
//     col: number,
//     row: number
// }

// interface DbTemplateBeta {
//     id: string,
//     node: string,
//     col: number,
//     row: number
//     isKursi: number,
//     harga: number
// }

// function templateToGrid(hasil: DbTemplate[]) {
//     // sementara predefined max col row
//     // let maxCol = 20
//     let maxCol = 5 // test pertama make 5x10 dulu
//     // let maxRow = 40
//     let wadah: Array<Array<DbTemplate>> = []

//     for (let i = 1; i <= maxCol; i++) {
//         let siap = hasil.filter((template) => template.col == i)
//         wadah.push(siap)
//     }

//     return wadah
// }

// // ini versi 2.0
// function templateToGridBeta(hasil: DbTemplateBeta[]) {
//     // sementara predefined max col row
//     // let maxCol = 20
//     let maxCol = 5 // test pertama make 5x10 dulu
//     // let maxRow = 40
//     let wadah: Array<Array<DbTemplateBeta>> = []

//     for (let i = 1; i <= maxCol; i++) {
//         let siap = hasil.filter((template) => template.col == i)
//         wadah.push(siap)
//     }

//     return wadah
// }

// export default class KursisController {
//     public async index({ view, params }: HttpContextContract) {
//         let studioId = params.id
        
//         try {
//             await Studio.findByOrFail('id', studioId).catch(() => {
//                 throw new Error('Studio id ga valid atau ga ada')
//             })

//             let base = await Database
//                 .from('kursis')
//                 .join('templates', 'kursis.template_id', 'templates.id')
//                 .where('studio_id', studioId)
//                 .select(
//                     'kursis.pub_id as node',
//                     'kursis.priv_id as id',
//                     'kursis.is_kursi as isKursi',
//                     'kursis.harga as harga',
//                     'templates.col as col',
//                     'templates.row as row'
//                     // segini dulu
//                 )
//                 .orderBy('templates.col', 'asc')
//                 .orderBy('templates.row', 'asc')

//             let grid = templateToGridBeta(base)

//             // console.log(grid)

//             return view.render('userv/k1_pilih_kursi', { grid })
//         } catch (error) {
//             return {
//                 msg: 'Studio yang lu cari error bro',
//                 err: error.message
//             }
//         }
//     }

//     // public async ambilData({ }: HttpContextContract) {
//     //     let base = await Database
//     //         .from('templates')
//     //         .select('*')
//     //         .orderBy('id')

//     //     let persiapan = templateToGrid(base)

//     //     return persiapan
//     //     // let grid: any[] = Saved
//     //     // let col = Saved.length
//     //     // let row = (Saved[0])? Saved[0].length : 0

//     //     // if(!Saved.length){
//     //     //     grid = Template.createGrid(10, 10)
//     //     //     col = 10
//     //     //     row = 10
//     //     // }

//     //     // // console.log(grid)

//     //     // return view.render('userv/k1_pilih_kursi', { grid, row, col })
//     // }

//     // public async sekedar({ view }: HttpContextContract) {
//     //     let grid: any[] = Saved
//     //     let col = Saved.length
//     //     let row = (Saved[0]) ? Saved[0].length : 0

//     //     if (!Saved.length) {
//     //         grid = temi.createGrid(10, 10)
//     //         col = 10
//     //         row = 10
//     //     }

//     //     // console.log(grid)

//     //     return view.render('userv/k1_pilih_kursi', { grid, row, col })
//     // }

//     public async setGrid({ view, params }: HttpContextContract) {
//         // SEMENTARA LOM ADA BEDANYA SET GRID AMA INDEX
//         let studioId = params.id
        
//         try {
//             await Studio.findByOrFail('id', studioId).catch(() => {
//                 throw new Error('Studio id ga valid atau ga ada')
//             })

//             let base = await Database
//                 .from('kursis')
//                 .join('templates', 'kursis.template_id', 'templates.id')
//                 .where('studio_id', studioId)
//                 .select(
//                     'kursis.pub_id as node',
//                     'kursis.priv_id as id',
//                     'kursis.is_kursi as isKursi',
//                     'kursis.harga as harga',
//                     'templates.col as col',
//                     'templates.row as row'
//                     // segini dulu
//                 )
//                 .orderBy('templates.col', 'asc')
//                 .orderBy('templates.row', 'asc')

//             let grid = templateToGridBeta(base)

//             // console.log(grid)

//             return view.render('userv/k1_set_template', { grid })
//         } catch (error) {
//             return {
//                 msg: 'Studio yang lu cari error bro',
//                 err: error.message
//             }
//         }
//     }

//     public async updateGrid({ request, response, params }: HttpContextContract) {
//         let studid = params.id

//         // validasi disini
//         let updateGridSchema = schema.create({
//             update: schema.array([rules.minLength(0)]).members(
//                 schema.object().members({
//                     isKursi: schema.boolean(),
//                     id: schema.string([
//                         rules.exists({
//                             table: 'kursis',
//                             column: 'priv_id',
//                             where: {
//                                 studio_id: studid
//                             }
//                         })
//                     ])
//                 })
//             )
//         })

//         try {
//             // cekk
//             const validrequest = await request.validate({
//                 schema: updateGridSchema
//             })

//             // ubah data db
//             let dataUpdate = validrequest.update
//             for (const iterator of dataUpdate) {
//                 let cari = await Kursi.findByOrFail('priv_id', iterator.id)
//                 cari.isKursi = iterator.isKursi

//                 await cari.save()
//             }

//             return {
//                 message: 'berhasil',
//                 data: validrequest.update
//             }
//         } catch (error) {
//             console.log(error.message)
//             return response.badRequest({
//                 msg: 'waduh error bro',
//                 error: error.message
//             })
//         }
//     }
// }
