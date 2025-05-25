"use client";

import { create } from 'zustand';

interface AnimationState {
  isAnimating: boolean;
  toggleAnimation: () => void;
}

export const useAnimationState = create<AnimationState>((set) => ({
  isAnimating: true,
  toggleAnimation: () => set((state) => ({ isAnimating: !state.isAnimating })),
}));