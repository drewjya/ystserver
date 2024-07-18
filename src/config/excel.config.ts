
export type TherapistExcel = {
    no: number,
    name: string,
    cabang?: string,
    treatment: string[],
    gender: string,
}

export type ExcelTherapist = {
    No: number,
    Nama: string,
    Cabang: string,
    Treatment: string,
    Gender: string,
}

export const convertToTherapist = (data: ExcelTherapist[]) => {

    const val = data.map((e) => {
        let treatment: string[] = []
        console.log(e);
        if (e.Treatment) {
            treatment = e.Treatment.split(",")
        }

        return <TherapistExcel>{
            no: e.No,
            cabang: e.Cabang && e.Cabang !== "-" ? e.Cabang : undefined,
            name: e.Nama,
            treatment: treatment,
            gender: e.Gender


        }

    });
    return val
}