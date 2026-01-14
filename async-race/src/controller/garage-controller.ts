import { stopCarAnimation } from '@/components/car/car-animation/animate-car';
import { POPUP_MESSAGES } from '@/data/error-messages';
import { getCarStore, removeCarStore } from '@/state/car-store';
import { handleErrors } from '@/utils/handle-errors';
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
  });

  eventState.on('car:delete', async (payload) => {
    if (!payload) {
      return;
    }
    await handleErrors(() => deleteCar(payload.id), POPUP_MESSAGES.carDeleteFailed(payload.id));

    const car = getCarStore(payload.id);
    if (car) {
      stopCarAnimation(payload.id);
      car.container.remove();
    }

    carState.remove(payload.id);
    removeCarStore(payload.id);

    const maxPage = Math.ceil(carState.totalCount / appState.perPage);
    if (appState.garagePage > maxPage) {
      appState.garagePage = maxPage > 0 ? maxPage : 1;
    }

    await garageList.render();
    eventState.emit('car:deleted', payload.id);
  });
}
