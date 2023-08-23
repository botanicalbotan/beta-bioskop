import { Select, initTE } from "tw-elements";
initTE({ Select });

const iStudio = document.getElementById("iStudio");
const iStudioInstace = Select.getInstance(iStudio);

// ambil valuenya, cari
const currentStudio = iStudio.dataset.currentStudio
iStudioInstace.setValue(currentStudio);

const currentTanggal = iStudio.dataset.currentTanggal

iStudio.addEventListener('change', (e) => {
    // console.log(`/userv/jadwals/${e.target.value}/${currentTanggal}`)
    window.location.href = `/userv/jadwals/${e.target.value}/${currentTanggal}`
})