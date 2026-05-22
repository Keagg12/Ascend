import React from 'react';
import { useGame } from '../store/GameContext';
import FloatLayer from '../components/shared/FloatLayer';
import StatCard from '../components/shared/StatCard';
import SectionHeader from '../components/shared/SectionHeader';
import HabitBtn from '../components/shared/HabitBtn';
import { HABITS } from '../constants/habits';
import { FaFire, FaBolt, FaBrain, FaDumbbell, FaCode, FaBook } from 'react-icons/fa';

const Dashboard = () => {
  const { state, dispatch } = useGame();
  
  const iconMap = {
    brain: FaBrain,
    fitness: FaDumbbell,
    book: FaBook,
    code: FaCode
  };

  const handleHabitClick = (habit) => {
    dispatch({ type: 'COMPLETE_HABIT', payload: { xp: habit.xp } });
    // Trigger toast or sound here
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Daily Streak" value={state.stats.streaks} icon={FaFire} color="amber" />
        <StatCard label="Energy" value={`${state.user.psych}%`} icon={FaBolt} color="purple" />
        <StatCard label="Focus Power" value="85" icon={FaBrain} color="cyan" />
        <StatCard label="Tasks Done" value={state.stats.totalHabitsCompleted} icon={FaBolt} color="emerald" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <SectionHeader title="Active Habits" subtitle="Complete daily protocols to earn XP" />
          <div className="grid sm:grid-cols-2 gap-4">
            {HABITS.map(habit => (
              <HabitBtn 
                key={habit.id}
                name={habit.name}
                xp={habit.xp}
                icon={iconMap[habit.icon]}
                onClick={() => handleHabitClick(habit)}
                color={habit.category === 'mental' ? 'purple' : habit.category === 'physical' ? 'emerald' : 'cyan'}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <SectionHeader title="Recent Activity" />
          <FloatLayer className="h-64 overflow-y-auto">
            {state.history.length === 0 ? (
              <p className="text-slate-500 text-sm text-center mt-10 italic">No protocols recorded yet...</p>
            ) : (
              <ul className="space-y-3">
                {state.history.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex justify-between">
                    <span>{item.name}</span>
                    <span className="text-cyan-500">+{item.xp} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </FloatLayer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
