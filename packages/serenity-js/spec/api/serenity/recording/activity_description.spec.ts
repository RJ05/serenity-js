import { given } from 'mocha-testdata';

import { describeAs } from '../../../../src/serenity/recording/activity_description';
import { Actor, PerformsTasks, Task } from '../../../../src/serenity/screenplay';

import expect = require('../../../expect');

describe('Description of an Activity', () => {

    class PayWithCreditCard implements Task {
        static number(creditCardNumber: string) {
            return new PayWithCreditCard(creditCardNumber);
        }

        constructor(private cardNumber: string, private expiryDate?: string[]) {}

        performAs(actor: PerformsTasks): Promise<void> {
            return actor.attemptsTo(
                // interact with the application to input the data
            );
        }

        toString = () => describeAs('#actor pays with a credit card ending #lastFourDigits', this);

        private lastFourDigits = () => this.cardNumber.slice(-4);
    }

    given(
        [ describeAs('{1}, {0}; age: {2}', 'John', 'Smith', 47),           'Smith, John; age: 47'      ],
        [ describeAs('{0} selects a product',    Actor.named('Emma')),     'Emma selects a product'    ],
        [ describeAs('#actor selects a product', Actor.named('Emma')),     'Emma selects a product'    ],
        [ describeAs('#first #last', { first: 'Jan', last: 'Molak' }),     'Jan Molak'                 ],
        [ describeAs('#first #last', { last: 'Bond' }),                    '#first Bond'               ],
        [ describeAs('products: #list', { list: ['apples', 'oranges'] }),  'products: apples, oranges' ],
    ).
    it ('can be parametrised', (result, expected) => expect(result).to.equal(expected));

    it ('can include the properties of an Activity', () => {

        const activity = PayWithCreditCard.number('4111 1111 1111 1234');

        expect(activity.toString()).to.equal('#actor pays with a credit card ending 1234');
    });

    it ('interpolates field tokens before taking argument tokens into consideration', () => {
        const activity = {
            products: () => ['apples', 'oranges'],
            performAs: (actor: PerformsTasks) => actor.attemptsTo(),
            toString: () => describeAs('{0} adds #products to the basket', activity),
        };

        expect(activity.toString()).to.equal('{0} adds apples, oranges to the basket');
    });

});
