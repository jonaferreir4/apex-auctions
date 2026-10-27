import React, { useState, useEffect } from 'react';
import { useCreateLotMutation } from '@/entities/lot/model/useLotQueries';
import { useExternalItemsQuery } from '@/entities/external-item/model/useExternalItemQueries';
import { ExternalItem } from '@/entities/external-item/types';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { ExternalItemCard } from '@/entities/external-item/ui/ExternalItemCard';
import { formatBRL } from '@/shared/lib/formatters';
import { Search, Plus, Calendar, DollarSign, PackageSearch, SlidersHorizontal, ArrowRight, ArrowLeft, Flame, Clock } from 'lucide-react';

export interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const toLocalISOString = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function CreateLotModal({ isOpen, onClose }: CreateLotModalProps) {
  const [activeTab, setActiveTab] = useState<'item' | 'rules'>('item');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ExternalItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [initialPrice, setInitialPrice] = useState<number>(1000);
  const [minIncrement, setMinIncrement] = useState<number>(100);

  const [publishMode, setPublishMode] = useState<'AO_VIVO' | 'AGENDADO'>('AO_VIVO');
  const [durationHours, setDurationHours] = useState<number>(2);

  const getInitialStart = () => toLocalISOString(new Date(Date.now() - 60000));
  const getInitialEnd = (hours = 2) => toLocalISOString(new Date(Date.now() + hours * 3600000));

  const [startTime, setStartTime] = useState(getInitialStart);
  const [endTime, setEndTime] = useState(() => getInitialEnd(2));

  const { data: externalItems, isLoading: isLoadingExternal } = useExternalItemsQuery(searchQuery);
  const createLotMutation = useCreateLotMutation();

  const resetForm = () => {
    setActiveTab('item');
    setSearchQuery('');
    setSelectedItem(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setCategory('');
    setInitialPrice(1000);
    setMinIncrement(100);
    setPublishMode('AO_VIVO');
    setDurationHours(2);
    setStartTime(getInitialStart());
    setEndTime(getInitialEnd(2));
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSelectItem = (item: ExternalItem) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setCategory(item.category);
    setInitialPrice(item.suggestedPrice || 1000);
    setMinIncrement(Math.max(50, Math.round((item.suggestedPrice || 1000) * 0.05)));
    setActiveTab('rules');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeChange = (mode: 'AO_VIVO' | 'AGENDADO') => {
    setPublishMode(mode);
    if (mode === 'AO_VIVO') {
      setStartTime(getInitialStart());
      setEndTime(getInitialEnd(durationHours));
    }
  };

  const handleDurationChange = (hours: number) => {
    setDurationHours(hours);
    if (publishMode === 'AO_VIVO') {
      setStartTime(getInitialStart());
      setEndTime(getInitialEnd(hours));
    }
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();

    const finalStart = publishMode === 'AO_VIVO' ? new Date(Date.now() - 60000) : new Date(startTime);
    const finalEnd = publishMode === 'AO_VIVO' ? new Date(Date.now() + durationHours * 3600000) : new Date(endTime);

    createLotMutation.mutate(
      {
        title,
        description,
        imageUrl,
        category,
        itemAttributes: selectedItem?.attributes,
        initialPrice,
        minIncrement,
        startTime: finalStart.toISOString(),
        endTime: finalEnd.toISOString()
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        }
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Novo Lote de Leilão"
      maxWidth="max-w-2xl"
      footer={
        activeTab === 'item' ? (
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {selectedItem ? (
                <span>Item selecionado: <strong className="text-slate-900 dark:text-slate-100">{selectedItem.title}</strong></span>
              ) : (
                <span>Selecione um item para avançar</span>
              )}
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setActiveTab('rules')}
            >
              Avançar para Regras
              <ArrowRight size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {createLotMutation.isError && (
              <div className="text-red-500 text-xs font-medium">
                {createLotMutation.error.message}
              </div>
            )}
            <div className="flex items-center justify-between gap-3 w-full">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setActiveTab('item')}
              >
                <ArrowLeft size={16} />
                Voltar aos Itens
              </Button>
              <Button
                type="submit"
                form="create-lot-form"
                variant="primary"
                size="md"
                isLoading={createLotMutation.isPending}
                className="flex-1"
              >
                <Plus size={18} />
                {publishMode === 'AO_VIVO' ? 'Publicar Lote Ao Vivo Agora' : 'Agendar Lote no Leilão'}
              </Button>
            </div>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('item')}
            className={`flex items-center gap-2 pb-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'item'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <PackageSearch size={16} />
            1. Selecionar da API Externa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 pb-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'rules'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <SlidersHorizontal size={16} />
            2. Configurar Regras do Lote
          </button>
        </div>

        {activeTab === 'item' ? (
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Buscar produtos na API pública (ex: watch, perfume, phone)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
            />

            <div className="max-h-96 overflow-y-auto flex flex-col gap-3 pr-1">
              {isLoadingExternal ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Consultando catálogo da API externa...
                </div>
              ) : !externalItems || externalItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Nenhum produto retornado para essa busca.
                </div>
              ) : (
                externalItems.map((item) => (
                  <ExternalItemCard
                    key={item.id}
                    item={item}
                    onSelect={handleSelectItem}
                    selected={selectedItem?.id === item.id}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          <form
            id="create-lot-form"
            onSubmit={handleCreateLot}
            className="flex flex-col gap-4"
          >
            {selectedItem && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-10 h-10 object-cover rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      Item Selecionado da API
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate max-w-sm">
                      {selectedItem.title}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('item')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Trocar item
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <Input
                  label="Título do Lote"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="Categoria"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <Input
              label="URL da Imagem do Item"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Descrição</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md text-sm outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Lance Inicial (R$)"
                type="number"
                min="1"
                value={initialPrice}
                onChange={(e) => setInitialPrice(Number(e.target.value))}
                icon={<DollarSign size={16} />}
                required
              />
              <Input
                label="Incremento Mínimo (R$)"
                type="number"
                min="1"
                value={minIncrement}
                onChange={(e) => setMinIncrement(Number(e.target.value))}
                icon={<DollarSign size={16} />}
                required
              />
            </div>

            <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-lg">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Modalidade de Início do Leilão
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('AO_VIVO')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                    publishMode === 'AO_VIVO'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-500'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Flame size={15} className={publishMode === 'AO_VIVO' ? 'text-red-600' : 'text-slate-400'} />
                  Iniciar Ao Vivo Imediatamente
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('AGENDADO')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                    publishMode === 'AGENDADO'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Calendar size={15} className={publishMode === 'AGENDADO' ? 'text-blue-600' : 'text-slate-400'} />
                  Agendar para Data Futura
                </button>
              </div>

              {publishMode === 'AO_VIVO' ? (
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Clock size={13} /> Duração do pregão ao vivo:
                    </span>
                    <div className="flex gap-1.5">
                      {[1, 2, 4, 12, 24].map((hours) => (
                        <button
                          key={hours}
                          type="button"
                          onClick={() => handleDurationChange(hours)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition-colors cursor-pointer ${
                            durationHours === hours
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {hours}h
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ O lote entrará na sala de pregão AO VIVO com lances liberados imediatamente após publicar.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Input
                    label="Início do Leilão"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    icon={<Calendar size={16} />}
                    required
                  />
                  <Input
                    label="Encerramento do Leilão"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    icon={<Calendar size={16} />}
                    required
                  />
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
