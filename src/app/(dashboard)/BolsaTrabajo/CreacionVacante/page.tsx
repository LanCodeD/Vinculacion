'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function CrearOferta() {
  const { data: session } = useSession();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [puesto, setPuesto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hoy = new Date().toISOString().split('T')[0]; // fecha mínima válida

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!titulo || !descripcion || !puesto || !ubicacion || !imagen || !fechaCierre) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const fechaSeleccionada = new Date(fechaCierre);
    if (fechaSeleccionada < new Date()) {
      setError('La fecha de cierre no puede ser anterior a hoy.');
      return;
    }

    if (!session || session.user.role !== 'Empresa') {
      setError('Solo cuentas de empresa pueden crear vacantes.');
      return;
    }

    try {
      const res = await fetch('/api/Ofertas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion,
          puesto,
          ubicacion,
          imagen,
          fecha_cierre: fechaCierre,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        toast.error(data.error || 'Error al crear la oferta.', {
          position: 'top-right',
        });
      } else {
        toast.success('✅ Oferta creada correctamente y enviada para revisión.', {
          position: 'top-right',
          duration: 1500,
        });

        // Limpiar formulario
        setTitulo('');
        setDescripcion('');
        setPuesto('');
        setUbicacion('');
        setImagen('');
        setFechaCierre('');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    }
  };

  if (!session) return <div>Debes iniciar sesión para crear una oferta.</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto mt-10 text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Crear nueva oferta</h1>

      {error && <p className="text-red-600 text-center mb-3">{error}</p>}
      {success && <p className="text-green-600 text-center mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Título *</label>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Ej. Desarrollador Frontend"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Descripción *</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Describe las responsabilidades y requisitos del puesto..."
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Puesto *</label>
          <input
            value={puesto}
            onChange={e => setPuesto(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Ej. Ingeniero de Software"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ubicación *</label>
          <input
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Ej. Guadalajara, Jalisco"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Imagen (URL) *</label>
          <input
            type="url"
            value={imagen}
            onChange={e => setImagen(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {imagen && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Previsualización:</p>
              <img
                src={imagen}
                alt="Previsualización"
                className="w-full rounded-lg border h-40 object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha de cierre *</label>
          <input
            type="date"
            value={fechaCierre}
            min={hoy}
            onChange={e => setFechaCierre(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Crear oferta
        </button>
      </form>
    </div>
  );
}