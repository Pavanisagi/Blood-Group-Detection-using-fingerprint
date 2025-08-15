import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // Add your test assertions here
  });
});
