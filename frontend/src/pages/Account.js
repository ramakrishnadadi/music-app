import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let response;
      if (isLogin) {
        response = await api.post('/auth/login', { email, password });
      } else {
        response = await api.post('/auth/register', { name, email, password });
      }
      localStorage.setItem('token', response.data.token);
      const profileResponse = await api.get('/profile');
      setUser(profileResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="account-page">
      <form onSubmit={handleSubmit} className="account-form">
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <p className="toggle-form" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default Account;