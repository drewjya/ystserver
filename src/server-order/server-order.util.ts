
export const selectOrderList = {
    id: true,
    orderId: true,
    orderStatus: true,
    cabang: {
        select: {
            nama: true,
            id: true,
        },
    },
    therapist: {
        select: {
            nama: true,
            id: true,
            no: true,
        },
    },
    guestGender: true,
    guestPhoneNumber: true,
    totalPrice: true,
    confirmationTime: true,
    orderTime: true,
    picture: {
        select: {
            path: true,
        },
    },
}


export const selectOrderDetail = {
    id: true,
    totalPrice: true,
    orderId: true,
    orderStatus: true,
    guestGender: true,
    confirmationTime: true,
    orderTime: true,
    cabang: {
        select: {
            nama: true,
            id: true,
        },
    },
    guestPhoneNumber: true,
    picture: {
        select: {
            path: true,
        },
    },
    therapist: {
        select: {
            nama: true,
            no: true,
            id: true,
        },
    },
    orderDetails: {
        select: {
            nama: true,
            duration: true,
            price: true,
            treatment: {
                select: {
                    nama: true,
                    category: {
                        select: {
                            nama: true,
                        },
                    },
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    },

    therapistGender: true,
    user: {
        select: {
            name: true,
            email: true,
            phoneNumber: true,
            gender: true,
            id: true,
        },
    },
    createdAt: true,
}



export type OrderSelectList = {
    cabangId?: number,
    cursor?: number,
    therapist?: string,
    name?: string,
    email?: string,
    gender?: string,
    phone?: string,
    start?: string,
    end?: string,
    status: string,
}