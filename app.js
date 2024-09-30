import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

const db = getFirestore();

// Initialize Auth0 Client
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

  // Check for existing Auth0 session
  try {
    await auth0.handleRedirectCallback();
  } catch (err) {
    console.log('Auth0 error:', err);
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();
    userId = user.sub;

    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    document.getElementById('coin-system').style.display = 'block';

    // Load the user's balance from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // If user doesn't exist in Firestore, create a new document with balance 0
      await setDoc(userDocRef, { balance: 0 });
      userBalance = 0;
    } else {
      userBalance = userDoc.data().balance;
    }

    balanceElem.innerText = userBalance;
  } else {
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    document.getElementById('coin-system').style.display = 'none';
  }

  // Login button click event
  loginBtn.addEventListener('click', async () => {
    await auth0.loginWithRedirect();
  });

  // Logout button click event
  logoutBtn.addEventListener('click', async () => {
    await auth0.logout({ returnTo: window.location.origin });
  });

  // Earn HexCoins
  earnCoinsBtn.addEventListener('click', async () => {
    try {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        userBalance += 10;  // Add 10 HexCoins
        await updateDoc(userDocRef, { balance: userBalance });
        balanceElem.innerText = userBalance;
        console.log('Earned 10 HexCoins');
      } else {
        console.error('User ID not found');
      }
    } catch (error) {
      console.error('Error earning HexCoins:', error);
    }
  });

  // Trade HexCoins
  tradeCoinsBtn.addEventListener('click', async () => {
    try {
      if (userId && userBalance >= 10) {
        const userDocRef = doc(db, 'users', userId);
        userBalance -= 10;  // Trade 10 HexCoins
        await updateDoc(userDocRef, { balance: userBalance });
        balanceElem.innerText = userBalance;
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
