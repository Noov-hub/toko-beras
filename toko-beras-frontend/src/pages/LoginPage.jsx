import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi'; // Import fungsi API
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        login(data.token);
        alert('Login berhasil!');
        navigate(from, { replace: true }); // Arahkan ke Halaman Utama setelah berhasil
        // Anda bisa juga me-refresh halaman untuk memperbarui state aplikasi
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login gagal. Silakan coba lagi.';
      setError(errorMessage);
    }
  };

  return (
    <div 
      className="relative min-h-[90vh] bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/images/sawah.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-black/70 rounded-xl shadow-lg text-white">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button 
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;