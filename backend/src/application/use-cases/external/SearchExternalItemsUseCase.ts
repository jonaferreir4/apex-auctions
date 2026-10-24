import { IExternalItemGateway } from '../../ports/IExternalItemGateway';

export class SearchExternalItemsUseCase {
  constructor(private externalItemGateway: IExternalItemGateway) { }

  async execute(query?: string) {
    return this.externalItemGateway.searchItems(query);
  }
}
