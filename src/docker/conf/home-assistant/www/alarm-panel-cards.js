"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i5 = decorators.length - 1, decorator; i5 >= 0; i5--)
      if (decorator = decorators[i5])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };

  // src/ui/node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t4, e5, o5) {
      if (this._$cssResult$ = true, o5 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4, this.t = e5;
    }
    get styleSheet() {
      let t4 = this.o;
      const s3 = this.t;
      if (e && void 0 === t4) {
        const e5 = void 0 !== s3 && 1 === s3.length;
        e5 && (t4 = o.get(s3)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s3, t4));
      }
      return t4;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
  var i = (t4, ...e5) => {
    const o5 = 1 === t4.length ? t4[0] : e5.reduce((e6, s3, o6) => e6 + ((t5) => {
      if (true === t5._$cssResult$) return t5.cssText;
      if ("number" == typeof t5) return t5;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s3) + t4[o6 + 1], t4[0]);
    return new n(o5, t4, s);
  };
  var S = (s3, o5) => {
    if (e) s3.adoptedStyleSheets = o5.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
    else for (const e5 of o5) {
      const o6 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o6.setAttribute("nonce", n5), o6.textContent = e5.cssText, s3.appendChild(o6);
    }
  };
  var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const s3 of t5.cssRules) e5 += s3.cssText;
    return r(e5);
  })(t4) : t4;

  // src/ui/node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t4, s3) => t4;
  var u = { toAttribute(t4, s3) {
    switch (s3) {
      case Boolean:
        t4 = t4 ? l : null;
        break;
      case Object:
      case Array:
        t4 = null == t4 ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, s3) {
    let i5 = t4;
    switch (s3) {
      case Boolean:
        i5 = null !== t4;
        break;
      case Number:
        i5 = null === t4 ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          i5 = JSON.parse(t4);
        } catch (t5) {
          i5 = null;
        }
    }
    return i5;
  } };
  var f = (t4, s3) => !i2(t4, s3);
  var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var b = class extends HTMLElement {
    static addInitializer(t4) {
      this._$Ei(), (this.l ??= []).push(t4);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t4, s3 = y) {
      if (s3.state && (s3.attribute = false), this._$Ei(), this.elementProperties.set(t4, s3), !s3.noAccessor) {
        const i5 = Symbol(), r7 = this.getPropertyDescriptor(t4, i5, s3);
        void 0 !== r7 && e2(this.prototype, t4, r7);
      }
    }
    static getPropertyDescriptor(t4, s3, i5) {
      const { get: e5, set: h3 } = r2(this.prototype, t4) ?? { get() {
        return this[s3];
      }, set(t5) {
        this[s3] = t5;
      } };
      return { get() {
        return e5?.call(this);
      }, set(s4) {
        const r7 = e5?.call(this);
        h3.call(this, s4), this.requestUpdate(t4, r7, i5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) ?? y;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t4 = n2(this);
      t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t5 = this.properties, s3 = [...h(t5), ...o2(t5)];
        for (const i5 of s3) this.createProperty(i5, t5[i5]);
      }
      const t4 = this[Symbol.metadata];
      if (null !== t4) {
        const s3 = litPropertyMetadata.get(t4);
        if (void 0 !== s3) for (const [t5, i5] of s3) this.elementProperties.set(t5, i5);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t5, s3] of this.elementProperties) {
        const i5 = this._$Eu(t5, s3);
        void 0 !== i5 && this._$Eh.set(i5, t5);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s3) {
      const i5 = [];
      if (Array.isArray(s3)) {
        const e5 = new Set(s3.flat(1 / 0).reverse());
        for (const s4 of e5) i5.unshift(c(s4));
      } else void 0 !== s3 && i5.push(c(s3));
      return i5;
    }
    static _$Eu(t4, s3) {
      const i5 = s3.attribute;
      return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
    }
    addController(t4) {
      (this._$EO ??= /* @__PURE__ */ new Set()).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
    }
    removeController(t4) {
      this._$EO?.delete(t4);
    }
    _$E_() {
      const t4 = /* @__PURE__ */ new Map(), s3 = this.constructor.elementProperties;
      for (const i5 of s3.keys()) this.hasOwnProperty(i5) && (t4.set(i5, this[i5]), delete this[i5]);
      t4.size > 0 && (this._$Ep = t4);
    }
    createRenderRoot() {
      const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t4, this.constructor.elementStyles), t4;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t4) => t4.hostDisconnected?.());
    }
    attributeChangedCallback(t4, s3, i5) {
      this._$AK(t4, i5);
    }
    _$EC(t4, s3) {
      const i5 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i5);
      if (void 0 !== e5 && true === i5.reflect) {
        const r7 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s3, i5.type);
        this._$Em = t4, null == r7 ? this.removeAttribute(e5) : this.setAttribute(e5, r7), this._$Em = null;
      }
    }
    _$AK(t4, s3) {
      const i5 = this.constructor, e5 = i5._$Eh.get(t4);
      if (void 0 !== e5 && this._$Em !== e5) {
        const t5 = i5.getPropertyOptions(e5), r7 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
        this._$Em = e5, this[e5] = r7.fromAttribute(s3, t5.type), this._$Em = null;
      }
    }
    requestUpdate(t4, s3, i5) {
      if (void 0 !== t4) {
        if (i5 ??= this.constructor.getPropertyOptions(t4), !(i5.hasChanged ?? f)(this[t4], s3)) return;
        this.P(t4, s3, i5);
      }
      false === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(t4, s3, i5) {
      this._$AL.has(t4) || this._$AL.set(t4, s3), true === i5.reflect && this._$Em !== t4 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t4);
    }
    async _$ET() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return null != t4 && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t6, s4] of this._$Ep) this[t6] = s4;
          this._$Ep = void 0;
        }
        const t5 = this.constructor.elementProperties;
        if (t5.size > 0) for (const [s4, i5] of t5) true !== i5.wrapped || this._$AL.has(s4) || void 0 === this[s4] || this.P(s4, this[s4], i5);
      }
      let t4 = false;
      const s3 = this._$AL;
      try {
        t4 = this.shouldUpdate(s3), t4 ? (this.willUpdate(s3), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s3)) : this._$EU();
      } catch (s4) {
        throw t4 = false, this._$EU(), s4;
      }
      t4 && this._$AE(s3);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$EU() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$Ej &&= this._$Ej.forEach((t5) => this._$EC(t5, this[t5])), this._$EU();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.4");

  // src/ui/node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
  var a2 = Array.isArray;
  var u2 = (t4) => a2(t4) || "function" == typeof t4?.[Symbol.iterator];
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t4) => (i5, ...s3) => ({ _$litType$: t4, strings: i5, values: s3 });
  var x = y2(1);
  var b2 = y2(2);
  var w = y2(3);
  var T = Symbol.for("lit-noChange");
  var E = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129);
  function P(t4, i5) {
    if (!a2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s2 ? s2.createHTML(i5) : i5;
  }
  var V = (t4, i5) => {
    const s3 = t4.length - 1, o5 = [];
    let r7, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = f2;
    for (let i6 = 0; i6 < s3; i6++) {
      const s4 = t4[i6];
      let a3, u3, d3 = -1, y3 = 0;
      for (; y3 < s4.length && (c4.lastIndex = y3, u3 = c4.exec(s4), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r7 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r7 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r7 = void 0);
      const x2 = c4 === m && t4[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s4 + n3 : d3 >= 0 ? (o5.push(a3), s4.slice(0, d3) + e3 + s4.slice(d3) + h2 + x2) : s4 + h2 + (-2 === d3 ? i6 : x2);
    }
    return [P(t4, l3 + (t4[s3] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), o5];
  };
  var N = class _N {
    constructor({ strings: t4, _$litType$: s3 }, n5) {
      let r7;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = V(t4, s3);
      if (this.el = _N.createElement(f3, n5), C.currentNode = this.el.content, 2 === s3 || 3 === s3) {
        const t5 = this.el.content.firstChild;
        t5.replaceWith(...t5.childNodes);
      }
      for (; null !== (r7 = C.nextNode()) && d3.length < u3; ) {
        if (1 === r7.nodeType) {
          if (r7.hasAttributes()) for (const t5 of r7.getAttributeNames()) if (t5.endsWith(e3)) {
            const i5 = v2[a3++], s4 = r7.getAttribute(t5).split(h2), e5 = /([.?@])?(.*)/.exec(i5);
            d3.push({ type: 1, index: c4, name: e5[2], strings: s4, ctor: "." === e5[1] ? H : "?" === e5[1] ? I : "@" === e5[1] ? L : k }), r7.removeAttribute(t5);
          } else t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r7.removeAttribute(t5));
          if ($.test(r7.tagName)) {
            const t5 = r7.textContent.split(h2), s4 = t5.length - 1;
            if (s4 > 0) {
              r7.textContent = i3 ? i3.emptyScript : "";
              for (let i5 = 0; i5 < s4; i5++) r7.append(t5[i5], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
              r7.append(t5[s4], l2());
            }
          }
        } else if (8 === r7.nodeType) if (r7.data === o3) d3.push({ type: 2, index: c4 });
        else {
          let t5 = -1;
          for (; -1 !== (t5 = r7.data.indexOf(h2, t5 + 1)); ) d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
        }
        c4++;
      }
    }
    static createElement(t4, i5) {
      const s3 = r3.createElement("template");
      return s3.innerHTML = t4, s3;
    }
  };
  function S2(t4, i5, s3 = t4, e5) {
    if (i5 === T) return i5;
    let h3 = void 0 !== e5 ? s3._$Co?.[e5] : s3._$Cl;
    const o5 = c3(i5) ? void 0 : i5._$litDirective$;
    return h3?.constructor !== o5 && (h3?._$AO?.(false), void 0 === o5 ? h3 = void 0 : (h3 = new o5(t4), h3._$AT(t4, s3, e5)), void 0 !== e5 ? (s3._$Co ??= [])[e5] = h3 : s3._$Cl = h3), void 0 !== h3 && (i5 = S2(t4, h3._$AS(t4, i5.values), h3, e5)), i5;
  }
  var M = class {
    constructor(t4, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t4) {
      const { el: { content: i5 }, parts: s3 } = this._$AD, e5 = (t4?.creationScope ?? r3).importNode(i5, true);
      C.currentNode = e5;
      let h3 = C.nextNode(), o5 = 0, n5 = 0, l3 = s3[0];
      for (; void 0 !== l3; ) {
        if (o5 === l3.index) {
          let i6;
          2 === l3.type ? i6 = new R(h3, h3.nextSibling, this, t4) : 1 === l3.type ? i6 = new l3.ctor(h3, l3.name, l3.strings, this, t4) : 6 === l3.type && (i6 = new z(h3, this, t4)), this._$AV.push(i6), l3 = s3[++n5];
        }
        o5 !== l3?.index && (h3 = C.nextNode(), o5++);
      }
      return C.currentNode = r3, e5;
    }
    p(t4) {
      let i5 = 0;
      for (const s3 of this._$AV) void 0 !== s3 && (void 0 !== s3.strings ? (s3._$AI(t4, s3, i5), i5 += s3.strings.length - 2) : s3._$AI(t4[i5])), i5++;
    }
  };
  var R = class _R {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t4, i5, s3, e5) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t4, this._$AB = i5, this._$AM = s3, this.options = e5, this._$Cv = e5?.isConnected ?? true;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === t4?.nodeType && (t4 = i5.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i5 = this) {
      t4 = S2(this, t4, i5), c3(t4) ? t4 === E || null == t4 || "" === t4 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t4 !== this._$AH && t4 !== T && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : u2(t4) ? this.k(t4) : this._(t4);
    }
    O(t4) {
      return this._$AA.parentNode.insertBefore(t4, this._$AB);
    }
    T(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
    }
    _(t4) {
      this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(r3.createTextNode(t4)), this._$AH = t4;
    }
    $(t4) {
      const { values: i5, _$litType$: s3 } = t4, e5 = "number" == typeof s3 ? this._$AC(t4) : (void 0 === s3.el && (s3.el = N.createElement(P(s3.h, s3.h[0]), this.options)), s3);
      if (this._$AH?._$AD === e5) this._$AH.p(i5);
      else {
        const t5 = new M(e5, this), s4 = t5.u(this.options);
        t5.p(i5), this.T(s4), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i5 = A.get(t4.strings);
      return void 0 === i5 && A.set(t4.strings, i5 = new N(t4)), i5;
    }
    k(t4) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s3, e5 = 0;
      for (const h3 of t4) e5 === i5.length ? i5.push(s3 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s3 = i5[e5], s3._$AI(h3), e5++;
      e5 < i5.length && (this._$AR(s3 && s3._$AB.nextSibling, e5), i5.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, i5) {
      for (this._$AP?.(false, true, i5); t4 && t4 !== this._$AB; ) {
        const i6 = t4.nextSibling;
        t4.remove(), t4 = i6;
      }
    }
    setConnected(t4) {
      void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
    }
  };
  var k = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t4, i5, s3, e5, h3) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t4, this.name = i5, this._$AM = e5, this.options = h3, s3.length > 2 || "" !== s3[0] || "" !== s3[1] ? (this._$AH = Array(s3.length - 1).fill(new String()), this.strings = s3) : this._$AH = E;
    }
    _$AI(t4, i5 = this, s3, e5) {
      const h3 = this.strings;
      let o5 = false;
      if (void 0 === h3) t4 = S2(this, t4, i5, 0), o5 = !c3(t4) || t4 !== this._$AH && t4 !== T, o5 && (this._$AH = t4);
      else {
        const e6 = t4;
        let n5, r7;
        for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r7 = S2(this, e6[s3 + n5], i5, n5), r7 === T && (r7 = this._$AH[n5]), o5 ||= !c3(r7) || r7 !== this._$AH[n5], r7 === E ? t4 = E : t4 !== E && (t4 += (r7 ?? "") + h3[n5 + 1]), this._$AH[n5] = r7;
      }
      o5 && !e5 && this.j(t4);
    }
    j(t4) {
      t4 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t4) {
      this.element[this.name] = t4 === E ? void 0 : t4;
    }
  };
  var I = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t4) {
      this.element.toggleAttribute(this.name, !!t4 && t4 !== E);
    }
  };
  var L = class extends k {
    constructor(t4, i5, s3, e5, h3) {
      super(t4, i5, s3, e5, h3), this.type = 5;
    }
    _$AI(t4, i5 = this) {
      if ((t4 = S2(this, t4, i5, 0) ?? E) === T) return;
      const s3 = this._$AH, e5 = t4 === E && s3 !== E || t4.capture !== s3.capture || t4.once !== s3.once || t4.passive !== s3.passive, h3 = t4 !== E && (s3 === E || e5);
      e5 && this.element.removeEventListener(this.name, this, s3), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var z = class {
    constructor(t4, i5, s3) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s3;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      S2(this, t4);
    }
  };
  var j = t2.litHtmlPolyfillSupport;
  j?.(N, R), (t2.litHtmlVersions ??= []).push("3.2.1");
  var B = (t4, i5, s3) => {
    const e5 = s3?.renderBefore ?? i5;
    let h3 = e5._$litPart$;
    if (void 0 === h3) {
      const t5 = s3?.renderBefore ?? null;
      e5._$litPart$ = h3 = new R(i5.insertBefore(l2(), t5), t5, void 0, s3 ?? {});
    }
    return h3._$AI(t4), h3;
  };

  // src/ui/node_modules/lit-element/lit-element.js
  var r4 = class extends b {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t4 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t4.firstChild, t4;
    }
    update(t4) {
      const s3 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = B(s3, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return T;
    }
  };
  r4._$litElement$ = true, r4["finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: r4 });
  var i4 = globalThis.litElementPolyfillSupport;
  i4?.({ LitElement: r4 });
  (globalThis.litElementVersions ??= []).push("4.1.1");

  // src/ui/node_modules/@lit/reactive-element/decorators/custom-element.js
  var t3 = (t4) => (e5, o5) => {
    void 0 !== o5 ? o5.addInitializer(() => {
      customElements.define(t4, e5);
    }) : customElements.define(t4, e5);
  };

  // src/ui/node_modules/@lit/reactive-element/decorators/property.js
  var o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  var r5 = (t4 = o4, e5, r7) => {
    const { kind: n5, metadata: i5 } = r7;
    let s3 = globalThis.litPropertyMetadata.get(i5);
    if (void 0 === s3 && globalThis.litPropertyMetadata.set(i5, s3 = /* @__PURE__ */ new Map()), s3.set(r7.name, t4), "accessor" === n5) {
      const { name: o5 } = r7;
      return { set(r8) {
        const n6 = e5.get.call(this);
        e5.set.call(this, r8), this.requestUpdate(o5, n6, t4);
      }, init(e6) {
        return void 0 !== e6 && this.P(o5, void 0, t4), e6;
      } };
    }
    if ("setter" === n5) {
      const { name: o5 } = r7;
      return function(r8) {
        const n6 = this[o5];
        e5.call(this, r8), this.requestUpdate(o5, n6, t4);
      };
    }
    throw Error("Unsupported decorator location: " + n5);
  };
  function n4(t4) {
    return (e5, o5) => "object" == typeof o5 ? r5(t4, e5, o5) : ((t5, e6, o6) => {
      const r7 = e6.hasOwnProperty(o6);
      return e6.constructor.createProperty(o6, r7 ? { ...t5, wrapped: true } : t5), r7 ? Object.getOwnPropertyDescriptor(e6, o6) : void 0;
    })(t4, e5, o5);
  }

  // src/ui/node_modules/@lit/reactive-element/decorators/state.js
  function r6(r7) {
    return n4({ ...r7, state: true, attribute: false });
  }

  // src/ui/alarm-panel-cards.ts
  var AlarmPanelCards = class extends r4 {
    constructor() {
      super(...arguments);
      this.code = "";
    }
    setConfig(config) {
      if (!config.entity) throw new Error("You must define an entity");
      this.config = config;
    }
    firstUpdated() {
      this._timer = window.setInterval(() => {
        const s3 = this.hass.states[this.config.entity].state;
        if (s3 === "pending") {
          this.requestUpdate();
        } else {
          clearInterval(this._timer);
        }
      }, 1e3);
    }
    render() {
      const stateObj = this.hass.states[this.config.entity];
      const state = stateObj.state;
      let mm = 0, ss = "00";
      if (state === "pending") {
        const armingTime = stateObj.attributes.arming_time || 0;
        const elapsed = Date.now() - new Date(stateObj.last_changed).getTime();
        const rem = Math.max(0, Math.ceil((armingTime * 1e3 - elapsed) / 1e3));
        mm = Math.floor(rem / 60);
        ss = String(rem % 60).padStart(2, "0");
      }
      const info = {
        disarmed: { icon: "mdi:shield-off-outline", label: "Disarmed", color: "var(--label-badge-yellow)" },
        armed_home: { icon: "mdi:home-account", label: "Armed Home", color: "var(--label-badge-green)" },
        armed_away: { icon: "mdi:walk", label: "Armed Away", color: "var(--label-badge-green)" },
        triggered: { icon: "mdi:bell-alert", label: "Alarm!", color: "var(--error-color)" },
        pending: { icon: "mdi:timer-sand", label: `${mm}:arming`, color: "var(--label-badge-yellow)" },
        arming: { icon: "mdi:timer-sand", label: `arming`, color: "var(--label-badge-yellow)" }
      }[state] || { icon: "mdi:help-circle", label: state, color: "var(--disabled-text-color)" };
      const modes = [
        { service: "alarm_disarm", icon: "mdi:shield-off-outline", label: "Disarm", state: "disarmed" },
        { service: "alarm_arm_home", icon: "mdi:home-account", label: "Home", state: "armed_home" },
        { service: "alarm_arm_away", icon: "mdi:walk", label: "Away", state: "armed_away" }
      ];
      return x`
      <ha-card>
        <div class="state-pill" style="background-color: ${info.color}">
          <ha-icon icon="${info.icon}"></ha-icon>
          <span>${info.label}</span>
        </div>
        <div class="modes">
          ${modes.map((m2) => x`
            <div class="mode" @click=${() => this._modeClick(m2, state)}>
              <div class="mode-circle ${state === m2.state ? "active" : ""}">
                <ha-icon icon="${m2.icon}"></ha-icon>
              </div>
              <div class="mode-label">${m2.label}</div>
            </div>
          `)}
        </div>
        ${state === "triggered" ? x`
          <div class="code-entry">
            <input
              type="password"
              .value=${this.code}
              @input=${(e5) => this.code = e5.target.value}
              placeholder="PIN"
            />
            <mwc-button @click=${this._confirmDisarm} ?disabled=${!this.code}>
              Potrdi
            </mwc-button>
          </div>
        ` : E}
      </ha-card>
    `;
    }
    _modeClick(m2, currentState) {
      if (m2.service === "alarm_disarm" && currentState === "triggered") return;
      this._callService(m2.service);
    }
    _confirmDisarm() {
      this._callService("alarm_disarm", this.code);
      this.code = "";
    }
    _callService(service, code) {
      const data = { entity_id: this.config.entity };
      if (code) data.code = code;
      this.hass.callService("alarm_control_panel", service, data);
    }
  };
  AlarmPanelCards.styles = i`
    ha-card { padding: 16px; }
    .state-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 4px 12px; border-radius: 12px; color: white;
      font-weight: 500; margin-bottom: 16px; font-size: 0.9rem;
    }
    .state-pill ha-icon { width: 20px; height: 20px; }
    .modes { display: flex; justify-content: space-around; padding-top: 8px; }
    .mode {
      display: flex; flex-direction: column; align-items: center;
      cursor: pointer; width: 80px;
    }
    .mode-circle {
      width: 80px; height: 80px; border-radius: 50%;
      background-color: var(--card-background-color);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--ha-card-box-shadow, 0px 1px 3px rgba(0,0,0,0.1));
      transition: background-color 0.2s;
    }
    .mode-circle.active { background-color: var(--primary-color); }
    .mode-circle ha-icon {
      font-size: 36px; color: var(--primary-color);
    }
    .mode-circle.active ha-icon {
      color: var(--text-primary-on-color, white);
    }
    .mode-label {
      margin-top: 8px; font-size: 1rem;
      color: var(--primary-text-color); text-align: center; width: 100%;
    }
    .code-entry {
      display: flex; align-items: center; gap: 8px;
      margin-top: 16px; justify-content: center;
    }
    .code-entry input {
      padding: 8px; font-size: 1rem; width: 80px;
      text-align: center; border: 1px solid var(--divider-color);
      border-radius: 4px;
    }
  `;
  __decorateClass([
    n4({ attribute: false })
  ], AlarmPanelCards.prototype, "hass", 2);
  __decorateClass([
    n4()
  ], AlarmPanelCards.prototype, "config", 2);
  __decorateClass([
    r6()
  ], AlarmPanelCards.prototype, "code", 2);
  AlarmPanelCards = __decorateClass([
    t3("alarm-panel-cards")
  ], AlarmPanelCards);
})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
