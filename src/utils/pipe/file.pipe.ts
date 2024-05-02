import { ParseFilePipe } from '@nestjs/common';

export function parseFile(param: { isRequired: boolean }) {
  return new ParseFilePipe({
    fileIsRequired: param.isRequired,
  });
}
