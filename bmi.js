/* BMI calculator page. Runs only in the browser; nothing is stored or sent. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var out = $('bmi-result');
  function num(id, label, min, max) {
    var raw = String($(id).value || '').trim();
    if (!raw) throw new Error('Please enter ' + label + '.');
    var n = Number(raw);
    if (!isFinite(n)) throw new Error(label + ' must be a number.');
    if (n < min || n > max) throw new Error(label + ' must be between ' + min + ' and ' + max + '.');
    return n;
  }
  function calc() {
    try {
      var w = num('bmi-weight', 'weight (kg)', 1, 1000);
      var h = num('bmi-height', 'height (cm)', 20, 300) / 100;
      var bmi = w / (h * h);
      var cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obesity range';
      out.replaceChildren();
      var a = document.createElement('span'); a.textContent = 'BMI: ' + bmi.toFixed(1);
      var br = document.createElement('br');
      var b = document.createElement('span'); b.textContent = 'Category: ' + cat;
      out.append(a, br, b);
      out.style.display = 'block';
    } catch (e) {
      out.textContent = e.message || 'Please check your input.';
      out.style.display = 'block';
    }
  }
  $('bmi-btn').addEventListener('click', calc);
})();
