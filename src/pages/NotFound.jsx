import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <div className="h-1 w-32 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 text-lg">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200"
          >
            <Home size={20} />
            Ke Beranda
          </button>
        </div>

        {/* Illustration */}
        <div className="mt-12">
          <svg
            className="w-64 h-64 mx-auto opacity-50"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="80" fill="#E0F2FE" />
            <path
              d="M70 90 Q100 70 130 90"
              stroke="#0EA5E9"
              strokeWidth="4"
              fill="none"
            />
            <circle cx="80" cy="85" r="8" fill="#0EA5E9" />
            <circle cx="120" cy="85" r="8" fill="#0EA5E9" />
            <path
              d="M70 120 Q100 140 130 120"
              stroke="#0EA5E9"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
