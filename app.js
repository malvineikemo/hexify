import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';
import { doc, getDoc, setDoc, updateDoc, getFirestore } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const balanceElem = document.getElementById('balance');
  const earnCoinsBtn = document.getElementById('earn-coins-btn');
  const tradeCoinsBtn = document.getElementById('trade-coins-btn');
  
  let userBalance = 0;

  // Firebase Auth State Listener
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      document.getElementById('coin-system').style.display = 'block';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';

      const userId = user.uid;
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Initialize user balance in Firestore if it doesn't exist
        await setDoc(userDocRef, { balance: 0 });
        userBalance = 0;
      } else {
        userBalance = userDoc.data().balance;
      }

      balanceElem.innerText = userBalance;
    } else {
      // No user is signed in
      document.getElementById('coin-system').style.display = 'none';
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
    }
  });

  // Login function
  loginBtn.addEventListener('click', () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully logged in
        console.log('User logged in:', userCredential.user);
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  });

  // Logout function
  logoutBtn.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  });

  // Earn HexCoins
  earnCoinsBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      userBalance += 10;  // Add 10 HexCoins
      await updateDoc(userDocRef, { balance: userBalance });
      balanceElem.innerText = userBalance;
    }
  });

  // Trade HexCoins
  tradeCoinsBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user && userBalance >= 10) {
      const userDocRef = doc(db, 'users', user.uid);
      userBalance -= 10;  // Trade 10 HexCoins
      await updateDoc(userDocRef, { balance: userBalance });
      balanceElem.innerText = userBalance;
      alert('Successfully traded 10 HexCoins!');
    } else {
      alert('Not enough HexCoins to trade!');
    }
  });
});
