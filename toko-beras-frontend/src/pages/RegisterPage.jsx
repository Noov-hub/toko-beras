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
    <div>
      <h1>Registrasi Akun Baru</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Daftar</button>
      </form>
    </div>
  );
}

export default RegisterPage;