// Aqui você deve adicionar suas análises
export const analysisData = [
  {
    device: "HD Seagate 2TB",
    damageType: "Falha de Setores",
    analysis: "Múltiplos setores defeituosos identificados. Necessária recuperação setor por setor com equipamento especializado.",
    category: "logical",
    severity: "complex"
  },
  {
    device: "SSD Kingston 500GB",
    damageType: "Corrupção de Firmware",
    analysis: "Firmware apresentando falhas na tabela de alocação. Requer reprogramação do controlador.",
    category: "electronic",
    severity: "moderate"
  },
  {
    device: "Pendrive Sandisk 32GB",
    damageType: "Danos Físicos",
    analysis: "Conector USB danificado com possível comprometimento da placa. Necessário reparo da solda e recuperação da conexão.",
    category: "physical",
    severity: "simple"
  }
  // Adicione mais análises seguindo este formato
];