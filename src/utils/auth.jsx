export function saveAuthData(token, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }
   
  export function getToken() {
    return localStorage.getItem('token');
  }
   
  export function getRole() {
    return localStorage.getItem('role');
  }