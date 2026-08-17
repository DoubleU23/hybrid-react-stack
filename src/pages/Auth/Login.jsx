// pages/LoginPage.js
import React, { useState } from 'react';
import { useSignIn, SignIn, useUser } from '@clerk/react'; // Wir bleiben konsistent beim neuen @clerk/react Paket
import {dark} from '@clerk/ui/themes'
import { useNavigate } from 'react-router-dom';
export default function LoginPage() {

  const { isSignedIn, isLoaded, user } = useUser();
  const redirect = useNavigate();

  if (isLoaded && isSignedIn)
    redirect('/profile')
  // const { signIn } = useSignIn();
  // const navigate = useNavigate();

  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const [loading, setLoading] = useState(false);

  // // Core 3 Sicherheits-Check: Warten, bis Clerk das Objekt bereitstellt
  // if (!signIn) {
  //   return <div>Auth-Schnittstelle lädt...</div>;
  // }

  // // --- 🌐 GOOGLE OAUTH SIGN-IN FUNCTION ---
  // const handleGoogleSignIn = async () => {
  //   setError('');
  //   try {
  //     // Startet die OAuth-Schnittstelle für den Login direkt über Clerk
  //     await signIn.authenticateWithRedirect({
  //       strategy: 'oauth_google',
  //       redirectUrl: '/dashboard',         // Wohin nach dem Google-Login weitergeleitet werden soll
  //       redirectUrlComplete: '/dashboard', // Fallback bei direktem Abschluss
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setError('Google Login fehlgeschlagen.');
  //   }
  // };

  // // --- KLASSISCHER LOGIN (E-Mail & Passwort) ---
  // const handleLoginSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     // API-Call an Clerk senden
  //     const result = await signIn.create({
  //       identifier: email,
  //       password: password,
  //     });

  //     // Wenn der Login erfolgreich war
  //     if (result.status === 'complete') {
  //       // Core 3 Methode zum Aktivieren der Browser-Session
  //       await result.finalize();

  //       // Weiterleitung zum Dashboard
  //       navigate('/dashboard');
  //     } else {
  //       console.log('Zusätzliche Verifizierung nötig:', result.status);
  //     }

  //   } catch (err) {
  //     console.error(err);
  //     setError(err.errors?.[0]?.message || 'Login fehlgeschlagen. Bitte prüfen.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <SignIn
        signInUrl="/login"
        forceRedirectUrl="/profile"
        appearance={{theme: dark, elements: {
      formFieldInput: {
        // Disables the browser's matching engine for autofill
        autoComplete: 'new-password'
      }
    }}}  />
     {/*  <h2>Einloggen</h2>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}


      <button
        type="button"
        onClick={handleGoogleSignIn}
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


      <form onSubmit={handleLoginSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>E-Mail-Adresse</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Prüfe Daten...' : 'Einloggen'}
        </button>
      </form> */}
    </div>
  );
}