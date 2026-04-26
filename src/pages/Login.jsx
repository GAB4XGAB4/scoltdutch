import { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';

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

  const handleGithubLogin = async () => {
    setError('');
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica se o usuário já tem registro na tabela Mestre (users)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Primeiro login com o GitHub, salva os dados básicos
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'Usuário do GitHub',
          surname: '',
          birthdate: '',
          email: user.email || ''
        });
        navigate('/config');
      } else {
        // Se já existir, verifica se faltam dados obrigatórios (ex: sobrenome)
        const data = userDoc.data();
        if (!data.surname || !data.birthdate) {
          navigate('/config');
        } else {
          navigate('/principal');
        }
      }
    } catch (err) {
      setError('Erro no login com GitHub: ' + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verifica se o usuário já tem registro na tabela Mestre (users)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Primeiro login com o Google, salva os dados básicos
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || 'Usuário do Google',
          surname: '',
          birthdate: '',
          email: user.email || ''
        });
        navigate('/config');
      } else {
        // Se já existir, verifica se faltam dados obrigatórios
        const data = userDoc.data();
        if (!data.surname || !data.birthdate) {
          navigate('/config');
        } else {
          navigate('/principal');
        }
      }
    } catch (err) {
      setError('Erro no login com Google: ' + err.message);
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
        <button type="submit" className="btn-primary">Acessar sua conta</button>
      </form>
      
      <div style={{ textAlign: 'center', margin: '15px 0', color: 'var(--color-white)', opacity: 0.6 }}>ou</div>
      
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px' }}>
        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          className="btn-primary" 
          style={{ background: '#db4437', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', padding: '0', fontSize: '1.5rem' }}
          title="Entrar com Google"
        >
          <FaGoogle />
        </button>

        <button 
          type="button" 
          onClick={handleGithubLogin} 
          className="btn-primary" 
          style={{ background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', padding: '0', fontSize: '1.5rem' }}
          title="Entrar com GitHub"
        >
          <FaGithub />
        </button>
      </div>

        <Link to="/cadastro" className="link-text">Não tem uma conta? Cadastre-se</Link>
      </div>
    </div>
  );
}
