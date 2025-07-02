declare module 'react' {
    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        color: 'primary' | 'standard' | 'default' | 'basic';
    }

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        color: 'primary' | 'standard' | 'default' | 'basic';
    }
}

export { };