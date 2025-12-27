import React from 'react';

export const LeafIconSolid = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className || "w-6 h-6"}
    >
        <path d="M11.25 6.195a2.25 2.25 0 0 1 3.56-1.072.75.75 0 0 1 .593 1.344 3.75 3.75 0 0 0 6.48 2.472.75.75 0 0 1 1.343.593 2.25 2.25 0 0 1-1.072 3.56 3.75 3.75 0 0 0-2.472 6.48.75.75 0 0 1-.593 1.343 2.25 2.25 0 0 1-3.56-1.072 3.75 3.75 0 0 0-6.48-2.472.75.75 0 0 1-1.343-.593 2.25 2.25 0 0 1 1.072-3.56 3.75 3.75 0 0 0 2.472-6.48ZM9.163 3.84a.75.75 0 0 1 1.057.24l2.5 3.5a.75.75 0 0 1-.951 1.137l-2.5-3.5a.75.75 0 0 1-.106-1.377Z" />
        <path d="M12.75 20.664a.75.75 0 0 1-1.057-.24l-2.5-3.5a.75.75 0 0 1 .951-1.137l2.5 3.5a.75.75 0 0 1 .106 1.377Z" />
    </svg>
);

export const UploadIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className || "w-10 h-10"}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
        />
    </svg>
);


export const SpinnerIcon = ({ className }: { className?: string }) => (
    <svg
        className={className || "animate-spin h-5 w-5 text-white"}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);
