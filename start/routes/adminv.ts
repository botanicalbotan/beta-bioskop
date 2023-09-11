import Route from '@ioc:Adonis/Core/Route'

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
  
    // ------------ KUPONN ------------
    Route.group(() => {
      Route.get('/', 'KuponsController.listKupon')
      Route.post('/baru', 'KuponsController.kuponBaru') // masih semi-generated
  
      
      Route.get('/:id', 'KuponsController.viewKupon') // cuma placeholder, gaada ui
    }).prefix('kupons')
  }).prefix('adminv')