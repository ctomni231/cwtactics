controller.errorPanel = document.getElementById("cwt_errorPanel");

controller.errorButtons = controller.generateButtonGroup( 
  controller.errorPanel,
  "ui-font ui-box-font ui-box-button",
  "ui-font ui-box-font ui-box-button active",
  "ui-font ui-box-font ui-box-button inactive"
);

controller.errorPanelVisible = false;