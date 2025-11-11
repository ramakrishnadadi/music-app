import React, { useState } from "react";

const Account = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Logging in..." : "Registering...", formData);
    alert(isLogin ? "Login Successful" : "Account Created");
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} style={styles.input} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
        <button type="submit" style={styles.button}>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p style={styles.toggle} onClick={toggleForm}>
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </p>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' },
  input: { width: '200px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { background: '#111', color: '#fff', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
  toggle: { color: '#007bff', cursor: 'pointer', marginTop: '10px' }
};

export default Account;