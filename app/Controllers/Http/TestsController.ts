import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Template from 'App/Asli/template'
import Saved from 'App/Asli/saved'
import Studio from 'App/Models/Studio'
import Database from '@ioc:Adonis/Lucid/Database'

function numToChar(angka: number = 0) {
    let base = 'a'.charCodeAt(0)
    return (angka === 0 || angka === 1) ? 'a' : String.fromCharCode(base + angka - 1)
}

function kapitalHurufPertama(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

export default class TestsController {
    public async index({ view }: HttpContextContract) {

        let grid: any[] = Saved
        let col = Saved.length
        let row = (Saved[0]) ? Saved[0].length : 0

        if (!Saved.length) {
            grid = Template.createGrid(10, 10)
            col = 10
            row = 10
        }

        // console.log(grid)

        return view.render('adminv/k2_pilih_kursi', { grid, row, col })
    }

    public async test({ }: HttpContextContract) {
        // return Template.createGrid(10, 10)
        console.log(Saved[0])
        console.log(Saved[0][0])
        return Saved
    }

    public async resetGrid({ }: HttpContextContract) {
        Template.createGrid(10, 10)

        return 'ok'
    }

    // public async pesan({ request, }: HttpContextContract) {
    //     let id = request.input('id')

    //     // return !Saved[0]

    //     if (!id) return 'ID gaboleh kosong!'
    //     if (!Saved[0]) return {
    //         pesan: 'DATABASE KOSONG',
    //         tes1: Saved[0],
    //         tes2: !Saved[0]
    //     }
    //     if (!Saved[0][0]) return 'DATABASE KOSONG JUGA'

    //     let tanda = 0
    //     let pesan = ''

    //     for (let i = 0; i < Saved.length; i++) {

    //         for (let j = 0; j < Saved[i].length; j++) {
    //             if (Saved[i][j].id && Saved[i][j].id === id) {
    //                 tanda = 1;
    //                 pesan = 'ID ditemukan: '
    //                 if (Saved[i][j].isValid) {
    //                     if (!Saved[i][j].isPesan) {
    //                         Saved[i][j].isPesan = true;
    //                         pesan += 'Pesanan berhasil!'
    //                     } else {
    //                         pesan += 'Kursi sudah dipesan!'
    //                     }
    //                 } else {
    //                     pesan += 'Slot yang dipilih bukan kursi!'
    //                 }

    //                 break;
    //             }
    //         }

    //         if (tanda) break;
    //     }


    //     return pesan;
    // }
    
}
