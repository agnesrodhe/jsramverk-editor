import { render, screen } from '@testing-library/react';
import DropDown from './DropDown';
import Save from './Save';
import Create from './Create';

const faker = jest.fn();

// test use-case 1
test('renders skapa nytt-knappen', () => {
    render(<Create onClick={faker} />);
    const label = screen.getByText(/Skapa nytt/i);
    expect(label).toBeInTheDocument();
});

test('renders spara-knappen', () => {
    render(<Save onClick={faker} />);
    const label = screen.getByText(/Spara/i);
    expect(label).toBeInTheDocument();
});
