import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'customer'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/users/register', form);
    alert('User registered!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
      <select onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="customer">Customer</option>
        <option value="artisan">Artisan</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}