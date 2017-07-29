/*

 Ultimate Wargame Engine (UWE)

 targets:  
   - open game state manager => redux ?
   - install necessary core helpers (for replays etc.)

 to be implemented:
   - strategy map
     - map display
     - displays possible fights
     - state based
     - info boxes
     - custom screens
   - tactic map (game round)
     - square based map
     - turn system 
   - game editor
     - resource overview
     - action/listener editor
     - action dispatcher
       - single
       - records
*/

{

  const openGameEditor = (body) => {
  
    const render = () => null
  
    const layout = panel(
    
      buttonGroup(
        alignLeft(),
        button("button.open.history"),
        button("button.open.replays"),
        button("button.open.dispatcher"),
        button("button.open.editor")),
        
      panel(
        id("history")),
        
      panel(
        id("replays")),
      
      panel(
        id("dispatcher")),
        
      panel(
        id("editor"),
        title("editor.title"),
        select("editor.select.file"),
        editor(id("editor")),        
        buttonGroup(
          alignRight(),
          button("buttons.revert", () => 
            byId("editor").setContent(store.getState().game.code.?)),
          button("buttons.save", () => 
            store?.dispatch(action("SAVE_FILE", "file:" + ?)))),
        
      buttonGroup(
        alignRight(),
        button("button.close"), 
        button("button.save")))
    
    const editor = render(layout)
    
    // side effect 
    body.appendChild(editor)
    
    return editor
  }
  
  const revertStateAction = history => (state, data) => 
    data.type == "GOTO_STATE" ? history[data.id] : state
  
  const setStateAction = (state, data) => 
    data.type == "SET_STATE" ? data.state : state

  const factory = () => {
    
    const noop = () => undefined
    
    const history = []
    
    const store = null
    
    return {
      getState: () => store.getState(),
      setState: (state) => store.dispatch({
        type: "SET_STATE",
        state 
      }),
      dispatch: (action) => store.dispatch(action),
      dispatchAll: (actions) => actions.forEach(x => store.dispatch(x)),
      getActions: (from, to) => [],
      gotoState: (id) => store.dispatch({
        type: "GOTO_STATE", 
        id 
      }),
      openGameEditor: noop
    }
  }
  
  window.createGWE = factory
}