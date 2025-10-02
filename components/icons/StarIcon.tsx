import React from 'react';

interface StarIconProps extends React.SVGProps<SVGSVGElement> {
    filled?: boolean;
}

export const StarIcon: React.FC<StarIconProps> = ({ filled = false, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.321l5.522.801a.563.563 0 0 1 .312.956l-4.02 3.918a.563.563 0 0 0-.162.562l.94 5.501a.563.563 0 0 1-.816.593l-4.898-2.576a.563.563 0 0 0-.522 0l-4.898 2.576a.563.563 0 0 1-.816-.593l.94-5.501a.563.563 0 0 0-.162-.562l-4.02-3.918a.563.563 0 0 1 .312-.956l5.522-.801a.563.563 0 0 0 .475-.321L11.48 3.5Z" />
    </svg>
);
