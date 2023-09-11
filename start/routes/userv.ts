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
        // di sini ntar bakal banyak pake input ala GET
        Route.get('/baru', 'ReservasisController.reservasiBaru') // param: jadid
        Route.post('/baru', 'ReservasisController.buatInvoice') // param: jadid, ini buat bikin invoice

        // invoice beda sama transaksi, invoice ini reservasi yang belom deal
        Route.get('/checkout/:invoiceid', 'ReservasisController.lihatInvoice')
        Route.get('/checkout/:invoiceid/bayar', 'ReservasisController.lamanBayarInvoice')
        Route.post('/checkout/:invoiceid/bayar', 'ReservasisController.bayarInvoice') // sekaligus bikin reservasi
        Route.get('/checkout/:invoiceid/batal', 'ReservasisController.batalInvoice')

        // ini api
        Route.get('/get_ongkos_pembayaran', 'InvoicesController.getOngkosPembayaranAPI')

        // ini baru reservasi
        Route.get('/', 'ReservasisController.listReservasi') // pake session
        Route.get('/invoices', 'ReservasisController.listInvoice') // invoice yang belom dibayar
        Route.get('/get_invoices', 'ReservasisController.getInvoiceAPI') // API belom dibayar
        Route.get('/get_invoice_count', 'ReservasisController.getInvoiceCountAPI') // API belom dibayar
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