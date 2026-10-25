import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function calculateHash(
  prevHash: string,
  bidId: string,
  lotId: string,
  bidderId: string,
  amount: number,
  createdAt: Date
): string {
  const serializedTime = new Date(createdAt).toISOString();
  const payload = `${prevHash}:${bidId}:${lotId}:${bidderId}:${amount.toFixed(2)}:${serializedTime}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function main() {
  console.log('Iniciando seed de dados...');

  await prisma.receipt.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const auctioneer = await prisma.user.create({
    data: {
      name: 'Carlos Leiloeiro Oficial',
      email: 'leiloeiro@verzel.com',
      password: passwordHash,
      role: 'LEILOEIRO',
      totalBalance: 3500,
      committedBalance: 0
    }
  });

  const bidder1 = await prisma.user.create({
    data: {
      name: 'Marina Silva',
      email: 'licitante1@verzel.com',
      password: passwordHash,
      role: 'LICITANTE',
      totalBalance: 11500,
      committedBalance: 0
    }
  });

  const bidder2 = await prisma.user.create({
    data: {
      name: 'Roberto Lins',
      email: 'licitante2@verzel.com',
      password: passwordHash,
      role: 'LICITANTE',
      totalBalance: 20000,
      committedBalance: 2800
    }
  });

  const now = new Date();
  const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const threeHoursAhead = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const liveLot = await prisma.lot.create({
    data: {
      title: 'Pintura Óleo sobre Tela: "Noite Estrelada no Vale"',
      description: 'Obra de arte impressionista original de 1924 em moldura de madeira nobre talhada à mão.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      category: 'Obras de Arte',
      itemAttributes: { artista: 'Émile Laurent', ano: 1924, tecnica: 'Óleo sobre Tela', dimensoes: '80x60cm' },
      status: 'AO_VIVO',
      initialPrice: 2500,
      minIncrement: 200,
      currentPrice: 2800,
      currentLeaderId: bidder2.id,
      auctioneerId: auctioneer.id,
      startTime: thirtyMinAgo,
      endTime: threeHoursAhead
    }
  });

  const genesisHash = crypto
    .createHash('sha256')
    .update(`GENESIS_LOT_${liveLot.id}`)
    .digest('hex');

  const bid1Id = crypto.randomUUID();
  const bid1Time = new Date(now.getTime() - 20 * 60 * 1000);
  const bid1Hash = calculateHash(genesisHash, bid1Id, liveLot.id, bidder1.id, 2500, bid1Time);

  await prisma.bid.create({
    data: {
      id: bid1Id,
      lotId: liveLot.id,
      bidderId: bidder1.id,
      amount: 2500,
      previousHash: genesisHash,
      hash: bid1Hash,
      createdAt: bid1Time
    }
  });

  const bid2Id = crypto.randomUUID();
  const bid2Time = new Date(now.getTime() - 10 * 60 * 1000);
  const bid2Hash = calculateHash(bid1Hash, bid2Id, liveLot.id, bidder2.id, 2800, bid2Time);

  await prisma.bid.create({
    data: {
      id: bid2Id,
      lotId: liveLot.id,
      bidderId: bidder2.id,
      amount: 2800,
      previousHash: bid1Hash,
      hash: bid2Hash,
      createdAt: bid2Time
    }
  });

  const oneHourAhead = new Date(now.getTime() + 60 * 60 * 1000);
  const twentyFourHoursAhead = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await prisma.lot.create({
    data: {
      title: 'Relógio Cronógrafo Suíço Vintage 1968',
      description: 'Peça de alta relojoaria com mecanismo mecânico automático em ouro 18k e pulseira em couro legítimo.',
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      category: 'Relógios & Joias',
      itemAttributes: { marca: 'Geneva Horology', calibre: 'Cal. 321', material: 'Ouro 18k', estojoOriginal: 'Sim' },
      status: 'AGENDADO',
      initialPrice: 4800,
      minIncrement: 300,
      currentPrice: 0,
      currentLeaderId: null,
      auctioneerId: auctioneer.id,
      startTime: oneHourAhead,
      endTime: twentyFourHoursAhead
    }
  });

  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const closedLot = await prisma.lot.create({
    data: {
      title: 'Primeira Edição: Dom Casmurro (1899)',
      description: 'Exemplar histórico encadernado em couro com carimbo de primeira tiragem da Livraria Garnier.',
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
      category: 'Livros Raros',
      itemAttributes: { autor: 'Machado de Assis', anoPublicacao: 1899, conservacao: 'Excelente' },
      status: 'ENCERRADO',
      initialPrice: 3200,
      minIncrement: 250,
      currentPrice: 3500,
      currentLeaderId: bidder1.id,
      auctioneerId: auctioneer.id,
      startTime: twoDaysAgo,
      endTime: oneDayAgo
    }
  });

  const closedGenesisHash = crypto
    .createHash('sha256')
    .update(`GENESIS_LOT_${closedLot.id}`)
    .digest('hex');

  const closedBidId = crypto.randomUUID();
  const closedBidTime = new Date(now.getTime() - 26 * 60 * 60 * 1000);
  const closedBidHash = calculateHash(closedGenesisHash, closedBidId, closedLot.id, bidder1.id, 3500, closedBidTime);

  await prisma.bid.create({
    data: {
      id: closedBidId,
      lotId: closedLot.id,
      bidderId: bidder1.id,
      amount: 3500,
      previousHash: closedGenesisHash,
      hash: closedBidHash,
      createdAt: closedBidTime
    }
  });

  await prisma.receipt.create({
    data: {
      lotId: closedLot.id,
      winnerId: bidder1.id,
      finalAmount: 3500,
      shareToken: 'recibo-demo-dom-casmurro-1899'
    }
  });

  console.log('✅ Seed finalizado com sucesso!');
  console.log('Leiloeiro: leiloeiro@verzel.com / password123');
  console.log('Licitante 1: licitante1@verzel.com / password123 (R$ 11.500 disponível)');
  console.log('Licitante 2: licitante2@verzel.com / password123 (R$ 17.200 disponível, R$ 2.800 comprometido liderando o lote ao vivo)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
