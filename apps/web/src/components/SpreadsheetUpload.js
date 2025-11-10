'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from './Button';
import styles from './SpreadsheetUpload.module.css';

export function SpreadsheetUpload({ isOpen, onUpload, onClose }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.macroEnabled.12', // .xlsm
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-excel.sheet.macroEnabled.12', // .xlsm (alternativo)
      'text/csv', // .csv
      'application/csv', // .csv
    ];
    
    const isValidType = validTypes.includes(selectedFile.type) || 
                       selectedFile.name.endsWith('.xlsx') ||
                       selectedFile.name.endsWith('.xlsm') ||
                       selectedFile.name.endsWith('.xls') ||
                       selectedFile.name.endsWith('.csv');

    if (!isValidType) {
      setError('Por favor, selecione um arquivo Excel (.xlsx, .xlsm, .xls) ou CSV (.csv)');
      return;
    }

    setFile(selectedFile);
    setError('');
    previewFile(selectedFile);
  };

  const previewFile = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          // Ler arquivo Excel com opções para processar fórmulas e valores calculados
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: false,
            cellNF: false,
            cellStyles: false,
            sheetStubs: false,
            cellFormula: false,
            cellHTML: false
          });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
            header: 1,
            defval: '',
            raw: false
          });
          
          if (jsonData.length === 0) {
            setError('A planilha está vazia');
            return;
          }

          setPreview({
            headers: jsonData[0] || [],
            rows: jsonData.slice(1, 6), // Mostrar apenas as primeiras 5 linhas
            totalRows: jsonData.length - 1,
          });
        } catch (err) {
          setError('Erro ao ler a planilha: ' + err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Erro ao processar o arquivo: ' + err.message);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Credor': 'Itau',
        'Valor total': 887.28,
        'Parcelas': 12,
        'Parcelas pagas': 0,
        'Valor pago': 0,
        'Dia vencimento': 11,
        '1ª parcela': 270.27,
        'Observações': 'Cartão de crédito'
      },
      {
        'Credor': 'Santander',
        'Valor total': 1055.80,
        'Parcelas': 5,
        'Parcelas pagas': 0,
        'Valor pago': 0,
        'Dia vencimento': 11,
        '1ª parcela': '',
        'Observações': ''
      },
      {
        'Credor': 'Lojas CEM',
        'Valor total': 2500.00,
        'Parcelas': 12,
        'Parcelas pagas': 2,
        'Valor pago': 260.00,
        'Dia vencimento': '',
        '1ª parcela': '',
        'Observações': ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dívidas');
    XLSX.writeFile(wb, 'template_dividas.xlsx');
  };

  const processSpreadsheet = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          // Ler arquivo Excel com opções para processar fórmulas e valores calculados
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellDates: false,
            cellNF: false,
            cellStyles: false,
            sheetStubs: false,
            // Garantir que valores calculados sejam lidos
            cellFormula: false,
            cellHTML: false
          });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Verificar o range da planilha para garantir que lemos todas as linhas
          const range = XLSX.utils.decode_range(firstSheet['!ref'] || 'A1');
          console.log(`[DEBUG] Range da planilha: ${firstSheet['!ref']}`);
          console.log(`[DEBUG] Linhas no range: ${range.e.r + 1} (de 0 a ${range.e.r})`);
          
          // Converter para JSON, usando valores calculados (não fórmulas)
          // raw: true para obter valores numéricos brutos, não formatados
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
            defval: '', // Valor padrão para células vazias
            raw: true, // Usar valores brutos (números) em vez de strings formatadas
            blankrows: false, // Não incluir linhas completamente vazias
          });

          console.log(`[DEBUG] Total de linhas lidas do JSON: ${jsonData.length}`);
          console.log(`[DEBUG] Primeiras 3 linhas:`, jsonData.slice(0, 3));

          if (jsonData.length === 0) {
            setError('A planilha está vazia');
            setIsProcessing(false);
            return;
          }

          // Mapear os dados da planilha para o formato esperado
          const debts = [];
          const errors = [];
          
          console.log(`[DEBUG] Iniciando processamento de ${jsonData.length} linhas`);
          
          jsonData.forEach((row, index) => {
            // Log a cada 5 linhas para debug
            if (index % 5 === 0 || index < 3) {
              console.log(`[DEBUG] Processando linha ${index + 1}:`, Object.keys(row).slice(0, 5));
            }
            try {
              // Tentar diferentes nomes de colunas (case insensitive e com match parcial)
              const getValue = (possibleNames) => {
                // Primeiro, tentar match exato (case insensitive)
                for (const name of possibleNames) {
                  const normalizedName = name.toLowerCase().trim();
                  const key = Object.keys(row).find(
                    k => {
                      const normalizedKey = k.toLowerCase().trim();
                      return normalizedKey === normalizedName;
                    }
                  );
                  if (key !== undefined && row[key] !== undefined && row[key] !== '') {
                    return row[key];
                  }
                }
                
                // Se não encontrou match exato, tentar match parcial (contém o nome)
                for (const name of possibleNames) {
                  const normalizedName = name.toLowerCase().trim();
                  const key = Object.keys(row).find(
                    k => {
                      const normalizedKey = k.toLowerCase().trim();
                      // Verificar se a chave contém o nome ou vice-versa
                      return normalizedKey.includes(normalizedName) || 
                             normalizedName.includes(normalizedKey);
                    }
                  );
                  if (key !== undefined && row[key] !== undefined && row[key] !== '') {
                    return row[key];
                  }
                }
                
                return null;
              };

              const toNumber = (value) => {
                if (value === null || value === undefined || value === '') return 0;
                
                // Se já é número, retornar diretamente
                if (typeof value === 'number') {
                  return isNaN(value) ? 0 : value;
                }
                
                // Converter string para número, lidando com formato brasileiro
                let str = String(value).trim();
                
                // Se a string está vazia após trim, retornar 0
                if (str === '') return 0;
                
                // Remover símbolo de moeda (R$, $, etc) no início
                str = str.replace(/^[R$]+\s*/i, '');
                
                // Remover espaços
                str = str.replace(/\s/g, '');
                
                // Formato brasileiro: 1.055,80 (ponto como milhar, vírgula como decimal)
                // Verificar se tem vírgula (formato brasileiro)
                if (str.includes(',') && str.includes('.')) {
                  // Tem ambos: ponto é milhar, vírgula é decimal
                  // Ex: 1.055,80 -> 1055.80
                  str = str.replace(/\./g, ''); // Remove pontos (milhares)
                  str = str.replace(',', '.'); // Converte vírgula para ponto (decimal)
                } else if (str.includes(',')) {
                  // Só tem vírgula: tratar como decimal brasileiro
                  // Ex: 1055,80 -> 1055.80
                  str = str.replace(',', '.');
                } else if (str.includes('.')) {
                  // Só tem ponto: verificar se é milhar ou decimal
                  const parts = str.split('.');
                  // Se tem mais de 2 partes ou a última parte tem mais de 2 dígitos, é milhar
                  if (parts.length > 2 || (parts.length === 2 && parts[1].length > 2)) {
                    // É milhar: 1.055.80 -> 1055.80 (remove pontos)
                    str = str.replace(/\./g, '');
                  }
                  // Se não, mantém como decimal (ex: 1055.80)
                }
                
                // Remover qualquer caractere não numérico exceto ponto e sinal negativo
                str = str.replace(/[^\d.-]/g, '');
                
                // Se ficou vazio, retornar 0
                if (str === '' || str === '-') return 0;
                
                const num = Number(str);
                return isNaN(num) ? 0 : num;
              };

              const id = getValue(['id', 'codigo', 'code']);
              
              // Mapear colunas priorizando nomes exatos do frontend
              // 1. Credor (nome exato do frontend)
              const creditor = getValue([
                'credor', // Nome exato do frontend
                'dividas ativas', 'dividasativas', 'divida ativa', 'dividaativa',
                'creditor', 'banco', 'instituição', 'instituicao', 'nome'
              ]);
              
              // 2. Valor total (nome exato do frontend)
              const totalValueRaw = getValue([
                'valor total', // Nome exato do frontend
                'valortotal', 'valor', 'total', 'totalvalue'
              ]);
              
              // Verificar se a linha está vazia (pular linhas vazias)
              // Ignorar linhas de totais/sumário
              const creditorLower = creditor ? creditor.toString().toLowerCase().trim() : '';
              if (creditorLower === 'totais' || creditorLower === 'total' || creditorLower === 'sem financ' || creditorLower === 'sem financiamento') {
                if (index < 10) {
                  console.log(`[DEBUG] Linha ${index + 1} pulada (linha de totais): "${creditor}"`);
                }
                return; // Pular linha de totais
              }
              
              // Verificar se todas as colunas importantes estão vazias
              const hasData = (creditor && creditor.toString().trim() !== '') ||
                             (totalValueRaw && totalValueRaw.toString().trim() !== '');
              
              if (!hasData) {
                if (index < 10) {
                  console.log(`[DEBUG] Linha ${index + 1} pulada (vazia): creditor="${creditor}", totalValue="${totalValueRaw}"`);
                }
                return; // Pular linha vazia
              }
              
              // Se não tem credor mas tem valor, criar um credor padrão
              let finalCreditor = creditor;
              if (!finalCreditor || finalCreditor.toString().trim() === '') {
                finalCreditor = `Dívida ${index + 1}`;
              }
              
              const totalValue = toNumber(totalValueRaw);
              
              // 3. Parcelas (nome exato do frontend)
              const installments = toNumber(getValue([
                'parcelas', // Nome exato do frontend
                'installments', 'quantidade', 'qtd'
              ]));
              
              // 4. Parcelas pagas (nome exato do frontend)
              const paidInstallments = toNumber(getValue([
                'parcelas pagas', // Nome exato do frontend
                'parcelaspagas', 'parcelas paga', 'parcelaspaga',
                'paidinstallments', 'pagas'
              ]));
              
              // 5. Valor pago (nome exato do frontend)
              const paidValue = toNumber(getValue([
                'valor pago', // Nome exato do frontend
                'valorpago', 'paidvalue', 'pago'
              ]));
              
              // 6. Valor restante (pode ser usado para calcular valor pago)
              const discountedValue = toNumber(getValue([
                'total restante', // Nome exato do frontend
                'valor restante', 'valorestante', 'restante',
                'descontando parcelas pagas', 'descontandoparcelaspagas'
              ]));
              
              // 7. Dia vencimento (nome exato do frontend)
              const dueDay = getValue([
                'dia vencimento', // Nome exato do frontend
                'diavencimento', 'vencimento',
                'data de vencimento', 'datadevencimento',
                'dueday', 'dia'
              ]);
              
              // 8. 1ª parcela (nome exato do frontend)
              const firstInstallmentValue = getValue([
                '1ª parcela', // Nome exato do frontend
                '1a parcela', 'primeira parcela', 'primeiraparcela',
                'firstinstallmentvalue', 'entrada'
              ]);
              
              // 9. Observações (nome exato do frontend)
              const notes = getValue([
                'observações', // Nome exato do frontend
                'observacoes', 'notes', 'notas', 'obs'
              ]);

              // Validações com mensagens mais claras
              const creditorName = finalCreditor || creditor || `Linha ${index + 2}`;
              
              if (!totalValueRaw || totalValueRaw === '' || totalValueRaw === null) {
                const errorMsg = `Linha ${index + 2} (${creditorName}): Coluna "Valor total" não encontrada ou vazia`;
                errors.push(errorMsg);
                if (index < 10) {
                  console.log(`[DEBUG] ${errorMsg}`);
                }
                return; // Pular esta linha
              }

              if (totalValue <= 0) {
                const errorMsg = `Linha ${index + 2} (${creditorName}): Valor Total deve ser maior que zero. Valor encontrado: "${totalValueRaw}"`;
                errors.push(errorMsg);
                if (index < 10) {
                  console.log(`[DEBUG] ${errorMsg}`);
                }
                return; // Pular esta linha
              }

              if (!installments || installments <= 0) {
                const errorMsg = `Linha ${index + 2} (${creditorName}): Parcelas deve ser maior que zero`;
                errors.push(errorMsg);
                if (index < 10) {
                  console.log(`[DEBUG] ${errorMsg}`);
                }
                return; // Pular esta linha
              }

              // Validar dia de vencimento se fornecido
              const dueDayNum = dueDay ? Math.floor(toNumber(dueDay)) : null;
              if (dueDayNum !== null && (dueDayNum < 1 || dueDayNum > 31)) {
                errors.push(`Linha ${index + 2} (${creditorName}): Dia de vencimento deve estar entre 1 e 31`);
                return; // Pular esta linha
              }

              // Validar parcelas pagas não pode ser maior que total de parcelas
              const paidInstallmentsNum = Math.floor(toNumber(paidInstallments || 0));
              const installmentsNum = Math.floor(toNumber(installments));
              if (paidInstallmentsNum > installmentsNum) {
                errors.push(`Linha ${index + 2} (${creditorName}): Parcelas pagas (${paidInstallmentsNum}) não pode ser maior que total de parcelas (${installmentsNum})`);
                return; // Pular esta linha
              }

              // Calcular valor pago se não foi informado
              let calculatedPaidValue = toNumber(paidValue || 0);
              
              // Se parcelas pagas = 0, então valor pago = 0 (não importa o que está em "Descontando parcelas pagas")
              if (paidInstallmentsNum === 0) {
                calculatedPaidValue = 0;
              } else if (calculatedPaidValue === 0) {
                // Só calcular se parcelas pagas > 0 e valor pago não foi informado
                
                // Prioridade 1: Se temos "Descontando parcelas pagas", calcular valor pago
                // A coluna mostra valores negativos: valor restante = valor total - valor pago
                // Então: valor pago = valor total - |valor descontado|
                if (discountedValue !== 0 && totalValue > 0) {
                  const discountedAbs = Math.abs(toNumber(discountedValue));
                  calculatedPaidValue = Math.max(0, toNumber(totalValue) - discountedAbs);
                }

                // Prioridade 2: Se ainda não temos valor pago mas temos parcelas pagas, calcular
                if (calculatedPaidValue === 0 && paidInstallmentsNum > 0 && installmentsNum > 0) {
                  const installmentValueCalc = toNumber(totalValue) / installmentsNum;
                  calculatedPaidValue = paidInstallmentsNum * installmentValueCalc;
                }
              }

              const debtData = {
                id: id ? String(id).trim() : null,
                creditor: String(finalCreditor).trim(),
                totalValue: toNumber(totalValue),
                installments: installmentsNum,
                paidInstallments: paidInstallmentsNum,
                paidValue: calculatedPaidValue,
                installmentValue: installmentsNum > 0 ? toNumber(totalValue) / installmentsNum : 0,
                dueDay: dueDayNum,
                firstInstallmentValue: firstInstallmentValue ? toNumber(firstInstallmentValue) : null,
                notes: notes ? String(notes).trim() : '',
              };
              
              debts.push(debtData);
              
              if (debts.length <= 10) {
                console.log(`[DEBUG] Dívida ${debts.length} adicionada: ${debtData.creditor} - Valor: ${debtData.totalValue}, Parcelas: ${debtData.installments}/${debtData.paidInstallments}`);
              }
            } catch (err) {
              // Capturar qualquer erro inesperado
              errors.push(`Linha ${index + 2}: ${err.message || 'Erro ao processar linha'}`);
            }
          });
          
          // Mostrar avisos sobre linhas com erro, mas continuar processamento
          if (errors.length > 0) {
            console.warn('Linhas com erro na planilha:', errors);
            // Não bloquear o processamento, apenas avisar
            if (debts.length === 0) {
              throw new Error(`Nenhuma dívida válida encontrada. Erros encontrados:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... e mais ${errors.length - 5} erro(s)` : ''}`);
            }
          }

          // Validar se há pelo menos uma dívida válida
          if (debts.length === 0) {
            const errorMsg = errors.length > 0 
              ? `Nenhuma dívida válida encontrada. Erros:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... e mais ${errors.length - 5} erro(s)` : ''}`
              : 'Nenhuma dívida válida encontrada na planilha';
            setError(errorMsg);
            setIsProcessing(false);
            return;
          }
          
          // Se houver erros mas também dívidas válidas, mostrar aviso mas continuar
          if (errors.length > 0 && debts.length > 0) {
            console.warn(`${errors.length} linha(s) foram ignoradas devido a erros. ${debts.length} dívida(s) válida(s) serão importadas.`);
          }

          // Log para debug: mostrar quantas dívidas foram processadas
          console.log(`[DEBUG Importação] Total de linhas na planilha: ${jsonData.length}`);
          console.log(`[DEBUG Importação] Total de dívidas processadas: ${debts.length}`);
          console.log(`[DEBUG Importação] Total de erros: ${errors.length}`);
          if (debts.length > 0) {
            console.log(`[DEBUG Importação] Primeiras 3 dívidas:`, debts.slice(0, 3).map(d => d.creditor));
          }

          // Chamar callback com os dados processados
          try {
            await onUpload(debts);
            // Fechar modal apenas após sucesso
            setIsProcessing(false);
            // Resetar estado
            setFile(null);
            setPreview(null);
            setError('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onClose();
          } catch (uploadError) {
            // Se houver erro no upload, manter o modal aberto e mostrar erro
            setError(uploadError.message || 'Erro ao fazer upload das dívidas');
            setIsProcessing(false);
          }
        } catch (err) {
          setError(err.message || 'Erro ao processar a planilha');
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Erro ao processar o arquivo: ' + err.message);
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = {
        target: {
          files: [droppedFile],
        },
      };
      handleFileSelect(event);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.overlay} 
      onClick={() => {
        if (!isProcessing) {
          setFile(null);
          setPreview(null);
          setError('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          onClose();
        }
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Importar Dívidas de Planilha</h3>
          <button 
            className={styles.closeButton} 
            onClick={() => {
              if (!isProcessing) {
                setFile(null);
                setPreview(null);
                setError('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                onClose();
              }
            }} 
            aria-label="Fechar"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.info}>
            <p className={styles.infoText}>
              <strong>Formato esperado:</strong> Excel (.xlsx, .xlsm, .xls) ou CSV (.csv)
            </p>
            <p className={styles.infoText}>
              <strong>Colunas obrigatórias:</strong>
            </p>
            <ul className={styles.infoList}>
              <li><strong>Dividas ativas</strong> (ou Credor, Nome) - Nome do credor</li>
              <li><strong>Valor</strong> (ou Valor Total) - Valor total da dívida</li>
              <li><strong>Parcelas</strong> - Número total de parcelas</li>
            </ul>
            <p className={styles.infoText}>
              <strong>Colunas opcionais:</strong>
            </p>
            <ul className={styles.infoList}>
              <li><strong>ID</strong> - Para atualizar dívida existente</li>
              <li><strong>Parcelas paga</strong> (ou Parcelas pagas) - Quantas parcelas já foram pagas</li>
              <li><strong>Descontando parcelas pagas</strong> - Valor restante (usado para calcular valor pago)</li>
              <li><strong>Valor Pago</strong> - Valor já pago (se não informar, será calculado)</li>
              <li><strong>Data de vencimento</strong> - Dia do mês (1-31)</li>
              <li><strong>Primeira parcela</strong> - Valor da entrada (se houver)</li>
              <li><strong>Observações</strong> - Notas adicionais</li>
            </ul>
            <p className={styles.infoText}>
              <strong>Dica:</strong> O sistema aceita variações nos nomes das colunas. Se não informar o ID, tentará atualizar dívidas existentes pelo nome do credor.
            </p>
            <button 
              type="button"
              onClick={downloadTemplate} 
              className={styles.downloadTemplate}
              disabled={isProcessing}
            >
              📥 Baixar Template de Exemplo
            </button>
          </div>

          <div
            className={styles.dropZone}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xlsm,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.macroEnabled.12,application/vnd.ms-excel,text/csv"
              onChange={handleFileSelect}
              className={styles.fileInput}
              id="spreadsheet-upload"
            />
            <label htmlFor="spreadsheet-upload" className={styles.dropZoneLabel}>
              {file ? (
                <div className={styles.fileSelected}>
                  <span className={styles.fileIcon}>📄</span>
                  <span className={styles.fileName}>{file.name}</span>
                  <button
                    className={styles.removeFile}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isProcessing) {
                        setFile(null);
                        setPreview(null);
                        setError('');
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }
                    }}
                    disabled={isProcessing}
                    title={isProcessing ? 'Aguarde o processamento' : 'Remover arquivo'}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <span className={styles.uploadIcon}>📤</span>
                  <span className={styles.uploadText}>
                    Clique para selecionar ou arraste um arquivo aqui
                  </span>
                  <span className={styles.uploadHint}>
                    Formatos suportados: .xlsx, .xlsm, .xls, .csv
                  </span>
                </>
              )}
            </label>
          </div>

          {isProcessing && (
            <div className={styles.processingMessage}>
              <div className={styles.spinner}></div>
              <span>Processando planilha... Por favor, aguarde.</span>
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          {preview && !isProcessing && (
            <div className={styles.preview}>
              <h4 className={styles.previewTitle}>
                Preview ({preview.totalRows} {preview.totalRows === 1 ? 'linha' : 'linhas'})
              </h4>
              <div className={styles.previewTable}>
                <table>
                  <thead>
                    <tr>
                      {preview.headers.map((header, i) => (
                        <th key={i}>{header || `Coluna ${i + 1}`}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr key={i}>
                        {preview.headers.map((_, j) => (
                          <td key={j}>{row[j] || ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            onClick={() => {
              if (!isProcessing) {
                setFile(null);
                setPreview(null);
                setError('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
                onClose();
              }
            }}
            className={styles.cancelButton}
            disabled={isProcessing}
          />
          <Button
            title={isProcessing ? 'Processando...' : 'Importar'}
            variant="primary"
            onClick={processSpreadsheet}
            disabled={!file || isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

