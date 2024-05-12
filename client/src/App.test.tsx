import React from 'react';
import { cleanup, render } from '@testing-library/react';
import App from './App';

describe('app', () => {

  test('initial test', () => {
    const container =  render(<App />);
    const { queryByTestId } = container;
    const app = queryByTestId('app');
    expect(app).toBeInTheDocument();

    // expect(container).toMatchSnapshot();
  });
});