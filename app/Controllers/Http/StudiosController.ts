import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Studio from 'App/Models/Studio'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Kursi from 'App/Models/Kursi'
import { kapitalHurufPertama, numToChar } from 'App/customFunction'
import TierStudio from 'App/Models/TierStudio'

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

export default class StudiosController {
    public async listStudio({ view, request }: HttpContextContract) {
        let tier = request.input('tier', '')

        let validTier = await TierStudio.findBy('nama', tier)

        let tiers = await Database
            .from('tier_studios')
            .select(
                'id',
                'nama as tier'
            )

        let studios = await Database
            .from('studios')
            .join('tier_studios', 'studios.tier_studio_id', 'tier_studios.id')
            .select(
                'studios.id as id',
                'studios.nama as nama',
                'tier_studios.nama as tier'
            )
            .if(validTier && validTier.nama, (query) => {
                query.where('tier_studios.nama', tier)
            })
            .orderBy('nama', 'asc')

        return view.render('1_adminv/studios/list_studio', { studios, tiers, filTier: tier.toLowerCase() })
    }

    // sebelumnya update_layout
    public async viewStudio({ view, params }: HttpContextContract) {
        // SEMENTARA LOM ADA BEDANYA SET GRID AMA INDEX
        let studioId = params.id

        try {
            let studio = await Studio.findByOrFail('id', studioId)
                .catch(() => {
                    throw new Error('Studio id ga valid atau ga ada')
                })

            await studio.load('tierStudio')

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

            return view.render('1_adminv/studios/update_layout', { studio, grid })
        } catch (error) {
            return {
                msg: 'Studio yang lu cari error bro',
                err: error.message
            }
        }
    }

    public async updateGrid({ request, response, params }: HttpContextContract) {
        let studid = params.id

        // validasi disini
        let updateGridSchema = schema.create({
            update: schema.array([rules.minLength(0)]).members(
                schema.object().members({
                    isKursi: schema.boolean(),
                    id: schema.string([
                        rules.exists({
                            table: 'kursis',
                            column: 'priv_id',
                            where: {
                                studio_id: studid
                            }
                        })
                    ])
                })
            )
        })

        try {
            // cekk
            const validrequest = await request.validate({
                schema: updateGridSchema
            })

            // ubah data db
            let dataUpdate = validrequest.update
            for (const iterator of dataUpdate) {
                let cari = await Kursi.findByOrFail('priv_id', iterator.id)
                cari.isKursi = iterator.isKursi

                await cari.save()
            }

            return {
                message: 'berhasil',
                data: validrequest.update
            }
        } catch (error) {
            console.log(error.message)
            return response.badRequest({
                msg: 'waduh error bro',
                error: error.message
            })
        }
    }

    public async studioBaru({ view }: HttpContextContract) {
        let tiers = await Database
            .from('tier_studios')
            .select(
                'id',
                'nama as tier'
            )

        // bisa ngeset constrainnya disini
        let dimension = {
            minW: 0,
            maxW: 0,
            minL: 0,
            maxL: 0
        }

        return view.render('1_adminv/studios/studio_baru', { tiers, dimension })
    }

    //  TEST ONLY
    public async simpanStudio({ request, response }: HttpContextContract) {
        // CONSTRAIN INI HARUSNYA PREDEFINED, SESUAI AMA MAX TEMPLATE
        let maxCol = 5
        let maxRow = 10

        let nama = request.input('nama')
        let col = request.input('col')
        let row = request.input('row')

        try {
            if (!nama) {
                throw new Error('isi nama dulu bro')
            }

            if(!row || isNaN(row)) {
                throw new Error('panjang row ga valid bro')
            }
    
            if(row < 0 || row > maxRow) {
                throw new Error(`panjang row harus antara 0 - ${maxRow} brooo`)
            }

            if(!col || isNaN(col)){
                throw new Error('panjang col ga valid bro')
            }
    
            if(col < 0 || col > maxCol) {
                throw new Error(`panjang col harus antara 0 - ${maxCol} brooo`)
            }

            // ngambil semua tier dulu
            let tiers = await Database
                .from('tier_studios')
                .select('id')

            if (tiers.length === 0) {
                throw new Error('Lah kosong tier studionya.')
            }

            let gachaTier = Math.floor(Math.random() * (tiers.length - 1))

            let stud = await Studio.create({
                nama: kapitalHurufPertama(nama),
                tierStudioId: tiers[gachaTier].id,
            })

            // ngambil semua template sesuai col row terpilih
            let semuaTemplate = await Database
            .from('templates')
            .select(
                'id',
                'node',
                'row',
                'col'
            )
            .orderBy('col', 'asc')
            .orderBy('row', 'asc')

            for (const iterator of semuaTemplate) {
                await stud.related('kursis').create({
                    templateId: iterator.id,
                    isKursi: false,
                    harga: 20000,
                    privId: numToChar(Math.floor(Math.random() * 20)) + stud.id + '$' + iterator.node + '$' + numToChar(Math.floor(Math.random() * 20)) + numToChar(Math.floor(Math.random() * 20)),
                    pubId: iterator.node,
                })
            }

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
