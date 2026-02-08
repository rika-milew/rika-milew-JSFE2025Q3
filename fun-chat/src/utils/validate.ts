import { VALIDATION_RULES } from '@/constants/validation-rules';
import { userStore } from '@/store/user-store';

import type { ValidationRule } from '@/types/types';

export function validate(field: 'login' | 'password', value: string, otherValue?: string): boolean {
  const rules: ValidationRule[] = VALIDATION_RULES[field];

  for (const rule of rules) {
    if (!rule.test(value, otherValue)) {
      userStore.showError(field, rule.error);
      return false;
    }
  }

  userStore.removeError(field);
  return true;
}
