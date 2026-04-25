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
      // Cria usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Grava no Firestore os dados adicionais utilizando o UID do usuário
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
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Cadastro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Nome" required value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Sobrenome" required value={surname} onChange={e => setSurname(e.target.value)} />
        <input type="date" required value={birthdate} onChange={e => setBirthdate(e.target.value)} />
        <input type="email" placeholder="E-mail" required value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" required value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Cadastrar</button>
      </form>
      <div style={{ marginTop: '10px' }}>
        <Link to="/login">Já tem uma conta? Faça Login</Link>
      </div>
    </div>
  );
}
