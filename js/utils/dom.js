// DOM helpers. `addElement` is the building block the whole interface is written
// with, and `empty` is how a panel is cleared before it is redrawn.
//
// Both lived at the bottom of js/systems/planner.js, between the daily plans and the
// test maps, which is nowhere anyone would look for them. Nothing about them is
// specific to a system, so they belong here with the other general helpers.
//
// Concatenated straight after js/core/bootstrap.js. js/ui/interface.js calls
// addElement at definition time -- its very first lines build the combat panels --
// and function declarations hoist across the whole concatenated scope, so the order
// was never what made that work. It is stated here rather than relied on quietly.

function addElement(parent_element, elem, id, cls) {
  const newelem = document.createElement(elem);
  if (id) newelem.id = id;
  if (cls) newelem.className = cls;
  parent_element.appendChild(newelem);
  return newelem;
}

function empty(dom) {
  while (dom.lastChild) {
    dom.removeChild(dom.lastChild);
  }
}
