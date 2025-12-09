import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function getFechaLocalSinHora(fecha: string | Date) {
  const d = dayjs(fecha);

  // 1. Convertir a LOCAL y quitar horas
  const localSinHora = d.hour(0).minute(0).second(0).millisecond(0);

  // 2. Convertir a UTC manteniendo la FECHA sin que se recorra
  return localSinHora.utc().toDate();
}
