import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { initialState } from './initialState';

const GameContext = createContext();

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE_HABIT':
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload.xp,
          // Level up logic would go here or in a utility
        },
        stats: {
          ...state.stats,
          totalHabitsCompleted: state.stats.totalHabitsCompleted + 1,
        }
      };
    case 'UPDATE_PSYCH':
      return {
        ...state,
        user: {
          ...state.user,
          psych: Math.min(100, Math.max(0, state.user.psych + action.payload)),
        }
      };
    case 'SET_USER_DATA':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Persistence logic could be added here
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
