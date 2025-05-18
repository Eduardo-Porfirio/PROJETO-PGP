import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Button({ children, type = 'button', className, onClick }: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 bg-blue-700 text-white rounded-md ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}