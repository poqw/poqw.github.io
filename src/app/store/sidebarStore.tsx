import React, { createContext, Dispatch, useContext, useReducer } from 'react'

type State = {
  isDrawerOpened: boolean
  [key: string]: boolean
}

type ActionType = 'ITEM_CLICKED' | 'DRAWER_TOGGLED'

interface Payload {
  clickedItemName: string
}

export interface SidebarAction {
  type: ActionType
  payload?: Payload
}

const initialState: State = {
  isDrawerOpened: false,
  cook: false,
  dev: true
}

const StateContext = createContext<State>(initialState)
const DispatchContext = createContext<Dispatch<SidebarAction>>(() => {})

export const useSidebarState = (): State => useContext(StateContext)
export const useSidebarDispatch = (): Dispatch<SidebarAction> => useContext(DispatchContext)

const authReducer = (state: State, action: SidebarAction): State => {
  switch (action.type) {
    case 'DRAWER_TOGGLED':
      return { ...state, isDrawerOpened: !state.isDrawerOpened }
    case 'ITEM_CLICKED':
      return { ...state, [action.payload.clickedItemName]: !state[action.payload.clickedItemName] }
    default:
      return state
  }
}

export const SidebarStoreProvider: React.FC = ({ children }) => {
  const [status, dispatch] = useReducer(authReducer, initialState)

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={status}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}
