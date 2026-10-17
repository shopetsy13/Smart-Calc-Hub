/* Loan EMI calculator page. Runs only in the browser; nothing is stored or sent. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var out = $('emi-result');
  function num(id, label, min, max) {
    var raw = String($(id).value || '').trim();
    if (!raw) throw new Error('Please enter ' + label + '.');
    var n = Number(raw);
    if (!isFinite(n)) throw new Error(label + ' must be a number.');
    if (n < min || n > max) throw new Error(label + ' must be between ' + min + ' and ' + max + '.');
    return n;
  }
  function fmt(n) { return n.toLocaleString('en-US', { maximumFractionDigits: 2 }); }
  function calc() {
    try {
      var p = num('emi-amount', 'loan amount', 0.01, 1e15);
      var rate = num('emi-rate', 'annual interest rate', 0, 1000);
      var years = num('emi-years', 'tenure in years', 0.01, 100);
      var months = Math.round(years * 12);
      if (months < 1) throw new Error('Tenure must be at least one month.');
      var r = rate / 1200;
      var emi = r === 0 ? p / months : p * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
      var total = emi * months;
      out.replaceChildren();
      [ 'Monthly EMI: ' + fmt(emi), 'Total payment: ' + fmt(total), 'Total interest: ' + fmt(total - p), 'Installments: ' + months ]
        .forEach(function (line, i) { if (i) out.appendChild(document.createElement('br')); var s = document.createElement('span'); s.textContent = line; out.appendChild(s); });
      out.style.display = 'block';
    } catch (e) {
      out.textContent = e.message || 'Please check your input.';
      out.style.display = 'block';
    }
  }
  $('emi-btn').addEventListener('click', calc);
})();
