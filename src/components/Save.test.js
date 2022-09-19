import Save from './Save';
import { render, screen, fireEvent } from '@testing-library/react';

// test use-case 2
test('when clicked, onClick-method is called', () => {
    const onClick = jest.fn();
    render(<Save onClick={onClick} />);
    fireEvent.click(screen.getByTestId("save"));
    expect(onClick).toHaveBeenCalledTimes(1);
});