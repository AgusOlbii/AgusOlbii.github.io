const tipoEleccion = 2;
const tipoRecuento = 1;

const $ = (arg) => document.querySelector(arg);

const mensajeErrorAmarillo = $('#mensaje-amarillo');
const mensajeErrorVerde = $('#mensaje-verde');
const mensajeErrorRojo = $('#mensaje-rojo');

const titulo = $('#titulo-principal');
const subtitulo = $('#ruta-elecciones');

const selectAnio = $('#select-anio');
const selectCargo = $('#select-cargo');
const selectDistrito = $('#select-districto');
const selectSeccion = $('#select-seccion');

const buttonFilter = $('#button-filter');

const porcentajeParticipacion = $('#contenido-participacion');
const porcentajeElectores = $('#contenido-electores');
const porcentajeMesa = $('#contenido-mesa');

let eleccionCargo = "";
let eleccionSeccion = "";
let eleccionDistricto = "";
let resultadosEncuesta = "";

const actualizarTitulos = () => {
    titulo.textContent = `Elecciones ${selectAnio.value} | Generles`
    subtitulo.textContent = `${selectAnio.value} > Generales > Provisorio > ${eleccionCargo} > ${eleccionDistricto} > ${eleccionSeccion}`
}

const mostrarAlerta = (tipoMensaje, mensaje) => {
    ocultarAlertas();
    tipoMensaje.textContent = mensaje;
    tipoMensaje.style.visibility = 'visible';
    setTimeout(() => {
        ocultarAlertas();
    }, 5000);
};

const ocultarAlertas = () => {
    mensajeErrorAmarillo.style.visibility = "hidden";
    mensajeErrorRojo.style.visibility = "hidden";
    mensajeErrorVerde.style.visibility = "hidden";
};

const fetchedData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data.sort((a, b) => b.id - a.id);
    } catch (error) {
        console.error(`Error: ${error}`);
        return [];
    }
};

const cargarCuadros = async () => {
    const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`
    let anioEleccion = selectAnio.value;
    let categoriaId = selectCargo.value;
    let distritoId = selectDistrito.value;
    let seccionProvincialId = 0;
    let seccionId = selectSeccion.value;
    let circuitoId = "";
    let mesaId = "";
    let parametro = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`
    try {
        const fetchedData = await fetch(url + parametro)
        if (fetchedData.ok) {
            resultadosEncuesta = await fetchedData.json();
            porcentajeElectores.textContent = `${resultadosEncuesta.estadoRecuento.cantidadElectores}`
            porcentajeMesa.textContent = `${resultadosEncuesta.estadoRecuento.mesasTotalizadas}`
            porcentajeParticipacion.textContent = `${resultadosEncuesta.estadoRecuento.participacionPorcentaje}`
        }
        else {
            mostrarAlerta(mensajeErrorRojo, "Los datos no estan disponibles")
        }
    } catch (error) {
        mostrarAlerta(mensajeErrorRojo, error)
    }
}

const consultarCargos = async () => {
    eleccionCargo = selectAnio.options[selectAnio.selectedIndex].value;
    const url = `https://resultados.mininterior.gob.ar/api/menu?año=${eleccionCargo}`;

    try {
        const response = await fetch(url);
        limpiarSelect(selectCargo);
        if (response.ok) {
            const datosElecciones = await response.json();
            datosElecciones.forEach(eleccion => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach(cargo => {
                        const option = document.createElement('option');
                        option.value = cargo.IdCargo;
                        option.text = cargo.Cargo;
                        selectCargo.appendChild(option);
                    });
                }
            });
        } else {
            mostrarAlerta(mensajeErrorRojo, "Error. El servicio está caído por el momento. Intente más tarde.");
        }
    } catch (err) {
        mostrarAlerta(mensajeErrorRojo, "Error. El servicio está caído por el momento. Intente más tarde.");
    }
};

const consultarSeccion = async () => {
    eleccionSeccion = selectDistrito.options[selectDistrito.selectedIndex].textContent;
    limpiarSelect(selectSeccion)

    try {
        const datosElecciones = await fetchedData(`https://resultados.mininterior.gob.ar/api/menu?año=${selectAnio.value}`);
        datosElecciones.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach((cargo) => {
                    if (cargo.IdCargo == selectCargo.value) {
                        cargo.Distritos.forEach((distrito) => {
                            if (distrito.IdDistrito == selectDistrito.value) {
                                distrito.SeccionesProvinciales.forEach((seccionProvincial) => {
                                    seccionProvincial.Secciones.forEach((seccion) => {
                                        const option = document.createElement('option');
                                        option.value = seccion.IdSeccion;
                                        option.textContent = seccion.Seccion;
                                        selectSeccion.appendChild(option);
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (err) {
        mostrarAlerta(mensajeErrorRojo, "Error al consultar las secciones.");
    }
};

const ConsultarDistritos = async () => {
    eleccionDistricto = selectCargo.options[selectCargo.selectedIndex].textContent;
    limpiarSelect(selectDistrito)
    try {
        const datosElecciones = await fetchedData(`https://resultados.mininterior.gob.ar/api/menu?año=${selectAnio.value}`);
        datosElecciones.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach((cargo) => {
                    if (cargo.IdCargo == selectCargo.value) {
                        cargo.Distritos.forEach((distrito) => {
                            const option = document.createElement('option');
                            option.value = distrito.IdDistrito;
                            option.textContent = distrito.Distrito;
                            selectDistrito.appendChild(option);
                        });
                    }
                });
            }
        });
    } catch (err) {
        mostrarAlerta(mensajeErrorRojo, "Error al consultar los distritos.");
    }
};

const cargarPeriodosDisponibles = async () => {
    const periodos = await fetchedData("https://resultados.mininterior.gob.ar/api/menu/periodos");
    populateSelect(periodos, selectAnio);
};

function limpiarSelect(select) {
    while (select.options.length > 1) {
        select.remove(1);
    }
}

const populateSelect = (data, selectElement) => {
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
};

const validarCamposSelect = () => {
    return (selectAnio.value === "none" || selectCargo.value === "none" || selectDistrito.value === "none" || selectSeccion.value === "none");
};

const clickHandlerFilter = () => {
    if (validarCamposSelect()) {
        mostrarAlerta(mensajeErrorAmarillo, "Completa todos los campos antes de filtrar...")
        return
    }

    actualizarTitulos();
    cargarCuadros();
    limpiarSelect(selectAnio);
    limpiarSelect(selectCargo);
    limpiarSelect(selectDistrito);
    limpiarSelect(selectSeccion);
    cargarPeriodosDisponibles();
    mostrarAlerta(mensajeErrorVerde, "Entraste bien doble P papuuu")

}
document.addEventListener("DOMContentLoaded", () => {
    cargarPeriodosDisponibles();
    mostrarAlerta(mensajeErrorVerde, "Entro perfect")
    selectAnio.addEventListener("change", consultarCargos);
    selectCargo.addEventListener("change", ConsultarDistritos);
    selectDistrito.addEventListener("change", consultarSeccion);
    buttonFilter.addEventListener("click", clickHandlerFilter);
});
