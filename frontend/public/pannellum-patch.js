/* Parche de seguridad y saneamiento para Pannellum (Cargado DESPUES de pannellum.js por index.html).
 * - Protege contra opciones nulas.
 * - Sanea URLs para evitar XSS en CSS.
 */
(function () {
  try {
    if (
      window.pannellum &&
      typeof window.__pannellumNormalizeOptions === 'function' &&
      !window.pannellum._sanitizePatchedV2
    ) {
      window.pannellum.sanitizeURL = window.__pannellumSanitize;
      window.pannellum.sanitizeURLForCss = function (u) {
        var s = window.__pannellumSanitize(u);
        return s ? 'url("' + s + '")' : '';
      };
      var Original = window.pannellum.viewer;
      var Patched = function (container, opts) {
        return Original.call(
          window.pannellum,
          container,
          window.__pannellumNormalizeOptions(opts || {})
        );
      };
      Patched.prototype = Original.prototype;
      Object.keys(Original).forEach(function (k) {
        Patched[k] = Original[k];
      });
      window.pannellum.viewer = Patched;
      window.pannellum._sanitizePatchedV2 = true;
    }
  } catch (e) {}
})();
