// src/app/registro/page.tsx
"use client"; // 👈 recuerda que usas hooks en RegistroWizard

import RegistroWizard from "./RegistroWizard";

export default function RegistroPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegistroWizard />
    </main>
  );
}
