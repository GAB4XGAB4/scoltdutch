import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

export default function Principal() {
  const [userData, setUserData] = useState(null);
  const [phones, setPhones] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Busca Tabela Mestre
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData(docSnap.data());

            // Busca Tabela de Telefones (Simulando o JOIN do 4NF)
            const qPhone = query(collection(db, 'user_phones'), where('uid', '==', user.uid));
            const phoneSnap = await getDocs(qPhone);
            setPhones(phoneSnap.docs.map(d => d.data()));

            // Busca Tabela de Endereços (Simulando o JOIN do 4NF)
            const qAddr = query(collection(db, 'user_addresses'), where('uid', '==', user.uid));
            const addrSnap = await getDocs(qAddr);
            setAddresses(addrSnap.docs.map(d => d.data()));
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

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Carregando...</div>;

  return (
    <div className="page-container">
      <h2 className="page-title">Perfil do Usuário</h2>
      {userData ? (
        <div className="profile-card">
          <div className="profile-avatar">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-info">
            <p><strong>Nome:</strong> {userData.name}</p>
            <p><strong>Sobrenome:</strong> {userData.surname}</p>
            <p><strong>Data de Nascimento:</strong> {userData.birthdate}</p>
            
            {phones.length > 0 && (
              <p><strong>Telefone:</strong> {phones[0].phoneNumber}</p>
            )}
            
            {addresses.length > 0 && (
              <p><strong>Cidade:</strong> {addresses[0].city}</p>
            )}
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
