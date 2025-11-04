"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export interface RegistroAuditoria {
  paso: string;
  estado: string;
  comentario: string;
}

type EstadoPaso = "PENDIENTE" | "EN REVISION" | "APROBADO" | "CORREGIR";

function isEstadoPaso(value: string): value is EstadoPaso {
  return ["PENDIENTE", "EN REVISION", "APROBADO", "CORREGIR"].includes(value);
}

export function useEstadoPaso(id_solicitud: string, nombrePaso: string) {
  const [estadoPaso, setEstadoPaso] = useState<
    "PENDIENTE" | "EN REVISION" | "APROBADO" | "CORREGIR"
  >("PENDIENTE");
  console.log("estado paso: ", estadoPaso);

  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await axios.get<{
          historial: RegistroAuditoria[];
          bloqueado: boolean;
        }>(`/api/Convenios/Especificos/${id_solicitud}/Auditoria`);

        setBloqueado(data.bloqueado);

        const pasoActual = data.historial.find(
          (p: RegistroAuditoria) => p.paso === nombrePaso
        );

        if (pasoActual && isEstadoPaso(pasoActual.estado)) {
          setEstadoPaso(pasoActual.estado);
        }
      } catch (err) {
        console.error("Error al cargar estado del paso:", err);
      }
    };
    if (id_solicitud) cargar();
  }, [id_solicitud, nombrePaso]);

  return { estadoPaso, bloqueado };
}
