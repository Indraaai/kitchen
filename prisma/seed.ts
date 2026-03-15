import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('🌱 Memulai proses seeding data...');

    // 1. Buat Roles
    const roles = ['public', 'admin', 'super_admin'];

    for (const roleName of roles) {
        await prisma.role.upsert({
            where: { nameRoles: roleName },
            update: {},
            create: { nameRoles: roleName },
        });
    }
    console.log('✅ Roles berhasil dibuat!');

    // Ambil ID dari role super_admin
    const superAdminRole = await prisma.role.findUnique({
        where: { nameRoles: 'super_admin' },
    });

    if (!superAdminRole) {
        throw new Error('Role super_admin tidak ditemukan');
    }

    // 2. Buat Akun Super Admin Pertama
    const hashedPassword = await bcrypt.hash('Admin123!', 10); // Password default

    const superAdmin = await prisma.user.upsert({
        where: { email: 'super@kitchenconnect.com' },
        update: {},
        create: {
            email: 'super@kitchenconnect.com',
            password: hashedPassword,
            roleId: superAdminRole.id,
            isActive: true,
        },
    });

    console.log('✅ Akun Super Admin berhasil dibuat!');
    console.log('-----------------------------------');
    console.log(`Email    : ${superAdmin.email}`);
    console.log(`Password : Admin123!`);
    console.log('-----------------------------------');
}

main()
    .catch((e) => {
        console.error('❌ Terjadi kesalahan saat seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });