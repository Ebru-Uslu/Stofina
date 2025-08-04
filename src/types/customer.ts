import { customerType } from "@/constants/customerType";

export interface Customer {
    id?: number;
    firstName?: string;
    lastName?: string;
    tradeName?: string;
    vkn?: string;
    email?: string;
    birthDate?: string;
    birthPlace?: string;
    createdAt?: Date;
    updatedAt?: Date;
    accountNumber?: string;
    tckn?: string;
    customerType: string;
}

export const mockCustomers: Customer[] = [
    {
        id: 1,
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        birthDate: '2024-01-10',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-01-10T09:00:00Z'),
        updatedAt: new Date('2024-06-15T12:00:00Z'),
        accountNumber: 'TR12345678901',
        tckn: '12345678901',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 2,
        firstName: 'Zeynep',
        lastName: 'Korkmaz',
        email: 'zeynep.korkmaz@example.com',
        birthDate: '2024-02-11',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-02-11T10:30:00Z'),
        updatedAt: new Date('2024-06-20T09:15:00Z'),
        accountNumber: 'TR98765432109',
        tckn: '10987654321',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 3,
        firstName: 'Mehmet',
        lastName: 'Demir',
        email: 'mehmet.demir@example.com',
        birthDate: '2024-03-12',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-03-12T11:15:00Z'),
        updatedAt: new Date('2024-06-18T14:20:00Z'),
        accountNumber: 'TR11223344556',
        tckn: '56789012345',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 4,
        firstName: 'Elif',
        lastName: 'Yıldız',
        email: 'elif.yildiz@example.com',
        birthDate: '2024-04-13',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-04-13T12:45:00Z'),
        updatedAt: new Date('2024-06-25T16:00:00Z'),
        accountNumber: 'TR45678912365',
        tckn: '65432109876',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 5,
        firstName: 'Burcu',
        lastName: 'Aydın',
        email: 'burcu.aydin@example.com',
        birthDate: '2024-01-22',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-01-22T09:00:00Z'),
        updatedAt: new Date('2024-07-01T10:00:00Z'),
        accountNumber: 'TR32165498745',
        tckn: '34567890123',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 6,
        firstName: 'Emre',
        lastName: 'Şahin',
        email: 'emre.sahin@example.com',
        birthDate: '2024-02-28',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-02-28T15:30:00Z'),
        updatedAt: new Date('2024-07-10T09:45:00Z'),
        accountNumber: 'TR15935748623',
        tckn: '23456789012',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 7,
        firstName: 'Cem',
        lastName: 'Kara',
        email: 'cem.kara@example.com',
        birthDate: '2024-03-05',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-03-05T08:15:00Z'),
        updatedAt: new Date('2024-07-12T11:30:00Z'),
        accountNumber: 'TR75395145601',
        tckn: '87654321098',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 8,
        firstName: 'Fatma',
        lastName: 'Koç',
        email: 'fatma.koc@example.com',
        birthDate: '2024-04-19',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-04-19T14:00:00Z'),
        updatedAt: new Date('2024-07-15T13:00:00Z'),
        accountNumber: 'TR14725836911',
        tckn: '54321098765',
        customerType: customerType.KURUMSAL,
    },
    {
        id: 9,
        firstName: 'Hakan',
        lastName: 'Tuncel',
        email: 'hakan.tuncel@example.com',
        birthDate: '2024-05-21',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-05-21T10:10:00Z'),
        updatedAt: new Date('2024-07-20T12:30:00Z'),
        accountNumber: 'TR36925814777',
        tckn: '32109876543',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 10,
        firstName: 'Leyla',
        lastName: 'Özkan',
        email: 'leyla.ozkan@example.com',
        birthDate: '2024-06-01',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-06-01T09:00:00Z'),
        updatedAt: new Date('2024-07-22T14:45:00Z'),
        accountNumber: 'TR95175345688',
        tckn: '21098765432',
        customerType: customerType.BIREYSEL,
    },
    {
        id: 11,
        firstName: 'Mehmet',
        lastName: 'Demir',
        email: 'mehmet.demir@example.com',
        birthDate: '2024-06-01',
        birthPlace: 'İstanbul',
        createdAt: new Date('2024-03-05T08:15:00Z'),
        updatedAt: new Date('2024-07-12T11:30:00Z'),
        accountNumber: 'TR75395145601',
        tckn: '87654321098',
        customerType: customerType.BIREYSEL,
    },
];

