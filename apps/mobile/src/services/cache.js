// Sistema de cache para reduzir requisições ao backend
// Usa cache em memória para acesso rápido

// Duração do cache: 5 minutos (pode ser ajustado)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos em milissegundos

let memoryCache = {
  data: null,
  timestamp: null,
  version: 0,
};

/**
 * Verifica se o cache é válido
 */
function isCacheValid(cache) {
  if (!cache || !cache.timestamp) return false;
  
  const now = Date.now();
  const age = now - cache.timestamp;
  
  return age < CACHE_DURATION;
}

/**
 * Obtém dados do cache (retorna null se inválido ou não existir)
 * Retorna uma cópia dos dados para evitar mutações
 */
export function getCachedData() {
  if (isCacheValid(memoryCache) && memoryCache.data !== null) {
    try {
      // Retorna uma cópia profunda para evitar mutações acidentais
      return JSON.parse(JSON.stringify(memoryCache.data));
    } catch (error) {
      console.warn('Erro ao deserializar cache:', error);
      // Se houver erro na serialização, invalida o cache
      invalidateCache();
      return null;
    }
  }
  return null;
}

/**
 * Armazena dados no cache
 * Garante que apenas dados serializáveis sejam armazenados
 */
export function setCachedData(data) {
  try {
    // Cria uma cópia profunda e serializável dos dados
    // Isso garante que não há referências circulares ou objetos não serializáveis
    const serializableData = JSON.parse(JSON.stringify(data));
    
    memoryCache = {
      data: serializableData,
      timestamp: Date.now(),
      version: memoryCache.version + 1,
    };
  } catch (error) {
    console.warn('Erro ao serializar dados para cache:', error);
    // Se não conseguir serializar, não armazena no cache
    // Mas não quebra a aplicação
  }
}

/**
 * Invalida o cache (força atualização na próxima requisição)
 */
export function invalidateCache() {
  memoryCache = {
    data: null,
    timestamp: null,
    version: memoryCache.version + 1,
  };
}

/**
 * Obtém a versão do cache (útil para verificar se mudou)
 */
export function getCacheVersion() {
  return memoryCache.version;
}

/**
 * Verifica se há cache disponível (mesmo que inválido)
 */
export function hasCache() {
  return memoryCache.data !== null;
}

/**
 * Obtém informações sobre o cache (útil para debug)
 */
export function getCacheInfo() {
  if (!memoryCache.timestamp) {
    return { hasCache: false, age: null, isValid: false };
  }
  
  const now = Date.now();
  const age = now - memoryCache.timestamp;
  
  return {
    hasCache: true,
    age: Math.floor(age / 1000), // idade em segundos
    isValid: isCacheValid(memoryCache),
    version: memoryCache.version,
  };
}
