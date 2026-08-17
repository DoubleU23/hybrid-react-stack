// pages/RegisterPage.js
import React, { useState } from 'react';
import { useSignUp, SignUp } from '@clerk/react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
//   const { signUp } = useSignUp();
//   const navigate = useNavigate();

//   // Formular-States
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');

//   // Phase 2 States (Code-Verifizierung)
//   const [pendingVerification, setPendingVerification] = useState(false);
//   const [code, setCode] = useState('');

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   if (!signUp) {
//     return <div>Auth-Schnittstelle lädt...</div>;
//   }

//   // --- 🌐 GOOGLE OAUTH SIGN-UP FUNCTION ---
//   const handleGoogleSignUp = async () => {
//     setError('');
//     try {
//       // Startet die OAuth-Schnittstelle direkt über Clerk
//       await signUp.authenticateWithRedirect({
//         strategy: 'oauth_google',
//         redirectUrl: '/dashboard', // Wo der User nach erfolgreichem Google-Sign-Up landen soll
//         redirectUrlComplete: '/dashboard', // Fallback, falls die Registrierung direkt abgeschlossen wird
//       });
//     } catch (err) {
//       console.error(err);
//       setError('Google Sign-Up fehlgeschlagen.');
//     }
//   };

//   // --- PHASE 1: E-Mail & Passwort Absenden ---
//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await signUp.create({
//         emailAddress: email,
//         password: password,
//         firstName: firstName,
//         lastName: lastName
//       });

//       // Code an E-Mail senden triggern
//       await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
//       setPendingVerification(true);

//     } catch (err) {
//       console.error(err);
//       setError(err.errors?.[0]?.message || 'Registrierung fehlgeschlagen.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- PHASE 2: Code Verifizieren ---
//   const handleVerificationSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

//       if (completeSignUp.status === "complete") {
//         await completeSignUp.finalize();
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       console.error(err);
//       setError(err.errors?.[0]?.message || 'Falscher Code.');
//     } finally {
//       setLoading(false);
//     }
//   };

  // --- RENDERING ---

  // Phase 2 Ansicht (Code eingeben)
//   if (pendingVerification) {
//     return (
//       <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
//         <h2>E-Mail verifizieren</h2>
//         <p>Code gesendet an: <strong>{email}</strong></p>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <form onSubmit={handleVerificationSubmit}>
//           <input
//             type="text"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             required
//             placeholder="123456"
//             style={{ width: '100%', padding: '0.5rem', textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem' }}
//           />
//           <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
//             {loading ? 'Prüfe...' : 'Aktivieren'}
//           </button>
//         </form>
//       </div>
//     );
//   }

  // Phase 1 Ansicht (Registrierung & Google)
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <SignUp />
     {/*  <h2>Account erstellen</h2>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}


      <button
        type="button"
        onClick={handleGoogleSignUp}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#fff',
          color: '#444',
          border: '1px solid #aaa',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '1.5rem'
        }}
      >
        🌐 Weiter mit Google
      </button>


      <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
        <div style={{ flex: 1, height: '1px', background: '#ccc' }}></div>
        <span style={{ padding: '0 10px', color: '#777', fontSize: '0.9rem' }}>oder</span>
        <div style={{ flex: 1, height: '1px', background: '#ccc' }}></div>
      </div>


      <form onSubmit={handleRegisterSubmit}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label>Vorname</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div>
            <label>Nachname</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>E-Mail-Adresse</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Erstelle Account...' : 'Registrieren'}
        </button>
      </form> */}
    </div>
  );
}