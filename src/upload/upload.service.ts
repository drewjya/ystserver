import { HttpStatus, Injectable } from '@nestjs/common';
import { Gender } from '@prisma/client';
import { ExcelTherapist, convertToTherapist } from 'src/config/excel.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiException } from 'src/utils/exception/api.exception';
import * as xlsx from 'xlsx';

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) { }
  async processData(filePath: string) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData: ExcelTherapist[] = xlsx.utils.sheet_to_json(worksheet);

    // Return the JSON data
    let data = convertToTherapist(jsonData) ?? [];

    if (data.length !== 0) {
      await this.prisma.therapist.deleteMany()
      for (let index = 0; index < data.length; index++) {
        const curr = data[index];

        try {

          await this.prisma.$transaction(async (tx) => {
            const tags = await tx.tags.findMany({
              where: {
                name: {
                  in: curr.tags
                }
              }
            })
            const tagsIds = tags.map((e) => e.id)


            let cabangId;
            if (curr.cabang) {
              const cabang = await tx.cabang.findFirst({
                where: {
                  nama: {
                    equals: curr.cabang
                  }
                }
              })
              if (cabang) {

                cabangId = cabang.id
              }
            }

            const therapist = await tx.therapist.create({
              data: {
                gender: curr.gender?.toLowerCase() === "male" ? Gender.MALE : Gender.FEMALE,
                nama: curr.name,
                no: curr.no,
                cabang: cabangId ? {
                  connect: {
                    id: cabangId
                  }
                } : undefined
              }
            })


            if (tagsIds && tagsIds.length !== 0) {
              await tx.therapistSkillTag.createMany({
                data: tagsIds.map((e) => {
                  return {
                    tagsId: e,
                    therapistId: therapist.id
                  }
                })
              })
              console.log(`Success ${therapist.nama} ${therapist.id}`);
            }
          })
        } catch (error) {
          console.log(error);

          throw new ApiException({
            data: `Error on ${curr.name} (${curr.no}), untuk sebelumnya sudah sukses`,
            status: HttpStatus.BAD_REQUEST
          })
        }

      }

      // const tags = await this.prisma.tags.findMany({
      //   where: {
      //     name: {
      //       in: takeOne.tags
      //     }
      //   }
      // })
      // console.log(tags);


    }

    return jsonData;


  }
}
