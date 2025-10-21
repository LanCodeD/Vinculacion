'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function CrearOferta() {
  const { data: session } = useSession();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [puesto, setPuesto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagen, setImagen] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');

  const [ingenierias, setIngenierias] = useState<number[]>([]);
  const [listaIngenierias, setListaIngenierias] = useState<{ id_academias: number; ingenieria: string }[]>([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hoy = new Date().toISOString().split('T')[0]; // fecha mínima válida

  // Cargar categorías
  useEffect(() => {
    fetch("/api/Ingenierias")
      .then(res => res.json())
      .then(data => {
        if (data.ok) setListaIngenierias(data.ingenierias);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!titulo || !descripcion || !puesto || !ubicacion || !imagen || !fechaCierre || ingenierias.length === 0) {
      toast.error('Por favor, completa todos los campos obligatorios y selecciona al menos una ingeniería.', {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    const fechaSeleccionada = new Date(fechaCierre);
    if (fechaSeleccionada < new Date()) {
      toast.error('La fecha de cierre no puede ser anterior a hoy.', { duration: 3000 });
      return;
    }

    if (!session || session.user.role !== 'Empresa') {
      toast.error('Solo cuentas de empresa pueden crear vacantes.', { duration: 3000 });
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
          ingenierias,
        }),
      });

      const data = await res.json();

      if (!data.ok) {
        toast.error(data.error || 'Error al crear la oferta.', { duration: 3000 });
      } else {
        toast.success('✅ Oferta creada correctamente y enviada para revisión.', { duration: 3000 });

        // Limpiar formulario
        setTitulo('');
        setDescripcion('');
        setPuesto('');
        setUbicacion('');
        setImagen('');
        setFechaCierre('');
        setIngenierias([]);
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    }
  };

  if (!session) return <div>Debes iniciar sesión para crear una oferta.</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto mt-10 text-black">
      {/* Toast container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '14px 20px',
            color: '#111',
            fontWeight: 500,
          },
          success: {
            style: {
              backgroundColor: '#bbf7d0', // bg-green-200
              color: '#065f46',           // texto verde oscuro
            },
          },
          error: {
            style: {
              backgroundColor: '#fecaca', // bg-red-200
              color: '#991b1b',           // texto rojo oscuro
            },
          },
        }}
      />

      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Crear nueva oferta</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Nombre de la empresa *</label>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Empresa"
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
          <label className="block font-medium mb-1">Puesto a desempeñar *</label>
          <input
            value={puesto}
            onChange={e => setPuesto(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Ej. Ingeniero de Software"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Ingenierías requeridas *</label>
          <div className="flex flex-wrap gap-2">
            {listaIngenierias.map(i => (
              <label key={i.id_academias} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={i.id_academias}
                  checked={ingenierias.includes(i.id_academias)}
                  onChange={e => {
                    const id = parseInt(e.target.value);
                    if (e.target.checked) {
                      setIngenierias([...ingenierias, id]);
                    } else {
                      setIngenierias(ingenierias.filter(cat => cat !== id));
                    }
                  }}
                  className="w-4 h-4 accent-blue-600"
                />
                <span>{i.ingenieria}</span>
              </label>
            ))}
          </div>
        </div>


        <div>
          <label className="block font-medium mb-1">Ubicación del puesto *</label>
          <input
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-200"
            placeholder="Ej. Valladolid, Yucatán"
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
          <label className="block font-medium mb-1">Fecha de cierre de la oferta*</label>
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
