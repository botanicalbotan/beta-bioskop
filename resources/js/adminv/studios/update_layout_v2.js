import axios from "axios"
import Swal from "sweetalert2"

const studio = document.getElementById('studio')
const studioId = studio.dataset.idstud

const generateInput = function (id, label, value, disabled = false) {
    //     return `<div class="relative mb-3" data-te-input-wrapper-init>
    //     <input
    //       type="text"
    //       class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
    //       id="${id}" value="${value}"
    //       placeholder="${label}" />
    //     <label
    //       for="${id}"
    //       class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
    //       >${label}
    //     </label>
    //   </div>`

    return `<div class="group relative">
        <label for="${id}" class="block w-full pb-1 text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400">${label}</label>
        <input id="${id}" type="text" ${disabled ? 'disabled' : ''} value="${value}" class="peer h-10 w-full rounded-md ${disabled ? 'bg-gray-200' : ' bg-gray-50'} px-4 font-thin outline-none border border-gray-400 drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-400" />
        </div>`
}

const generateRadio = function (id, label, value, checked = false) {
    return `<div class="mb-[0.125rem] mr-4 inline-block min-h-[1.5rem] pl-[1.5rem]">
    <input
      class="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
      type="radio" ${(checked) ? 'checked' : ''}
      name="adalahKursi"
      id="${id}"
      value="${value}" />
    <label
      class="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
      for="${id}"
      >${label}
    </label>
  </div>`
}

const formSwalNode = function (lokasiNode = '', label = '', isKursi = false) {
    return Swal.fire({
        title: 'Ubah Node',
        html: `
        <div class="p-4 space-y-6">
            <div>
                ${generateInput('label', 'Label Publik Node', label, (!isKursi) ? true : false)}
            </div>
            <div>
                ${generateInput('lokasiNode', 'Lokasi Node', lokasiNode, true)}
            </div>
            <div class="flex justify-center">
                ${generateRadio('bukanKursi', 'Bukan Kursi', 0, (!isKursi) ? true : false)}
                ${generateRadio('kursi', 'Kursi', 1, (isKursi) ? true : false)}
            </div>
        <div>`,
        confirmButtonText: 'Simpan',
        focusConfirm: false,
        scrollbarPadding: false,
        didOpen: () => {
            const inLabel = Swal.getPopup().querySelector('#label')
            const radioK = Swal.getPopup().querySelector('#kursi')
            const radioBK = Swal.getPopup().querySelector('#bukanKursi')

            radioBK.addEventListener('click', () => {
                inLabel.disabled = true
                inLabel.value = '*'
                inLabel.classList.remove('bg-gray-50')
                inLabel.classList.add('bg-gray-200')
            })

            radioK.addEventListener('click', () => {
                inLabel.disabled = false
                inLabel.value = label
                inLabel.classList.remove('bg-gray-200')
                inLabel.classList.add('bg-gray-50')
            })
        },
        preConfirm: () => {
            try {
                const inLabel = Swal.getPopup().querySelector('#label').value
                const radioKursi = Swal.getPopup().querySelector('[name=adalahKursi]:checked')

                // sanitasi
                if (!inLabel) throw new Error('Label publik node harus terisi!')
                if (!radioKursi) throw new Error('Pilih salah satu radio!')

                return {
                    label: inLabel,
                    adalahKursi: radioKursi.value
                }
            } catch (error) {
                Swal.showValidationMessage(error.message)
            }
        }
    })
}

const epenNode = function (e) {
    let privId = e.target.dataset.id
    Swal.fire({
        title: 'Mengambil node...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        scrollbarPadding: false,
        didOpen: () => {
            Swal.showLoading()

            setTimeout(() => {

                axios.get(`/adminv/studios/${studioId}/get_node?id=${privId}`)
                    .then((res) => {
                        if (res.data.lokasiNode && res.data.label && typeof res.data.isKursi != undefined) {
                            formSwalNode(res.data.lokasiNode, res.data.label, res.data.isKursi)
                                .then((form) => {
                                    if(form.isConfirmed){
                                        Swal.fire({
                                            title: 'Menyimpan node...',
                                            allowOutsideClick: false,
                                            allowEscapeKey: false,
                                            showConfirmButton: false,
                                            scrollbarPadding: false,
                                            didOpen: () => {
                                                Swal.showLoading()
    
                                                setTimeout(() => {
                                                    axios.post(`/adminv/studios/${studioId}/update_layout_v2`, {
                                                        label: form.value.label,
                                                        isKursi: form.value.adalahKursi,
                                                        nodeId: privId
                                                    })
                                                        .then((res) => {
                                                            Swal.fire('Berhasil', 'Data berhasil disimpan!', 'success').then(() => location.reload())
                                                        })
                                                        .catch((err) => {
                                                            console.log(err)
                                                            swalError(err.response.data.msg)
                                                        })
                                                }, 1000)
                                            }
                                        })
                                    }
                                    
                                })
                        } else {
                            throw new Error('Data balikan ga utuh atau ga valid')
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        swalError(err.response.data.msg)
                    })

            }, 1000)
        }
    })
}

const semuaNode = document.getElementsByClassName('kursi-cgv-template')

// gabisa pake foreach
for (let i = 0; i < semuaNode.length; i++) {
    semuaNode[i].addEventListener('click', epenNode)
}


const swalError = function (error, judul = 'Terdapat error dari server!') {
    return Swal.fire({
        icon: 'error',
        title: judul,
        scrollbarPadding: false,
        text: error,
        confirmButtonText: 'Tutup'
    })
}

const swalLoading = function (didOpenCall = function () { }, judul = 'Memproses...') {
    return Swal.fire({
        title: judul,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        scrollbarPadding: false,
        didOpen: didOpenCall
    })
}