import { Lot, LotStatus } from '../../../domain/entities/Lot';
import { ForbiddenError, NotFoundError, ValidationError } from '../../../domain/errors/DomainError';
import { ILotRepository } from '../../../domain/repositories/ILotRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IWebSocketEmitter } from '../../ports/IWebSocketEmitter';
import crypto from 'node:crypto';

export interface CreateLotDTO {
  auctioneerId: string;
  title: string;
  description: string;
  imageUrl: string;
  category?: string;
  itemAttributes?: Record<string, unknown>;
  initialPrice: number;
  minIncrement: number;
  startTime: Date | string;
  endTime: Date | string;
}

export class CreateLotUseCase {
  constructor(
    private lotRepository: ILotRepository,
    private userRepository: IUserRepository,
    private websocketEmitter: IWebSocketEmitter
  ) { }

  async execute(dto: CreateLotDTO) {
    const auctioneer = await this.userRepository.findById(dto.auctioneerId);
    if (!auctioneer) {
      throw new NotFoundError('Leiloeiro não encontrado');
    }

    if (!auctioneer.isAuctioneer()) {
      throw new ForbiddenError('Apenas leiloeiros podem criar lotes');
    }

    if (!dto.title || !dto.description || !dto.imageUrl) {
      throw new ValidationError('Título, descrição e imagem são obrigatórios');
    }

    if (dto.initialPrice <= 0 || dto.minIncrement <= 0) {
      throw new ValidationError('Lance inicial e incremento mínimo devem ser maiores que zero');
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    const now = new Date();

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new ValidationError('Datas de início e fim inválidas');
    }

    if (endTime <= startTime) {
      throw new ValidationError('Data de término deve ser posterior à data de início');
    }

    let initialStatus: LotStatus = 'AGENDADO';
    if (now >= startTime && now < endTime) {
      initialStatus = 'AO_VIVO';
    } else if (now >= endTime) {
      initialStatus = 'ENCERRADO';
    }

    const lot = new Lot({
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      imageUrl: dto.imageUrl,
      category: dto.category || 'Geral',
      itemAttributes: dto.itemAttributes || {},
      status: initialStatus,
      initialPrice: dto.initialPrice,
      minIncrement: dto.minIncrement,
      currentPrice: 0,
      currentLeaderId: null,
      auctioneerId: auctioneer.id,
      startTime,
      endTime,
      createdAt: now,
      updatedAt: now
    });

    const createdLot = await this.lotRepository.create(lot);

    this.websocketEmitter.broadcast('lot_created', createdLot.toJSON());

    return createdLot.toJSON();
  }
}
