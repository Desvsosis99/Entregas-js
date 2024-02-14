document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('calcular').addEventListener('click', calcularArrayCuotasYFechas);
  document.getElementById('verSimulaciones').addEventListener('click', verSimulacionesGuardadas);
});

function calcularArrayCuotasYFechas() {
  if (!validarCampos()) {
      Toastify({
          text: "Por favor, complete todos los campos antes de calcular.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
      return;
  }

  const deudaTotal = parseFloat(document.getElementById('deudaInicial').value);
  const TEA = parseFloat(document.getElementById('TEA').value);
  const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value);
  const fechaInicio = new Date(document.getElementById('fechaInicio').value);
  let fechaPrimerPago = new Date(document.getElementById('fechaPrimerPago').value);

  if (fechaPrimerPago < fechaInicio) {
      Toastify({
          text: "La fecha del primer pago no puede ser menor que la fecha de inicio.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ff5f6d)",
      }).showToast();
      return;
  }

  let arrayCuotas = [];
  let fechasPago = [];
  let sumaFactores = 0;

  for (let i = 0; i < numeroCuotas; i++) {
      let fechaPago = new Date(fechaPrimerPago.getFullYear(), fechaPrimerPago.getMonth() + i, fechaPrimerPago.getDate());
      fechasPago.push(fechaPago.toISOString().split('T')[0]);
  
      let dias = (fechaPago - fechaInicio) / (1000 * 3600 * 24);
      let factorTEA = 1 / Math.pow((1 + TEA), dias / 360);
      sumaFactores += factorTEA;
      
      arrayCuotas.push({
          factor: factorTEA.toFixed(4),
          monto: (deudaTotal * factorTEA).toFixed(2)
      });
  }

  let cuota = deudaTotal / sumaFactores;
  guardarEnLocalStorage(fechasPago, arrayCuotas, TEA, cuota);
  mostrarTablaResultados(fechasPago, arrayCuotas, TEA, cuota);
}

function validarCampos() {
  const campos = ['nombreCliente', 'deudaInicial', 'TEA', 'numeroCuotas', 'fechaInicio', 'fechaPrimerPago'];
  for (const campo of campos) {
      if (document.getElementById(campo).value === '') {
          return false;
      }
  }
  return true;
}

function guardarEnLocalStorage(fechasPago, arrayCuotas, TEA, cuota) {
  const nombreCliente = document.getElementById('nombreCliente').value;
  const fechaFin = fechasPago[fechasPago.length - 1];
  const deudaInicial = document.getElementById('deudaInicial').value;
  const fechaInicio = document.getElementById('fechaInicio').value;
  
  // Recuperar el último ID utilizado o inicializarlo a 0 si no existe
  let ultimoID = parseInt(localStorage.getItem('ultimoSimulacionID')) || 0;
  
  // Incrementar el ID para la nueva simulación
  ultimoID++;
  
  // Generar el nuevo ID único para la simulación actual
  const uniqueID = `simulacion_${ultimoID}`;
  
  // Guardar la nueva simulación con el ID incrementado
  localStorage.setItem(uniqueID, JSON.stringify({ nombreCliente, deudaInicial, fechaInicio, fechaFin, TEA, cuota }));
  
  // Actualizar el último ID utilizado en localStorage
  localStorage.setItem('ultimoSimulacionID', ultimoID.toString());
  
  alert("Simulación guardada con éxito. ID de simulación: " + uniqueID);
}

function mostrarTablaResultados(fechas, cuotas, TEA, cuota) {
  let tabla = '<table border="1"><tr><th># Cuota</th><th>Fecha de Pago</th><th>Factor TEA</th></tr>';
  for (let i = 0; i < fechas.length; i++) {
      tabla += `<tr>
                  <td>${i + 1}</td>
                  <td>${fechas[i]}</td>
                  <td>${cuotas[i].factor}</td>
                </tr>`;
  }
  tabla += `<tr><td colspan="2">Cuota Promedio</td><td>${cuota.toFixed(2)}</td></tr>`;
  tabla += '</table>';
  document.getElementById('tablaResultados').innerHTML = tabla;
}

function verSimulacionesGuardadas() {
  const claves = Object.keys(localStorage);
  let simulaciones = claves.filter(clave => clave.startsWith('simulacion_'));

  if (simulaciones.length === 0) {
      Toastify({
          text: "Aún no se presenta alguna simulación guardada.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      }).showToast();
      return;
  }

  let tabla = '<table border="1"><tr><th>ID Simulación</th><th>Nombre del Cliente</th><th>Monto a Financiar</th><th>Fecha de Inicio</th><th>Fecha de Fin</th><th>TEA</th><th>Cuota</th></tr>';
  simulaciones.forEach(clave => {
      const { nombreCliente, deudaInicial, fechaInicio, fechaFin, TEA, cuota } = JSON.parse(localStorage.getItem(clave));
      const TEAPorcentaje = (TEA * 100).toFixed(2) + '%';
      tabla += `<tr>
                  <td>${clave}</td>
                  <td>${nombreCliente}</td>
                  <td>${deudaInicial}</td>
                  <td>${fechaInicio}</td>
                  <td>${fechaFin}</td>
                  <td>${TEAPorcentaje}</td>
                  <td>${cuota}</td>
                </tr>`;
  });
  tabla += '</table>';
  document.getElementById('tablaResultados').innerHTML = tabla;
}
