import { AbstractControl } from '@angular/forms';

export function uniqueColorsValidator(formArray: AbstractControl): { [key: string]: boolean } | null {
  const colors = formArray.value.map((player: any) => player.color);
  const uniqueColors = new Set(colors);

  return colors.length !== uniqueColors.size ? { 'uniqueColors': true } : null;
}
