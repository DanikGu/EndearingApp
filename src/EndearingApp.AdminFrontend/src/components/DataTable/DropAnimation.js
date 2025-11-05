import {
  defaultDropAnimationSideEffects,
  useSensors,
  useSensor,
  TouchSensor,
  KeyboardSensor,
  MouseSensor,
} from '@dnd-kit-svelte/core';


export const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export const sensors = useSensors(useSensor(TouchSensor), useSensor(KeyboardSensor), useSensor(MouseSensor));
