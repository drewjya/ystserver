
export type TherapistExcel = {
    no: string,
    name: string,
    cabang?: string,
    tags: string[],
    gender: string,
}

export type ExcelTherapist = {
    No: string,
    Nama: string,
    Gender: string,
    Cabang: string,
    'Reflexology Normal': string | undefined,
    'Reflexology Signature': string | undefined,
    'Massage Traditional Normal': string | undefined,
    'Massage TraditionalSignature': string | undefined,
    'Massage Tuina': string | undefined,
    'Massage Aromatherapy': string | undefined,
    'Massage Jepang': string | undefined,
    'Massage Balita': string | undefined,
    "Massage Bumil": string | undefined,
    "Shiatsu": string | undefined,
    "Massage Hot Stone": string | undefined,
    "Turun Bero": string | undefined,
    "Keseleo": string | undefined,
    "Bekam": string | undefined,
    "Totok Wajah": string | undefined,
    "Ear Candle": string | undefined,
    "Lulur": string | undefined,
    "Kerik": string | undefined,
    "Kop": string | undefined,
    "Kop Kaki": string | undefined,
    "Kop Api": string | undefined,
}

export const convertToTherapist = (data: ExcelTherapist[]) => {

    const val = data.map((e) => {
        let tags: string[] = []
        if (e['Reflexology Normal'] !== undefined && e['Reflexology Normal'] !== null) {
            tags.push('Reflexology Normal');
        }
        if (e['Reflexology Signature'] !== undefined && e['Reflexology Signature'] !== null) {
            tags.push('Reflexology Signature');
        }
        if (e['Massage Traditional Normal'] !== undefined && e['Massage Traditional Normal'] !== null) {
            tags.push('Massage Traditional Normal');
        }
        if (e['Massage TraditionalSignature'] !== undefined && e['Massage TraditionalSignature'] !== null) {
            tags.push('Massage TraditionalSignature');
        }
        if (e['Massage Tuina'] !== undefined && e['Massage Tuina'] !== null) {
            tags.push('Massage Tuina');
        }
        if (e['Massage Aromatherapy'] !== undefined && e['Massage Aromatherapy'] !== null) {
            tags.push('Massage Aromatherapy');
        }
        if (e['Massage Jepang'] !== undefined && e['Massage Jepang'] !== null) {
            tags.push('Massage Jepang');
        }
        if (e['Massage Balita'] !== undefined && e['Massage Balita'] !== null) {
            tags.push('Massage Balita');
        }
        if (e["Massage Bumil"] !== undefined && e["Massage Bumil"] !== null) {
            tags.push("Massage Bumil");
        }
        if (e["Shiatsu"] !== undefined && e["Shiatsu"] !== null) {
            tags.push("Shiatsu");
        }
        if (e["Massage Hot Stone"] !== undefined && e["Massage Hot Stone"] !== null) {
            tags.push("Massage Hot Stone");
        }
        if (e["Turun Bero"] !== undefined && e["Turun Bero"] !== null) {
            tags.push("Turun Bero");
        }
        if (e["Keseleo"] !== undefined && e["Keseleo"] !== null) {
            tags.push("Keseleo");
        }
        if (e["Bekam"] !== undefined && e["Bekam"] !== null) {
            tags.push("Bekam");
        }
        if (e["Totok Wajah"] !== undefined && e["Totok Wajah"] !== null) {
            tags.push("Totok Wajah");
        }
        if (e["Ear Candle"] !== undefined && e["Ear Candle"] !== null) {
            tags.push("Ear Candle");
        }
        if (e["Lulur"] !== undefined && e["Lulur"] !== null) {
            tags.push("Lulur");
        }
        if (e["Kerik"] !== undefined && e["Kerik"] !== null) {
            tags.push("Kerik");
        }
        if (e["Kop"] !== undefined && e["Kop"] !== null) {
            tags.push("Kop");
        }
        if (e["Kop Kaki"] !== undefined && e["Kop Kaki"] !== null) {
            tags.push("Kop Kaki");
        }
        if (e["Kop Api"] !== undefined && e["Kop Api"] !== null) {
            tags.push("Kop Api");
        }


        return <TherapistExcel>{
            no: e.No.length !== 0 ? `${e.No}` : null,
            cabang: e.Cabang,
            name: e.Nama,
            tags: tags,
            gender: e.Gender



        }

    });
    return val
}