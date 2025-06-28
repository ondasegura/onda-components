declare module 'react' {
    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        color: 'primary' | 'standard' | 'default';
    }

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        color: 'primary' | 'standard' | 'default';
    }
}

export { };