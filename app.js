// Wait for DOMContentLoaded event to ensure the DOM and scripts are fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Make sure auth0 is accessible only after the SDK is loaded and DOM is ready
  if (typeof auth0 !== 'undefined') {
    // Initialize Auth0 only if the SDK is available
    const auth0Client = new auth0.WebAuth({
      domain: 'dev-njj4l7prjl50p7vh.us.auth0.com', // Okta domain from Auth0 setup
      clientID: '2U9J082LrHLhQk93AcT0JoWAMdXsLtOw',  // Client ID from Auth0 setup
      redirectUri: window.location.origin + '/index.html', // Redirect back after login
      responseType: 'token id_token',
      scope: 'openid profile email'  // Request necessary scopes
    });

    // Add event listener to login button
    document.getElementById('login-btn').addEventListener('click', () => {
      auth0Client.authorize(); // Redirect to Okta login page
    });

    // Parse hash from URL to handle login
    auth0Client.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ''; // Clear URL hash
        setSession(authResult);    // Set user session
        displayCoinSystem();       // Show coin management system
        showLogoutButton();        // Show logout button
      } else if (err) {
        console.error('Error parsing hash:', err);
      }
    });

    // Store user session
    function setSession(authResult) {
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      ));
      document.getElementById('login-btn').style.display = 'none';  // Hide login button
    }

    // Show the logout button and hide login
    function showLogoutButton() {
      document.getElementById('logout-btn').style.display = 'block';
      document.getElementById('logout-btn').addEventListener('click', logout);
    }

    // Logout function
    function logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      window.location.reload();
    }

    // Check if the user is already logged in
    function isAuthenticated() {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    // Show coin system if the user is logged in
    function displayCoinSystem() {
      if (isAuthenticated()) {
        document.getElementById('coin-system').style.display = 'block';
        updateBalance(); // Update user's HexCoin balance
      }
    }

    // Coin system: handle earning and trading HexCoins
    let userBalance = localStorage.getItem('hexCoins') || 0;

    function updateBalance() {
      document.getElementById('balance').innerText = userBalance;
      localStorage.setItem('hexCoins', userBalance);
    }

    document.getElementById('earn-coins-btn').addEventListener('click', () => {
      userBalance = parseInt(userBalance) + 10;  // Earn 10 HexCoins
      updateBalance();
    });

    document.getElementById('trade-coins-btn').addEventListener('click', () => {
      if (userBalance >= 10) {
        userBalance -= 10;  // Trade 10 HexCoins
        updateBalance();
        alert('Successfully traded 10 HexCoins!');
      } else {
        alert('Not enough coins to trade!');
      }
    });

  } else {
    console.error('Auth0 SDK not loaded');
  }

});
