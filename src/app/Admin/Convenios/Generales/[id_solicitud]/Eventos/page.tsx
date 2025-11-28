"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function AdminEventos() {
  const { id_solicitud } = useParams();

  const [form, setForm] = useState({
    ceremonia_realizara: false,
    ceremonia_fecha_hora: "",
    ceremonia_lugar: "",
    requerimientos_evento: "",
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get(
          `/api/Convenios/Generales/${id_solicitud}/Eventos`
        );

        if (data) {
          setForm({
            ceremonia_realizara: !!data.ceremonia_realizara,
            ceremonia_fecha_hora: data.ceremonia_fecha_hora
              ? new Date(data.ceremonia_fecha_hora).toISOString().slice(0, 16)
              : "",
            ceremonia_lugar: data.ceremonia_lugar || "",
            requerimientos_evento: data.requerimientos_evento || "",
          });
        }
      } catch (err) {
        console.warn("No se pudo cargar el evento", err);
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando)
    return <p className="text-center py-6 text-black">Cargando datos...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-2xl font-bold text-[#011848]">
        Detalles del evento o ceremonia
      </h2>

      <div className="border rounded-xl bg-white shadow-sm p-6 space-y-5">
        {/* Realización de ceremonia */}
        <div>
          <p className="text-sm font-semibold text-gray-700">
            ¿Se realizará ceremonia?
          </p>
          <p
            className={`mt-1 font-medium ${
              form.ceremonia_realizara ? "text-green-600" : "text-red-600"
            }`}
          >
            {form.ceremonia_realizara ? "Sí" : "No"}
          </p>
        </div>

        {/* Solo mostrar detalles si la ceremonia se realizará */}
        {form.ceremonia_realizara && (
          <>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Fecha y hora del evento
              </p>
              <p className="mt-1 border rounded-lg p-3 bg-gray-50">
                {form.ceremonia_fecha_hora
                  ? dayjs(form.ceremonia_fecha_hora).format(
                      "DD/MM/YYYY hh:mm A"
                    )
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Lugar de la ceremonia
              </p>
              <p className="mt-1 border rounded-lg p-3 bg-gray-50">
                {form.ceremonia_lugar || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Requerimientos especiales o logística
              </p>
              <p className="mt-1 border rounded-lg p-3 bg-gray-50 whitespace-pre-line">
                {form.requerimientos_evento || "—"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="text-sm text-gray-500 italic">
        *Información proporcionada por el solicitante.
      </div>
    </div>
  );
}
