import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Config() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setSurname(data.surname || '');
            setBirthdate(data.birthdate || '');
          }

          const qPhone = query(collection(db, 'user_phones'), where('uid', '==', user.uid));
          const phoneSnap = await getDocs(qPhone);
          if (!phoneSnap.empty) {
            setPhone(phoneSnap.docs[0].data().phoneNumber || '');
          }

          const qAddr = query(collection(db, 'user_addresses'), where('uid', '==', user.uid));
          const addrSnap = await getDocs(qAddr);
          if (!addrSnap.empty) {
            setCity(addrSnap.docs[0].data().city || '');
          }
        } catch (err) {
          console.error("Erro ao carregar dados", err);
        }
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Atualiza Tabela Mestre
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        birthdate
      });

      // Atualiza ou Cria na Tabela de Telefones
      const qPhone = query(collection(db, 'user_phones'), where('uid', '==', user.uid));
      const phoneSnap = await getDocs(qPhone);
      if (!phoneSnap.empty) {
        const phoneDocId = phoneSnap.docs[0].id;
        await updateDoc(doc(db, 'user_phones', phoneDocId), { phoneNumber: phone });
      } else if (phone) {
        await addDoc(collection(db, 'user_phones'), { uid: user.uid, phoneNumber: phone });
      }

      // Atualiza ou Cria na Tabela de Endereços
      const qAddr = query(collection(db, 'user_addresses'), where('uid', '==', user.uid));
      const addrSnap = await getDocs(qAddr);
      if (!addrSnap.empty) {
        const addrDocId = addrSnap.docs[0].id;
        await updateDoc(doc(db, 'user_addresses', addrDocId), { city: city });
      } else if (city) {
        await addDoc(collection(db, 'user_addresses'), { uid: user.uid, city: city });
      }

      setSuccess('Dados atualizados com sucesso!');
      setTimeout(() => {
        navigate('/principal');
      }, 1500);

    } catch (err) {
      setError('Erro ao salvar configurações: ' + err.message);
    }
  };

  if (loading) return <div className="page-container" style={{ textAlign: 'center' }}>Carregando...</div>;

  return (
    <div className="page-container">
      <h2 className="page-title">Configurações da Conta</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', opacity: 0.8 }}>
        Preencha os dados restantes para continuar.
      </p>
      
      {error && <div className="error-msg">{error}</div>}
      {success && (
        <div className="error-msg" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSave} className="form-group">
        <input type="text" placeholder="Nome" required value={name} onChange={e => setName(e.target.value)} className="input-field" />
        <input type="text" placeholder="Sobrenome" required value={surname} onChange={e => setSurname(e.target.value)} className="input-field" />
        <input type="date" required value={birthdate} onChange={e => setBirthdate(e.target.value)} className="input-field" />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="input-field" style={{ width: '80px', padding: '14px 10px' }} title="DDI">
            <option value="+55">+55</option>
            <option value="+1">+1</option>
            <option value="+351">+351</option>
          </select>
          <input 
            type="tel" 
            placeholder="(DDD) 90000-0000" 
            required
            value={phone} 
            onChange={e => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length > 2) val = "(" + val.substring(0,2) + ") " + val.substring(2);
              if (val.length > 10) val = val.substring(0,10) + "-" + val.substring(10,14);
              setPhone(val);
            }} 
            className="input-field"
            style={{ flex: 1 }}
            maxLength={15}
          />
        </div>

        <input type="text" placeholder="Cidade" required value={city} onChange={e => setCity(e.target.value)} className="input-field" />
        
        <button type="submit" className="btn-primary">Salvar Configurações</button>
      </form>
    </div>
  );
}
