const tipoEleccion = 2;
const tipoRecuento = 1;

const $ = (arg) => document.querySelector(arg);

const mensajeErrorAmarillo = $('#mensaje-amarillo');
const mensajeErrorVerde = $('#mensaje-verde');
const mensajeErrorRojo = $('#mensaje-rojo');

const titulo = $('#titulo-principal')
const subtitulo = $('#ruta-elecciones')

const selectAnio = $('#select-anio')
const selectCargo = $('#select-cargo')
const selectDistricto = $('#select-districto')



const mostrarAlerta = (tipoMensaje, mensaje,) => {
    tipoMensaje.textContent = mensaje
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarAlerta();
    }, 5000);
}

const ocultarAlertas = () => {
    mensajeErrorAmarillo.style.visibility = "hidden";
    mensajeErrorRojo.style.visibility = "hidden";
    mensajeErrorVerde.style.visibility = "hidden";
}

const fetchedData = (url) => {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((fetchedData) => {
            const sortedData = fetchedData.sort((a, b) => b.id - a.id);
            populateSelect(sortedData)
        })
        .catch((error) => {
            console.log(`Error: ${error}`)
        });
}


const periodosDisponibles = fetchedData("https://resultados.mininterior.gob.ar/api/menu/periodos")
const cargosDisponibles = fetchedDataObj("https://resultados.mininterior.gob.ar/api/menu?año=" +
    periodosDisponibles.value)

const cargarCargos = () => {
    cargosDisponibles.forEach(eleccion => {
        if (eleccion.IdEleccion === tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                const option = document.createElement('option');
                option.value = cargo.Cargo
                option.text = cargo.IdCargo
                selectCargo.appendChild(option);
            })
        }
    });
}

const fetchedDataObj = (url) => {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((fetchedData) => {
            const sortedData = fetchedData.sort((a, b) => b.id - a.id);
        })
        .catch((error) => {
            console.log(`Error: ${error}`)
        });
}


const validarCamposSelect = () => {
    return (selectAnio.value !== "none" && selectCargo.value !== "none" && selectDistricto.value !== "none")
}

const limpiarCamposSelect = () => {
    selectAnio.empty()
    selectCargo.empty()
    selectDistricto.empty()
}

function populateSelect(years) {
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectAnio.appendChild(option);
    });
}


selectAnio.value.addEventListener("change", cargarCargos())
selectCargo.addEventListener("")