class ManagedObjectService {  
  boot(object) {
    const keys = Object.keys(object)
    const gameObjectKeys = keys.filter(key => object[key] && object[key].prototype === ManagedObject)
    const services = {}
    
    gameObjectKeys.forEach(key => services[key] = new (object[key])())
    
    gameObjectKeys.forEach(key => services[key].onConstruct(this))
    
    this.services = services
  }
  
  getService(name) {
    const service = this.services[name]
    
    if (!service) {
      throw new Error("unknown service " + name)
    }
    
    return service
  } 
  
  inject(scriptPath) {
    const PATH = "192.168.0.5:12345/"
    
    alert("loading "  + PATH + scriptPath)
    
    const el = document.createElement("script")
    
    el.setAttribute("type", "text/javascript")
    el.setAttribute("src", PATH + scriptPath)
    
    document.body.appendChild(el)
  }
}

class ManagedObject {
  onConstruct(services, objectName) {
    this.objectName = objectName
  }
  
  toString() {
    return "SERVICE: " + this.objectName;
  }
}
