import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import Game from './Game.tsx';

const root = document.getElementById('root')!;

createRoot(root).render(
    <StrictMode>
        <Game />
    </StrictMode>
);
