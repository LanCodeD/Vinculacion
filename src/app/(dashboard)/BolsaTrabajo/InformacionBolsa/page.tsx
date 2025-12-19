"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Bolsa de Trabajo",
    description:
      "La Bolsa de Trabajo es un espacio donde empresas publican vacantes laborales y estudiantes o egresados pueden postularse de manera directa, facilitando la vinculación profesional.",
    image: "/InformacionBolsa/imagen1.jpg",
    reverse: false,
  },
  {
    title: "Publicación de Vacantes",
    description:
      "Las empresas registradas pueden crear ofertas de empleo especificando requisitos, puesto, modalidad y fecha de cierre, las cuales pasan por un proceso de revisión antes de publicarse.",
    image: "/InformacionBolsa/imagen2.jpg",
    reverse: true,
  },
  {
    title: "Postulación de Estudiantes y Egresados",
    description:
      "Los estudiantes y egresados pueden consultar las vacantes disponibles, subir su currículum y postularse a aquellas que se ajusten a su perfil académico y profesional.",
    image: "/InformacionBolsa/imagen3.jpg",
    reverse: false,
  },
  {
    title: "Seguimiento de Postulaciones",
    description:
      "Las empresas pueden dar seguimiento a los postulantes, revisar perfiles, aceptar o rechazar candidaturas y mantener un control organizado del proceso de selección.",
    image: "/InformacionBolsa/imagen4.webp",
    reverse: true,
  },
];

export default function BolsaTrabajoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24 bg-linear-to-b from-white via-zinc-50 to-white">
      {/* TÍTULO */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center text-zinc-800 mb-8"
      >
        Información sobre la Bolsa de Trabajo
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
            className={`w-full ${
              section.reverse ? "md:order-2" : "md:order-1"
            }`}
          >
            <Image
              src={section.image}
              alt={section.title}
              width={600}
              height={400}
              className="rounded-xl shadow-md w-full h-auto object-cover"
            />
          </motion.div>

          {/* Texto */}
          <div
            className={`w-full ${
              section.reverse ? "md:order-1" : "md:order-2"
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
