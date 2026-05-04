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

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Carregando...</div>;

  return (
    <div className="page-container" style={{ marginTop: '50px' }}>
      <h2 className="page-title">Perfil do Usuário</h2>
      {userData ? (
        <div className="profile-card">
          <div className="profile-info">
            <p><strong>Nome:</strong> {userData.name}</p>
            <p><strong>Sobrenome:</strong> {userData.surname}</p>
            <p><strong>Data de Nascimento:</strong> {userData.birthdate}</p>
          </div>
          <br/>
          <button onClick={handleLogout} className="btn-primary" style={{ marginTop: '10px' }}>Sair</button>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Dados do usuário não encontrados.</p>
      )}
    </div>
  );
}
