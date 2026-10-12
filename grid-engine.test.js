const assert=require('node:assert/strict');const g=require('./grid-engine.js');let n=0;
function t(name,fn){fn();n++;console.log('PASS '+n+' '+name);}
t('example tariff A',()=>assert.equal(g.annualCost(15000,{rate:24,base:180}),3780));
t('example tariff B',()=>assert.equal(g.annualCost(15000,{rate:21,base:150}),3300));
t('example savings',()=>assert.equal(g.compare(3780,3300).savings,480));
t('dual HT NT same price',()=>assert.equal(g.dualCost({ht:7879.5,nt:8203.7},{htRate:24.11,ntRate:24.11,base:176.87}),4054.56));
t('dual HT NT different prices',()=>assert.equal(g.dualCost({ht:100,nt:200},{htRate:30,ntRate:20,base:100}),170));
t('household current projection',()=>assert.equal(g.annualCost(5544.99,{rate:28.18,base:235.25}),1797.83));
t('heat settlement is debt',()=>assert.equal(g.settle(4217.29,4140),-77.29));
t('home settlement is credit',()=>assert.equal(g.settle(1899.69,3300),1400.31));
t('historical invoice sum',()=>assert.equal(g.case001().historicCost,6116.98));
t('combined consumption',()=>assert.equal(g.case001().usage,21628.19));
t('termination dates kept separate',()=>assert.notEqual(g.case001().heat.termination,g.case001().home.termination));
t('unverified offer fail closed',()=>assert.equal(g.offerStatus({rate:19}), 'NOT_VERIFIED'));
t('negative values rejected',()=>assert.throws(()=>g.annualCost(-1,{rate:20,base:10})));
t('invalid dual register rejected',()=>assert.throws(()=>g.dualCost({ht:NaN,nt:0},{htRate:20,ntRate:20,base:0})));
t('missing portfolio rejected',()=>assert.throws(()=>g.portfolio([])));
t('case stays NOT_VERIFIED',()=>assert.equal(g.case001().offerStatus,'NOT_VERIFIED'));
console.log(n+' / '+n+' PASS');