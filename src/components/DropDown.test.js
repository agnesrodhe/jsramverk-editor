import DropDown from "./DropDown";
import { render, screen, fireEvent } from '@testing-library/react';

test('test dropdown', () => {
    const onChange = jest.fn();
    const docs = [{
            "name": "Dokument 1",
            "text": "Dokumenttext 1"
        },
        {
            "name": "Dokument 2",
            "text": "Dokumenttext 2"
        }]
    const { getAllByTestId } =     render(<DropDown docs={docs} onChange={onChange}/>);
    let options = getAllByTestId('select');
    expect(options).toHaveLength(2);
});
