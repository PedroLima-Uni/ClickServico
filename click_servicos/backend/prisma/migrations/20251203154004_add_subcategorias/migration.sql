/*
  Warnings:

  - You are about to drop the column `id_profissao` on the `servicos` table. All the data in the column will be lost.
  - You are about to drop the `profissoes` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `celular` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `servicos_id_profissao_fkey` ON `servicos`;

-- AlterTable
ALTER TABLE `servicos` DROP COLUMN `id_profissao`,
    ADD COLUMN `id_subcategoria` INTEGER NULL;

-- AlterTable
ALTER TABLE `usuarios` MODIFY `celular` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `profissoes`;

-- CreateTable
CREATE TABLE `subcategorias` (
    `id_subcategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `id_categoria` INTEGER NOT NULL,
    `nome_subcategoria` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,

    PRIMARY KEY (`id_subcategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfissionalSubcategoria` (
    `id_usuario` INTEGER NOT NULL,
    `id_subcategoria` INTEGER NOT NULL,

    PRIMARY KEY (`id_usuario`, `id_subcategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `servicos_id_subcategoria_fkey` ON `servicos`(`id_subcategoria`);

-- AddForeignKey
ALTER TABLE `subcategorias` ADD CONSTRAINT `subcategorias_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfissionalSubcategoria` ADD CONSTRAINT `ProfissionalSubcategoria_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfissionalSubcategoria` ADD CONSTRAINT `ProfissionalSubcategoria_id_subcategoria_fkey` FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategorias`(`id_subcategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;
