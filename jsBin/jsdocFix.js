exports.handlers = {
  newDoclet: function(e) {
    console.log(e.doclet.meta.path + '/' + e.doclet.meta.filename)
  }
}