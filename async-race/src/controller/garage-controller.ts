import { stopCarAnimation } from '@/components/car/car-animation/animate-car';
import { getCarStore, removeCarStore } from '@/state/car-store';
import { createCar } from '@api/garage/create-car';
import { deleteCar } from '@api/garage/delete-car';
import { updateCar } from '@api/garage/update-car';
import { errorPopup } from '@components/error/error';
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

    try {
      const created = await createCar(payload.name, payload.color);
      carState.add(created);
      eventState.emit('updateform:reset');
      eventState.emit('garage:refresh');
    } catch {
      errorPopup.show('Failed to create a new car');
    }
  });

  eventState.on('car:update', async (payload) => {
    if (!payload) {
      return;
    }

    try {
      const updated = await updateCar(payload.id, payload.name, payload.color);
      carState.update(updated);
    } catch {
      errorPopup.show('Failed to update the chosen car');
    }
  });

  eventState.on('car:delete', async (payload) => {
    if (!payload) {
      return;
    }

    try {
      await deleteCar(payload.id);

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
    } catch {
      errorPopup.show('Failed to delete the chosen car');
    }
  });
}
