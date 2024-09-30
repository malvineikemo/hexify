import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

// Firebase configuration (replace with your values)
const firebaseConfig = {
  apiKey: "AIzaSyBgUH6d_Ze1hfB5yTgFaVJtv8gMuGfmr90",
  authDomain: "hexify-f836f.firebaseapp.com",
  projectId: "hexify-f836f",
  storageBucket: "hexify-f836f.appspot.com",
  messagingSenderId: "633259472045",
  appId: "1:633259472045:web:19769365b151c0283b4224"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Auth0 client
const auth0 = new Auth0Client({
  domain: 'dev-njj4l7prjl50p7vh.us.auth0.com',
  client_id: '2U9J082LrHLhQk93AcT0JoWAMdXsLtOw',
  redirect_uri: window.location.origin
});

document.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const balanceElem = document.getElementById('balance');
  const earnCoinsBtn = document.getElementById('earn-coins-btn');
  const tradeCoinsBtn = document.getElementById('trade-coins-btn');

  let userId = '';
  let userBalance = 0;

  // Handle Auth0 authentication callback
  try {
    await auth0.handleRedirectCallback();
  } catch (err) {
    console.error('Error handling Auth0 redirect callback:', err);
  }

  // Check if the user is authenticated
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();
    userId = user.sub;

    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    document.getElementById('coin-system').style.display = 'block';

    // Retrieve the user's balance from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If the user doesn't exist, create a new user document with balance 0
      await setDoc(userDocRef, { balance: 0 });
      userBalance = 0;
    } else {
      userBalance = userDoc.data().balance;
    }

    // Display the user's balance
    balanceElem.innerText = userBalance;
  } else {
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    document.getElementById('coin-system').style.display = 'none';
  }

  // Login button event
  loginBtn.addEventListener('click', async () => {
    await auth0.loginWithRedirect();
  });

  // Logout button event
  logoutBtn.addEventListener('click', async () => {
    await auth0.logout({
      returnTo: window.location.origin
    });
  });

  // Earn HexCoins event
  earnCoinsBtn.addEventListener('click', async () => {
    try {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        userBalance += 10;  // Add 10 HexCoins
        await updateDoc(userDocRef, { balance: userBalance });
        balanceElem.innerText = userBalance;  // Update displayed balance
        console.log('Earned 10 HexCoins');
      } else {
        console.error('User ID not found');
      }
    } catch (error) {
      console.error('Error earning HexCoins:', error);
    }
  });

  // Trade HexCoins event
  tradeCoinsBtn.addEventListener('click', async () => {
    try {
      if (userId && userBalance >= 10) {
        const userDocRef = doc(db, 'users', userId);
        userBalance -= 10;  // Deduct 10 HexCoins
        await updateDoc(userDocRef, { balance: userBalance });
        balanceElem.innerText = userBalance;  // Update displayed balance
        alert('Successfully traded 10 HexCoins!');
      } else {
        alert('Not enough HexCoins to trade!');
        console.error('Insufficient balance or user ID not found');
      }
    } catch (error) {
      console.error('Error trading HexCoins:', error);
    }
  });
});
