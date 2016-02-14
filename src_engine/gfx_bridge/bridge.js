function ignored_game_event(event) {
  cwt.log_warn("seems nobody wants to react on event " + event);
};

/**
 * called when an unit looses health
 *
 * @param {number} unit_id        no further desc.
 * @param {number} x              no further desc.
 * @param {number} y              no further desc.
 * @param {number} lost_health    no further desc.
 * @param {number} current_health no further desc.
 */
cwt.game_event_unit_lost_health = function (unit_id, x, y, lost_health, current_health) {
  ignored_game_event("unit_lost_health");
};
