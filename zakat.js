/* Zakat calculator (2.5% estimate). Runs only in the browser; nothing is stored or sent. */
(function () {
  var NISAB_GOLD_G = 87.48;     /* commonly used gold nisab, grams */
  var NISAB_SILVER_G = 612.36;  /* commonly used silver nisab, grams */
  var $ = function (id) { return document.getElementById(id); };
  var out = $('zakat-result');

  function num(id, label, allowEmpty) {
    var raw = String($(id).value || '').trim();
    if (!raw) { if (allowEmpty) return 0; throw new Error('Please enter ' + label + '.'); }
    var n = Number(raw);
    if (!isFinite(n)) throw new Error(label + ' must be a number.');
    if (n < 0) throw new Error(label + ' cannot be negative.');
    return n;
  }
  function fmt(n) { return n.toLocaleString('en-US', { maximumFractionDigits: 2 }); }

  function calc() {
    try {
      var wealth = num('zakat-wealth', 'your total zakatable wealth');
      var debts = num('zakat-debts', 'debts (enter 0 if none)', true);
      var basis = $('zakat-basis').value;                 /* 'silver' or 'gold' */
      var price = num(basis === 'gold' ? 'zakat-gold' : 'zakat-silver', 'the ' + basis + ' price per gram');
      if (price <= 0) throw new Error('The ' + basis + ' price must be more than 0.');
      var nisab = price * (basis === 'gold' ? NISAB_GOLD_G : NISAB_SILVER_G);
      var net = wealth - debts;
      var lines;
      if (net < nisab) {
        lines = 'Net wealth: ' + fmt(net) + '<br>Nisab (' + basis + '): ' + fmt(nisab) +
                '<br>Zakat is not due, because net wealth is below nisab for one lunar year.';
      } else {
        var z = net * 0.025;
        lines = 'Net wealth: ' + fmt(net) + '<br>Nisab (' + basis + '): ' + fmt(nisab) +
                '<br><strong>Estimated Zakat (2.5%): ' + fmt(z) + '</strong>';
      }
      out.replaceChildren();
      lines.split('<br>').forEach(function (line, i) {
        if (i) out.appendChild(document.createElement('br'));
        var span = document.createElement('span');
        span.textContent = line.replace(/<\/?strong>/g, '');
        if (/<strong>/.test(line)) span.style.fontWeight = '700';
        out.appendChild(span);
      });
      out.style.display = 'block';
    } catch (e) {
      out.textContent = e.message || 'Please check your input.';
      out.style.display = 'block';
    }
  }
  function syncBasis() {
    var g = $('zakat-basis').value === 'gold';
    $('zakat-gold-group').hidden = !g;
    $('zakat-silver-group').hidden = g;
  }
  $('zakat-basis').addEventListener('change', syncBasis);
  $('zakat-btn').addEventListener('click', calc);
  syncBasis();
})();
