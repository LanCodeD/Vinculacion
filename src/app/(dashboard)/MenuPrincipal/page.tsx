"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Sistema de Vinculación",
    description:
      "El Sistema de Vinculación integra los módulos de Convenios y Bolsa de Trabajo, permitiendo fortalecer la relación entre la institución, las empresas y la comunidad estudiantil.",
    image: "/InformacionGeneral/convenio.jpg",
    reverse: false,
  },
  {
    title: "Convenios Institucionales",
    description:
      "Los convenios permiten establecer acuerdos de colaboración con empresas e instituciones para prácticas profesionales, estadías, investigación y otros proyectos académicos.",
    image: "/InformacionGeneral/relaciones_institucionales.png",
    reverse: true,
  },
  {
    title: "Bolsa de Trabajo",
    description:
      "A través de la Bolsa de Trabajo, las empresas publican vacantes y los estudiantes o egresados pueden postularse de forma directa, facilitando su inserción al mercado laboral.",
    image: "/InformacionGeneral/bolsatrabajo.jpg",
    reverse: false,
  },
  {
    title: "Integración Convenios y Vacantes",
    description:
      "La integración de ambos módulos permite que las oportunidades laborales y los acuerdos institucionales se gestionen desde un solo sistema, optimizando los procesos de vinculación.",
    image: "/InformacionGeneral/Inegracion.png",
    reverse: true,
  },
  {
    title: "Seguimiento y Control",
    description:
      "El sistema ofrece herramientas de seguimiento, control y consulta de información, facilitando la toma de decisiones y la evaluación del impacto de la vinculación institucional.",
    image: "/InformacionGeneral/Control.jpg",
    reverse: false,
  },
];

export default function VinculacionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24 bg-linear-to-b from-white via-zinc-50 to-white">
      {/* TÍTULO */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-zinc-800 mb-8"
      >
        Sistema de Vinculación
      </motion.h1>

      {/* SECCIONES */}
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Imagen */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-full ${section.reverse ? "md:order-2" : "md:order-1"
              }`}
          >
            <div className="relative w-full h-64 md:h-72 lg:h-80 overflow-hidden rounded-2xl shadow-md">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Texto */}
          <div
            className={`w-full ${section.reverse ? "md:order-1" : "md:order-2"
              }`}
          >
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

