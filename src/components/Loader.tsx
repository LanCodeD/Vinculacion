// src/components/LoadingIndicator.tsx
interface LoadingIndicatorProps {
  mensaje?: string;
}

export default function LoaderIndicador({ mensaje = "Cargando datos..." }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-[#011848]">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-t-transparent border-[#011848] rounded-full animate-spin"></div>

      {/* Texto */}
      <p className="mt-4 text-sm font-medium animate-pulse">{mensaje}</p>
    </div>
  );
}
