let setAuthState: ((value: boolean) => void) | null = null

export const setAuthSetter = (setter: (value: boolean) => void) => {
  setAuthState = setter
}

export const updateAuthState = (value: boolean) => {
  if (setAuthState) {
    setAuthState(value)
  }
}
