import React from "react";

const Button: React.FC<{children: React.ReactNode}> = ({children}) => {
    return <button className="bg-blue-500 text-white p-2 rounded">{children}</button>;
};

export default Button;
