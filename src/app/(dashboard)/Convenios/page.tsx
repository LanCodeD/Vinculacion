"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Convenios Generales",
    description:
      "Son acuerdos marco entre instituciones que establecen lineamientos amplios para colaboración académica, intercambios o proyectos sin requerimientos específicos.",
    image: "/Convenios/convenio2.webp",
    reverse: false,
  },
  {
    title: "Convenios Específicos",
    description:
      "Derivan de los convenios generales y detallan acciones concretas como movilidad estudiantil, investigación conjunta o uso compartido de recursos.",
    image: "/Convenios/convenio1.webp",
    reverse: true,
  },
  {
    title: "¿Cómo elegir el tipo de convenio?",
    description:
      "Si tu proyecto es amplio y no requiere ejecución inmediata, considera un convenio general. Si involucra fechas, recursos o compromisos específicos, opta por uno específico.",
    image: "/Convenios/convenio3.webp",
    reverse: false,
  },
  {
    title: "¿Consultar los registros realizados?",
    description:
      "Aquí puedes revisar los convenios registrados en el sistema, filtrarlos por tipo, fecha o institución participante.",
    image: "/Convenios/convenio4.webp",
    reverse: true,
  },
];

export default function ConveniosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24 bg-linear-to-b from-white via-zinc-50 to-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-zinc-800 mb-8"
      >
        Información sobre Convenios
      </motion.h1>

      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`grid md:grid-cols-2 gap-8 items-center ${
            section.reverse ? "md:grid-cols-[1fr_1fr]" : ""
          }`}
        >
          {/* Imagen con hover */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full"
          >
            <Image
              src={section.image}
              alt={section.title}
              width={600}
              height={400}
              className="rounded-xl shadow-md w-full h-auto object-cover"
            />
          </motion.div>

          {/* Texto animado */}
          <div className="w-full">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold text-zinc-700 mb-4"
            >
              {section.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-600 text-lg"
            >
              {section.description}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
