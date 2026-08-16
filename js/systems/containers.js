// Storage containers. A container is an item list that persists independently
// of the player's inventory, used for home storage and other stashes the player
// can deposit into and withdraw from.

function Container(id) {
  this.id = id || 0;
  this.c = [];
}

container.home_strg = new Container(1);
if (!home.trunk) {
  home.trunk = container.home_strg;
}
