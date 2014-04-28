/**
 *
 * @class
 */
cwt.ButtonGroup = my.Class( /** @lends cwt.ButtonGroup.prototype */ {

  STATIC: {
    PADDING: 10
  },

  constructor: function (slotsX,slotsY) {
    this.buttons = [];
    this.selected = 0;

    this.curSlot = 0;
    this.slotW = parseInt((cwt.Screen.width-((slotsX+1)*10))/slotsX, 10);
    this.slotH = parseInt((cwt.Screen.height-((slotsY+1)*10))/slotsY, 10);
  },

  addButton: function (slotX,slotY,slotsW,slotsH,key,font) {
    var x = this.slotW*slotX + (cwt.ButtonGroup.PADDING*(slotX));
    var y = this.slotH*slotY + (cwt.ButtonGroup.PADDING*(slotY));
    var w = this.slotW*slotsW + (cwt.ButtonGroup.PADDING*(slotsW-1));
    var h = this.slotH*slotsH + (cwt.ButtonGroup.PADDING*(slotsH-1));

    var btn = new cwt.uiGameButton(x,y,w,h,key,font);

    this.buttons.push(btn);
    if (this.buttons.length === 1) {
      this.buttons[0].inFocus = true;
    }
  },

  activeButton: function () {
    return this.buttons[this.selected];
  },

  handleInput: function (input) {
    if (cwt.DEBUG) cwt.assert(input !== null);

    var res = true;
    this.buttons[this.selected].inFocus = false;

    switch (input.key) {
      case cwt.Input.TYPE_UP:
      case cwt.Input.TYPE_LEFT:
        this.selected--;
        if (this.selected < 0) {
          this.selected = this.buttons.length-1;
        }
        break;

      case cwt.Input.TYPE_RIGHT:
      case cwt.Input.TYPE_DOWN:
        this.selected++;
        if (this.selected >= this.buttons.length) {
          this.selected = 0;
        }
        break;

      default : res = false;
    }

    this.buttons[this.selected].inFocus = true;

    return res;
  },

  draw: function (ctx) {
    for (var i= 0, e= this.buttons.length; i<e; i++) {
      this.buttons[i].draw(ctx);
    }
  }
});