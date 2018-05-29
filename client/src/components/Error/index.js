import React from 'react';

const Error = ({ error }) => (
  error ? <span className="text-danger">{ error }</span> : null
)

export default Error;