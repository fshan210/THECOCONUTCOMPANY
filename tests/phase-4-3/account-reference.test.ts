import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountDate, accountMoney, orderStatusLabel, orderStep } from '../../lib/account/display';
import { isAccountRoute } from '../../lib/account/routes';
test('account boundary only captures account routes and descendants',()=>{
 for(const path of ['/account','/account/security','/orders/history','/orders/123','/profile','/wishlist','/saved-recipes'])assert.equal(isAccountRoute(path),true,path);
 for(const path of ['/','/about','/shop','/recipes','/sustainability','/journal','/login','/register','/accounting','/orders-archive'])assert.equal(isAccountRoute(path),false,path);
});
test('unknown order states never look delivered or paid',()=>{assert.equal(orderStatusLabel('NOT_IMPLEMENTED'),'Update pending');assert.equal(orderStep('NOT_IMPLEMENTED'),-1);assert.equal(orderStep('CANCELLED'),-1);assert.equal(orderStep('DELIVERED'),4);assert.equal(orderStatusLabel('PENDING_PAYMENT'),'Awaiting payment');});
test('absent and malformed money and dates remain unknown, not fabricated',()=>{assert.equal(accountDate('bad date'),'Date unavailable');assert.equal(accountDate(),'Date unavailable');assert.equal(accountMoney(),'Total unavailable');assert.equal(accountMoney(NaN),'Total unavailable');assert.equal(accountMoney(0),'₹0.00');assert.equal(accountMoney(500,'bad currency'),'Total unavailable');});
