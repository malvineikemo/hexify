// Initialize Auth0
const auth0 = new auth0.WebAuth({
    domain: 'YOUR_OKTA_DOMAIN', // Okta domain from Auth0 setup
    clientID: 'YOUR_CLIENT_ID',  // Client ID from Auth0 setup
    redirectUri: window.location.href, // Redirect after login
    responseType: 'token id_token',
    scope: 'openid profile'
  });
  
  document.getElementById('login-btn').addEventListener('click', () => {
    auth0.authorize();
  });
  
  // Handle Authentication Response
  auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      setSession(authResult);
      document.getElementById('content').innerHTML = `<p>Welcome back!</p>
        <button id="logout-btn" class="btn btn-danger">Logout</button>`;
      document.getElementById('logout-btn').addEventListener('click', logout);
    } else if (err) {
      console.log(err);
    }
  });
  
  function setSession(authResult) {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }
  
  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    window.location.reload();
  }

  let userBalance = localStorage.getItem('hexCoins') || 0;

  function updateBalance() {
    document.getElementById('balance').innerText = userBalance;
    localStorage.setItem('hexCoins', userBalance);
  }
  
  document.getElementById('earn-coins-btn').addEventListener('click', () => {
    userBalance = parseInt(userBalance) + 10; // Earn 10 coins
    updateBalance();
  });
  
  document.getElementById('trade-coins-btn').addEventListener('click', () => {
    if (userBalance >= 10) {
      userBalance -= 10; // Trade 10 coins
      updateBalance();
      alert('Successfully traded 10 HexCoins!');
    } else {
      alert('Not enough coins to trade!');
    }
  });
  
  function displayCoinSystem() {
    document.getElementById('coin-system').style.display = 'block';
    updateBalance();
  }