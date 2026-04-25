import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function Principal() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (err) {
          console.error("Erro ao buscar dados do usuário: ", err);
        }
      } else {
        // Se não tiver usuário logado, redireciona para login
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Página Principal</h2>
      {userData ? (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Nome:</strong> {userData.name}</p>
          <p><strong>Sobrenome:</strong> {userData.surname}</p>
          <p><strong>Data de Nascimento:</strong> {userData.birthdate}</p>
          <br/>
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <p>Dados do usuário não encontrados.</p>
      )}
    </div>
  );
}
