"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import LoaderIndicador from "@/components/Loader";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function PasoEventosEspecificoAdmin() {
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
          `/api/Convenios/Especificos/${id_solicitud}/Eventos`
        );

        setForm({
          ceremonia_realizara: !!data.ceremonia_realizara,
          ceremonia_fecha_hora: data.ceremonia_fecha_hora
            ? new Date(data.ceremonia_fecha_hora).toISOString().slice(0, 16)
            : "",
          ceremonia_lugar: data.ceremonia_lugar || "",
          requerimientos_evento: data.requerimientos_evento || "",
        });
      } catch (err) {
        console.error("❌ Error al cargar los datos del evento:", err);
      } finally {
        setCargando(false);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud]);

  if (cargando) {
    return <LoaderIndicador mensaje="Cargando datos de Eventos..." />;
  }


  return (
    <div className="max-w-3xl mx-auto space-y-6 text-black">
      <h2 className="text-2xl font-bold text-[#011848]">Detalles del Evento</h2>

      {/* ======= Información principal ======= */}
      <div className="border rounded-lg bg-white shadow p-5 space-y-4">
        <p>
          <strong>¿Se realizará ceremonia?:</strong>{" "}
          <span className="text-gray-700">
            {form.ceremonia_realizara ? "Sí" : "No"}
          </span>
        </p>

        {form.ceremonia_realizara && (
          <>
            <p>
              <strong>Fecha y hora:</strong>{" "}
              <span className="text-gray-700">
               
                  {form.ceremonia_fecha_hora
                    ? dayjs(form.ceremonia_fecha_hora).format(
                        "DD/MM/YYYY hh:mm A"
                      )
                    : "—"}

              </span>
            </p>

            <p>
              <strong>Lugar:</strong>{" "}
              <span className="text-gray-700">
                {form.ceremonia_lugar || "—"}
              </span>
            </p>
          </>
        )}

        <p>
          <strong>Requerimientos para el evento:</strong>
        </p>
        <div className="border rounded-lg bg-gray-50 p-3 text-gray-800 whitespace-pre-wrap">
          {form.requerimientos_evento
            ? form.requerimientos_evento
            : "No se especificaron requerimientos."}
        </div>
      </div>

      {/* ======= Nota final ======= */}
      <div className="text-sm text-gray-500 italic border-t pt-4">
        *Esta información fue proporcionada por el solicitante.
      </div>
    </div>
  );
}
