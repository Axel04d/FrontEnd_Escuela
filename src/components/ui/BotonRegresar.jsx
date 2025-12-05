import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function BotonRegresar() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mb-6 px-4 py-2 
                 bg-gray-200 hover:bg-gray-300 text-gray-700 
                 rounded-lg w-fit transition"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      Regresar
    </button>
  );
}
