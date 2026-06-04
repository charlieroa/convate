/* =====================================================================
   TiendaConvatec · Store CRM compartido (mockup)
   - Estado ficticio persistente en localStorage (mismo origen).
   - Móvil / Escritorio / CRM / me+ comparten estos datos.
   - Una "compra" registrada desde cualquier canal alimenta el CRM en vivo
     mediante el evento 'storage' (entre documentos) y 'convatec:change'
     (dentro del mismo documento).
   ===================================================================== */
(function (global) {
  "use strict";

  var KEY = "convatec_crm_v3";
  var CH = "convatec:change";
  var APP_USER = "C-1042"; // usuaria conectada en el mockup móvil/web ("Laura")

  /* ---------- Catálogo de productos ---------- */
  var CATALOG = [
    { sku: "ESS-421745", nombre: "Esteem+ Bolsa cerrada (recortable)", linea: "Esteem+", precio: 168000, presentacion: "Caja x30", freq: 30 },
    { sku: "ESS-421746", nombre: "Esteem+ Bolsa drenable", linea: "Esteem+", precio: 192000, presentacion: "Caja x30", freq: 30 },
    { sku: "SEN-175430", nombre: "SenSura Mio barrera convexa", linea: "SenSura Mio", precio: 248000, presentacion: "Caja x10", freq: 30 },
    { sku: "NAT-650832", nombre: "Natura+ Barrera 45mm", linea: "Natura+", precio: 156000, presentacion: "Caja x5", freq: 30 },
    { sku: "NAT-650845", nombre: "Natura+ Bolsa drenable 57mm", linea: "Natura+", precio: 174000, presentacion: "Caja x10", freq: 30 },
    { sku: "ACC-302110", nombre: "Pasta niveladora Stomahesive", linea: "Accesorios", precio: 62000, presentacion: "Tubo 60g", freq: 60 },
    { sku: "ACC-302115", nombre: "Anillo moldeable Eakin Cohesive", linea: "Accesorios", precio: 89000, presentacion: "Caja x10", freq: 45 },
    { sku: "ACC-302130", nombre: "Polvo protector Stomahesive", linea: "Accesorios", precio: 54000, presentacion: "Frasco 25g", freq: 60 },
    { sku: "ACC-302140", nombre: "Toallitas removedoras Niltac", linea: "Accesorios", precio: 41000, presentacion: "Caja x30", freq: 45 }
  ];

  /* ---------- Datos semilla ---------- */
  function seed() {
    var clientes = [
      {
        id: "C-1042", nombre: "Laura Gómez Restrepo", doc: "CC 39.482.115", edad: 58, sexo: "F",
        ciudad: "Bogotá D.C.", barrio: "Cedritos", tel: "+57 311 482 1190", email: "laura.gomez@gmail.com",
        eps: "Sura EPS", regimen: "Contributivo",
        estoma: { tipo: "Colostomía", motivo: "Cáncer colorrectal", cirugia: "2023-08-14", diametro: "45 mm", piel: "Estable" },
        meplus: { estado: "Activo", nivel: "Plus Cuidado", enfermera: "Enf. Diana Castaño", ultimaVisita: "2026-05-12", adherencia: 92 },
        segmento: "Recurrente", riesgo: "Bajo", desde: "2023-09-01"
      },
      {
        id: "C-1088", nombre: "José Gregorio Patiño", doc: "CC 79.114.620", edad: 64, sexo: "M",
        ciudad: "Medellín", barrio: "Laureles", tel: "+57 300 765 4421", email: "jgpatino@hotmail.com",
        eps: "Nueva EPS", regimen: "Contributivo",
        estoma: { tipo: "Ileostomía", motivo: "Enf. de Crohn", cirugia: "2022-03-02", diametro: "38 mm", piel: "Irritación leve" },
        meplus: { estado: "Activo", nivel: "Plus", enfermera: "Enf. Andrés Mejía", ultimaVisita: "2026-04-28", adherencia: 78 },
        segmento: "Recurrente", riesgo: "Medio", desde: "2022-03-20"
      },
      {
        id: "C-1130", nombre: "Luz Marina Cuervo", doc: "CC 41.205.778", edad: 71, sexo: "F",
        ciudad: "Cali", barrio: "Ciudad Jardín", tel: "+57 318 220 9087", email: "lmcuervo@gmail.com",
        eps: "Coomeva", regimen: "Contributivo",
        estoma: { tipo: "Urostomía", motivo: "Cáncer de vejiga", cirugia: "2024-11-19", diametro: "32 mm", piel: "Estable" },
        meplus: { estado: "Onboarding", nivel: "Plus", enfermera: "Enf. Diana Castaño", ultimaVisita: "2026-05-22", adherencia: 64 },
        segmento: "Nuevo", riesgo: "Alto", desde: "2024-12-05"
      },
      {
        id: "C-1175", nombre: "Carlos Andrés Beltrán", doc: "CC 80.331.094", edad: 49, sexo: "M",
        ciudad: "Barranquilla", barrio: "Alto Prado", tel: "+57 315 901 3320", email: "cabeltran@outlook.com",
        eps: "Salud Total", regimen: "Contributivo",
        estoma: { tipo: "Colostomía", motivo: "Trauma", cirugia: "2021-07-08", diametro: "50 mm", piel: "Estable" },
        meplus: { estado: "Inactivo", nivel: "Básico", enfermera: "—", ultimaVisita: "2025-12-10", adherencia: 41 },
        segmento: "En riesgo de fuga", riesgo: "Alto", desde: "2021-07-25"
      },
      {
        id: "C-1201", nombre: "Gloria Esperanza Niño", doc: "CC 51.778.342", edad: 67, sexo: "F",
        ciudad: "Bucaramanga", barrio: "Cabecera", tel: "+57 304 558 7711", email: "geni67@gmail.com",
        eps: "Sanitas", regimen: "Contributivo",
        estoma: { tipo: "Colostomía", motivo: "Diverticulitis", cirugia: "2023-02-11", diametro: "45 mm", piel: "Estable" },
        meplus: { estado: "Activo", nivel: "Plus Cuidado", enfermera: "Enf. Andrés Mejía", ultimaVisita: "2026-05-30", adherencia: 88 },
        segmento: "Recurrente", riesgo: "Bajo", desde: "2023-02-28"
      }
    ];

    // Inventario / cadena de abastecimiento
    var inventario = CATALOG.map(function (p, i) {
      var stock = [220, 60, 18, 140, 95, 310, 44, 180, 260][i];
      var rop = [80, 80, 40, 60, 60, 90, 60, 70, 90][i];
      return {
        sku: p.sku, nombre: p.nombre, linea: p.linea, stock: stock, rop: rop,
        proveedor: p.linea === "Accesorios" ? "Convatec LATAM" : "Convatec Global Supply",
        leadTime: p.linea === "SenSura Mio" ? 38 : 21,
        enTransito: stock < rop ? rop * 2 : (i % 3 === 0 ? 120 : 0),
        bodega: "CD Funza (Bogotá)"
      };
    });

    var s = {
      v: 3,
      clientes: clientes,
      ordenes: [],
      inventario: inventario,
      counter: 4820,
      ts: 0
    };

    // Órdenes históricas (para que el CRM nazca "lleno")
    var hist = [
      { cli: "C-1042", canal: "Móvil", dias: 2, estado: "Despachado", items: [["ESS-421745", 1], ["ACC-302110", 1]] },
      { cli: "C-1042", canal: "Móvil", dias: 33, estado: "Entregado", items: [["ESS-421745", 1]] },
      { cli: "C-1088", canal: "Web", dias: 5, estado: "En tránsito", items: [["NAT-650845", 1], ["ACC-302115", 1]] },
      { cli: "C-1088", canal: "Web", dias: 36, estado: "Entregado", items: [["NAT-650845", 1]] },
      { cli: "C-1130", canal: "Call center", dias: 1, estado: "En preparación", items: [["SEN-175430", 1], ["ACC-302130", 1]] },
      { cli: "C-1201", canal: "Móvil", dias: 8, estado: "Entregado", items: [["ESS-421745", 1], ["ACC-302140", 1]] },
      { cli: "C-1175", canal: "Web", dias: 95, estado: "Entregado", items: [["ESS-421745", 1]] }
    ];
    hist.forEach(function (h) {
      s.counter += 7;
      var items = h.items.map(function (it) {
        var p = findCat(it[0]);
        return { sku: p.sku, nombre: p.nombre, linea: p.linea, qty: it[1], precio: p.precio };
      });
      var total = items.reduce(function (a, it) { return a + it.qty * it.precio; }, 0);
      s.ordenes.push({
        id: "OC-" + s.counter,
        clienteId: h.cli,
        canal: h.canal,
        fecha: daysAgoISO(h.dias),
        items: items,
        total: total,
        estado: h.estado,
        despacho: dispatchFor(h.estado, h.dias),
        nota: ""
      });
    });
    return s;
  }

  /* ---------- Utilidades ---------- */
  function findCat(sku) { for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].sku === sku) return CATALOG[i]; return CATALOG[0]; }
  function daysAgoISO(d) { var t = Date.now() - d * 86400000; return new Date(t).toISOString(); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function dispatchFor(estado, dias) {
    var trans = ["Coordinadora Mercantil", "Servientrega", "TCC"];
    var t = trans[dias % 3];
    var guia = "CL" + (90000000 + (dias * 131 % 9000000));
    var etaDays = estado === "Entregado" ? -1 : (estado === "En tránsito" ? 1 : (estado === "Despachado" ? 2 : 3));
    return {
      transportadora: t,
      guia: guia,
      eta: etaDays < 0 ? "Entregado" : daysFromNowISO(etaDays),
      bodega: "CD Funza (Bogotá)"
    };
  }
  function daysFromNowISO(d) { return new Date(Date.now() + d * 86400000).toISOString(); }

  /* ---------- Persistencia ---------- */
  function load() {
    var raw = null;
    try { raw = global.localStorage.getItem(KEY); } catch (e) {}
    if (!raw) { var s = seed(); persist(s); return s; }
    try {
      var data = JSON.parse(raw);
      if (!data || data.v !== 3) { var s2 = seed(); persist(s2); return s2; }
      return data;
    } catch (e) { var s3 = seed(); persist(s3); return s3; }
  }
  function persist(s) {
    try { global.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* ---------- API pública ---------- */
  var Store = {
    KEY: KEY,
    APP_USER: APP_USER,
    CATALOG: CATALOG,

    get: function () { return load(); },

    reset: function () { var s = seed(); persist(s); fire(); return s; },

    cliente: function (id) {
      var s = load();
      for (var i = 0; i < s.clientes.length; i++) if (s.clientes[i].id === id) return s.clientes[i];
      return null;
    },

    /* Registra una compra (alimenta CRM, despacho, inventario, recompra) */
    addOrder: function (opts) {
      opts = opts || {};
      var s = load();
      var clientes = s.clientes;
      var cli = opts.clienteId
        ? Store._find(clientes, opts.clienteId)
        : clientes[(s.counter) % clientes.length];

      var items = (opts.items && opts.items.length)
        ? opts.items.map(function (it) {
            var p = findCat(it.sku);
            return { sku: p.sku, nombre: p.nombre, linea: p.linea, qty: it.qty || 1, precio: p.precio };
          })
        : [(function () {
            var p = CATALOG[(s.counter * 3) % CATALOG.length];
            return { sku: p.sku, nombre: p.nombre, linea: p.linea, qty: 1, precio: p.precio };
          })()];

      var total = items.reduce(function (a, it) { return a + it.qty * it.precio; }, 0);
      s.counter += 1;
      var canal = opts.canal || "Móvil";
      var subs = !!opts.subscripcion;
      var orden = {
        id: "OC-" + (s.counter + 7),
        clienteId: cli.id,
        canal: canal,
        fecha: new Date().toISOString(),
        items: items,
        total: total,
        estado: "Recibido",
        despacho: { transportadora: "Por asignar", guia: "—", eta: daysFromNowISO(3), bodega: "CD Funza (Bogotá)" },
        nota: opts.real
          ? "Compra REAL detectada en el mockup " + canal + (subs ? " · recompra me+" : "")
          : "Compra ingresada desde canal " + canal,
        real: !!opts.real,
        subscripcion: subs,
        nuevo: true
      };
      s.ordenes.unshift(orden);

      // Movimiento de suscripción me+ (mueve la próxima entrega del cliente)
      if (subs && cli.meplus) {
        var freq = findCat(items[0].sku).freq || 30;
        cli.meplus.proximaEntrega = daysFromNowISO(freq);
        cli.meplus.ultimaCompra = orden.fecha;
      }

      // Descontar inventario
      items.forEach(function (it) {
        for (var i = 0; i < s.inventario.length; i++) {
          if (s.inventario[i].sku === it.sku) { s.inventario[i].stock = Math.max(0, s.inventario[i].stock - it.qty); }
        }
      });

      s.ts = Date.now();
      s.lastEvent = { type: "order", id: orden.id, ts: s.ts };
      persist(s);
      fire(orden);
      return orden;
    },

    /* Avanza el estado de una orden en el flujo de despacho */
    advance: function (ordenId) {
      var flow = ["Recibido", "En preparación", "Despachado", "En tránsito", "Entregado"];
      var s = load();
      for (var i = 0; i < s.ordenes.length; i++) {
        if (s.ordenes[i].id === ordenId) {
          var idx = flow.indexOf(s.ordenes[i].estado);
          if (idx < flow.length - 1) {
            s.ordenes[i].estado = flow[idx + 1];
            s.ordenes[i].despacho = dispatchFor(s.ordenes[i].estado, (i + 2));
          }
          break;
        }
      }
      s.ts = Date.now();
      persist(s);
      fire();
    },

    _find: function (arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return arr[0]; },

    /* Predicción de recompra por cliente (último consumo + frecuencia) */
    recompra: function () {
      var s = load();
      var out = [];
      s.clientes.forEach(function (c) {
        // última orden del cliente
        var last = null;
        for (var i = 0; i < s.ordenes.length; i++) {
          if (s.ordenes[i].clienteId === c.id) {
            if (!last || new Date(s.ordenes[i].fecha) > new Date(last.fecha)) last = s.ordenes[i];
          }
        }
        if (!last) return;
        var item = last.items[0];
        var p = findCat(item.sku);
        var lastT = new Date(last.fecha).getTime();
        var next = lastT + p.freq * 86400000;
        var diasRest = Math.round((next - Date.now()) / 86400000);
        var estado = diasRest < 0 ? "Vencida" : (diasRest <= 5 ? "Próxima" : "Programada");
        out.push({
          cliente: c, sku: p.sku, producto: p.nombre, frecuencia: p.freq,
          ultima: last.fecha, proxima: new Date(next).toISOString(),
          diasRest: diasRest, estado: estado
        });
      });
      out.sort(function (a, b) { return a.diasRest - b.diasRest; });
      return out;
    },

    /* KPIs para el dashboard */
    kpis: function () {
      var s = load();
      var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      var ventas = 0, ordHoy = 0, abiertas = 0, mrr = 0;
      s.ordenes.forEach(function (o) {
        ventas += o.total;
        if (new Date(o.fecha) >= hoy) ordHoy++;
        if (o.estado !== "Entregado") abiertas++;
      });
      // MRR estimado: total de programas activos * ticket medio
      var activos = s.clientes.filter(function (c) { return c.meplus.estado === "Activo"; }).length;
      var ticket = s.ordenes.length ? Math.round(ventas / s.ordenes.length) : 0;
      mrr = activos * ticket;
      var bajoStock = s.inventario.filter(function (i) { return i.stock <= i.rop; }).length;
      return {
        ventas: ventas, ordenes: s.ordenes.length, ordHoy: ordHoy, abiertas: abiertas,
        clientes: s.clientes.length, activos: activos, ticket: ticket, mrr: mrr, bajoStock: bajoStock
      };
    },

    subscribe: function (fn) {
      var lastTs = 0;
      function fromStorage() {
        var s = load();
        var orden = null;
        if (s.lastEvent && s.lastEvent.type === "order" && s.lastEvent.ts > lastTs) {
          lastTs = s.lastEvent.ts;
          for (var i = 0; i < s.ordenes.length; i++) if (s.ordenes[i].id === s.lastEvent.id) orden = s.ordenes[i];
        }
        fn(s, orden);
      }
      global.addEventListener("storage", function (e) { if (e.key === KEY) fromStorage(); });
      global.addEventListener(CH, function (e) {
        var s = load();
        if (s.lastEvent) lastTs = s.lastEvent.ts;
        fn(s, e.detail || null);
      });
    },

    fmt: fmtMoney,
    fecha: fmtFecha,
    desde: fmtDesde
  };

  function fire(orden) {
    try { global.dispatchEvent(new CustomEvent(CH, { detail: orden || null })); } catch (e) {}
  }

  function fmtMoney(n) {
    return "$" + (n || 0).toLocaleString("es-CO");
  }
  function fmtFecha(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return d.getDate() + " " + meses[d.getMonth()] + " " + d.getFullYear();
  }
  function fmtDesde(iso) {
    if (!iso) return "—";
    var diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (diff < 1) return "hace segundos";
    if (diff < 60) return "hace " + diff + " min";
    var h = Math.round(diff / 60);
    if (h < 24) return "hace " + h + " h";
    var d = Math.round(h / 24);
    return "hace " + d + " d";
  }

  global.ConvatecStore = Store;
})(window);
