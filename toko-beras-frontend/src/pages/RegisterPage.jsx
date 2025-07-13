import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi'; // Import fungsi API

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error setiap kali submit

    try {
      await registerUser({ name, email, password });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login'); // Arahkan ke halaman login setelah berhasil
    } catch (err) {
      // Tangkap dan tampilkan pesan error dari server
      const errorMessage = err.response?.data?.error || 'Registrasi gagal. Silakan coba lagi.';
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
        <h1 className="text-3xl font-bold text-center">Registrasi Akun Baru</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Nama:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full px-4 py-2 text-gray-100 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;