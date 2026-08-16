// Map rendering and the mastery panel. Draws explored areas onto a canvas and
// builds the mastery tree the player spends training progress in.

function _drawmap(mapdata) {
  if (test.maps.gui) {
    empty(test.maps.gui);
    document.body.removeChild(test.maps.gui);
    delete test.maps.gui;
    empty(test.maps.guioverlay);
    document.body.removeChild(test.maps.guioverlay);
    delete test.maps.guioverlay;
  }
  const size = test.maps.cellsize;
  test.maps.gui = addElement(document.body, "canvas");
  test.maps.gui.style.position = "absolute";
  test.maps.gui.style.top = 0;
  test.maps.gui.style.left = 0;
  test.maps.guit = test.maps.gui.getContext("2d");
  test.maps.guioverlay = addElement(document.body, "canvas");
  test.maps.guioverlay.style.position = "absolute";
  test.maps.guioverlay.width = window.innerWidth;
  test.maps.guioverlay.height = window.innerHeight;
  test.maps.guioverlay.style.pointerEvents = "none";
  test.maps.guioverlay.style.top = 0;
  test.maps.guioverlay.style.left = 0;
  draggable(test.maps.gui, test.maps.gui);
  const canvas = test.maps.gui;
  const tmain = test.maps.guit;
  const tmaino = test.maps.guioverlay.getContext("2d");
  canvas.height = mapdata.data.length * size;
  canvas.width = mapdata.data[0].length * size;
  for (const y in mapdata.data) {
    for (const x in mapdata.data[y]) {
      tmain.fillStyle = mapdata.c[mapdata.data[y][x]];
      tmain.fillRect(x * size, y * size, size, size);
    }
  }
  // mapdata.guicache = tmain.getImageData(0,0,canvas.width,canvas.height);
  test.maps.gui.addEventListener("mousemove", (xy) => {
    //tmain.clearRect(0,0,canvas.height,canvas.width)
    tmaino.clearRect(
      0,
      0,
      test.maps.guioverlay.height,
      test.maps.guioverlay.width,
    );
    //tmain.putImageData(mapdata.guicache,0,0)
    const l = parseInt(test.maps.gui.style.left);
    const t = parseInt(test.maps.gui.style.top);
    const cx = xy.clientX - parseInt(test.maps.gui.style.left);
    const cy = xy.clientY - parseInt(test.maps.gui.style.top);
    tmaino.strokeStyle = "lime";
    tmaino.strokeRect(
      l + ((cx / size) << 0) * size,
      t + ((cy / size) << 0) * size,
      size,
      size,
    );
    tmaino.strokeStyle = "red";
    tmaino.beginPath();
    tmaino.moveTo(cx + 20 + l, cy + 20 + t);
    tmaino.lineTo(cx + 35 + l, cy + 30 + t);
    tmaino.lineTo(cx + 90 + l, cy + 30 + t);
    tmaino.stroke();
    tmaino.closePath();
    tmaino.font = 'italic  bold .6em "MS Gothic"';
    tmaino.fillStyle = "crimson";
    tmaino.fillText(
      "X:" + (((cx / size) << 0) + 1) + " Y:" + (((cy / size) << 0) + 1),
      cx + 40 + l,
      cy + 45 + t,
    );
    tmaino.fillText(
      mapdata.d[mapdata.data[(cy / size) << 0][(cx / size) << 0]],
      cx + 40 + l,
      cy + 25 + t,
    );
  });
  test.maps.gui.addEventListener("mouseleave", () => {
    tmaino.clearRect(
      0,
      0,
      test.maps.guioverlay.height,
      test.maps.guioverlay.width,
    );
  });
}

/*pts=[];
wind = -2;
canvas = addElement(document.body,'canvas'); canvas.style.position='absolute'; canvas.style.top=canvas.style.left=0; canvas.style.pointerEvents='none'
tmain = canvas.getContext('2d'); canvas.height = window.innerHeight; canvas.width = window.innerWidth;
tmain.globalCompositeOperation='destination-over'; tmain.fillStyle='white'; tmain.font='20px MS Gothic';
drawsnow = setInterval(()=>{ //tmain.clearRect(0,0,window.innerWidth,window.innerHeight);
  for(let a in pts){
    let p = pts[a]; p.windtimedest>p.windtime?p.windtime++:p.windtime--;
    if(p.windtime===p.windtimedest) {p.windtimedest=rand(550); p.windold=p.wind; p.wind = random()*wind}
    p.y+=.5; p.x+=(p.wind-p.windold)*(Math.min(p.windtimedest/Math.max(p.windtimedest,p.windtime)))
    tmain.fillText(p.c,p.x,p.y);
    if(p.y>=window.innerHeight) pts.splice(pts[a],1);
  }
  if(random()<.1){pts.push({x:rand(window.innerWidth*1.5+10),y:0,wind:.1,windtimedest:1,switch:true,windold:.1,windded:0,windtime:0,c:select(['*',"'",'.','。'])})}
},10)*/

function Mastery(id) {
  this.id = id || -1;
  this.name = "dummy";
  this.desc = function () {
    return "dummy";
  };
  this.condd = function () {
    return "????????";
  };
  this.icon; // = [0,0];
  this.x = 20;
  this.y = 20;
  this.data = { lvl: 0 };
  this.limit = 10;
  this.have = false;
  this.linkto;
  this.linkfrom;
  this.cond = function () {
    return true;
  };
  this.onlevel = function () {};
}

mastery.str1 = new Mastery(1);
mastery.str1.name = i18n.t("content.mastery.str1.name");
mastery.str1.desc = function () {
  return (
    "Simple improvements to body physique" +
    dom.dseparator +
    '<div style="color:cyan;background-color:midnightblue;font-size:small">Effects:</div><div style="color:yellow;background-color:#123;font-size:small"><br>STR +0.5  |  HP +5  |  SAT +1<br><br></div><div style="color:cyan;background-color:midnightblue;font-size:small">Current:</div><div style="color:lime;background-color:#123;font-size:small"><br>STR +' +
    mastery.str1.data.lvl * 0.5 +
    "  |  HP +" +
    mastery.str1.data.lvl * 5 +
    "  |  SAT +" +
    mastery.str1.data.lvl +
    "<br><br></div>"
  );
};
mastery.str1.have = true;
mastery.str1.onlevel = function () {
  you.stra += 0.5;
  you.sata += 1;
  you.hpa += 5;
};
mastery.str1.icon = [6, 3];

mastery.agl1 = new Mastery(2);
mastery.agl1.name = i18n.t("content.mastery.agl1.name");
mastery.agl1.desc = function () {
  return (
    "" +
    dom.dseparator +
    '<div style="color:cyan;background-color:midnightblue;font-size:small">Effects:</div><div style="color:yellow;background-color:#123;font-size:small"><br>STR +0.5  |  HP +5  |  SAT +1<br><br></div><div style="color:cyan;background-color:midnightblue;font-size:small">Current:</div><div style="color:lime;background-color:#123;font-size:small"><br>STR +' +
    mastery.str1.data.lvl * 0.5 +
    "  |  HP +" +
    mastery.str1.data.lvl * 5 +
    "  |  SAT +" +
    mastery.str1.data.lvl +
    "<br><br></div>"
  );
};
mastery.agl1.have = true;
mastery.agl1.x = 230;
mastery.agl1.limit = 10;
mastery.agl1.icon = [7, 3];

mastery.xtr1 = new Mastery(3);
mastery.xtr1.name = i18n.t("content.mastery.xtr1.name");
mastery.xtr1.have = true;
mastery.xtr1.x = 430;
mastery.xtr1.limit = 10;
mastery.xtr1.icon = [1, 7];

mastery.fse1 = new Mastery(4);
mastery.fse1.name = i18n.t("content.mastery.fse1.name");
mastery.fse1.x = 230;
mastery.fse1.y = 200;
mastery.fse1.linkfrom = [mastery.str1, mastery.agl1, mastery.xtr1];
mastery.xtr1.linkto = [mastery.fse1];
mastery.fse1.icon = [6, 1];

mastery.hstr1 = new Mastery(9);
mastery.hstr1.have = false;
mastery.hstr1.x = 125;
mastery.hstr1.linkfrom = [mastery.str1, mastery.agl1];
mastery.hstr1.limit = 1;
mastery.hstr1.icon = [5, 3];
mastery.hstr1.hidden = true;
mastery.str1.linkto = [mastery.fse1, mastery.hstr1];
mastery.agl1.linkto = [mastery.fse1, mastery.hstr1];

function _drawmwindow() {
  if (test.mguic) {
    empty(test.mguic);
    document.body.removeChild(test.mguic);
    delete test.mguic;
  }
  test.mguic = addElement(document.body, "div");
  test.mguic.style.height = 500;
  test.mguic.style.width = 500;
  test.mguic.style.padding = 2;
  test.mguic.style.position = "absolute";
  test.mguic.style.top = 100;
  test.mguic.style.left = 100;
  test.mguic.style.border = "2px solid black";
  test.mguic.style.backgroundColor = "#558";
  test.mguid = addElement(test.mguic, "div");
  test.mguid.style.height = 20;
  test.mguid.style.borderBottom = "2px solid rgb(0,40,64)";
  test.mguid.innerHTML = i18n.t("ui.panels.masteries");
  test.mguid.style.color = "lime";
  test.mguid.style.textAlign = "center";
  test.mguidk = addElement(test.mguid, "div");
  test.mguidk.innerHTML = "✖";
  test.mguidk.style.float = "right";
  test.mguidk.style.color = "black";
  test.mguidk.style.backgroundColor = "crimson";
  test.mguidk.addEventListener("click", function () {
    empty(test.mguic);
    document.body.removeChild(test.mguic);
    delete test.mguic;
  });
  test.mgui = addElement(test.mguic, "canvas");
  test.mgui.offsetx = 0;
  test.mgui.offsety = 0;
  draggable(test.mguid, test.mguic);
  const canvas = test.mgui;
  const tmain = test.mgui.getContext("2d");
  canvas.height = 478;
  canvas.width = 500;
  const HEIGHT = canvas.height;
  const WIDTH = canvas.width;
  const _gr = tmain.createLinearGradient(200, 200, 200, 500);
  _gr.addColorStop(0, "#000");
  _gr.addColorStop(1, "#123");
  tmain.fillStyle = _gr;
  tmain.fillRect(0, 0, WIDTH, HEIGHT);
  tmain.c = canvas;
  tmain._bg = tmain.getImageData(0, 0, WIDTH, HEIGHT);
  _renderm(tmain);
  test.mgui.addEventListener("mousemove", (xy) => {
    for (const a in mastery) {
      const m = mastery[a];
      if (
        xy.offsetX > m.x - 3 &&
        xy.offsetX < m.x + 53 &&
        xy.offsetY > m.y - 3 &&
        xy.offsetY < m.y + 53
      ) {
        if (test.mgui.selected && test.mgui.selected.id === m.id) {
          global.dscr.style.top =
            global.dscr.clientHeight + 60 + xy.clientY >
            document.body.clientHeight
              ? xy.clientY +
                30 +
                global.dscr.clientHeight -
                (xy.clientY +
                  30 +
                  global.dscr.clientHeight -
                  document.body.clientHeight) -
                global.dscr.clientHeight -
                30
              : xy.clientY + 30;
          global.dscr.style.left =
            global.dscr.clientWidth + 60 + xy.clientX >
            document.body.clientWidth
              ? xy.clientX +
                30 +
                global.dscr.clientWidth -
                (xy.clientX +
                  30 +
                  global.dscr.clientWidth -
                  document.body.clientWidth) -
                global.dscr.clientWidth -
                30
              : xy.clientX + 30;
          return;
        }
        test.mgui.selected = m;
        _renderm(tmain);
        if (!m.hidden && (m.dscv || m.have))
          dscr(
            xy,
            null,
            12,
            !m.have ? "????????" : m.name,
            !m.have ? m.condd : m.desc,
          );
        return;
      }
    }
    if (test.mgui.selected) {
      test.mgui.selected = null;
      empty(global.dscr);
      global.dscr.style.display = "none";
      _renderm(tmain);
    }
  });
  test.mgui.addEventListener("click", (xy) => {
    if (
      test.mgui.selected &&
      test.mgui.selected.data.lvl < test.mgui.selected.limit &&
      test.mgui.selected.have
    ) {
      test.mgui.selected.data.lvl++;
      test.mgui.selected.onlevel();
      you.stat_r();
      dom.d5_1_1m.update();
      dom.d5_3_1.update();
      global.dscr.children[1].innerHTML = test.mgui.selected.desc();
      _renderm(tmain, true);
    }
  });
}

function _renderm(tmain, forced) {
  tmain.clearRect(0, 0, tmain.c.width, tmain.c.height);
  tmain.putImageData(tmain._bg, 0, 0);
  const ofx = test.mgui.offsetx;
  const ofy = test.mgui.offsety;
  for (const a in mastery) {
    const m = mastery[a];
    if (mastery[a].have) {
      if (m.linkto)
        for (const b in m.linkto) {
          if (m.data.lvl <= 0 || (m.linkto[b].hidden && !m.linkto[b].have))
            break;
          const p = m.linkto[b];
          tmain.beginPath();
          tmain.moveTo(m.x + 25, m.y + 25);
          tmain.lineTo(p.x + 25, p.y + 25);
          if (p.have) {
            tmain.lineWidth = 6;
            tmain.strokeStyle = "#a44";
            tmain.stroke();
            tmain.lineWidth = 2;
            tmain.strokeStyle = "#ff0";
            tmain.stroke();
          } else {
            tmain.lineWidth = 6;
            tmain.strokeStyle = "#444";
            tmain.stroke();
            tmain.lineWidth = 1;
            tmain.strokeStyle = "#ccc";
            tmain.stroke();
          }
          tmain.closePath();
        }
    }
    if (m.linkfrom && !m.hidden) {
      let t = m.linkfrom.length;
      for (const c in m.linkfrom) {
        const p = m.linkfrom[c];
        if (p.data.lvl > 0) t--;
      }
      if (t === 0) m.have = true;
      else if (t !== m.linkfrom.length) {
        m.dscv = true;
        tmain.fillStyle = "#555";
        tmain.fillRect(m.x + ofx - 2, m.y + ofy - 2, 54, 54);
        tmain.fillStyle = "grey";
        tmain.fillRect(m.x + ofx, m.y + ofy, 50, 50);
        tmain.fillStyle = "#333";
        tmain.font = ' 1.2em "MS Gothic"';
        tmain.fillText("???", m.x + ofx + 9, m.y + ofy + 33);
      }
    }
    if (m.have) {
      tmain.fillStyle =
        test.mgui.selected && m.id === test.mgui.selected.id ? "lime" : "red";
      tmain.fillRect(m.x + ofx - 2, m.y + ofy - 2, 54, 54);
      tmain.fillStyle = "rgba(0,0,0,.5)";
      tmain.fillRect(m.x + ofx, m.y + ofy + 54, 50, 9);
      tmain.font = ' .6em "MS PGothic"';
      tmain.fillStyle =
        m.data.lvl === 0
          ? "crimson"
          : m.data.lvl === m.limit
            ? "lime"
            : "yellow";
      tmain.fillText(m.data.lvl + "/" + m.limit, m.x + ofx + 1, m.y + ofy + 62);
      if (m.icon) {
        const data = global._preic2_tmain.getImageData(
          (m.icon[0] - 1) * 50,
          (m.icon[1] - 1) * 50,
          50,
          50,
        );
        tmain.putImageData(data, m.x, m.y);
      }
    }
  }
}
