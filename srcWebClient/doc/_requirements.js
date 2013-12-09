/*

  |Environment|Error|Solution|
  |------|------|:--------|
  |**InternetExplorer 9 and up**|Canvas is not available|Add `<!DOCTYPE html>` to the head of your HTML document. **Important: (!)** You have to write it exact like above with the correct letter case else the Internet Explorer will ignore it and prevents using HTML5 stuff.|
  |**InternetExplorer**|syntax error for keyword const| The Internet Explorer cannot understand the `const` keyword of javascript. You should use `var` with capital letters as workaround. |
  |**Firefox**|Mouse input has `NaN` x and y coordinates|`Webkit`and `Mozilla` using different mouse event properties. In `WebKit` environments you can use `ev.offsetX` or `ev.offsetY` to grab the position, but in `Mozilla` environments you have to use `ev.layerX` and `ev.layerY`. |

*/
