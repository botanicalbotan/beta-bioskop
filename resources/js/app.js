import '../css/app.css'

// Ini buat navbar
import {
    Collapse,
    initTE,
  } from "tw-elements";
  
  initTE({ Collapse });

// setup jquery
// global.$ = require('jquery');

// function resetSelectKursiTemplate(){
//     // keknya gajadi kepake, kepake di yang selectKursi aslinya
//     // let prev = document.getElementsByClassName('kursi-adminv bukan-kursi selected')
// }

// function selectKursiTemplate(event){
//     let currentStat = event.target.dataset.iskursi
//     if(currentStat && currentStat!== '0'){
//         event.target.classList.add('bukan-kursi')
//         event.target.dataset.iskursi = 0
//         console.log('klik 1')
//     } else {
//         event.target.classList.remove('bukan-kursi')
//         event.target.dataset.iskursi = 1
//         console.log('klik 2')
//     }
    
//     event.target.dataset.berubah = 1
// }

// // buat tes!!
// window.cekBerubah = function(){
//     let wadah = []
//     for(let i=0; i< kursiTemplate.length; i++){
//         if(kursiTemplate[i].dataset.berubah === '1'){
//             wadah.push(kursiTemplate[i])
//         }
//     }

//     // returnnya array DOM
//     return wadah
// }

// let persiapanKirim = function(){
//     let wadah = []
//     for(let i=0; i< kursiTemplate.length; i++){
//         if(kursiTemplate[i].dataset.berubah === '1'){
//             wadah.push({
//                 id: kursiTemplate[i].dataset.id,
//                 isKursi: kursiTemplate[i].dataset.iskursi,
//             })
//         }
//     }

//     // returnnya array DOM
//     return wadah
// }

// let kirimGrid = document.getElementById('kirimGrid')

// kirimGrid.addEventListener('click', ()=>{
//     let prepare = {update: persiapanKirim()}

//     $.ajax({
//         type: "POST",
//         url: window.location.pathname,
//         data: prepare,
//         dataType: "json",
//         success: function (response) {
//             console.log(response)
//             alert('berhasil weeeyyyy')
            
//             // window.location = window.location.pathname
//         },
//         error: function (e) {
//             alert('error ajg')
//             console.log(e)
//         }
//     });
// })

// // function selectKursi(){

// // }

// // function resetSelectKursi(){

// // }


// // set semua DOM kursi template
// let kursiTemplate = document.getElementsByClassName('kursi-adminv')

// // gabisa pake foreach
// for(let i=0; i< kursiTemplate.length; i++){
//     kursiTemplate[i].addEventListener('click', selectKursiTemplate)
// }

// let tes = document.getElementById('tes')
// tes.addEventListener('click', (e)=>{
//     // e.target.textContent = 'ewe'
// })


