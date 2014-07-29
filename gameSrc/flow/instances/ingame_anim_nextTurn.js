cwt.Gameflow.addState({
  id: "ANIMATION_NEXT_TURN",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});

/*
 util.scoped(function(){

 view.registerAnimationHook({
 key: "nextTurn_invoked",

 prepare: function(){

 view.showInfoMessage(
 model.data_localized("day")+
 " "+
 model.round_day+
 " - "+
 model.player_data[model.round_turnOwner].name,
 999999999
 );

 if( controller.features_client.audioMusic ){
 var commanders = model.co_data[model.round_turnOwner].coA;
 controller.coMusic_playCoMusic( ( commanders )? commanders.music : null );
 }
 else view.message_closePanel(1000);
 },

 render: function(){},

 update: function( delta ){},

 isDone: function(){
 return !view.hasInfoMessage();
 }

 });

 });
//