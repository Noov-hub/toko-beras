import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi'; // Import fungsi API
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        login(data.token);
        alert('Login berhasil!');
        navigate('/'); // Arahkan ke Halaman Utama setelah berhasil
        // Anda bisa juga me-refresh halaman untuk memperbarui state aplikasi
        window.location.reload();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login gagal. Silakan coba lagi.';
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default LoginPage;