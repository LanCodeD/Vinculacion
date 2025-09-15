import React from "react";
import type { DatosRegistro } from "@/types/registro";
import { useRouter } from "next/navigation";

interface Props {
  registro: DatosRegistro;
  onBack: () => void;
}

export default function PasoFinal({ registro, onBack }: Props) {
  const { tipoCuentaId } = registro;
  const router = useRouter();

  // 🔹 Mensaje según tipo de cuenta
  let mensaje = "";
  let mostrarBotonInicio = true;

  if (tipoCuentaId === 1 || tipoCuentaId === 3) {
    // 1 = egresado, 3 = empresa
    mensaje =
      "Registro completo. Espere respuesta del administrador para verificar su cuenta.";
    mostrarBotonInicio = true; // el botón siempre aparece, aunque podría estar deshabilitado según tu lógica futura
  } else if (tipoCuentaId === 2) {
    // 2 = docente
    mensaje =
      "Registro completo. Puede iniciar sesión con los datos ingresados.";
    mostrarBotonInicio = true;
  } else {
    mensaje = "Registro completo.";
  }

  const handleInicio = () => {
    // 🔹 Redirigir al inicio (o login)
    router.push("/");
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4 items-center justify-center text-center text-black">
      <h2 className="text-xl font-bold">¡Registro Finalizado!</h2>
      <p className="mt-2">{mensaje}</p>

      <div className="flex justify-between mt-4 w-full">
{/*         <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Atrás
        </button> */}

        {mostrarBotonInicio && (
          <button
            onClick={handleInicio}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Ir al Inicio
          </button>
        )}
      </div>
    </div>
  );
}
