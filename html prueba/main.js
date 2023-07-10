// Simulador de presupuesto
let restante = 0;

const guardarPresupuesto = () => {
    const presupuesto = parseInt(document.querySelector("#presupuestoInicial").value);
    if (presupuesto < 1 || isNaN(presupuesto)) {
        mostrarNotificacion("CANTIDAD NO VALIDA", "error");

        return;
    }

    localStorage.setItem("presupuesto", presupuesto);
    localStorage.setItem("gastos", JSON.stringify([]));
    actualizarVista();
}

const actualizarVista = () => {
    const presupuesto = localStorage.getItem("presupuesto");
    const divPregunta = document.querySelector("#pregunta");
    const divGastos = document.querySelector("#divGastos");
    const divControlGastos = document.querySelector("#divControlGastos");
    divPregunta.style.display = "none";
    divGastos.style.display = "none";
    let controlGastos = `
        <div class="gastos-realizados"> 
            <h2>Listado de Gastos</h2>
            <div class="alert alert-primary">
                Presupuesto: $ ${presupuesto}
            </div>
            <div class="alert alert-success">
                Restante: $ ${presupuesto}
            </div>
        </div>
    `;

    if (!presupuesto) {
        divPregunta.style.display = "block";
    } else {
        divPregunta.style.display = "none";
        divGastos.style.display = "block";
        divControlGastos.innerHTML = controlGastos;
        refrescarListado();
    }
}

const agregarGasto = () => {
    const tipoGasto = document.querySelector("#tipoGasto").value;
    const cantidad = parseInt(document.querySelector("#cantidadGasto").value);

    if (cantidad < 1 || isNaN(cantidad) || tipoGasto.trim() === '') {
        mostrarNotificacion("CANTIDAD NO VALIDA", "error");        return;
    }

    const restante = parseInt(localStorage.getItem("presupuesto")) - getTotalGastos();
    if (cantidad > restante) {
        mostrarNotificacion("CANTIDAD NO VALIDA", "error");        return;
    }

    const nuevoGasto = {
        tipoGasto,
        cantidad
    };

    let gastos = JSON.parse(localStorage.getItem("gastos"));
    gastos.push(nuevoGasto);
    localStorage.setItem("gastos", JSON.stringify(gastos));
    refrescarListado();
    document.querySelector("#formGastos").reset();
}

const refrescarListado = () => {
    const presupuesto = parseInt(localStorage.getItem("presupuesto"));
    const gastos = JSON.parse(localStorage.getItem("gastos"));

    let totalGastos = 0;
    let listadoHTML = '';

    gastos.forEach(gasto => {
        listadoHTML += `
            <li class="gastos">
                <p>
                    ${gasto.tipoGasto}
                    <span class="gasto">$ ${gasto.cantidad}</span>
                </p>
            </li>
        `;
        totalGastos += parseInt(gasto.cantidad);
    });

    restante = presupuesto - totalGastos;

    let clase;
    if ((presupuesto / 4) > restante) {
        clase = "alert alert-danger";
    } else if ((presupuesto / 2) > restante) {
        clase = "alert alert-warning";
    } else {
        clase = "alert alert-success";
    }

    const divControlGastos = document.querySelector("#divControlGastos");
    divControlGastos.innerHTML = `
        <div class="gastos-realizados">
            <h2>Listado de Gastos</h2>
            ${listadoHTML}
            <div class="alert alert-primary">
                Presupuesto: $ ${presupuesto}
            </div>
            <div class="${clase}">
                Restante: $ ${restante}
            </div>
            <button onclick="reiniciarPresupuesto()" class="button u-full-width">Reiniciar Presupuesto</button>
        </div>
    `;
}

const reiniciarPresupuesto = () => {
    localStorage.clear();
    location.reload(true);
}

// TOASTIFY

const mostrarNotificacion = (mensaje, tipo) => {
    const toast = Toastify({
      text: mensaje,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: tipo === "error" ? "#ff3f3f" : "#00c900",
      stopOnFocus: true,
      onClick: function () {},
      style: {
        main: {
          background: tipo === "error" ? "#ff3f3f" : "#00c900",
          color: "#ffffff",
          borderRadius: "3px",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },
      },
      className: tipo === "error" ? "toastify-error" : "toastify-success",
    });
  
    toast.showToast();
  };

  /* REEMPLAZADA POR TOASTIFY
const mostrarError = (elemento, mensaje) => {
    const divError = document.querySelector(elemento);
    divError.innerHTML = `<p class="alert alert-danger error">${mensaje}</p>`;
    setTimeout(() => {
        divError.innerHTML = '';
    }, 2000);
}
*/

const getTotalGastos = () => {
    const gastos = JSON.parse(localStorage.getItem("gastos"));
    let totalGastos = 0;
    gastos.forEach(gasto => {
        totalGastos += parseInt(gasto.cantidad);
    });
    return totalGastos;
}

// Simulador de préstamo



function simularPrestamo() {
    const entidadBancaria = document.querySelector("#entidadBancaria").value;
    const porcentajeInteres = parseFloat(document.querySelector("#porcentajeInteres").value);
    const numeroCuotas = parseInt(document.querySelector("#numeroCuotas").value);
    const monto = parseFloat(document.querySelector("#monto").value);

    if (isNaN(porcentajeInteres) || isNaN(numeroCuotas) || isNaN(monto)) {
        swal.fire('Error', 'Por favor, complete todos los campos.', 'error');
        return;
    }

    const montoFinalPagar = calcularMontoFinalPagar(monto, porcentajeInteres);
    const cuotasMensuales = calcularCuotasMensuales(monto, porcentajeInteres, numeroCuotas);

    // SWEET ALERT
    swal.fire({
        title: 'Resultado de la simulación',
        html: `
            <div class="alert alert-primary">
                Entidad Bancaria: ${entidadBancaria}
            </div>
            <div class="alert alert-success">
                Monto Final a Pagar: $${montoFinalPagar.toFixed(2)}
            </div>
            <div class="alert alert-success">
                Cuotas Mensuales:
                <ul>
                    ${cuotasMensuales.map(cuota => `<li>Cuota ${cuota.cuota}: $${cuota.cuotaMensual.toFixed(2)} (${cuota.capital.toFixed(2)} capital, ${cuota.interes.toFixed(2)} interes)</li>`).join('')}
                </ul>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
}


/* REEMPLAZADO POR SWEET ALERT
function simularPrestamo() {
    const entidadBancaria = document.querySelector("#entidadBancaria").value;
    const porcentajeInteres = parseFloat(document.querySelector("#porcentajeInteres").value);
    const numeroCuotas = parseInt(document.querySelector("#numeroCuotas").value);
    const monto = parseFloat(document.querySelector("#monto").value);

    if (isNaN(porcentajeInteres) || isNaN(numeroCuotas) || isNaN(monto)) {
        mostrarNotificacion("CANTIDAD NO VALIDA", "error");
        return;
    }

    const montoFinalPagar = calcularMontoFinalPagar(monto, porcentajeInteres);
    const cuotasMensuales = calcularCuotasMensuales(monto, porcentajeInteres, numeroCuotas);

    mostrarResultadoSimulacion(entidadBancaria, montoFinalPagar, cuotasMensuales);
}
*/


function calcularMontoFinalPagar(monto, porcentajeInteres) {
    const interes = (monto * porcentajeInteres) / 100;
    return monto + interes;
}

function calcularCuotasMensuales(monto, porcentajeInteres, numeroCuotas) {
    const cuotaMensual = calcularMontoFinalPagar(monto, porcentajeInteres) / numeroCuotas;
    const cuotasMensuales = [];

    for (let i = 1; i <= numeroCuotas; i++) {
        const interesMes = (monto * porcentajeInteres) / 100;
        const capitalMes = cuotaMensual - interesMes;

        cuotasMensuales.push({
            cuota: i,
            cuotaMensual: cuotaMensual,
            capital: capitalMes,
            interes: interesMes
        });

        monto -= capitalMes;
    }

    return cuotasMensuales;
}

function mostrarResultadoSimulacion(entidadBancaria, montoFinalPagar, cuotasMensuales) {
    const resultadoSimulacion = document.querySelector("#resultadoSimulacion");
    resultadoSimulacion.innerHTML = `
        <h2>Resultado de la simulación</h2>
        <div class="alert alert-primary">
            Entidad Bancaria: ${entidadBancaria}
        </div>
        <div class="alert alert-success">
            Monto Final a Pagar: $${montoFinalPagar.toFixed(2)}
        </div>
        <div class="alert alert-success">
            Cuotas Mensuales:
            <ul>
                ${cuotasMensuales.map(cuota => `<li>Cuota ${cuota.cuota}: $${cuota.cuotaMensual.toFixed(2)} (${cuota.capital.toFixed(2)} capital, ${cuota.interes.toFixed(2)} interes)</li>`).join('')}
            </ul>
        </div>
    `;
}


// SWEET ALERT

swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Confirmación de la acción
      swal.fire('¡Hecho!', 'La acción se realizó correctamente.', 'success');
    } else if (result.dismiss === swal.DismissReason.cancel) {
      // Cancelación de la acción
      swal.fire('Cancelado', 'La acción ha sido cancelada.', 'error');
    }
  });


  // ASINCRONÍA, PROMESAS & AJAX

  // Ejemplo de función asincrónica para obtener los datos del servidor
async function fetchData() {
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  }
  
  // Ejemplo de función asincrónica para cargar el contenido
  async function loadContent() {
    try {
      const data = await fetchData();
      console.log('Datos obtenidos:', data);
      // Operaciones adicionales con los datos obtenidos
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Después de esperar');
    } catch (error) {
      
    }
  }
  
  // Llamada a la función para cargar el contenido asincrónicamente
  loadContent();
  
  


