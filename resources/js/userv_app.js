import '../css/app.css'

import axios from 'axios';

// Ini buat navbar
import {
    Collapse,
    initTE,
  } from "tw-elements";
  
  initTE({ Collapse });

const lbNamaUser = document.getElementById('lbNamaUser')

axios.get('/userv/data_user')
  .then((res) => {
    if(res.data.nama) {
      lbNamaUser.innerText = res.data.nama
      lbNamaUser.classList.remove('invisible')
    }
  })