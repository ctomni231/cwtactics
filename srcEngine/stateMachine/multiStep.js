controller.stateMachine.structure.MULTISTEP_IDLE = {
  
    nextStep: function(){

      var action = this.data.action;
      var actObj = this.data.actionObject;

      this.data.cleanMenu();
      this.data.cleanMovepath();

      actObj.prepareMenu( this.data );
      this.data.addEntry("done");

      return ( this.data.menuSize > 1 )? "ACTION_SUBMENU": "IDLE";

    }
  
};