import { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        surname,
        birthdate,
        email
      });

      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (err) {
      setError('Erro ao cadastrar: ' + err.message);
    }
  };

  return (
    <div className="standalone-page">
      <div className="page-container">
        <h2 className="page-title">Cadastro</h2>
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleRegister} className="form-group">
          <input 
            type="text" 
            placeholder="Nome" 
            required 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="input-field"
          />
          <input 
            type="text" 
            placeholder="Sobrenome" 
            required 
            value={surname} 
            onChange={e => setSurname(e.target.value)} 
            className="input-field"
          />
          <input 
            type="date" 
            required 
            value={birthdate} 
            onChange={e => setBirthdate(e.target.value)} 
            className="input-field"
          />
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
          <button type="submit" className="btn-primary">Cadastrar</button>
        </form>
        
        <Link to="/login" className="link-text">Já tem uma conta? Faça Login</Link>
      </div>
    </div>
  );
}
