import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'UjadwalsController.defaultHome')
    Route.get('/data_user', 'UsersController.getActiveUser')

    Route.group(() => {
        Route.get('/', () => {
            return {
                msg: 'Kosong, lom ada apa2nya'
            }
        })
    }).prefix('films')

    Route.group(() => {
        Route.get('/', 'UJadwalsController.defaultHome') // default
        Route.get('/:studioId/:tanggal', 'UJadwalsController.listJadwalAktif') // aslinya gini
    }).prefix('jadwals')

    Route.group(() => {
        // reservasi baru -> bikin kuncikur -> bikin reservasi

        // di sini ntar bakal banyak pake input ala GET
        Route.get('/baru', 'ReservasisController.pilihKursi') // param: jadid
        Route.post('/baru', 'KuncikursController.buatKuncikur') // param: jadid, ini buat bikin kuncikur

        // kuncikur beda sama transaksi, kuncikur ini reservasi yang belom deal
        Route.get('/checkout/:kuncikurid', 'KuncikursController.formCheckout') // sama lihat kuncikur
        Route.get('/checkout/:kuncikurid/batal', 'KuncikursController.batalCheckout')

        // dibawah ini buat bikin reservasi baru. Dipisah soalnya validasinya beda
        Route.post('/checkout/:kuncikurid/dt', 'ReservasisController.buatReservasiDebit') // debit transfer
        Route.post('/checkout/:kuncikurid/bbp', 'ReservasisController.buatReservasiBBPoint') // bb point
        Route.post('/checkout/:kuncikurid/kk', 'ReservasisController.buatReservasiKartuKredit') // kartu kredit
        Route.post('/checkout/:kuncikurid/lain', 'ReservasisController.buatReservasiLainnya') // lainnya

        // dibawah ini buat bayar bayar
        Route.get('/pembayaran/:reservasiid', 'ReservasisController.lihatPembayaranReservasi')
        Route.post('/pembayaran/:reservasiid', 'ReservasisController.simpanPembayaranReservasi') // aslinya ga gini, sementara debit doang

        // ini api
        Route.get('/get_ongkos_pembayaran', 'KuncikursController.getOngkosPembayaranAPI')

        Route.get('/', 'ReservasisController.listReservasi') // pake session
        Route.get('/kuncikurs', 'KuncikursController.listKuncikur') // kuncikur yang belom dibayar
        Route.get('/get_kuncikurs', 'KuncikursController.getKuncikurAPI') // API belom dibayar
        Route.get('/get_kuncikur_count', 'KuncikursController.getKuncikurCountAPI') // API belom dibayar
        
        Route.get('/:id', 'ReservasisController.lihatReservasi')
        
    }).prefix('reservasi')

    Route.group(() => {
        Route.get('/cek_kupon', 'KuponsController.cekKuponAPI') // param: kuponid
    }).prefix('kupons')

}).prefix('userv').middleware('auth')

// Dipisah biar ga kena middleware
Route.group(() => {
    Route.get('/pilih_user', 'UsersController.getPilihUser')
    Route.post('/pilih_user', 'UsersController.pilihUserIni')
}).prefix('userv')