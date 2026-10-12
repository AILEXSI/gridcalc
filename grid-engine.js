/* AISI GRID v0.2 — pure, dependency-free calculations. No network or banking operations. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.GridEngine=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const round=n=>Math.round((n+Number.EPSILON)*100)/100;
  function nonnegative(n,label){if(typeof n!=='number'||!Number.isFinite(n)||n<0)throw Error('Invalid '+label);return n;}
  function annualCost(usage,tariff){
    nonnegative(usage,'usage');if(!tariff||typeof tariff!=='object')throw Error('Invalid tariff');
    return round(usage*nonnegative(tariff.rate,'rate')/100+nonnegative(tariff.base,'base'));
  }
  function dualCost(meter,tariff){
    if(!meter||!tariff)throw Error('Missing meter or tariff');
    const ht=nonnegative(meter.ht,'HT'),nt=nonnegative(meter.nt,'NT');
    return round(ht*nonnegative(tariff.htRate,'HT rate')/100+nt*nonnegative(tariff.ntRate,'NT rate')/100+nonnegative(tariff.base,'base'));
  }
  function settle(invoice,paid){return round(nonnegative(paid,'paid')-nonnegative(invoice,'invoice'));}
  function compare(current,alternative){nonnegative(current,'current cost');nonnegative(alternative,'alternative cost');return {current:round(current),alternative:round(alternative),savings:round(current-alternative),monthly:round((current-alternative)/12)};}
  function portfolio(sites){if(!Array.isArray(sites)||!sites.length)throw Error('No sites');return round(sites.reduce((s,site)=>s+nonnegative(site,'site cost'),0));}
  function offerStatus(_offer){return 'NOT_VERIFIED';} // Client-supplied metadata cannot prove external offer verification.
  const CASE001=Object.freeze({
    heat:{ht:7879.50,nt:8203.70,invoice:4217.29,paid:4140.00,rate:24.11,base:176.87,termination:'2027-04-28'},
    home:{kwh:5544.99,invoice:1899.69,paid:3300.00,rate:28.18,base:235.25,termination:'2027-05-31'}
  });
  function case001(){
    const h=CASE001.heat,o=CASE001.home;
    const heatCurrent=dualCost(h,{htRate:h.rate,ntRate:h.rate,base:h.base});
    const homeCurrent=annualCost(o.kwh,{rate:o.rate,base:o.base});
    return {usage:round(h.ht+h.nt+o.kwh),historicCost:portfolio([h.invoice,o.invoice]),
      heat:{usage:round(h.ht+h.nt),historicCost:h.invoice,settlement:settle(h.invoice,h.paid),currentProjection:heatCurrent,termination:h.termination},
      home:{usage:o.kwh,historicCost:o.invoice,settlement:settle(o.invoice,o.paid),currentProjection:homeCurrent,termination:o.termination},
      currentProjection:portfolio([heatCurrent,homeCurrent]),offerStatus:'NOT_VERIFIED'};
  }
  return {round,annualCost,dualCost,settle,compare,portfolio,offerStatus,CASE001,case001};
});