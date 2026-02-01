import { createCar, deleteCar, updateCar } from '@/api/garage';
import { deleteWinner } from '@/api/winners';
import { stopCarAnimation } from '@/components/car/car-animation/stop-car-animation';
import { errorPopup } from '@/components/popup/error/error';
import { POPUP_MESSAGES } from '@/constants/error-messages';
import { appState } from '@/state/app-state';
import { carState } from '@/state/car-state';
import { removeCarStore } from '@/state/car-store';
import { eventState } from '@/state/events/event-state';
import { garageList } from '@/ui/garage/helpers/garage-list';

import type { Car, CarStateItem } from '@/types/types';

let isControllerStarted = false;

export function startGarageController(): void {
  if (isControllerStarted) {
    return;
  }
  isControllerStarted = true;

  eventState.on('car:create', async (payload: { name: string; color: string } | undefined) => {
    if (!payload) {
      return;
    }

    const created: Car | undefined = await createCar(payload.name, payload.color);

    if (!created) {
      errorPopup.show(POPUP_MESSAGES.carCreateFailed());
      return;
    }

    carState.add(created);

    eventState.emit('updateform:reset');
    eventState.emit('garage:refresh');
  });

  eventState.on(
    'car:update',
    async (payload: { id: number; name: string; color: string } | undefined) => {
      if (!payload) {
        return;
      }

      const updated: Car | undefined = await updateCar(payload.id, payload.name, payload.color);

      if (!updated) {
        errorPopup.show(POPUP_MESSAGES.carUpdateFailed());
        return;
      }

      carState.update(updated);

      eventState.emit('garage:refresh');
      eventState.emit('winners:refresh');
    },
  );

  eventState.on('car:delete', async (payload: { id: number } | undefined) => {
    if (!payload) {
      return;
    }

    const car: CarStateItem | undefined = carState.getById(payload.id);

    const success: boolean = await deleteCar(payload.id);

    if (!success) {
      errorPopup.show(POPUP_MESSAGES.carDeleteFailed(payload.id, car?.name));
      return;
    }

    deleteWinner(payload.id).catch((error: unknown) => {
      console.error('Failed to delete the winner', error);
    });

    stopCarAnimation(payload.id);
    carState.remove(payload.id);
    removeCarStore(payload.id);

    const maxPage: number = Math.ceil(carState.totalCount / appState.perPage);
    if (appState.garagePage > maxPage) {
      appState.garagePage = maxPage > 0 ? maxPage : 1;
    }

    garageList.render();

    eventState.emit('car:deleted', payload.id);
  });
}
