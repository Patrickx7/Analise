import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { supabase } from './supabase';

type TabType = 'logical' | 'physical' | 'electronic';
type Analysis = {
  id: string;
  device: string;
  damage_type: string;
  analysis: string;
  category: TabType;
  severity: 'simple' | 'moderate' | 'complex';
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('logical');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newAnalysis, setNewAnalysis] = useState<Omit<Analysis, 'id'>>({
    device: '',
    damage_type: '',
    analysis: '',
    category: 'logical',
    severity: 'simple'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  async function fetchAnalyses() {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*');

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('analyses')
          .update(newAnalysis)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('analyses')
          .insert([newAnalysis]);

        if (error) throw error;
      }

      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      setNewAnalysis({
        device: '',
        damage_type: '',
        analysis: '',
        category: 'logical',
        severity: 'simple'
      });
      fetchAnalyses();
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja excluir esta análise?')) {
      try {
        const { error } = await supabase
          .from('analyses')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchAnalyses();
      } catch (error) {
        console.error('Error deleting analysis:', error);
      }
    }
  }

  function handleEdit(analysis: Analysis) {
    setIsEditing(true);
    setEditingId(analysis.id);
    setNewAnalysis({
      device: analysis.device,
      damage_type: analysis.damage_type,
      analysis: analysis.analysis,
      category: analysis.category,
      severity: analysis.severity
    });
    setShowForm(true);
  }

  const filteredData = analyses.filter((item) => {
    const matchesTab = item.category === activeTab;
    const matchesSearch = item.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.analysis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Análise Técnica</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar análises..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors"
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setNewAnalysis({
                device: '',
                damage_type: '',
                analysis: '',
                category: 'logical',
                severity: 'simple'
              });
              setShowForm(true);
            }}
          >
            <Plus size={20} />
            Nova Análise
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          {(['logical', 'physical', 'electronic'] as const).map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-red-700 text-red-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'logical' && 'Lógico'}
              {tab === 'physical' && 'Físico'}
              {tab === 'electronic' && 'Eletrônico'}
            </button>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {isEditing ? 'Editar Análise' : 'Nova Análise'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dispositivo
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={newAnalysis.device}
                    onChange={(e) => setNewAnalysis({...newAnalysis, device: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Análise
                  </label>
                  <textarea
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={4}
                    value={newAnalysis.analysis}
                    onChange={(e) => setNewAnalysis({...newAnalysis, analysis: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      value={newAnalysis.category}
                      onChange={(e) => setNewAnalysis({...newAnalysis, category: e.target.value as TabType})}
                    >
                      <option value="logical">Lógico</option>
                      <option value="physical">Físico</option>
                      <option value="electronic">Eletrônico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severidade
                    </label>
                    <select
                   required
                   className="w-full p-2 border border-gray-300 rounded-lg"
                   value={newAnalysis.damage_type}
                   onChange={(e) => setNewAnalysis({...newAnalysis, damage_type: e.target.value})}
                    >
                      <option value="simple">Simples</option>
                      <option value="Moderado">Moderado</option>
                      <option value="complex">Complexo</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                  >
                    {isEditing ? 'Salvar Alterações' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Dispositivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Tipo de Dano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Análise
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Carregando análises...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Nenhuma análise encontrada
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {item.device}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                        {item.damage_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 border-r border-gray-200">
                        {item.analysis}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;