// (Int, Int) -> PropertyModel
cwt.propertyModelFactory = (points = 20, owner = -1) => ({
  points,
  owner
});

// (PropertyModel, UnitModel) -> PropertyModel
cwt.captureProperty = (propertyModel, capturerUnitModel) => {
  const points = propertyModel.points - parseInt(capturerUnitModel.hp / 10, 10);
  const captured = points <= 0;
  const owner = captured ? capturerUnitModel.owner : propertyModel.owner;
  // TODO change type
  return cwt.propertyModelFactory(captured ? 20 : points, owner);
};
