// src/types/registro.ts

export interface DatosBasicos {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  celular: string;
}

export interface DatosVerificacion {
  codigoVerificacion?: string;
}

export interface PerfilEgresado {
  matricula: string;
  titulo: string;
  puesto: string;
  fechaEgreso: string; // ISO string en frontend
  correoInstitucional: string;
  academiasIngenieriasId: number;
}

export interface PerfilDocente {
  titulo: string;
  puesto: string;
  academiasIngenieriasId: number;
}

export interface PerfilEmpresa {
  nombreComercial: string;
  razonSocial?: string;
  rfc: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  puesto?: string;
  titulo?: string;
}


/**
 * Objeto maestro que guarda todo el progreso del wizard.
 * - tipoCuentaId: siempre existe (0 = no seleccionado).
 * - usuarioId?: almacenar id retornado por backend (necesario para tokens).
 * - los bloques de datos son opcionales porque se llenan paso a paso.
 */
export interface DatosRegistro {
  tipoCuentaId: number;
  usuarioId?: number | null; // <- agrega esto
  datosBasicos?: DatosBasicos;
  verificacion?: DatosVerificacion;
  perfilEgresado?: PerfilEgresado;
  perfilDocente?: PerfilDocente;
  perfilEmpresa?: PerfilEmpresa;
}
