// Simulating user management in localStorage
document.getElementById('update-balance-btn').addEventListener('click', () => {
    const userId = document.getElementById('user-id').value;
    const newBalance = document.getElementById('new-balance').value;
    
    // Save user balance in local storage (for testing purposes)
    localStorage.setItem(`${userId}_hexCoins`, newBalance);
    alert(`Balance updated for User ${userId}`);
  });