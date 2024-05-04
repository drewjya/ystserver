import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { uuid } from 'src/common/uuid';

export const uploadConfig = (path?: string) => {
  return FileInterceptor(path ?? 'file', {
    storage: diskStorage({
      destination: process.env.STATIC_PATH,
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.');
        const val = uuid();
        cb(null, `${val}.${ext[ext.length - 1]}`);
      },
    }),
  });
};

export function removeStoragePath(val?: string) {
  if (!val) {
    return null;
  }
  return val.replace(process.env.STATIC_PATH + '/', '');
}

export function addStoragePath(val: string) {
  return `${process.env.STATIC_PATH}/${val}`;
}
