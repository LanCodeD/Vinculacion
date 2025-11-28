export function getFechaLocalSinHora(fecha: string | Date) {
  const f = new Date(fecha);

  // Quitar horas en la zona LOCAL
  f.setHours(0, 0, 0, 0);

  // Ajustar para que no se recorra al guardarse en UTC
  return new Date(f.getTime() - f.getTimezoneOffset() * 60000);
}
