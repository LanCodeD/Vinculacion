export interface TipoCuenta {
  nombre: string;
}
export interface Rol {
  nombre: string;
}
export interface AcademiaIngenieria {
  ingenieria: string;
}
export interface EmpresaSimple {
  nombre_comercial: string;
}
export interface Verificador {
  nombre: string;
  apellido: string;
  correo: string;
}

export interface EgresadoPerfil {
  id_egresados: number;
  matricula: string;
  titulo: string | null;
  puesto: string | null;
  fecha_egreso: string | null;
  correo_institucional: string | null;
  academias_ingenierias: AcademiaIngenieria | null;
  empresas: EmpresaSimple | null;
  verificado_en: string | null;
  verificado_por_usuarios_id: number | null;
  verificado_por: Verificador | null;
}

export interface DocentePerfil {
  id_docentes: number;
  titulo: string | null;
  puesto: string | null;
  empresas: EmpresaSimple | null;
}

export interface EmpresaPerfil {
  id_empresas: number;
  nombre_comercial: string;
  razon_social: string;
  rfc: string;
  direccion: string;
  telefono: string;
  correo: string;
  puesto: string | null;
  verificado: boolean;
  verificado_por_usuarios_id: number | null;
  verificado_por: Verificador | null;
  verificado_en: string | null;
}

export interface UsuarioGestion {
  id_usuarios: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string | null;
  tipos_cuenta_id: number;
  roles_id: number;
  foto_perfil: string | null;
  tipos_cuenta: TipoCuenta;
  roles: Rol;
  egresados_perfil?: EgresadoPerfil | null;
  docentes?: DocentePerfil | null;
  empresas_perfil?: EmpresaPerfil | null;
}
