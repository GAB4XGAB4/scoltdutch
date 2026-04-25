import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/principal');
    } catch (err) {
      setError('Usuário não está cadastrado ou credenciais inválidas.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Acessar a página Principal</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
      </div>
    </div>
  );
}
