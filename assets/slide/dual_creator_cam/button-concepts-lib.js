// Shared 3D record-button concept builders (Three.js r128 global `THREE`).
// Extracted from 3d-button-concepts.html so multiple pages can render the
// same buttons. Call RecordButtonConcepts(THREE) -> { CONCEPTS, mats, VIEW, ... }.
window.RecordButtonConcepts = function (THREE) {
  var PT = 1;                 // 1 px = 1 pt
  var R = 52 * PT;            // record button radius (104pt dia)
  var DOT_R = 10 * PT;        // 20pt center dot
  var VIEW = 110;             // ortho half-extent -> 220px stage
  var RED = 0xff4b33;

  // Tilt state the concept glint-updaters read. In the original single-page
  // build these were IIFE-scoped globals; here the host page pushes them in
  // via setTilt() so buildBejeweled/buildDisco's update() can see them.
  var tiltX = 0, tiltY = 0;

  // ---- shared environment cube (fake studio for metals) ----
  function envFace(top, bottom, band) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    if (band) { x.fillStyle = 'rgba(255,255,255,0.55)'; x.fillRect(0, 34, 128, 14); }
    return c;
  }
  var envTex = new THREE.CubeTexture([
    envFace('#9a9a9a', '#2a2a2a', true),  // px
    envFace('#8a8a8a', '#262626', true),  // nx
    envFace('#ffffff', '#bfbfbf', false), // py (top)
    envFace('#1c1c1c', '#0a0a0a', false), // ny
    envFace('#a8a8a8', '#2e2e2e', true),  // pz
    envFace('#787878', '#222222', false)  // nz
  ]);
  envTex.needsUpdate = true;

  // 4-point star glint texture for the bejeweled twinkle sprites
  function starTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d');
    var g0 = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g0.addColorStop(0, 'rgba(255,255,255,1)');
    g0.addColorStop(0.12, 'rgba(255,255,255,0.9)');
    g0.addColorStop(0.45, 'rgba(255,255,255,0.10)');
    g0.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g0; x.fillRect(0, 0, 128, 128);
    x.globalCompositeOperation = 'lighter';
    function beam(angle, len, half) {
      x.save(); x.translate(64, 64); x.rotate(angle);
      var lg = x.createLinearGradient(-len, 0, len, 0);
      lg.addColorStop(0, 'rgba(255,255,255,0)');
      lg.addColorStop(0.5, 'rgba(255,255,255,0.95)');
      lg.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = lg;
      x.beginPath();
      x.moveTo(-len, 0); x.lineTo(0, -half); x.lineTo(len, 0); x.lineTo(0, half);
      x.closePath(); x.fill(); x.restore();
    }
    beam(0, 62, 4); beam(Math.PI / 2, 62, 4);
    beam(Math.PI / 4, 34, 2); beam(-Math.PI / 4, 34, 2);
    return new THREE.CanvasTexture(c);
  }
  var sparkTex = starTexture();

  // material registries for the color changer. primaryShadeMats follow the
  // primary color at a darker shade (userData.shade) — used for the puck
  // rims/sides so the whole body reads as one primary-colored part.
  var primaryMats = [], secondaryMats = [], dotMats = [], primaryShadeMats = [];
  function reg(list, mat) {
    mat.userData.orig = mat.color.getHex();
    list.push(mat);
    return mat;
  }

  // center indicator: red circle (idle) that morphs to a rounded
  // stop square (recording), mirroring the app's state change
  function indicator(z) {
    var mat = reg(dotMats, new THREE.MeshStandardMaterial({ color: RED, roughness: 0.45, metalness: 0.0 }));
    var grp = new THREE.Group();
    var circle = new THREE.Mesh(new THREE.CircleGeometry(DOT_R, 48), mat);
    var s = 9, r = 4.5; // 18pt rounded stop square
    var shape = new THREE.Shape();
    shape.moveTo(-s + r, -s);
    shape.lineTo(s - r, -s); shape.quadraticCurveTo(s, -s, s, -s + r);
    shape.lineTo(s, s - r); shape.quadraticCurveTo(s, s, s - r, s);
    shape.lineTo(-s + r, s); shape.quadraticCurveTo(-s, s, -s, s - r);
    shape.lineTo(-s, -s + r); shape.quadraticCurveTo(-s, -s, -s + r, -s);
    var square = new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), mat);
    square.scale.set(0.001, 0.001, 1);
    grp.add(circle); grp.add(square);
    grp.position.z = z;
    grp.userData.circle = circle;
    grp.userData.square = square;
    return grp;
  }

  function lathe(profile, mat) {
    var pts = profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var g = new THREE.LatheGeometry(pts, 96);
    var m = new THREE.Mesh(g, mat);
    m.rotation.x = Math.PI / 2; // lathe axis +Y -> +Z (toward viewer)
    m.castShadow = true;
    return m;
  }

  // ---- concept builders (each returns a THREE.Group) ----

  // True 32-panel truncated icosahedron: panel layout = spherical Voronoi
  // cells of the 12 icosahedron vertices (black pentagons) + 20 face centers
  // (white hexagons). Each panel is its own pillowed mesh so seams recess
  // and every element catches the tilt light separately.
  function buildSoccer() {
    var g = new THREE.Group();
    var proud = 8; // sphere center 8pt in front of glass -> 62pt protrusion
    var PHI = (1 + Math.sqrt(5)) / 2;

    // 12 icosahedron vertices: cyclic permutations of (0, ±1, ±PHI)
    var verts = [];
    [[0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI]].forEach(function (p) {
      verts.push(new THREE.Vector3(p[0], p[1], p[2]).normalize());
      verts.push(new THREE.Vector3(p[1], p[2], p[0]).normalize());
      verts.push(new THREE.Vector3(p[2], p[0], p[1]).normalize());
    });

    // adjacency = the max pairwise dot; faces = mutually adjacent triples
    var i, j, k, maxDot = -2;
    for (i = 0; i < 12; i++) for (j = i + 1; j < 12; j++) maxDot = Math.max(maxDot, verts[i].dot(verts[j]));
    function adj(a, b) { return verts[a].dot(verts[b]) > maxDot - 1e-4; }

    var centers = [];
    verts.forEach(function (v) { centers.push({ dir: v.clone(), pent: true }); });
    for (i = 0; i < 12; i++) for (j = i + 1; j < 12; j++) for (k = j + 1; k < 12; k++)
      if (adj(i, j) && adj(j, k) && adj(i, k))
        centers.push({ dir: verts[i].clone().add(verts[j]).add(verts[k]).normalize(), pent: false });

    // rotate so a black pentagon faces the viewer (red dot sits on it, like the ref)
    var q = new THREE.Quaternion().setFromUnitVectors(centers[0].dir.clone(), new THREE.Vector3(0, 0, 1));
    centers.forEach(function (c) { c.dir.applyQuaternion(q); });

    function nearestIdx(dir) {
      var best = -2, bi = 0;
      for (var n = 0; n < centers.length; n++) {
        var d = dir.dot(centers[n].dir);
        if (d > best) { best = d; bi = n; }
      }
      return bi;
    }

    var A = 64, RINGS = 5, SHRINK = 1.0, PUFF = 1.0; // panels meet edge-to-edge, no seam lines

    // every panel gets its own material with jittered tone, gloss and
    // reflectivity — so with the seams gone, each panel still separates
    // by catching the light differently as you tilt
    function panelMat(pent) {
      var col = new THREE.Color(pent ? 0x141414 : 0xf1f1f1)
        .multiplyScalar(0.94 + Math.random() * 0.12);
      var m = new THREE.MeshStandardMaterial({
        color: col,
        roughness: (pent ? 0.42 : 0.3) + (Math.random() - 0.5) * 0.18,
        metalness: pent ? 0.1 : 0.05,
        envMap: envTex,
        envMapIntensity: (pent ? 0.4 : 0.55) + (Math.random() - 0.5) * 0.4,
        side: THREE.DoubleSide
      });
      return reg(pent ? secondaryMats : primaryMats, m);
    }

    var ball = new THREE.Group();
    // dark core sphere — shows through the panel gaps as recessed seams
    ball.add(new THREE.Mesh(
      new THREE.SphereGeometry(R - 0.35, 48, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 })
    ));

    centers.forEach(function (c, ci) {
      // tangent basis around this panel's center
      var up = Math.abs(c.dir.z) < 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
      var u = new THREE.Vector3().crossVectors(up, c.dir).normalize();
      var w = new THREE.Vector3().crossVectors(c.dir, u).normalize();

      function dirAt(t, ca, sa) {
        return c.dir.clone().multiplyScalar(Math.cos(t))
          .addScaledVector(u, Math.sin(t) * ca)
          .addScaledVector(w, Math.sin(t) * sa);
      }

      // Voronoi cell boundary (angular radius) per azimuth, via bisection
      var ts = [];
      for (var a = 0; a < A; a++) {
        var th = a * Math.PI * 2 / A, ca = Math.cos(th), sa = Math.sin(th);
        var t = 0.05;
        while (t < 0.9 && nearestIdx(dirAt(t, ca, sa)) === ci) t += 0.04;
        var lo = t - 0.04, hi = t;
        for (var s = 0; s < 18; s++) {
          var mid = (lo + hi) / 2;
          if (nearestIdx(dirAt(mid, ca, sa)) === ci) lo = mid; else hi = mid;
        }
        ts.push(((lo + hi) / 2) * SHRINK);
      }

      // pillowed panel: fan + rings, radius puffed at center, flush at seams
      var pos = [], idx = [];
      var cv = c.dir.clone().multiplyScalar(R + PUFF);
      pos.push(cv.x, cv.y, cv.z);
      for (var r = 1; r <= RINGS; r++) {
        var f = r / RINGS;
        for (a = 0; a < A; a++) {
          th = a * Math.PI * 2 / A;
          var d = dirAt(ts[a] * f, Math.cos(th), Math.sin(th));
          var rr = R + PUFF * Math.cos(f * Math.PI / 2);
          pos.push(d.x * rr, d.y * rr, d.z * rr);
        }
      }
      for (a = 0; a < A; a++) idx.push(0, 1 + a, 1 + (a + 1) % A);
      for (r = 0; r < RINGS - 1; r++)
        for (a = 0; a < A; a++) {
          var r0 = 1 + r * A, r1 = 1 + (r + 1) * A, a1 = (a + 1) % A;
          idx.push(r0 + a, r1 + a, r1 + a1, r0 + a, r1 + a1, r0 + a1);
        }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      var mesh = new THREE.Mesh(geo, panelMat(c.pent));
      mesh.castShadow = true;
      ball.add(mesh);
    });

    ball.position.z = proud;
    g.add(ball);
    var ind = indicator(proud + R + PUFF + 0.4);
    g.add(ind); g.userData.indicator = ind;
    return g;
  }

  function buildBejeweled() {
    // Flat pavé plate (Ø104×12): low velvet puck with concentric stone
    // rings on the face — silhouette family of chrome/matte, not an orb.
    var g = new THREE.Group();
    var FACE_Z = 12;
    var baseMat = reg(primaryMats, new THREE.MeshStandardMaterial({ color: 0x2b2b2e, roughness: 0.7, metalness: 0.15 }));
    g.add(lathe([[52, 0], [52, 11], [50.5, FACE_Z]], baseMat));
    var face = new THREE.Mesh(new THREE.CircleGeometry(50.5, 64), baseMat);
    face.position.z = FACE_Z;
    face.castShadow = true;
    g.add(face);

    // individual brilliant-cut diamonds: octagonal frustum crown with a
    // flat table facet, flat-shaded so the table + 8 crown facets flash
    // as distinct planes. Mostly white with a hint of icy fire.
    // Slightly transparent stones — crystal rather than solid metal.
    var gemMats = [0xffffff, 0xffffff, 0xecf3ff, 0xf5eeff].map(function (t) {
      return reg(secondaryMats, new THREE.MeshStandardMaterial({
        color: t, roughness: 0.035, metalness: 0.45, flatShading: true,
        transparent: true, opacity: 0.82, depthWrite: true,
        envMap: envTex, envMapIntensity: 2.3
      }));
    });

    // pavé setting: concentric rings of uniform stones around the record
    // dot, alternate rings offset half a step (brick pattern), facet spin
    // following each ring. The first ring keeps a clear margin so the
    // record indicator is never covered.
    var studs = [];
    var UP = new THREE.Vector3(0, 1, 0);
    var Z = new THREE.Vector3(0, 0, 1);
    var faceUp = new THREE.Quaternion().setFromUnitVectors(UP, Z);
    // Four evenly spaced rings shifted toward the rim: the outer ring
    // sits on the plate edge, stones lipping ~2.5pt past the outline —
    // a subtle spill, with a whisper of hand-set wobble.
    var rings = [
      { radius: 16, size: 4.6 },    // face radius, girdle radius
      { radius: 24.5, size: 4.6 },
      { radius: 33, size: 4.6 },
      { radius: 41.5, size: 4.6 },
      { radius: 50, size: 4.6 }
    ];
    rings.forEach(function (ring, ri) {
      var count = Math.max(6, Math.round(2 * Math.PI * ring.radius / (2 * ring.size + 0.5)));
      for (var i = 0; i < count; i++) {
        var phi = (i + (ri % 2 ? 0.5 : 0)) * Math.PI * 2 / count;
        var gr = ring.size;
        var h = gr * 0.55 + 0.8;
        var s = new THREE.Mesh(
          new THREE.CylinderGeometry(gr * 0.55, gr, h, 8, 1, false),
          gemMats[(ri + i) % gemMats.length]
        );
        s.position.set(Math.cos(phi) * ring.radius,
                       Math.sin(phi) * ring.radius,
                       FACE_Z + h * 0.35);
        var spin = new THREE.Quaternion().setFromAxisAngle(UP, phi);
        var wobAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).normalize();
        var wob = new THREE.Quaternion().setFromAxisAngle(wobAxis, Math.random() * 0.06);
        s.quaternion.copy(wob).multiply(faceUp).multiply(spin);
        s.castShadow = true;
        studs.push({ pos: s.position.clone(), n: Z.clone().applyQuaternion(wob) });
        g.add(s);
      }
    });
    var ind = indicator(FACE_Z + 0.4);
    g.add(ind); g.userData.indicator = ind;

    // glints driven by rotation/motion: a star flares when its jewel's
    // normal aligns with the halfway vector of the moving key light and
    // the viewer — so glints sweep across the dome as you tilt, they
    // don't twinkle on their own timers.
    // one glint per stone, each with a jittered facet normal so different
    // stones flash at different tilt angles; brightness also scales with
    // tilt velocity so sweeping the cursor makes the whole dome scintillate
    var sparks = [];
    for (var k = 0; k < studs.length; k++) {
      var sd = studs[k];
      var sm = new THREE.SpriteMaterial({
        map: sparkTex, color: 0xffffff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
        rotation: Math.random() * Math.PI
      });
      var sp = new THREE.Sprite(sm);
      sp.position.copy(sd.pos).addScaledVector(sd.n, 5);
      // Wide facet-normal spread (~±22°) matched to the halfway vector's
      // swing so the tilt sweep catches different stones.
      var jn = sd.n.clone()
        .add(new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.1))
        .normalize();
      sparks.push({ s: sp, n: jn, size: 8 + Math.random() * 8, sharp: 30 + Math.random() * 30 });
      g.add(sp);
    }
    var lastTX = 0, lastTY = 0, motion = 0;
    g.userData.update = function () {
      // smoothed tilt velocity -> extra scintillation while moving
      motion += (Math.min(1, (Math.abs(tiltX - lastTX) + Math.abs(tiltY - lastTY)) * 30) - motion) * 0.12;
      lastTX = tiltX; lastTY = tiltY;
      var L = new THREE.Vector3(-70 - tiltX * 60, 90 - tiltY * 40, 160).normalize();
      var H = L.add(new THREE.Vector3(0, 0, 1)).normalize();
      var gain = 3.0 + motion * 2.5; // flat-plate alignments peak lower
      for (var n2 = 0; n2 < sparks.length; n2++) {
        var o = sparks[n2];
        var nw = o.n.clone().applyEuler(g.rotation);
        var b = Math.pow(Math.max(0, nw.dot(H)), o.sharp);
        o.s.material.opacity = Math.min(1, b * gain);
        var sc = o.size * (0.5 + 0.8 * Math.min(1, b * (0.8 + motion)));
        o.s.scale.set(sc, sc, 1);
      }
    };
    return g;
  }

  function brushedRoughness() {
    var c = document.createElement('canvas'); c.width = 64; c.height = 512;
    var x = c.getContext('2d');
    x.fillStyle = '#666'; x.fillRect(0, 0, 64, 512);
    for (var i = 0; i < 900; i++) {
      var y = Math.random() * 512;
      x.fillStyle = 'rgba(' + (Math.random() > 0.5 ? '255,255,255' : '0,0,0') + ',' + (Math.random() * 0.25) + ')';
      x.fillRect(0, y, 64, 1); // horizontal lines in UV = concentric rings after lathe
    }
    return new THREE.CanvasTexture(c);
  }

  // concentric-ring roughness for the flat (planar-UV) face disc
  function ringsRoughness() {
    var c = document.createElement('canvas'); c.width = c.height = 512;
    var x = c.getContext('2d');
    x.fillStyle = '#666'; x.fillRect(0, 0, 512, 512);
    for (var i = 0; i < 700; i++) {
      x.beginPath();
      x.arc(256, 256, Math.random() * 256, 0, Math.PI * 2);
      x.strokeStyle = 'rgba(' + (Math.random() > 0.5 ? '255,255,255' : '0,0,0') + ',' + (Math.random() * 0.22) + ')';
      x.lineWidth = 1; x.stroke();
    }
    return new THREE.CanvasTexture(c);
  }

  // shared machined puck: Ø104 x 16pt, 6pt chamfer ridge.
  // Face disc = primary material, chamfer rim = secondary material.
  function machinedPuck(g, faceMat, rimMat) {
    g.add(lathe([[52, 0], [52, 8], [46, 14], [40, 16]], rimMat));
    var face = new THREE.Mesh(new THREE.CircleGeometry(40, 64), faceMat);
    face.position.z = 16;
    face.castShadow = true;
    g.add(face);
    var ind = indicator(16.4);
    g.add(ind); g.userData.indicator = ind;
  }

  function buildChrome() {
    var g = new THREE.Group();
    var faceMat = reg(primaryMats, new THREE.MeshStandardMaterial({
      color: 0xc4c4c4, metalness: 0.95, roughness: 0.3,
      roughnessMap: ringsRoughness(), envMap: envTex, envMapIntensity: 1.3
    }));
    var rimMat = reg(primaryShadeMats, new THREE.MeshStandardMaterial({
      color: 0x9f9f9f, metalness: 0.95, roughness: 0.32,
      roughnessMap: brushedRoughness(), envMap: envTex, envMapIntensity: 1.3
    }));
    rimMat.userData.shade = 0.8;
    machinedPuck(g, faceMat, rimMat);
    return g;
  }

  function buildMatte() {
    var g = new THREE.Group();
    var faceMat = reg(primaryMats, new THREE.MeshStandardMaterial({
      color: 0x4a4a4a, roughness: 0.85, metalness: 0.05,
      side: THREE.DoubleSide // concave bowl shows its inner surface
    }));
    var sideMat = reg(primaryShadeMats, new THREE.MeshStandardMaterial({ color: 0x363636, roughness: 0.88, metalness: 0.05 }));
    sideMat.userData.shade = 0.72;
    // Dished shutter-button profile (matte cross-section diagram):
    // straight cylinder walls, CONCAVE face sinking 3.5pt at center.
    // Fully rounded shoulder: fillet = half the button height, a
    // complete half-round rubber rim from mid-wall to face.
    var fillet = 8;
    var sidePts = [[52, 0]];
    for (var fa = 0; fa <= 10; fa++) {
      var ang = (fa / 10) * Math.PI / 2;
      sidePts.push([52 - fillet + fillet * Math.cos(ang),
                    16 - fillet + fillet * Math.sin(ang)]);
    }
    g.add(lathe(sidePts, sideMat));
    // Deep bowl, profile center → rim so lathe normals face the viewer
    // and the tilt light shades a real crescent inside the dish.
    var dishDepth = 6, dishR = 44; // dish meets the full-round rim at r=44
    // Concentric ridge rings machined into the bowl (vinyl-record
    // texture): a fine sine ripple on the parabolic dish, fading
    // toward the rim for a smooth outer band.
    var ridgeCount = 13, ridgeAmp = 0.3;
    var dishPts = [];
    for (var d = 0; d <= 140; d++) {
      var t = d / 140;
      var rr = dishR * t;
      // No ridges under the record dot: flat within r=13, fade 13→18.
      var centerClear = Math.min(1, Math.max(0, (rr - 13) / 5));
      var z = 16 - dishDepth * (1 - t * t)
            + ridgeAmp * Math.sin(t * ridgeCount * Math.PI * 2)
              * (1 - t * 0.85) * centerClear;
      dishPts.push([Math.max(rr, 0.001), z]);
    }
    var face = lathe(dishPts, faceMat);
    face.castShadow = true;
    g.add(face);
    // dot rests at the bottom of the dish
    var ind = indicator(16 - dishDepth + 0.4);
    g.add(ind); g.userData.indicator = ind;
    return g;
  }

  function buildDisco() {
    var g = new THREE.Group();
    var proud = 8; // same protrusion as the soccer ball
    var ballGroup = new THREE.Group();

    // dark core showing through the grout lines between tiles
    var coreMat = reg(primaryMats, new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: 0.85 }));
    ballGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R - 1, 48, 32), coreMat));

    // mirror tiles: latitude bands around a vertical axis, instanced
    var tileMat = reg(secondaryMats, new THREE.MeshStandardMaterial({
      color: 0xd8d8de, metalness: 1.0, roughness: 0.12, flatShading: true,
      envMap: envTex, envMapIntensity: 1.6
    }));
    var pitch = 6.4, tileSize = 5.2;
    var placements = [];
    for (var band = 0; ; band++) {
      var th = (band + 0.5) * pitch / R;
      if (th > Math.PI - 0.08) break;
      var nT = Math.max(3, Math.round(2 * Math.PI * R * Math.sin(th) / pitch));
      for (var i = 0; i < nT; i++) {
        placements.push({ th: th, ph: (i + (band % 2) * 0.5) * Math.PI * 2 / nT });
      }
    }
    var inst = new THREE.InstancedMesh(new THREE.BoxGeometry(tileSize, tileSize, 0.9), tileMat, placements.length);
    var dummy = new THREE.Object3D();
    var dirs = [];
    placements.forEach(function (pl, idx) {
      var d = new THREE.Vector3(
        Math.sin(pl.th) * Math.cos(pl.ph),
        Math.cos(pl.th),                    // y = vertical spin axis
        Math.sin(pl.th) * Math.sin(pl.ph)
      );
      dirs.push(d);
      dummy.position.copy(d).multiplyScalar(R - 0.45);
      dummy.lookAt(d.x * R * 2, d.y * R * 2, d.z * R * 2);
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
    });
    inst.castShadow = true;
    ballGroup.add(inst);
    ballGroup.position.z = proud;
    g.add(ballGroup);

    var ind = indicator(proud + R + 1.5);
    g.add(ind); g.userData.indicator = ind;

    // glints parented to the ball so they orbit with the spin
    var sparks = [];
    var step = Math.max(1, Math.floor(dirs.length / 48));
    for (var k = 0; k < dirs.length; k += step) {
      var sm = new THREE.SpriteMaterial({
        map: sparkTex, color: 0xffffff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
        rotation: Math.random() * Math.PI
      });
      var sp = new THREE.Sprite(sm);
      sp.position.copy(dirs[k]).multiplyScalar(R + 3);
      sparks.push({ s: sp, n: dirs[k], size: 8 + Math.random() * 9, sharp: 30 + Math.random() * 60 });
      ballGroup.add(sp);
    }
    g.userData.update = function () {
      // static ball — glints respond to tilt only, like the other concepts
      var L = new THREE.Vector3(-70 - tiltX * 60, 90 - tiltY * 40, 160).normalize();
      var H = L.add(new THREE.Vector3(0, 0, 1)).normalize();
      for (var n2 = 0; n2 < sparks.length; n2++) {
        var o = sparks[n2];
        var nw = o.n.clone().applyEuler(g.rotation);
        var b = Math.pow(Math.max(0, nw.dot(H)), o.sharp);
        o.s.material.opacity = Math.min(1, b * 1.5);
        var sc = o.size * (0.5 + 0.8 * b);
        o.s.scale.set(sc, sc, 1);
      }
    };
    return g;
  }

  var CONCEPTS = [
    { name: 'Soccer Ball', note: '32-panel truncated icosahedron Ø104pt, subtle panel relief with stitched seams, 62pt proud of the glass.', build: buildSoccer },
    { name: 'Bejeweled', note: 'Flat pavé plate Ø104×12pt, diamond rings set on the face — glints sweep as you tilt.', build: buildBejeweled },
    { name: 'Chrome', note: 'Machined puck Ø104×16pt, 6pt chamfer, concentric brushed finish. Sits fully proud.', build: buildChrome },
    { name: 'Matte', note: 'Dished shutter key Ø104×16pt — concave face sinks 3.5pt to cradle the fingertip, rubbery matte finish.', build: buildMatte },
    { name: 'Disco Ball', note: 'Mirror ball Ø104pt — mirror tiles flash as you tilt. 62pt proud.', build: buildDisco }
  ];

  return {
    CONCEPTS: CONCEPTS,
    VIEW: VIEW,
    RED: RED,
    // host page must call this (e.g. on pointermove) so the glint updaters
    // in buildBejeweled/buildDisco track the cursor tilt
    setTilt: function (x, y) { tiltX = x; tiltY = y; },
    mats: {
      primary: primaryMats,
      secondary: secondaryMats,
      dot: dotMats,
      primaryShade: primaryShadeMats
    },
    // clear registries before building a fresh concept so the color pickers
    // only ever touch the materials of the button currently on screen
    resetMats: function () {
      primaryMats.length = 0;
      secondaryMats.length = 0;
      dotMats.length = 0;
      primaryShadeMats.length = 0;
    }
  };
};
