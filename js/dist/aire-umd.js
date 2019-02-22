(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Aire = {})));
}(this, (function (exports) { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  Validator.registerMissedRuleValidator(function () {
    return true;
  }, '');

  var resolveElement = function resolveElement(target) {
    if ('string' === typeof target) {
      return document.querySelector(target);
    }

    return target;
  };

  var getData = function getData(form) {
    var formData = new FormData(form);
    var values = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        key = key.replace(/\[]$/, '');

        if (values[key]) {
          if (!(values[key] instanceof Array)) {
            values[key] = new Array(values[key]);
          }

          values[key].push(value);
        } else {
          values[key] = value;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return values;
  };

  var config = {
    'templates': {
      'error': {
        'prefix': '<li>',
        'suffix': '</li>'
      }
    },
    'classnames': {
      'none': {},
      'valid': {},
      'invalid': {}
    }
  };
  var configure = function configure(customConfig) {
    config = customConfig;
    console.log(config);
  }; // FIXME: This still needs major perf work
  // FIXME: We need to handle multiple values
  // FIXME: We should be able to apply some validation even when an item is not grouped

  var defaultRenderer = function defaultRenderer(_ref) {
    var form = _ref.form,
        errors = _ref.errors,
        data = _ref.data,
        refs = _ref.refs,
        touched = _ref.touched;
    var _config = config,
        templates = _config.templates,
        classnames = _config.classnames;
    Object.keys(data).forEach(function (name) {
      // Stop if we don't have refs to this field
      if (!(name in refs)) {
        return;
      }

      var fails = touched.has(name) && name in errors;
      var passes = touched.has(name) && !fails && name in data;

      if ('errors' in refs[name]) {
        if (passes) {
          refs[name].errors[0].classList.add('hidden');
          refs[name].errors[0].innerHTML = '';
        } else if (fails) {
          // TODO: Maybe hide help text
          refs[name].errors[0].classList.remove('hidden');
          refs[name].errors[0].innerHTML = errors[name].map(function (message) {
            return "".concat(templates.error.prefix).concat(message).concat(templates.error.suffix);
          }).join('');
        }
      }

      Object.entries(refs[name]).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            name = _ref3[0],
            elements = _ref3[1];

        elements.forEach(function (element) {
          if (name in classnames.valid) {
            if (passes) {
              var _element$classList;

              (_element$classList = element.classList).add.apply(_element$classList, _toConsumableArray(classnames.valid[name].split(' ')));
            } else {
              var _element$classList2;

              (_element$classList2 = element.classList).remove.apply(_element$classList2, _toConsumableArray(classnames.valid[name].split(' ')));
            }
          }

          if (name in classnames.invalid) {
            if (fails) {
              var _element$classList3;

              (_element$classList3 = element.classList).add.apply(_element$classList3, _toConsumableArray(classnames.invalid[name].split(' ')));
            } else {
              var _element$classList4;

              (_element$classList4 = element.classList).remove.apply(_element$classList4, _toConsumableArray(classnames.invalid[name].split(' ')));
            }
          }

          if (name in classnames.none) {
            if (!passes && !fails) {
              var _element$classList5;

              (_element$classList5 = element.classList).add.apply(_element$classList5, _toConsumableArray(classnames.none[name].split(' ')));
            } else {
              var _element$classList6;

              (_element$classList6 = element.classList).remove.apply(_element$classList6, _toConsumableArray(classnames.none[name].split(' ')));
            }
          }
        });
      });
    });
  };

  var renderer = defaultRenderer;
  var setRenderer = function setRenderer(customRenderer) {
    renderer = customRenderer;
  };
  var supported = 'undefined' !== typeof FormData && 'getAll' in FormData.prototype;
  var connect = function connect(target) {
    var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!supported) {
      return null;
    }

    var form = resolveElement(target);
    var refs = {};
    form.querySelectorAll('[data-aire-component]').forEach(function (element) {
      if ('aireFor' in element.dataset) {
        var parent = element.dataset.aireFor;
        var component = element.dataset.aireComponent;
        refs[parent] = refs[parent] || {};

        if (component in refs[parent]) {
          refs[parent][component].push(element);
        } else {
          refs[parent][component] = [element];
        }
      }
    });
    var validator;
    var connected = true;
    var touched = new Set();

    var touch = function touch(e) {
      var name = e.target.getAttribute('name');

      if (name) {
        touched.add(name.replace(/\[]$/, ''));
      }
    };

    var debounce;

    var run = function run(e) {
      if ('undefined' !== typeof e && 'target' in e) {
        touch(e);
      }

      var latestRun = 0;
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        validator = new Validator(getData(form), rules); // Because some validators may run async, we'll store a reference
        // to the run "id" so that we can cancel the callbacks if another
        // validation started before the callbacks were fired

        var activeRun = ++latestRun;

        var validated = function validated() {
          if (connected && activeRun === latestRun) {
            renderer({
              form: form,
              touched: touched,
              refs: refs,
              data: validator.input,
              errors: validator.errors.all()
            });
          }
        };

        validator.checkAsync(validated, validated);
      }, 250);
    };

    form.addEventListener('change', run, true);
    form.addEventListener('keyup', run, true);
    form.addEventListener('focus', touch, true);
    run();

    var disconnect = function disconnect() {
      connected = false;
      clearTimeout(debounce);
      form.removeEventListener('change', run);
      form.removeEventListener('keyup', run);
      form.removeEventListener('focus', touch);
    };

    return {
      get valid() {
        return 'undefined' !== typeof validator && 0 === Object.keys(validator.errors.all()).length;
      },

      run: run,
      disconnect: disconnect
    };
  };

  exports.configure = configure;
  exports.setRenderer = setRenderer;
  exports.supported = supported;
  exports.connect = connect;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
