import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RawData from 'App/Asli/raw_data'

export default class InvoicesController {
    public async getOngkosPembayaranAPI({ }: HttpContextContract) {
        return {
            ongkos: RawData.ongkosPembayaran
        }
    }
}
