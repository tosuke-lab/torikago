export class CyclicDependencyError extends Error {
  constructor(name: string | number | symbol, resolutionStack: (string | number | symbol)[]) {
    name = name.toString()
    resolutionStack.push(name)
    const path = resolutionStack.map(a => a.toString()).join('->')
    const msg = `Could not resolve ${name}. Cyclic Dependency is detected.
    
    Resolution path: ${path}`
    super(msg)
  }
}
