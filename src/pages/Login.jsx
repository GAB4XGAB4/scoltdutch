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
    } catch {
      setError('Usuário não está cadastrado ou credenciais inválidas.');
    }
  };

  return (
    <div className="standalone-page">
      <div className="page-container">
        <h2 className="page-title">Login</h2>
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleLogin} className="form-group">
          <input 
            type="email" 
            placeholder="E-mail" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="input-field"
          />
          <input 
            type="password" 
            placeholder="Senha" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="input-field"
          />
          <button type="submit" className="btn-primary">Acessar Página Principal</button>
        </form>
        
        <Link to="/cadastro" className="link-text">Ainda não tem conta? Cadastre-se</Link>
      </div>
    </div>
  );
}
