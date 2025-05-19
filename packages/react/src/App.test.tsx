import '@testing-library/jest-dom';

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import App from './App';

describe('App', () => {
    it('should render', () => {
        const { getByText } = render(<App />);
        const title = getByText(/Alerta vermelho!/i);
        expect(title).toBeInTheDocument();
    });
});