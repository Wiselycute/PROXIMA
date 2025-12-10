import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Client-side authentication utilities
 */

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const isAdmin = () => {
  const user = getUser();
  console.log('Checking admin status:', user); // Debug log
  return user?.role === 'admin';
};

export const isMember = () => {
  const user = getUser();
  return user?.role === 'member';
};

export const hasRole = (role) => {
  const user = getUser();
  return user?.role === role;
};
