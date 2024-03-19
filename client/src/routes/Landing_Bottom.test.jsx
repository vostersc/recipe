import {fireEvent, render, screen} from '@testing-library/react';

import Landing_Bottom from "./Landing_Bottom";

//in the future some of these tests will be moved into the child components they are testing...
describe('Landing_Bottom', () => {
    const selectDropdownItem = vi.fn();
    const runAddToCart = vi.fn();
    const groceryLists = [{uid: '999jwww', name: 'Costco'}, {uid: '3290j9s', name: 'Harmons'}];
    const groceryItems = [['vital wheat gluten', ''], ['turkey bacon', ''], ['butter - kerrygold', ''], ['meatballs', ''], ['sharp white cheddar', '']];
    const atcState = {percentComplete: 0, error: false, off: null, name: ''};
    function buildLanding(groceryLists, groceryItems, atcState = atcState){
        return (
            <Landing_Bottom
                activeDropdownItem={{name: ''}}
                limitDisplay={10} //max grocery item characters
                groceryLists={groceryLists}
                groceryItems={groceryItems}
                atcState={atcState}
                selectDropdownItem={selectDropdownItem}
                runAddToCart={runAddToCart}
            />
        );
    };

    it('Hides add to cart button when loading.', () => {
        const customAtcState = {percentComplete: 50, error: false, off: null, name: ''};
        render(buildLanding(groceryLists, groceryItems, customAtcState));
        const renderedItem = screen.queryByText('Load This Cart');   
        expect(renderedItem).toBeNull();
        // screen.debug();
    });

    it('Hides add to cart button when there is a cart complete error.', () => {
        const customAtcState = {percentComplete: 50, error: true, off: null, name: ''};
        render(buildLanding(groceryLists, groceryItems, customAtcState));
        const renderedItem = screen.queryByText('Load This Cart');   
        expect(renderedItem).toBeNull();
    });

    it('Hides add to cart button when there are no items.', () => {
        const customAtcState = {percentComplete: 0, error: false, off: null, name: ''};
        render(buildLanding(groceryLists, [], customAtcState));
        const renderedItem = screen.queryByText('Load This Cart');   
        expect(renderedItem).toBeNull();
    });

    it('Hides add to cart button when all items are on display.', () => {
        const customAtcState = {percentComplete: 0, error: false, off: null, name: ''};
        render(buildLanding(groceryLists, groceryItems, customAtcState));
        const renderedItem = screen.queryByText('Load This Cart');   
        expect(renderedItem).toBeNull();
    });

    it('Limits max display text length of a grocery item.', () => {
        render(buildLanding(groceryLists, groceryItems, atcState));
        const expectedLimitedText = 'turkey';
        const renderedItem = screen.getByText(expectedLimitedText);
        expect(renderedItem).toBeTruthy();
    });

    it('Handles no cards correctly.', () => {
        render(buildLanding(groceryLists, [], atcState));
        const recipeItemOption = screen.queryByText('turkey');
        const recipeItemDefault = screen.getByText('No items found.');

        expect(recipeItemOption).toBeNull();
        expect(recipeItemDefault).toBeTruthy();
    });

    it('Displays the correct quantity of cards.', () => {
        render(buildLanding([], groceryItems, atcState));

        const allListItems = screen.queryAllByRole('option');
        expect(allListItems.length).toBe(5);
    });

    it('Displays dropdown with correct options.', () => {
        render(buildLanding(groceryLists, [], atcState));
        const dropDownItem0 = screen.getByText('View Options');
        const dropDownItem1 = screen.getByText('Costco');
        const dropDownItem2 = screen.getByText('Harmons');

        expect(dropDownItem0).toBeTruthy();
        expect(dropDownItem1).toBeTruthy();
        expect(dropDownItem2).toBeTruthy();
    });

    it('Handles empty and unselected dropdown.', () => {
        render(buildLanding([], groceryItems, atcState));
        const emptyDropDown = screen.getByText('View Options');
        expect(emptyDropDown).toBeTruthy(); 
    });

    it('Handles dropdown click.', () => {
        render(buildLanding(groceryLists, groceryItems, atcState));

        const dropDownDefault = screen.getByText('View Options');
        expect(dropDownDefault).toBeTruthy();

        const expectedDisplayOptionText = groceryLists[0].name;
        const dropDownOption = screen.getByText(expectedDisplayOptionText);
        fireEvent.click(dropDownOption);
        expect(selectDropdownItem).toHaveBeenCalledTimes(1);

        const dropDownDefaultAfter = screen.queryByText('View Options');
        expect(dropDownDefaultAfter).toBeNull();
    });
});