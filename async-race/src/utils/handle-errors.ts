import { errorPopup } from '@/components/popup/error/error';

export async function handleErrors<T>(
  function_: () => Promise<T>,
  message: string,
): Promise<T | undefined> {
  try {
    return await function_();
  } catch (error) {
    console.error(error);
    errorPopup.show(message);

    return undefined;
  }
}

export async function handleErrorsVoid(
  function_: () => Promise<void>,
  message: string,
): Promise<boolean> {
  try {
    await function_();
    return true;
  } catch (error) {
    console.error(error);
    errorPopup.show(message);

    return false;
  }
}
