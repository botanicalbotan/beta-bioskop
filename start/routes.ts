/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// dilempar ke yang redi sekarang
Route.get('/', async ({ response }) => {
  response.redirect('/adminv/studios/')
})

Route.group(() => {

  Route.get('/', 'UjadwalsController.defaultHome')

  Route.group(() => {
    Route.get('/', ()=>{
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
    Route.get('/', ()=>{
      return {
        msg: 'Kosong, lom ada apa2nya'
      }
    })

    // di sini ntar bakal banyak pake input ala GET
    Route.get('/baru', 'ReservasisController.lamanPesanBaru') // param: jad
  }).prefix('reservasi')

}).prefix('userv')

Route.group(() => {
  Route.get('/', async ({ response })=>{
    response.redirect('/adminv/studios/')
  })



  Route.group(() => {
    Route.get('/', 'StudiosController.listStudio')
    // Route.get('/baru', 'StudiosController.studioBaru') 
    Route.post('/baru', 'StudiosController.simpanStudio') // masih semi-generated

    Route.get('/:id', 'StudiosController.viewStudio')

    // v1 ini model lama, yang batch
    Route.get('/:id/update_layout_v1', 'StudiosController.setGridV1')
    Route.post('/:id/update_layout_v1', 'StudiosController.updateGridV1')

    // v2 ini yang tiap node diurusin sendiri
    Route.get('/:id/update_layout_v2', 'StudiosController.setGridV2')
    Route.post('/:id/update_layout_v2', 'StudiosController.updateGridV2')

    Route.get('/:id/get_node', 'StudiosController.getNodeById')

  }).prefix('studios')

  Route.group(() => {
    Route.get('/', 'FilmsController.listFilm')
    Route.post('/baru', 'FilmsController.filmBaru') // masih semi-generated

    
    Route.get('/:id', 'FilmsController.viewFilm') // cuma placeholder, gaada ui
  }).prefix('films')

  Route.group(() => {
    Route.get('/', 'JadwalsController.listJadwal')
  
    Route.get('/baru', 'JadwalsController.jadwalBaru')
    Route.post('/baru', 'JadwalsController.simpanJadwal')

    Route.get('/cari_slot', 'JadwalsController.cariSlot')

    Route.get('/:id', 'JadwalsController.viewJadwal')
  }).prefix('jadwals')

}).prefix('adminv')

Route.group(() => {
  Route.get('/studio_baru', 'TestsController.studioBaru')
  Route.get('/film_baru', 'AdminsController.filmBaru')
}).prefix('test_only')