function calcularArrayCuotasYFechas() {
  const deudaTotal = parseFloat(document.getElementById('deudaInicial').value);
  const TEA = parseFloat(document.getElementById('TEA').value);
  const numeroCuotas = parseInt(document.getElementById('numeroCuotas').value);
  const fechaInicio = new Date(document.getElementById('fechaInicio').value);
  let fechaPrimerPago = new Date(document.getElementById('fechaPrimerPago').value);
  const diaPago = parseInt(document.getElementById('diaPago').value);
  let arrayCuotas = [];
  let fechasPago = [];
  let sumaFactores = 0;

  
  if (fechaPrimerPago < fechaInicio) {
      fechaPrimerPago = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() + 1, diaPago);
  } else {
      fechaPrimerPago.setDate(diaPago);
  }

  for (let i = 0; i < numeroCuotas; i++) {
      let fechaPago = new Date(fechaPrimerPago.getFullYear(), fechaPrimerPago.getMonth() + i, fechaPrimerPago.getDate());
      fechasPago.push(fechaPago.toISOString().split('T')[0]);

      let dias = (fechaPago - fechaInicio) / (1000 * 3600 * 24);
      let factorTEA = 1 / Math.pow((1 + TEA), dias / 360);
      sumaFactores += factorTEA;
      arrayCuotas.push(factorTEA.toFixed(4));
  }

  let promedioFactorTEA = sumaFactores / numeroCuotas;
  let cuota = deudaTotal / sumaFactores;
  mostrarTablaResultados(fechasPago, arrayCuotas, promedioFactorTEA, cuota);
}

function mostrarTablaResultados(fechas, cuotas, promedioFactorTEA, cuota) {
  let tabla = '<table border="1"><tr><th># Cuota</th><th>Fecha de Pago</th><th>Factor TEA</th></tr>';
  
  for (let i = 0; i < fechas.length; i++) {
      tabla += `<tr>
                  <td>${i + 1}</td>
                  <td>${fechas[i]}</td>
                  <td>${cuotas[i]}</td>
                </tr>`;
  }

  tabla += `<tr><td colspan="2">Promedio Factor TEA</td><td>${promedioFactorTEA.toFixed(4)}</td></tr>`;
  tabla += `<tr><td colspan="2">Cuota</td><td>${cuota.toFixed(2)}</td></tr>`;
  tabla += '</table>';
  document.getElementById('tablaResultados').innerHTML = tabla;
}