'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const React = require('react');

const Button = ({ children }) => {
  return React.createElement('button', {
    style: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
    },
  }, children);
};

exports.Button = Button;
