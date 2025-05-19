# Guía de Contribución

Este repositorio sigue la especificación de [Conventional Commits](https://www.conventionalcommits.org) para mantener un historial de commits consistente y semántico.

## 📝 Formato del Commit

### Estructura básica
```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie opcional]
```

### Tipos permitidos

- `feat`: Nueva funcionalidad para el usuario (ej: `feat: add login form`)
- `fix`: Corrección de errores (ej: `fix: resolve navigation bug`)
- `docs`: Cambios en la documentación (ej: `docs: update API documentation`)
- `style`: Cambios que no afectan el significado del código (ej: `style: format code according to prettier`)
- `refactor`: Refactorización de código sin cambios funcionales (ej: `refactor: simplify authentication logic`)
- `perf`: Mejoras de rendimiento (ej: `perf: optimize database queries`)
- `test`: Adición o modificación de pruebas (ej: `test: add unit tests for user service`)
- `build`: Cambios que afectan el sistema de build o dependencias (ej: `build: update webpack configuration`)
- `ci`: Cambios en la configuración de CI o scripts (ej: `ci: add GitHub Actions workflow`)
- `chore`: Tareas de mantenimiento (ej: `chore: update dependencies`)

### Alcance (opcional)
El alcance debe ser una sección del proyecto afectada, por ejemplo:
- `feat(auth): add password reset`
- `fix(api): handle timeout errors`
- `docs(readme): update installation steps`

### Descripción
- Usar el imperativo, tiempo presente: "change" no "changed" ni "changes"
- No capitalizar la primera letra
- No usar punto final
- Máximo 72 caracteres

### Cuerpo (opcional)
- Separar del título con una línea en blanco
- Usar el imperativo, tiempo presente
- Incluir la motivación del cambio y contrastar con el comportamiento anterior

### Pie (opcional)
- Separar del cuerpo con una línea en blanco
- Referenciar issues relacionados usando palabras clave:
  - `Closes #123`
  - `Fixes #456`
  - `Resolves #789`

## 📋 Ejemplos

### Commit simple
```
feat: add user registration form
```

### Commit con alcance
```
fix(auth): handle expired token error
```

### Commit con cuerpo
```
feat: implement dark mode

- Add theme toggle component
- Create dark theme styles
- Add theme persistence
```

### Commit con pie
```
fix: resolve navigation bug

The navigation was breaking on mobile devices due to incorrect viewport calculations.

Closes #123
```

## 🚫 Reglas importantes

1. No usar mayúsculas al inicio del mensaje
2. Usar el presente (e.g., `add`, no `added`)
3. Ser específico en la descripción
4. Si cierra un issue, agregar la referencia en el pie
5. Mantener los mensajes concisos pero descriptivos

## 🧪 Validación automática

Este repositorio está configurado con:
- [`commitlint`](https://github.com/conventional-changelog/commitlint): Valida que los commits sigan la convención
- [`husky`](https://github.com/typicode/husky): Ejecuta los hooks de git

Si tu commit no cumple con la convención, será rechazado automáticamente.

## 🔍 Consejos adicionales

1. **Planifica tus commits**: Haz commits pequeños y enfocados
2. **Revisa antes de commitear**: Usa `git status` y `git diff`
3. **Usa mensajes descriptivos**: Otros desarrolladores deberían entender el cambio sin ver el código
4. **Referencia issues**: Siempre que sea posible, vincula tus commits con issues relacionados
