function calculate(kwh,a,b){const cost=t=>kwh*t.rate/100+t.base;const current=cost(a),alternative=cost(b);return {current,alternative,savings:current-alternative};}
if(typeof module!=='undefined')module.exports={calculate};
