
// Función para generar IDs únicos
export const generateMockId = (prefix = 'ID') => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}${randomStr}`;
};

// Función de debounce
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

// Función para formatear fechas de manera optimizada con caché
export const formatDate = (() => {
    const cache = new Map();

    return (dateString) => {
        if (cache.has(dateString)) {
            return cache.get(dateString);
        }

        const date = new Date(dateString);
        const today = new Date();
        const diffTime = today.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        let result;
        if (diffTime < 0) {
            result = 'Fecha futura';
        } else if (diffMinutes < 60) {
            result = diffMinutes < 1 ? 'Hace unos segundos' : `Hace ${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            result = `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
        } else if (diffDays === 0) {
            result = 'Hoy';
        } else if (diffDays === 1) {
            result = 'Hace 1 día';
        } else if (diffDays < 30) {
            result = `Hace ${diffDays} días`;
        } else if (diffDays < 365) {
            const diffMonths = Math.floor(diffDays / 30);
            result = `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
        } else {
            const diffYears = Math.floor(diffDays / 365);
            result = `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
        }

        cache.set(dateString, result);
        return result;
    };
})();

// Función para truncar texto
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

// Función para validar email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Función para validar teléfono colombiano
export const isValidColombianPhone = (phone) => {
    const phoneRegex = /^(\+57|57)?[3][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Función para formatear teléfono
export const formatPhone = (phone) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('57')) {
        return '+' + cleanPhone;
    } else if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
        return '+57 ' + cleanPhone;
    }

    return phone;
};

// Función para capitalizar texto
export const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Función para generar colores aleatorios consistentes
export const generateConsistentColor = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
};

// Función para filtrar y buscar en arrays
export const filterBySearch = (items, searchTerm, searchFields) => {
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();

    return items.filter(item =>
        searchFields.some(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return value?.toString().toLowerCase().includes(term);
        })
    );
};

// Función para ordenar arrays por múltiples criterios
export const sortBy = (items, sortKey, direction = 'asc') => {
    return [...items].sort((a, b) => {
        let aVal = sortKey.split('.').reduce((obj, key) => obj?.[key], a);
        let bVal = sortKey.split('.').reduce((obj, key) => obj?.[key], b);

        // Manejar fechas
        if (aVal instanceof Date || (typeof aVal === 'string' && !isNaN(Date.parse(aVal)))) {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }

        // Manejar números
        if (typeof aVal === 'string' && !isNaN(aVal)) {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

// Función para agrupar elementos por criterio
export const groupBy = (items, key) => {
    return items.reduce((groups, item) => {
        const group = key.split('.').reduce((obj, k) => obj?.[k], item);
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};

// Función para calcular estadísticas básicas
export const calculateStats = (items, field) => {
    const values = items
        .map(item => field.split('.').reduce((obj, key) => obj?.[key], item))
        .filter(val => val !== null && val !== undefined && !isNaN(val))
        .map(val => parseFloat(val));

    if (values.length === 0) {
        return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { count: values.length, sum, avg, min, max };
};

// Función para generar un slug amigable para URLs
export const generateSlug = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
        .replace(/[^a-z0-9 -]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Remover guiones duplicados
        .trim('-'); // Remover guiones al inicio y final
};

// Función para copiar al portapapeles
export const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            return false;
        }
    } else {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            console.error('Error copying to clipboard:', err);
            document.body.removeChild(textArea);
            return false;
        }
    }
};

// Función para formatear números
export const formatNumber = (num, options = {}) => {
    const {
        decimals = 0,
        thousandsSeparator = '.',
        decimalSeparator = ',',
        prefix = '',
        suffix = ''
    } = options;

    if (num === null || num === undefined || isNaN(num)) return '';

    const fixed = parseFloat(num).toFixed(decimals);
    const [integer, decimal] = fixed.split('.');

    // Agregar separador de miles
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

    let result = formattedInteger;
    if (decimals > 0 && decimal) {
        result += decimalSeparator + decimal;
    }

    return prefix + result + suffix;
};

// Función para generar un hash simple de un string
export const simpleHash = (str) => {
    let hash = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash);
};