import Kupon from "App/Models/Kupon"
import { DateTime } from "luxon"

export async function checkAndGetKupon(kodeKupon: string) {
    const cariKupon = await Kupon.findByOrFail('kode', kodeKupon)
        .catch(() => {
            throw new Error('Kode kupon ngga valid broooo')
        })

    if (!cariKupon.isValid) {
        throw new Error('Kode kupon ngga valid broooo (2)')
    }

    if (DateTime.now() > cariKupon.expiredAt) {
        throw new Error('Kupon udah expired broooo')
    }

    if (cariKupon.jumlahRedeem + 1 > cariKupon.maxRedeem) {
        throw new Error('Kupon udah abis brooo')
    }

    return cariKupon
}

const _ = {
    checkAndGetKupon
}

export default _