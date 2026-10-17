/* GST / Tax calculator page. Runs only in the browser; nothing is stored or sent. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var out = $('gst-result');
  function num(id, label, min, max) {
    var raw = String($(id).value || '').trim();
    if (!raw) throw new Error('Please enter ' + label + '.');
    var n = Number(raw);
    if (!isFinite(n)) throw new Error(label + ' must be a number.');
    if (n < min || n > max) throw new Error(label + ' must be between ' + min + ' and ' + max + '.');
    return n;
  }
  function money(x) { return x.toLocaleString('en-US', { maximumFractionDigits: 2 }); }
  function calc() {
    try {
      var amount = num('gst-amount', 'amount', 0, 1e15);
      var rate = num('gst-rate', 'tax rate', 0, 1000);
      var mode = $('gst-mode').value;
      var net, tax, total;
      if (mode === 'add') { net = amount; tax = amount * rate / 100; total = net + tax; }
      else { total = amount; net = amount / (1 + rate / 100); tax = total - net; }
      out.replaceChildren();
      [ 'Amount without tax: ' + money(net), 'Tax (' + money(rate) + '%): ' + money(tax), 'Total with tax: ' + money(total) ]
        .forEach(function (line, i) { if (i) out.appendChild(document.createElement('br')); var s = document.createElement('span'); s.textContent = line; out.appendChild(s); });
      out.style.display = 'block';
    } catch (e) {
      out.textContent = e.message || 'Please check your input.';
      out.style.display = 'block';
    }
  }
  $('gst-btn').addEventListener('click', calc);
})();
