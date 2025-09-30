'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular?: string;
  rol: string;
  tipoCuenta: string;
  last_login?: string;
  paso_actual: number;
  empresas?: any[];
  egresados?: any[];
}

export default function Perfil() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const userId = session?.user?.id;
    if (!userId) return;

    fetch(`/api/Users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [status, session]);

  if (status === 'loading') return <div>Cargando sesión...</div>;
  if (!user) return <div>Cargando datos del usuario...</div>;

  return (
    <div className='p-4 bg-white rounded shadow text-black'>
      <h1>Perfil de {user.nombre} {user.apellido}</h1>
      <p>Correo: {user.correo}</p>
      <p>Celular: {user.celular}</p>
      <p>Rol: {user.rol}</p>
      <p>Tipo de cuenta: {user.tipoCuenta}</p>
      <p>Último login: {user.last_login}</p>

      {user.rol === 'Administrador' && (
        <div>
          <h2>Empresas</h2>
          <ul>
            {user.empresas?.map(e => <li key={e.id_empresas}>{e.nombre_comercial}</li>)}
          </ul>
        </div>
      )}

      {user.rol === 'Egresado' && (
        <div>
          <h2>Datos de egresado</h2>
          <ul>
            {user.egresados?.map(e => <li key={e.id_egresados}>{e.titulo}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
