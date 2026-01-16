import { stopCarAnimation } from '@/components/car/car-animation/animate-car';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { removeCarStore } from '@/state/car-store';
import { handleErrors, handleErrorsVoid } from '@/utils/handle-errors';
import { createCar } from '@api/garage/create-car';
import { deleteCar } from '@api/garage/delete-car';
import { updateCar } from '@api/garage/update-car';
import { appState } from '@state/app-state';
import { carState } from '@state/car-state';
import { eventState } from '@state/events/event-state';
import { garageList } from '@ui/garage/helpers/garage-list';

let isControllerStarted = false;

export function startGarageController(): void {
  if (isControllerStarted) {
    return;
  }
  isControllerStarted = true;

  eventState.on('car:create', async (payload) => {
    if (!payload) {
      return;
    }

    const created = await handleErrors(
      () => createCar(payload.name, payload.color),
      POPUP_MESSAGES.carCreateFailed(),
    );

    if (!created) {
      return;
    }

    carState.add(created);
    eventState.emit('updateform:reset');
    eventState.emit('garage:refresh');
  });

  eventState.on('car:update', async (payload) => {
    if (!payload) {
      return;
    }

    const updated = await handleErrors(
      () => updateCar(payload.id, payload.name, payload.color),
      POPUP_MESSAGES.carUpdateFailed(payload.id),
    );

    if (!updated) {
      return;
    }

    carState.update(updated);
    eventState.emit('garage:refresh');
  });

  eventState.on('car:delete', async (payload) => {
    if (!payload) {
      return;
    }

    const success = await handleErrorsVoid(
      () => deleteCar(payload.id),
      POPUP_MESSAGES.carDeleteFailed(payload.id),
    );

    if (!success) {
      return;
    }

    stopCarAnimation(payload.id);

    carState.remove(payload.id);
    removeCarStore(payload.id);

    const maxPage = Math.ceil(carState.totalCount / appState.perPage);
    if (appState.garagePage > maxPage) {
      appState.garagePage = maxPage > 0 ? maxPage : 1;
    }

    garageList.render();
    eventState.emit('car:deleted', payload.id);
  });
}
