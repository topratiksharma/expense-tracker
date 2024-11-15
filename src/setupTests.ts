import '@testing-library/jest-dom/extend-expect'

// Ignore React warning until
// https://github.com/kentcdodds/react-testing-library/issues/281 is fixed.
// See also https://github.com/facebook/react/pull/14853
const originalConsoleError = console.error
console.error = (...args: any[]) => {
  if (
    args[0] &&
    args[0].startsWith(
      'Warning: An update to %s inside a test was not wrapped in act(...).'
    )
  ) {
    return
  }
  originalConsoleError(...args)
}
